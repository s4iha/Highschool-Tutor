import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  school: z.string().optional(),
  gradeLevel: z.string().optional(),
  track: z.string().optional(),
});

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: sessionUser.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { fullName, school, gradeLevel, track } = validated.data;

    const profile = await prisma.profile.upsert({
      where: { id: sessionUser.id },
      update: {
        fullName,
        school: school || "",
        ...(gradeLevel ? { gradeLevel } : {}),
        ...(track ? { track } : {}),
      },
      create: {
        id: sessionUser.id,
        fullName,
        email: sessionUser.email,
        school: school || "",
        gradeLevel: gradeLevel || "Grade 11",
        track: track || "STEM Strand",
        hasOnboarded: true,
      },
    });

    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { name: fullName },
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

