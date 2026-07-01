import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/newsletter/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";

    if (!email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 },
      );
    }

    const result = await subscribeToNewsletter(email);

    return NextResponse.json(result, {
      status: result.success ? 201 : 409,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Newsletter subscription failed";
    console.error("[newsletter-api]", message);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST with { email } to subscribe to the newsletter",
  });
}
