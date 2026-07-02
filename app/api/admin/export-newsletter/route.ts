import { requireAdmin } from "@/lib/admin/auth";
import { getNewsletterSubscribersAdmin } from "@/lib/admin/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const subscribers = await getNewsletterSubscribersAdmin();

  const csv = [
    "email,subscribed_at,active",
    ...subscribers.map(
      (s: { email: string; subscribed_at: string; active: boolean }) =>
        `${s.email},${s.subscribed_at},${s.active}`,
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"',
    },
  });
}
