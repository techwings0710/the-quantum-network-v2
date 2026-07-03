import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron/auth";
import { createSystemLog, finishSystemLog } from "@/lib/logs/db";
import { ingestEventsFromSources } from "@/lib/events/ingest";

async function runIngestion() {
  const startTime = Date.now();
  console.log("[events-api] Starting events ingestion");

  const logId = await createSystemLog({
    job_type: "events_ingest",
    status: "started",
    message: "Events ingestion started",
  });

  const result = await ingestEventsFromSources();
  const processingTime = Date.now() - startTime;

  console.log(
    `[events-api] Finished: ${result.saved} saved, ${result.deactivated} archived, ${processingTime}ms`,
  );

  if (logId) {
    await finishSystemLog(logId, {
      status: result.success ? "completed" : "partial",
      message: `Saved ${result.saved}, archived ${result.deactivated}`,
      metadata: { ...result },
      processing_time_ms: processingTime,
    });
  }

  return NextResponse.json(result, {
    status: result.success ? 200 : 207,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyCronAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return runIngestion();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Events ingestion failed";
    console.error("[events-api] POST failed:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return runIngestion();
}