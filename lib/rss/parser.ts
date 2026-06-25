import Parser from "rss-parser";
import type { RssFeedConfig } from "../types";

export interface ParsedRssItem {
  title: string;
  link: string;
  content: string;
  pubDate: string | null;
  imageUrl: string | null;
  source: string;
  feedId: string;
}

const parser = new Parser({
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
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch?.[1] ?? null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

        const content = stripHtml(String(rawContent));

        return {
          title: item.title!.trim(),
          link: (item.link ?? item.guid ?? "").trim(),
          content: content || item.title!.trim(),
          pubDate: item.pubDate ?? item.isoDate ?? null,
          imageUrl: extractImageUrl(itemRecord),
          source: feed.name,
          feedId: feed.id,
        };
      });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RSS error";
    throw new Error(`Failed to fetch feed "${feed.name}": ${message}`);
  }
}
