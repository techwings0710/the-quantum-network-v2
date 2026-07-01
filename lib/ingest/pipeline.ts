import { rewriteArticleWithGemini, isGeminiConfigured } from "../gemini";
import { getEnabledFeeds } from "../rss/feeds";
import { fetchFeedItems } from "../rss/parser";
import {
  articleExistsBySourceUrl,
  ensureUniqueSlug,
  getDefaultImageUrl,
  saveNewsArticle,
  updateFeaturedArticle,
} from "../news/db";
import type { IngestResult } from "../types";

const MAX_ITEMS_PER_FEED = 2;

export async function ingestNewsFromRss(): Promise<IngestResult> {
  const startTime = Date.now();
  const result: IngestResult = {
    success: true,
    feeds_processed: 0,
    feeds_failed: 0,
    processed: 0,
    saved: 0,
    skipped: 0,
    duplicates: 0,
    errors: [],
    processing_time_ms: 0,
  };

  if (!isGeminiConfigured()) {
    result.success = false;
    result.errors.push("GEMINI_API_KEY is not configured");
    result.processing_time_ms = Date.now() - startTime;
    return result;
  }

  const feeds = getEnabledFeeds();
  console.log(`[ingest] Starting ingestion for ${feeds.length} feeds`);

  for (const feed of feeds) {
    try {
      const items = await fetchFeedItems(feed);
      result.feeds_processed += 1;
      const recentItems = items.slice(0, MAX_ITEMS_PER_FEED);
      console.log(`[ingest] Feed "${feed.name}": ${recentItems.length} items to process`);

      for (const item of recentItems) {
        result.processed += 1;

        try {
          const exists = await articleExistsBySourceUrl(item.link);
          if (exists) {
            result.skipped += 1;
            result.duplicates += 1;
            continue;
          }

          const rewritten = await rewriteArticleWithGemini({
            title: item.title,
            content: item.content,
            source: feed.name,
          });

          const slug = await ensureUniqueSlug(rewritten.slug);
          const publishedAt = item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString();

          const saved = await saveNewsArticle({
            slug,
            title: rewritten.title,
            summary: rewritten.summary,
            content: rewritten.rewritten_article,
            category: rewritten.category,
            tags: rewritten.tags,
            india_relevance: rewritten.india_relevance,
            seo_description: rewritten.seo_description,
            image_url: item.imageUrl ?? getDefaultImageUrl(),
            source_name: feed.name,
            source_url: item.link,
            author: item.author ?? null,
            published_at: publishedAt,
            featured: false,
          });

          if (saved) {
            result.saved += 1;
            console.log(`[ingest] Saved: ${saved.title}`);
          } else {
            result.errors.push(`Failed to save article: ${item.title}`);
          }
        } catch (itemError) {
          const message =
            itemError instanceof Error ? itemError.message : "Unknown error";
          result.errors.push(`Error processing "${item.title}" from ${feed.name}: ${message}`);
          console.error(`[ingest] Item error: ${message}`);
        }
      }
    } catch (feedError) {
      result.feeds_failed += 1;
      const message =
        feedError instanceof Error ? feedError.message : "Unknown feed error";
      result.errors.push(`Feed "${feed.name}" failed: ${message}`);
      console.error(`[ingest] Feed error (${feed.name}): ${message}`);
    }
  }

  if (result.saved > 0) {
    try {
      await updateFeaturedArticle();
      console.log("[ingest] Updated featured article");
    } catch (featuredError) {
      const message =
        featuredError instanceof Error ? featuredError.message : "Featured update failed";
      result.errors.push(message);
    }
  }

  result.processing_time_ms = Date.now() - startTime;
  result.success = result.errors.length === 0 || result.saved > 0;

  console.log(
    `[ingest] Complete: ${result.saved} saved, ${result.duplicates} duplicates, ${result.feeds_failed} feeds failed, ${result.processing_time_ms}ms`,
  );

  return result;
}
