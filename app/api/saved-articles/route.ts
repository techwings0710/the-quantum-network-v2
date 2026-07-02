import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSavedArticles, saveArticle, unsaveArticle } from "@/lib/news/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articles = await getSavedArticles(session.user.email);
    return NextResponse.json(articles);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch saved articles";
    console.error("[saved-articles-api] GET failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const success = await saveArticle(session.user.email, articleId);
    if (!success) {
      return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Article saved successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save article";
    console.error("[saved-articles-api] POST failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const success = await unsaveArticle(session.user.email, articleId);
    if (!success) {
      return NextResponse.json({ error: "Failed to unsave article" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Article unsaved successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to unsave article";
    console.error("[saved-articles-api] DELETE failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
