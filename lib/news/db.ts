import {
  getSupabaseClient,
  getSupabaseServiceClient,
  isSupabaseConfigured,
} from "../supabase";
import type { NewsArticle } from "../types";
import { getFallbackArticle } from "./fallbacks";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAk5nQAEf4GclwdCIBHqymKr6km9oAak4h2hvuO0EVUi5e9OgRE-_LaG35xXpCJXsUbYxWrttcZ29TdENxEaitMNT_vVFxinHgwj-FUrRVPtKkrIb-TKvv4b3HdyuZEOuDag_uo97cAPUFBvOgH2x91YiXDkqE62LYoBW6Hh994aq0quq8p0U4MQHg796C-D-t7uy9xYs1A-Sk0lziyeHIJbKE0_EKIv1A-3aC0-YSkB_Xu7hUMwdm8YRhgf2iSgxRutgZp6RZ7ZY";

export function getDefaultImageUrl(): string {
  return DEFAULT_IMAGE;
}

export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
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

  return (data ?? []) as NewsArticle[];
}

export async function getFeaturedNews(): Promise<NewsArticle | null> {
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

  return (data as NewsArticle) ?? null;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured()) return getFallbackArticle(slug);

  const supabase = getSupabaseClient();
  if (!supabase) return getFallbackArticle(slug);

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch news by slug:", error.message);
    return getFallbackArticle(slug);
  }

  return (data as NewsArticle) ?? getFallbackArticle(slug);
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const term = query.trim();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .or(
      `title.ilike.%${term}%,summary.ilike.%${term}%,content.ilike.%${term}%`,
    )
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to search news:", error.message);
    return [];
  }

  return (data ?? []) as NewsArticle[];
}

export async function articleExistsBySourceLink(
  sourceLink: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("news")
    .select("id")
    .eq("source", sourceLink)
    .maybeSingle();

  if (error) {
    console.error("Failed to check article existence:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function saveNewsArticle(article: {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  image_url: string | null;
  source: string;
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

  return data as NewsArticle;
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

export function formatArticleDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
