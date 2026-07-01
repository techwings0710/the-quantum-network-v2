import { NextRequest, NextResponse } from "next/server";
import { ingestNewsFromRss } from "@/lib/ingest/pipeline";

function verifyCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;

  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-vercel-cron");
  return (
    authHeader === `Bearer ${cronSecret}` || cronHeader === "1"
  );
}

async function runIngestion() {
  const result = await ingestNewsFromRss();
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
      error instanceof Error ? error.message : "Ingestion pipeline failed";
    console.error("[ingest-api] POST failed:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
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
      error instanceof Error ? error.message : "Ingestion pipeline failed";
    console.error("[ingest-api] GET failed:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
