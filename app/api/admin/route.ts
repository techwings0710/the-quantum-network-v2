import { requireAdmin } from "@/lib/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ status: "ok" });
}

async function triggerIngest(path: string, request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cronSecret = process.env.CRON_SECRET;
  const headers: Record<string, string> = {};
  if (cronSecret) {
    headers.Authorization = `Bearer ${cronSecret}`;
  }

  const baseUrl = request.nextUrl.origin;
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { action?: string; articleId?: string; status?: string; id?: string; updates?: Record<string, unknown> };
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { deleteArticleAdmin, featureArticleAdmin, updateArticleAdmin } = await import("@/lib/admin/db");
  const { updateJoinUsApplicationStatus } = await import("@/lib/join-us/db");
  const { createSystemLog } = await import("@/lib/logs/db");

  switch (body.action) {
    case "ingest-news":
      return triggerIngest("/api/ingest-news", request);
    case "ingest-opportunities":
      return triggerIngest("/api/ingest-opportunities", request);
    case "ingest-events":
      return triggerIngest("/api/ingest-events", request);
    case "delete-article":
      if (!body.articleId) return NextResponse.json({ error: "articleId required" }, { status: 400 });
      await createSystemLog({ job_type: "admin_action", status: "completed", message: `Deleted article ${body.articleId}` });
      return NextResponse.json({ success: await deleteArticleAdmin(body.articleId) });
    case "feature-article":
      if (!body.articleId) return NextResponse.json({ error: "articleId required" }, { status: 400 });
      return NextResponse.json({ success: await featureArticleAdmin(body.articleId) });
    case "edit-article":
      if (!body.articleId || !body.updates) {
        return NextResponse.json({ error: "articleId and updates required" }, { status: 400 });
      }
      return NextResponse.json({
        success: await updateArticleAdmin(body.articleId, body.updates as Parameters<typeof updateArticleAdmin>[1]),
      });
    case "upload-image":
      if (!body.articleId || !body.updates?.image_url) {
        return NextResponse.json({ error: "articleId and image_url required" }, { status: 400 });
      }
      return NextResponse.json({
        success: await updateArticleAdmin(body.articleId, {
          image_url: body.updates.image_url as string,
        }),
      });
    case "retry-failed":
      return triggerIngest(
        body.updates?.job === "events"
          ? "/api/ingest-events"
          : body.updates?.job === "opportunities"
            ? "/api/ingest-opportunities"
            : "/api/ingest-news",
        request,
      );
    case "approve-application":
      if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
      return NextResponse.json({
        success: await updateJoinUsApplicationStatus(body.id, (body.status as "approved" | "rejected") ?? "approved"),
      });
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
