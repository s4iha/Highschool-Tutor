import { NextRequest, NextResponse } from "next/server";
import { runAsAdmin } from "@/lib/prisma";
import { AnnouncementUpdateSchema } from "@/features/admin/schemas/adminSchemas";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const rawBody = await req.json();
    const parsed = AnnouncementUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (updateData.publishedAt !== undefined) {
      updateData.publishedAt = updateData.publishedAt ? new Date(updateData.publishedAt as string) : null;
    }

    const updated = await runAsAdmin(async (tx) => {
      return tx.announcement.update({
        where: { id },
        data: updateData,
      });
    });

    return NextResponse.json({
      success: true,
      message: "Announcement updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await runAsAdmin(async (tx) => {
      return tx.announcement.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
