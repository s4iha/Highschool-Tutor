import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { z } from "zod";

const onboardingSchema = z.object({
  fullName: z.string().min(1),
  gradeLevel: z.string().min(1),
  track: z.string().min(1),
  termPreference: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = onboardingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid form data. All fields are required." },
        { status: 400 }
      );
    }

    const { fullName, gradeLevel, track, termPreference } = validated.data;

    const profile = await prisma.profile.upsert({
      where: { id: sessionUser.id },
      update: {
        fullName,
        gradeLevel,
        track,
        termPreference: termPreference || "",
        hasOnboarded: true,
      },
      create: {
        id: sessionUser.id,
        fullName,
        email: sessionUser.email,
        gradeLevel,
        track,
        termPreference: termPreference || "",
        hasOnboarded: true,
      },
    });

    // Also update User name
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { name: fullName },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

