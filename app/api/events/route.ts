import { NextRequest, NextResponse } from "next/server";
import { getEvents, getEventsByType } from "@/lib/events/db";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type") ?? undefined;
    const events = type ? await getEventsByType(type) : await getEvents();

    return NextResponse.json({
      count: events.length,
      events,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch events";
    console.error("[events-api]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
