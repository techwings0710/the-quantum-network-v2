import { getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import type { AgentIngestResult, RawEvent } from "../types";
import { eventSources } from "./sources";

export async function upsertEvent(item: RawEvent): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const now = new Date().toISOString();

  const { error } = await supabase.from("events").upsert(
    {
      title: item.title,
      description: item.description ?? null,
      location: item.location,
      venue: item.venue ?? null,
      city: item.city ?? null,
      country: item.country ?? null,
      type: item.type,
      event_url: item.registration_url,
      registration_url: item.registration_url,
      organiser: item.organiser ?? null,
      speaker: item.speaker ?? null,
      image: item.image ?? null,
      tags: item.tags ?? [],
      start_date: item.date,
      end_date: item.end_date ?? null,
      source_url: item.source_url,
      source_id: item.source_id ?? null,
      active: true,
      updated_at: now,
    },
    {
      onConflict: "source_url",
    },
  );

  if (error) {
    console.error("[events-ingest] Upsert failed:", error.message);
    return false;
  }

  return true;
}

export async function archivePastEvents(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return 0;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .update({
      active: false,
      updated_at: now,
    })
    .lt("start_date", now)
    .eq("active", true)
    .select("id");

  if (error) {
    console.error("[events-ingest] Archive failed:", error.message);
    return 0;
  }

  return data?.length ?? 0;
}

export async function deactivatePlaceholderEvents(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return 0;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .update({
      active: false,
      updated_at: now,
    })
    .or("event_url.eq.#,event_url.is.null,registration_url.eq.#")
    .eq("active", true)
    .select("id");

  if (error) {
    console.error(
      "[events-ingest] Placeholder deactivate failed:",
      error.message,
    );
    return 0;
  }

  return data?.length ?? 0;
}

export async function ingestEventsFromSources(): Promise<AgentIngestResult> {
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

  console.log(
    `[events-ingest] Starting sync for ${eventSources.length} sources`,
  );

  for (const source of eventSources) {
    try {
      const rawItems = await source.fetch();

      result.sources_processed += 1;
      result.fetched += rawItems.length;

      for (const raw of rawItems) {
        try {
          const normalized = source.normalize(raw);

          if (!normalized) {
            console.log("[EVENTS] normalize() returned null");
            continue;
          }

          const valid = source.validate(normalized);

          if (!valid) {
            console.log("[EVENTS] Validation failed:");
            console.log(normalized);
            continue;
          }

          console.log("[EVENTS] Attempting to save:", normalized.title);

          const saved = await upsertEvent(normalized);

          console.log("[EVENTS] Saved:", saved);

          if (saved) {
            result.saved += 1;
          }
        } catch (itemError) {
          const message =
            itemError instanceof Error
              ? itemError.message
              : "Unknown error";

          result.errors.push(`${source.name} item error: ${message}`);
        }
      }
    } catch (sourceError) {
      result.sources_failed += 1;

      const message =
        sourceError instanceof Error
          ? sourceError.message
          : "Unknown source error";

      result.errors.push(`Source "${source.name}" failed: ${message}`);

      console.error(
        `[events-ingest] Source error (${source.name}): ${message}`,
      );
    }
  }

  // --------------------------------------------------
  // TEMPORARILY DISABLED
  //
  // Current RSS feeds are mostly NEWS feeds, not real
  // event feeds. Their publication dates are historical,
  // so archivePastEvents() immediately marks everything
  // inactive.
  //
  // Re-enable this once real event sources are added.
  // --------------------------------------------------

  const archivedCount = 0;

  const placeholderCount = await deactivatePlaceholderEvents();

  result.deactivated = placeholderCount;

  result.processing_time_ms = Date.now() - startTime;

  result.success = result.errors.length === 0 || result.saved > 0;

  console.log(
    `[events-ingest] Complete: ${result.saved} saved, ${result.deactivated} deactivated, ${result.processing_time_ms}ms`,
  );

  return result;
}