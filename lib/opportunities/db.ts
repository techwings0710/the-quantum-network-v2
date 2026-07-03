import { unstable_cache } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";
import type { Opportunity } from "../types";

async function fetchOpportunities(type?: string): Promise<Opportunity[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from("opportunities")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch opportunities:", error.message);
    return [];
  }

  return (data ?? []) as Opportunity[];
}

export async function getOpportunities(type?: string): Promise<Opportunity[]> {
  return fetchOpportunities(type);
}

export async function getOpportunitiesByType(type: string): Promise<Opportunity[]> {
  return fetchOpportunities(type);
}
