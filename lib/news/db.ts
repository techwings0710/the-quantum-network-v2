import { unstable_cache } from "next/cache";
import {
  getSupabaseClient,
  getSupabaseServiceClient,
  isSupabaseConfigured,
} from "../supabase";
import type { NewsArticle } from "../types";
import { sanitizeSearchTerm } from "../utils";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAk5nQAEf4GclwdCIBHqymKr6km9oAak4h2hvuO0EVUi5e9OgRE-_LaG35xXpCJXsUbYxWrttcZ29TdENxEaitMNT_vVFxinHgwj-FUrRVPtKkrIb-TKvv4b3HdyuZEOuDag_uo97cAPUFBvOgH2x91YiXDkqE62LYoBW6Hh994aq0quq8p0U4MQHg796C-D-t7uy9xYs1A-Sk0lziyeHIJbKE0_EKIv1A-3aC0-YSkB_Xu7hUMwdm8YRhgf2iSgxRutgZp6RZ7ZY";

const RESEARCH_TAGS = ["RESEARCH", "ACADEMIC", "PAPER"];

export function getDefaultImageUrl(): string {
  return DEFAULT_IMAGE;
}

export function formatArticleDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeArticle(row: Record<string, unknown>): NewsArticle {
  return {
    ...(row as unknown as NewsArticle),
    source_name:
      (row.source_name as string) ??
      (row.author as string) ??
      "Unknown Source",
    source_url:
      (row.source_url as string) ?? (row.source as string) ?? "",
    india_relevance: Boolean(row.india_relevance),
    image_generated: Boolean(row.image_generated),
    tags: (row.tags as string[]) ?? [],
  };
}

async function fetchLatestNews(limit: number): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch latest news:", error.message);
    return [];
  }

  return (data ?? []).map(normalizeArticle);
}

export const getLatestNews = unstable_cache(
  fetchLatestNews,
  ["latest-news"],
  { revalidate: 300, tags: ["news"] },
);

async function fetchFeaturedNews(): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch featured news:", error.message);
    return null;
  }

  if (data) return normalizeArticle(data);

  const latest = await fetchLatestNews(1);
  return latest[0] ?? null;
}

export const getFeaturedNews = unstable_cache(
  fetchFeaturedNews,
  ["featured-news"],
  { revalidate: 300, tags: ["news"] },
);

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch news by slug:", error.message);
    return null;
  }

  return data ? normalizeArticle(data) : null;
}

const cachedSearchNews = unstable_cache(
  async (term: string): Promise<NewsArticle[]> => {
    if (!isSupabaseConfigured() || !term) return [];

    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .or(
        `title.ilike.%${term}%,summary.ilike.%${term}%,content.ilike.%${term}%,category.ilike.%${term}%`,
      )
      .order("published_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Failed to search news:", error.message);
      return [];
    }

    const articles = (data ?? []).map(normalizeArticle);

    const tagMatches = articles.filter((article) =>
      article.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase())),
    );

    const combined = [...articles];
    for (const match of tagMatches) {
      if (!combined.find((a) => a.id === match.id)) {
        combined.push(match);
      }
    }

    return combined;
  },
  ["search-news"],
  { revalidate: 60 }
);

export async function searchNews(query: string): Promise<NewsArticle[]> {
  const term = sanitizeSearchTerm(query);
  if (!term) return [];
  return cachedSearchNews(term);
}

export async function getResearchArticles(limit = 20): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .or(
      `category.eq.RESEARCH,tags.cs.{RESEARCH},tags.cs.{ACADEMIC},tags.cs.{PAPER}`,
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch research articles:", error.message);
    return [];
  }

  return (data ?? []).map(normalizeArticle);
}

export async function getIndustryArticles(limit = 6): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .in("category", ["VENTURE", "ENTERPRISE", "ECOSYSTEM", "HARDWARE"])
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch industry articles:", error.message);
    return [];
  }

  return (data ?? []).map(normalizeArticle);
}

export async function getRelatedArticles(
  article: NewsArticle,
  limit = 3,
): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch related articles:", error.message);
    return [];
  }

  return (data ?? []).map(normalizeArticle);
}

export async function articleExistsBySourceUrl(
  sourceUrl: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("news")
    .select("id")
    .eq("source_url", sourceUrl)
    .maybeSingle();

  if (error) {
    console.error("Failed to check article existence:", error.message);
    return false;
  }

  if (data) return true;

  const { data: legacyData, error: legacyError } = await supabase
    .from("news")
    .select("id")
    .eq("source", sourceUrl)
    .maybeSingle();

  if (legacyError) {
    console.error("Failed to check legacy article existence:", legacyError.message);
    return false;
  }

  return Boolean(legacyData);
}

export async function saveNewsArticle(article: {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  india_relevance: boolean;
  seo_description: string | null;
  image_url: string | null;
  source_name: string;
  source_url: string;
  author: string | null;
  published_at: string;
  featured?: boolean;
}): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("news")
    .upsert(
      {
        ...article,
        source: article.source_url,
        image_url: article.image_url ?? DEFAULT_IMAGE,
        featured: article.featured ?? false,
        updated_at: now,
      },
      { onConflict: "slug" },
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to save news article:", error.message);
    return null;
  }

  return normalizeArticle(data);
}

export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  if (!isSupabaseConfigured()) return baseSlug;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return baseSlug;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("news")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function updateFeaturedArticle(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return;

  await supabase.from("news").update({ featured: false }).eq("featured", true);

  const { data: indiaFeatured } = await supabase
    .from("news")
    .select("id")
    .eq("india_relevance", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const featuredId =
    indiaFeatured?.id ??
    (
      await supabase
        .from("news")
        .select("id")
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    ).data?.id;

  if (featuredId) {
    await supabase.from("news").update({ featured: true }).eq("id", featuredId);
  }
}

export function isResearchArticle(article: NewsArticle): boolean {
  return (
    article.category === "RESEARCH" ||
    article.tags.some((tag) => RESEARCH_TAGS.includes(tag.toUpperCase()))
  );
}

export async function isArticleSaved(userEmail: string, articleId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("saved_articles")
    .select("id")
    .eq("user_email", userEmail)
    .eq("article_id", articleId)
    .maybeSingle();

  if (error) {
    console.error("Failed to check if article is saved:", error.message);
    return false;
  }

  return !!data;
}

export async function saveArticle(userEmail: string, articleId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("saved_articles")
    .upsert({ user_email: userEmail, article_id: articleId }, { onConflict: "user_email,article_id" });

  if (error) {
    console.error("Failed to save article:", error.message);
    return false;
  }

  return true;
}

export async function unsaveArticle(userEmail: string, articleId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("saved_articles")
    .delete()
    .eq("user_email", userEmail)
    .eq("article_id", articleId);

  if (error) {
    console.error("Failed to unsave article:", error.message);
    return false;
  }

  return true;
}

export async function getSavedArticles(userEmail: string): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_articles")
    .select("article_id, news (*)")
    .eq("user_email", userEmail)
    .order("saved_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch saved articles:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row: any) => row.news)
    .filter(Boolean)
    .map(normalizeArticle);
}
