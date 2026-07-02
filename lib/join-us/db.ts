import { getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import type { JoinUsApplication } from "../types";

export async function submitJoinUsApplication(input: {
  name: string;
  email: string;
  country: string;
  organization?: string;
  role: string;
  area_of_interest: string;
  message?: string;
}): Promise<JoinUsApplication | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("join_us_applications")
    .insert({
      name: input.name,
      email: input.email,
      country: input.country,
      organization: input.organization ?? null,
      role: input.role,
      area_of_interest: input.area_of_interest,
      message: input.message ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to submit join us application:", error.message);
    return null;
  }

  return data as JoinUsApplication;
}

export async function getJoinUsApplications(
  status?: string,
): Promise<JoinUsApplication[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  let query = supabase
    .from("join_us_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch join us applications:", error.message);
    return [];
  }

  return (data ?? []) as JoinUsApplication[];
}

export async function updateJoinUsApplicationStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("join_us_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Failed to update application status:", error.message);
    return false;
  }

  return true;
}

export async function getJoinUsApplicationCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("join_us_applications")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
