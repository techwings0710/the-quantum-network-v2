import { getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import type { NewsArticle } from "../types";

export async function getAdminStats() {
  if (!isSupabaseConfigured()) {
    return {
      newsCount: 0,
      eventsCount: 0,
      opportunitiesCount: 0,
      subscribersCount: 0,
      applicationsCount: 0,
      usersCount: 0,
      savedArticlesCount: 0,
    };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return {
      newsCount: 0,
      eventsCount: 0,
      opportunitiesCount: 0,
      subscribersCount: 0,
      applicationsCount: 0,
      usersCount: 0,
      savedArticlesCount: 0,
    };
  }

  const [
    news,
    events,
    opportunities,
    subscribers,
    applications,
    users,
    savedArticles,
  ] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("opportunities").select("*", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase.from("join_us_applications").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("saved_articles").select("*", { count: "exact", head: true }),
  ]);

  return {
    newsCount: news.count ?? 0,
    eventsCount: events.count ?? 0,
    opportunitiesCount: opportunities.count ?? 0,
    subscribersCount: subscribers.count ?? 0,
    applicationsCount: applications.count ?? 0,
    usersCount: users.count ?? 0,
    savedArticlesCount: savedArticles.count ?? 0,
  };
}

export async function getAllNewsAdmin(limit = 50): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as NewsArticle[];
}

export async function deleteArticleAdmin(articleId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { error } = await supabase.from("news").delete().eq("id", articleId);
  return !error;
}

export async function updateArticleAdmin(
  articleId: string,
  updates: Partial<Pick<NewsArticle, "title" | "summary" | "featured" | "image_url">>,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("news")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", articleId);

  return !error;
}

export async function featureArticleAdmin(articleId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  await supabase.from("news").update({ featured: false }).eq("featured", true);

  const { error } = await supabase
    .from("news")
    .update({ featured: true, updated_at: new Date().toISOString() })
    .eq("id", articleId);

  return !error;
}

export async function getNewsletterSubscribersAdmin() {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getReadingAnalyticsAdmin() {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reading_history")
    .select("article_id, news(title, slug), viewed_at")
    .order("viewed_at", { ascending: false })
    .limit(100);

  if (error) return [];
  return data ?? [];
}

export async function getSavedArticlesAdmin(limit = 50) {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("saved_articles")
    .select("*, news(title, slug)")
    .order("saved_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}
