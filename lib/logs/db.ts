import { getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";

export type JobType =
  | "news_ingest"
  | "opportunities_ingest"
  | "events_ingest"
  | "image_generation"
  | "admin_action";

export interface SystemLog {
  id: string;
  job_type: JobType;
  status: "started" | "completed" | "failed" | "partial";
  message: string | null;
  metadata: Record<string, unknown>;
  started_at: string;
  finished_at: string | null;
  processing_time_ms: number | null;
}

export async function createSystemLog(input: {
  job_type: JobType;
  status: SystemLog["status"];
  message?: string;
  metadata?: Record<string, unknown>;
}): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("system_logs")
    .insert({
      job_type: input.job_type,
      status: input.status,
      message: input.message ?? null,
      metadata: input.metadata ?? {},
    })
    .select("id")
    .single();

  if (error) {
    console.error("[system-log] Failed to create log:", error.message);
    return null;
  }

  return data.id as string;
}

export async function finishSystemLog(
  logId: string,
  input: {
    status: SystemLog["status"];
    message?: string;
    metadata?: Record<string, unknown>;
    processing_time_ms: number;
  },
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("system_logs")
    .update({
      status: input.status,
      message: input.message ?? null,
      metadata: input.metadata ?? {},
      finished_at: new Date().toISOString(),
      processing_time_ms: input.processing_time_ms,
    })
    .eq("id", logId);

  if (error) {
    console.error("[system-log] Failed to finish log:", error.message);
  }
}

export async function getRecentSystemLogs(
  limit = 50,
  jobType?: JobType,
): Promise<SystemLog[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  let query = supabase
    .from("system_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (jobType) {
    query = query.eq("job_type", jobType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[system-log] Failed to fetch logs:", error.message);
    return [];
  }

  return (data ?? []) as SystemLog[];
}
