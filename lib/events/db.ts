import { unstable_cache } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase";
import type { Event } from "../types";

async function fetchEvents(type?: string): Promise<Event[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let query = supabase
  .from("events")
  .select("*")
  .eq("active", true)
  .gte("start_date", new Date().toISOString())
  .order("start_date", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch events:", error.message);
    return [];
  }

  return (data ?? []) as Event[];
}

export async function getEvents(type?: string): Promise<Event[]> {
  return fetchEvents(type);
}

export async function getEventsByType(type: string): Promise<Event[]> {
  return fetchEvents(type);
}
