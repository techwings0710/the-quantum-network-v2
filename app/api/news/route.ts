import { NextRequest, NextResponse } from "next/server";
import { getLatestNews, searchNews } from "@/lib/news/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    if (query) {
      const results = await searchNews(query);
      return NextResponse.json({ articles: results, query });
    }

    const articles = await getLatestNews(limit);
    return NextResponse.json({ articles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch news";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
