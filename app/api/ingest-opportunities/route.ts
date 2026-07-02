import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron/auth";
import { createSystemLog, finishSystemLog } from "@/lib/logs/db";
import { ingestOpportunitiesFromSources } from "@/lib/opportunities/ingest";

async function runIngestion() {
  const startTime = Date.now();
  console.log("[opportunities-api] Starting opportunities ingestion");

  const logId = await createSystemLog({
    job_type: "opportunities_ingest",
    status: "started",
    message: "Opportunities ingestion started",
  });

  const result = await ingestOpportunitiesFromSources();
  const processingTime = Date.now() - startTime;

  console.log(
    `[opportunities-api] Finished: ${result.saved} saved, ${result.deactivated} deactivated, ${processingTime}ms`,
  );

  if (logId) {
    await finishSystemLog(logId, {
      status: result.success ? "completed" : "partial",
      message: `Saved ${result.saved}, deactivated ${result.deactivated}`,
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
      error instanceof Error ? error.message : "Opportunities ingestion failed";
    console.error("[opportunities-api] POST failed:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyCronAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return runIngestion();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Opportunities ingestion failed";
    console.error("[opportunities-api] GET failed:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
