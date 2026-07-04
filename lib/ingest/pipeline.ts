import { getEnabledFeeds } from "../rss/feeds";
import { fetchFeedItems, type ParsedRssItem } from "../rss/parser";
import {
  articleExistsBySourceUrl,
  ensureUniqueSlug,
  getDefaultImageUrl,
  saveNewsArticle,
  updateFeaturedArticle,
} from "../news/db";
import {
  scheduleArticleImageGeneration,
  generateMissingNewsImages,
} from "../images/generate";
import type { IngestResult } from "../types";

const MAX_ITEMS_PER_FEED = 4;

function generateLocalSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

function getSummaryFromContent(content: string): string {
  if (!content) return "";

  const clean = content
    .replace(/\n+/g, "\n")
    .trim();

  if (clean.length <= 2500) {
    return clean;
  }

  return clean.substring(0, 2497).trim() + "...";
}
function getSeoDescription(summary: string): string {
  const clean = summary.replace(/\n+/g, " ").trim();
  if (clean.length <= 160) return clean;
  return clean.substring(0, 157).trim() + "...";
}

function extractTags(title: string, content: string, rssCategories: string[]): string[] {
  const textToScan = `${title} ${content}`.toLowerCase();
  const tagSet = new Set<string>();

  // Add RSS categories first
  rssCategories.forEach(cat => {
    if (cat.length > 1 && cat.length < 20) {
      tagSet.add(cat.toUpperCase());
    }
  });

  // Keyword mapping rules
  const keywordRules: Record<string, string[]> = {
    "superconducting": ["SUPERCONDUCTING", "HARDWARE"],
    "qubit": ["QUBITS", "HARDWARE"],
    "photon": ["PHOTONICS", "HARDWARE"],
    "silicon": ["SILICON", "HARDWARE"],
    "ion trap": ["ION-TRAP", "HARDWARE"],
    "trapped ion": ["ION-TRAP", "HARDWARE"],
    "topological": ["TOPOLOGICAL", "HARDWARE"],
    "error correction": ["ERROR-CORRECTION", "RESEARCH"],
    "fault tolerant": ["ERROR-CORRECTION", "RESEARCH"],
    "quantum key": ["QKD", "SECURITY", "COMMUNICATION"],
    "qkd": ["QKD", "SECURITY", "COMMUNICATION"],
    "cryptography": ["CRYPTOGRAPHY", "SECURITY"],
    "encryption": ["CRYPTOGRAPHY", "SECURITY"],
    "algorithm": ["ALGORITHMS", "SOFTWARE"],
    "software": ["SOFTWARE"],
    "simulat": ["SIMULATION", "SOFTWARE"],
    "machine learning": ["ML", "SOFTWARE"],
    "qiskit": ["QISKIT", "SOFTWARE"],
    "national quantum mission": ["NQM", "POLICY", "INDIA"],
    "nqm": ["NQM", "POLICY", "INDIA"],
    "dst": ["DST", "POLICY", "INDIA"],
    "funding": ["VENTURE", "INVESTMENT"],
    "investment": ["VENTURE", "INVESTMENT"],
    "startup": ["STARTUP", "ECOSYSTEM"],
    "spinout": ["STARTUP", "ECOSYSTEM"],
    "merger": ["MERGER", "ECOSYSTEM"],
    "acquisition": ["ACQUISITION", "ECOSYSTEM"],
  };

  for (const [keyword, tags] of Object.entries(keywordRules)) {
    if (textToScan.includes(keyword)) {
      tags.forEach(t => tagSet.add(t));
    }
  }

  // Default tags if none found
  if (tagSet.size === 0) {
    tagSet.add("QUANTUM");
  }

  return Array.from(tagSet);
}

function detectIndiaRelevance(title: string, content: string, feedCategory?: string): boolean {
  if (feedCategory === "INDIA") return true;
  const text = `${title} ${content}`.toLowerCase();
  const indiaKeywords = [
    "india",
    "indian",
    "bangalore",
    "bengaluru",
    "delhi",
    "mumbai",
    "chennai",
    "pune",
    "kolkata",
    "iisc",
    "iit",
    "tifr",
    "nqm",
    "national quantum mission",
    "dst india",
    "qnulabs",
    "qnu labs",
    "qpiai",
    "bosonq psi",
    "bosonqpsi"
  ];
  return indiaKeywords.some(keyword => text.includes(keyword));
}

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

  const feeds = getEnabledFeeds();
  console.log(`[ingest] Starting ingestion for ${feeds.length} feeds (Bypassing Gemini completely)`);

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

          // Local metadata derivation
          const category = feed.category || "RESEARCH";
          const summary = getSummaryFromContent(item.content);
          const seoDescription = getSeoDescription(summary);
          const tags = extractTags(item.title, item.content, item.categories);
          const indiaRelevance = detectIndiaRelevance(item.title, item.content, feed.category);

          const baseSlug = generateLocalSlug(item.title);
          const slug = await ensureUniqueSlug(baseSlug);
          const publishedAt = item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString();

          const saved = await saveNewsArticle({
            slug,
            title: item.title,
            summary: summary,
            content: item.content,
            category: category,
            tags: tags,
            india_relevance: indiaRelevance,
            seo_description: seoDescription,
            image_url: item.imageUrl ?? getDefaultImageUrl(),
            source_name: feed.name,
            source_url: item.link,
            author: item.author ?? feed.name,
            published_at: publishedAt,
            featured: false,
          });

          if (saved) {
            result.saved += 1;
            console.log(`[ingest] Saved: ${saved.title}`);

            if (!item.imageUrl) {
              scheduleArticleImageGeneration({
                articleId: saved.id,
                title: saved.title,
                summary: saved.summary,
                category: saved.category,
                currentImageUrl: saved.image_url,
                imageGenerated: saved.image_generated ?? false,
              });
            }
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
  await generateMissingNewsImages();
  result.processing_time_ms = Date.now() - startTime;
  result.success = result.errors.length === 0 || result.saved > 0;

  console.log(
    `[ingest] Complete: ${result.saved} saved, ${result.duplicates} duplicates, ${result.feeds_failed} feeds failed, ${result.processing_time_ms}ms`,
  );

  return result; 
}


