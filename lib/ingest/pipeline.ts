import { rewriteArticleWithGemini, isGeminiConfigured } from "../gemini";
import { getEnabledFeeds } from "../rss/feeds";
import { fetchFeedItems } from "../rss/parser";
import {
  articleExistsBySourceLink,
  ensureUniqueSlug,
  getDefaultImageUrl,
  saveNewsArticle,
} from "../news/db";
import type { IngestResult } from "../types";

const MAX_ITEMS_PER_FEED = 3;

export async function ingestNewsFromRss(): Promise<IngestResult> {
  const result: IngestResult = {
    processed: 0,
    saved: 0,
    skipped: 0,
    errors: [],
  };

  if (!isGeminiConfigured()) {
    result.errors.push("GEMINI_API_KEY is not configured");
    return result;
  }

  const feeds = getEnabledFeeds();

  for (const feed of feeds) {
    try {
      const items = await fetchFeedItems(feed);
      const recentItems = items.slice(0, MAX_ITEMS_PER_FEED);

      for (const item of recentItems) {
        result.processed += 1;

        try {
          const exists = await articleExistsBySourceLink(item.link);
          if (exists) {
            result.skipped += 1;
            continue;
          }

          const rewritten = await rewriteArticleWithGemini({
            title: item.title,
            content: item.content,
            source: item.source,
          });

          const slug = await ensureUniqueSlug(rewritten.slug);
          const publishedAt = item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString();

          const saved = await saveNewsArticle({
            slug,
            title: rewritten.title,
            summary: rewritten.summary,
            content: rewritten.content,
            category: rewritten.category,
            tags: rewritten.tags,
            image_url: item.imageUrl ?? getDefaultImageUrl(),
            source: item.link,
            author: feed.name,
            published_at: publishedAt,
            featured: result.saved === 0 && rewritten.india_relevant,
          });

          if (saved) {
            result.saved += 1;
          } else {
            result.errors.push(`Failed to save article: ${item.title}`);
          }
        } catch (itemError) {
          const message =
            itemError instanceof Error ? itemError.message : "Unknown error";
          result.errors.push(`Error processing "${item.title}": ${message}`);
        }
      }
    } catch (feedError) {
      const message =
        feedError instanceof Error ? feedError.message : "Unknown feed error";
      result.errors.push(message);
    }
  }

  return result;
}
