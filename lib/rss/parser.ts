import Parser from "rss-parser";
import type { RssFeedConfig } from "../types";

export interface ParsedRssItem {
  title: string;
  link: string;
  content: string;
  rawContent: string;
  pubDate: string | null;
  imageUrl: string | null;
  author: string | null;
  source: string;
  feedId: string;
  categories: string[];
}

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/rdf+xml, application/atom+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function extractImageUrl(item: Record<string, unknown>): string | null {
  const mediaContent = item.mediaContent as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const mediaThumbnail = item.mediaThumbnail as { $?: { url?: string } } | undefined;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;

  const enclosure = item.enclosure as { url?: string; type?: string } | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image")) {
    return enclosure.url;
  }

  const content = String(item.contentEncoded ?? item.content ?? item.contentSnippet ?? "");
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i) || content.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch?.[1] ?? null;
}

export function cleanHTML(html: string): string {
  if (!html) return "";
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Convert line breaks and paragraph breaks
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<td>/gi, " ")
    .replace(/<\/td>/gi, "\t");

  // Strip all other HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode basic HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "--");

  // Normalize spaces (avoid replacing double newlines!)
  const lines = text.split("\n").map(line => line.replace(/[ \t]+/g, " ").trim());
  
  // Reconstruct with double newlines/single newlines
  let result = lines.join("\n");
  // Replace 3 or more consecutive newlines with exactly two newlines
  result = result.replace(/\n{3,}/g, "\n\n");
  // Remove spaces around newlines
  result = result.replace(/ +\n/g, "\n").replace(/\n +/g, "\n");
  
  return result.trim();
}

export async function fetchFeedItems(
  feed: RssFeedConfig,
): Promise<ParsedRssItem[]> {
  try {
    const parsed = await parser.parseURL(feed.url);

    return (parsed.items ?? [])
      .filter((item) => item.title && (item.link || item.guid))
      .map((item) => {
        const itemRecord = item as unknown as Record<string, unknown>;
        const rawContent =
          itemRecord.contentEncoded ??
          item.content ??
          item.contentSnippet ??
          item.summary ??
          "";

        const content = cleanHTML(String(rawContent));

        // Get RSS categories/tags if present
        const categories: string[] = [];
        if (Array.isArray(item.categories)) {
          item.categories.forEach((cat) => {
            if (typeof cat === "string") {
              categories.push(cat.trim().toUpperCase());
            } else if (cat && typeof cat === "object" && (cat as any)._ || (cat as any).name) {
              const name = (cat as any)._ || (cat as any).name;
              if (typeof name === "string") {
                categories.push(name.trim().toUpperCase());
              }
            }
          });
        }

        return {
          title: cleanHTML(item.title!.trim()),
          link: (item.link ?? item.guid ?? "").trim(),
          content: content || item.title!.trim(),
          rawContent: String(rawContent),
          pubDate: item.pubDate ?? item.isoDate ?? null,
          imageUrl: extractImageUrl(itemRecord),
          author: item.creator ?? (item as { author?: string }).author ?? null,
          source: feed.name,
          feedId: feed.id,
          categories,
        };
      });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RSS error";
    throw new Error(`Failed to fetch feed "${feed.name}": ${message}`);
  }
}
