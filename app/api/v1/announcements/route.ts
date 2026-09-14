import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");

    const where: {
      isActive: boolean;
      targetAudience?: { in: ("ALL" | "PREMIUM" | "TRIAL")[] };
    } = {
      isActive: true,
    };

    if (audience === "PREMIUM") {
      where.targetAudience = { in: ["ALL", "PREMIUM"] };
    } else if (audience === "TRIAL") {
      where.targetAudience = { in: ["ALL", "TRIAL"] };
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: 20,
    });

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.warn("Error loading public announcements:", error);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
