import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/news/db";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") ?? "";

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Search query parameter 'q' is required" },
        { status: 400 },
      );
    }

    const results = await searchNews(query);

    return NextResponse.json({
      query,
      count: results.length,
      articles: results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    console.error("[search-api]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
