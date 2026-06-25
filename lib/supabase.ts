import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { NewsArticle, UserProfile } from "./types";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function createSupabaseClient(key: string): SupabaseClient | null {
  if (!supabaseUrl || !key) {
    return null;
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!anonClient && supabaseAnonKey) {
    anonClient = createSupabaseClient(supabaseAnonKey);
  }
  return anonClient;
}

export function getSupabaseServiceClient(): SupabaseClient | null {
  if (!serviceClient && supabaseServiceRoleKey) {
    serviceClient = createSupabaseClient(supabaseServiceRoleKey);
  }
  return serviceClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function upsertUser(user: {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
}): Promise<UserProfile | null> {
  if (!isSupabaseConfigured() || !supabaseServiceRoleKey) {
    return null;
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        name: user.name ?? null,
        email: user.email,
        image: user.image ?? null,
        updated_at: now,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to upsert user:", error.message);
    return null;
  }

  return data as UserProfile;
}

export type { NewsArticle, UserProfile };
