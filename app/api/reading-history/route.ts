import { auth } from "@/lib/auth";
import { recordReadingHistory } from "@/lib/users/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { articleId?: string };
  if (!body.articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  await recordReadingHistory(session.user.id, body.articleId);
  return NextResponse.json({ success: true });
}
