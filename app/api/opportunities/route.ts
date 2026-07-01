import { NextRequest, NextResponse } from "next/server";
import { getOpportunities, getOpportunitiesByType } from "@/lib/opportunities/db";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type") ?? undefined;
    const opportunities = type
      ? await getOpportunitiesByType(type)
      : await getOpportunities();

    return NextResponse.json({
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch opportunities";
    console.error("[opportunities-api]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
