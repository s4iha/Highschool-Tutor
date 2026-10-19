import { NextRequest, NextResponse } from "next/server";
import { prisma, runAsAdmin } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { AdminEnrollStudentSchema } from "@/features/admin/schemas/adminSchemas";

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrator access required." },
        { status: 403 }
      );
    }

    const rawBody = await req.json();
    const parsed = AdminEnrollStudentSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { email, name, plan, gradeLevel } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const config = await prisma.adminConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    const monthlyPrice = config?.monthlyPricePhp ?? 299;
    const annualPrice = config?.annualPricePhp ?? 2999;

    const result = await runAsAdmin(async (tx) => {
      // 1. Find or create user
      let user = await tx.user.findUnique({
        where: { email: normalizedEmail },
        include: { profile: true },
      });

      const studentName = name?.trim() || user?.name || normalizedEmail.split("@")[0];
      const studentGrade = gradeLevel?.trim() || user?.profile?.gradeLevel || "Grade 7";

      if (!user) {
        user = await tx.user.create({
          data: {
            email: normalizedEmail,
            name: studentName,
            roles: {
              create: {
                role: "STUDENT",
              },
            },
            profile: {
              create: {
                fullName: studentName,
                email: normalizedEmail,
                gradeLevel: studentGrade,
                school: "Enrolled by Admin",
              },
            },
          },
          include: { profile: true },
        });
      }

      // 2. Compute subscription dates and amounts
      const now = new Date();
      let expiresAt: Date;
      let amountPhp = 0;
      let subPlan: "MONTHLY" | "ANNUAL";
      let subStatus: "ACTIVE" | "TRIAL" = "ACTIVE";

      if (plan === "ANNUAL") {
        subPlan = "ANNUAL";
        amountPhp = annualPrice;
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      } else if (plan === "MONTHLY") {
        subPlan = "MONTHLY";
        amountPhp = monthlyPrice;
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else {
        // 30-Day Full Access Trial
        subPlan = "MONTHLY";
        subStatus = "TRIAL";
        amountPhp = 0;
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      // 3. Upsert subscription
      const existingSub = await tx.subscription.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      let subscription;
      if (existingSub) {
        subscription = await tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            plan: subPlan,
            status: subStatus,
            amountPhp,
            startedAt: now,
            expiresAt,
          },
        });
      } else {
        subscription = await tx.subscription.create({
          data: {
            userId: user.id,
            plan: subPlan,
            status: subStatus,
            amountPhp,
            startedAt: now,
            expiresAt,
          },
        });
      }

      // 4. Create an audit payment record if it's an active paid plan grant
      if (amountPhp > 0) {
        await tx.payment.create({
          data: {
            userId: user.id,
            subscriptionId: subscription.id,
            amountPhp,
            method: "admin_grant",
            referenceNo: `ADMIN-${Date.now().toString().slice(-8)}`,
            status: "VERIFIED",
            adminNotes: `Manually enrolled by administrator (${sessionUser.email || sessionUser.id})`,
            paidAt: now,
            verifiedAt: now,
          },
        });
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        subscription: {
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          expiresAt: subscription.expiresAt?.toISOString(),
        },
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully enrolled ${result.user.email} with ${plan === "TRIAL_30" ? "30-Day Full Trial" : plan} access.`,
      data: result,
    });
  } catch (error) {
    console.error("Admin manual enrollment error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Enrollment failed" },
      { status: 500 }
    );
  }
}
