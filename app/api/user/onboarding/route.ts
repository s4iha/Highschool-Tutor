import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { z } from "zod";

const onboardingSchema = z.object({
  fullName: z.string().min(1),
  gradeLevel: z.string().min(1),
  track: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
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

    const { fullName, gradeLevel, track } = validated.data;

    const profile = await prisma.profile.upsert({
      where: { id: payload.userId },
      update: {
        fullName,
        gradeLevel,
        track,
        hasOnboarded: true,
      },
      create: {
        id: payload.userId,
        fullName,
        email: payload.email,
        gradeLevel,
        track,
        hasOnboarded: true,
      },
    });

    // Also update User name
    await prisma.user.update({
      where: { id: payload.userId },
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
