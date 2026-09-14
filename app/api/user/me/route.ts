import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { profile: true, roles: true },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // 1. Auto-assign STUDENT role if missing
    let userRole = user.roles?.[0]?.role || sessionUser.role || "STUDENT";
    if (user.roles.length === 0) {
      try {
        const createdRole = await prisma.userRole.create({
          data: {
            userId: user.id,
            role: "STUDENT",
          },
        });
        userRole = createdRole.role;
      } catch (err) {
        console.error("Auto-assign role error:", err);
      }
    }

    // 2. Auto-provision Profile if missing (e.g. for Google OAuth signups)
    let profile = user.profile;
    if (!profile) {
      try {
        profile = await prisma.profile.create({
          data: {
            id: user.id,
            email: user.email,
            fullName: user.name || "",
            hasOnboarded: false,
          },
        });
      } catch (err) {
        console.error("Auto-provision profile error:", err);
      }
    } else if (!profile.fullName?.trim() && user.name?.trim()) {
      // Sync Google name to existing empty profile
      try {
        profile = await prisma.profile.update({
          where: { id: user.id },
          data: { fullName: user.name.trim() },
        });
      } catch (err) {
        console.error("Sync profile name error:", err);
      }
    } else if (!user.name?.trim() && profile.fullName?.trim()) {
      // Sync profile name to user.name if user.name is empty
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: profile.fullName.trim() },
        });
        user.name = profile.fullName.trim();
      } catch (err) {
        console.error("Sync user name error:", err);
      }
    }

    const resolvedName = profile?.fullName?.trim() || user.name?.trim() || "";

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: resolvedName,
        image: user.image,
        role: userRole,
        profile: profile
          ? {
              fullName: resolvedName,
              gradeLevel: profile.gradeLevel,
              track: profile.track,
              school: profile.school,
              hasOnboarded: profile.hasOnboarded,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

