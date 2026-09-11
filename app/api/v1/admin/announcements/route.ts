import { NextRequest, NextResponse } from "next/server";
import { runAsAdmin } from "@/lib/prisma";
import { AnnouncementCreateSchema } from "@/features/admin/schemas/adminSchemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where: Record<string, unknown> = {};

    if (audience && audience !== "ALL_AUDIENCES") {
      where.targetAudience = audience;
    }
    if (type && type !== "ALL_TYPES") {
      where.type = type;
    }
    if (activeOnly) {
      where.isActive = true;
    }

    const announcements = await runAsAdmin(async (tx) => {
      return tx.announcement.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    });

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error listing announcements:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = AnnouncementCreateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const created = await runAsAdmin(async (tx) => {
      return tx.announcement.create({
        data: {
          title: data.title,
          body: data.body,
          type: data.type,
          targetAudience: data.targetAudience,
          isActive: data.isActive,
          publishedAt: data.isActive ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Announcement created successfully.",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
