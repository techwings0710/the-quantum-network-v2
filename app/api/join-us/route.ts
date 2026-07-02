import { submitJoinUsApplication } from "@/lib/join-us/db";
import { isValidEmail } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, string>;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const country = body.country?.trim();
    const role = body.role?.trim();
    const areaOfInterest = body.area_of_interest?.trim();

    if (!name || !email || !country || !role || !areaOfInterest) {
      return NextResponse.json(
        { error: "Name, email, country, role, and area of interest are required" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const application = await submitJoinUsApplication({
      name,
      email,
      country,
      organization: body.organization?.trim(),
      role,
      area_of_interest: areaOfInterest,
      message: body.message?.trim(),
    });

    if (!application) {
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
