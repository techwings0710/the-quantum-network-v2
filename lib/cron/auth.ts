import { NextRequest } from "next/server";

export function verifyCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;

  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-vercel-cron");
  return (
    authHeader === `Bearer ${cronSecret}` || cronHeader === "1"
  );
}
