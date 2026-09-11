import { NextRequest, NextResponse } from "next/server";
import { prisma, runAsAdmin } from "@/lib/prisma";
import { AdminConfigUpdateSchema } from "@/features/admin/schemas/adminSchemas";

const DEFAULT_CONFIG = {
  id: "default_config",
  monthlyPricePhp: 199,
  annualPricePhp: 1499,
  maxTrialSubjects: 3,
  maxFreeLessons: 3,
  gcashReceiverNumber: "0917-888-4321",
  gcashAccountName: "HIGHSCHOOL TUTOR PH",
  mayaReceiverNumber: "0918-999-8765",
  mayaAccountName: "HIGHSCHOOL TUTOR PH",
  enableAiTutorTrial: true,
  promoDiscountPercent: 20,
};

export async function GET() {
  try {
    let config = await prisma.adminConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!config) {
      config = await runAsAdmin(async (tx) => {
        return tx.adminConfig.create({
          data: DEFAULT_CONFIG,
        });
      });
    }

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.warn("DB offline or error loading settings, returning default:", error);
    return NextResponse.json({
      success: true,
      data: {
        ...DEFAULT_CONFIG,
        updatedAt: new Date().toISOString(),
      },
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = AdminConfigUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await runAsAdmin(async (tx) => {
      const existing = await tx.adminConfig.findFirst({
        orderBy: { updatedAt: "desc" },
      });

      if (existing) {
        return tx.adminConfig.update({
          where: { id: existing.id },
          data: {
            ...parsed.data,
            updatedAt: new Date(),
          },
        });
      } else {
        return tx.adminConfig.create({
          data: {
            ...DEFAULT_CONFIG,
            ...parsed.data,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Admin configuration updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Failed to update admin config:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
