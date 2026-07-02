import { auth } from "@/lib/auth";
import { getUserById, syncGoogleProfile, updateUserProfile } from "@/lib/users/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserById(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  const updated = await updateUserProfile(session.user.id, {
    name: body.name as string | undefined,
    bio: body.bio as string | undefined,
    organization: body.organization as string | undefined,
    country: body.country as string | undefined,
    research_interests: body.research_interests as string[] | undefined,
    favourite_topics: body.favourite_topics as string[] | undefined,
    notification_preferences: body.notification_preferences as
      | { newsletter: boolean; opportunities: boolean; events: boolean }
      | undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json(updated);
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const synced = await syncGoogleProfile({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  });

  if (!synced) {
    return NextResponse.json({ error: "Failed to sync profile" }, { status: 500 });
  }

  return NextResponse.json(synced);
}
