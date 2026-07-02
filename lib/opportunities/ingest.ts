import { getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import type { AgentIngestResult, RawOpportunity } from "../types";
import { getInitials } from "./sources/base";
import { opportunitySources } from "./sources";

const LOGO_COLORS = ["primary", "secondary", "tertiary"] as const;

function getLogoColor(org: string): string {
  const hash = org.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return LOGO_COLORS[hash % LOGO_COLORS.length];
}

export async function upsertOpportunity(item: RawOpportunity): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const now = new Date().toISOString();
  const initials = getInitials(item.organization);

  const { error } = await supabase.from("opportunities").upsert(
    {
      title: item.title,
      organization: item.organization,
      logo: item.logo ?? null,
      location: item.location,
      country: item.country ?? null,
      type: item.type,
      description: item.description ?? null,
      deadline: item.deadline ?? null,
      skills: item.skills ?? [],
      salary: item.salary ?? null,
      tags: item.tags ?? [],
      apply_url: item.apply_url,
      source_url: item.source_url,
      source_id: item.source_id ?? null,
      logo_initials: initials,
      logo_color: getLogoColor(item.organization),
      active: true,
      updated_at: now,
    },
    { onConflict: "source_url" },
  );

  if (error) {
    console.error("[opportunities-ingest] Upsert failed:", error.message);
    return false;
  }

  return true;
}

export async function deactivateExpiredOpportunities(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return 0;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("opportunities")
    .update({ active: false, updated_at: now })
    .lt("deadline", now)
    .eq("active", true)
    .select("id");

  if (error) {
    console.error("[opportunities-ingest] Deactivate failed:", error.message);
    return 0;
  }

  return data?.length ?? 0;
}

export async function deactivatePlaceholderOpportunities(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return 0;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("opportunities")
    .update({ active: false, updated_at: now })
    .or("apply_url.eq.#,apply_url.is.null")
    .eq("active", true)
    .select("id");

  if (error) {
    console.error("[opportunities-ingest] Placeholder deactivate failed:", error.message);
    return 0;
  }

  return data?.length ?? 0;
}

export async function ingestOpportunitiesFromSources(): Promise<AgentIngestResult> {
  const startTime = Date.now();
  const result: AgentIngestResult = {
    success: true,
    sources_processed: 0,
    sources_failed: 0,
    fetched: 0,
    saved: 0,
    updated: 0,
    deactivated: 0,
    errors: [],
    processing_time_ms: 0,
  };

  console.log(`[opportunities-ingest] Starting sync for ${opportunitySources.length} sources`);

  for (const source of opportunitySources) {
    try {
      const rawItems = await source.fetch();
      result.sources_processed += 1;
      result.fetched += rawItems.length;

      for (const raw of rawItems) {
        try {
          const normalized = source.normalize(raw);
          if (!normalized || !source.validate(normalized)) continue;

          const saved = await upsertOpportunity(normalized);
          if (saved) {
            result.saved += 1;
          }
        } catch (itemError) {
          const message =
            itemError instanceof Error ? itemError.message : "Unknown error";
          result.errors.push(`${source.name} item error: ${message}`);
        }
      }
    } catch (sourceError) {
      result.sources_failed += 1;
      const message =
        sourceError instanceof Error ? sourceError.message : "Unknown source error";
      result.errors.push(`Source "${source.name}" failed: ${message}`);
      console.error(`[opportunities-ingest] Source error (${source.name}): ${message}`);
    }
  }

  const expiredCount = await deactivateExpiredOpportunities();
  const placeholderCount = await deactivatePlaceholderOpportunities();
  result.deactivated = expiredCount + placeholderCount;

  result.processing_time_ms = Date.now() - startTime;
  result.success = result.errors.length === 0 || result.saved > 0;

  console.log(
    `[opportunities-ingest] Complete: ${result.saved} saved, ${result.deactivated} deactivated, ${result.processing_time_ms}ms`,
  );

  return result;
}
