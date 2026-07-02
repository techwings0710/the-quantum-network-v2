import { getSupabaseClient, getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import type { NewsArticle, NotificationPreferences, ReadingHistoryEntry, UserProfile } from "../types";
import { normalizeArticle } from "../news/news-normalize";

function normalizeUser(row: Record<string, unknown>): UserProfile {
  const prefs = row.notification_preferences as NotificationPreferences | null;
  return {
    id: row.id as string,
    name: (row.name as string) ?? null,
    email: row.email as string,
    image: (row.image as string) ?? null,
    bio: (row.bio as string) ?? null,
    organization: (row.organization as string) ?? null,
    country: (row.country as string) ?? null,
    research_interests: (row.research_interests as string[]) ?? [],
    favourite_topics: (row.favourite_topics as string[]) ?? [],
    notification_preferences: prefs ?? {
      newsletter: true,
      opportunities: true,
      events: true,
    },
    is_admin: Boolean(row.is_admin),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch user:", error.message);
    return null;
  }

  return data ? normalizeUser(data) : null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<
    Pick<
      UserProfile,
      | "name"
      | "bio"
      | "organization"
      | "country"
      | "research_interests"
      | "favourite_topics"
      | "notification_preferences"
    >
  >,
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update user profile:", error.message);
    return null;
  }

  return normalizeUser(data);
}

export async function syncGoogleProfile(input: {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const existing = await getUserById(input.id);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: input.id,
        name: input.name ?? existing?.name ?? null,
        email: input.email,
        image: input.image ?? existing?.image ?? null,
        updated_at: now,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to sync Google profile:", error.message);
    return null;
  }

  return normalizeUser(data);
}

export async function recordReadingHistory(
  userId: string,
  articleId: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return;

  const { error } = await supabase.from("reading_history").upsert(
    {
      user_id: userId,
      article_id: articleId,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,article_id" },
  );

  if (error) {
    console.error("Failed to record reading history:", error.message);
  }
}

export async function getReadingHistory(
  userId: string,
  limit = 10,
): Promise<ReadingHistoryEntry[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reading_history")
    .select("*, news (*)")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch reading history:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const record = row as Record<string, unknown>;
    const newsRow = record.news as Record<string, unknown> | null;
    return {
      id: record.id as string,
      user_id: record.user_id as string,
      article_id: record.article_id as string,
      viewed_at: record.viewed_at as string,
      article: newsRow ? normalizeArticle(newsRow) : undefined,
    };
  });
}

export async function getRecentlyViewedArticles(
  userId: string,
  limit = 5,
): Promise<NewsArticle[]> {
  const history = await getReadingHistory(userId, limit);
  return history
    .map((entry) => entry.article)
    .filter((article): article is NewsArticle => Boolean(article));
}

export function isUserAdmin(user: UserProfile | null, email?: string | null): boolean {
  if (user?.is_admin) return true;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && adminEmails.includes(email.toLowerCase()));
}

export async function getAllUsers(limit = 100): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch users:", error.message);
    return [];
  }

  return (data ?? []).map(normalizeUser);
}

export async function getUserCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
