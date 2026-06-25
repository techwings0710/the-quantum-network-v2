import { NextRequest, NextResponse } from "next/server";
import { getNewsBySlug } from "@/lib/news/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const article = await getNewsBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
