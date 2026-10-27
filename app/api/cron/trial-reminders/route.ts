import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTrialReminderEmail } from "@/features/billing/services/email-service";

export const dynamic = "force-dynamic";

/**
 * Daily Cron Route: 7-Day Trial Expiration Reminder
 * 
 * Invoked by Vercel Cron, external cron services, or admin workflows.
 * Requires Bearer authorization header matching process.env.CRON_SECRET.
 * Identifies trial students whose 30-day window will expire in 7 days (Day 23 of 30)
 * and delivers an email notification with 100% idempotency via ReminderNotice.
 */
export async function GET(req: NextRequest) {
  return handleTrialReminders(req);
}

export async function POST(req: NextRequest) {
  return handleTrialReminders(req);
}

async function handleTrialReminders(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Validate authorization if CRON_SECRET is configured
    if (cronSecret && cronSecret.trim() !== "") {
      const expectedBearer = `Bearer ${cronSecret.trim()}`;
      if (authHeader !== expectedBearer) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing CRON_SECRET bearer token" },
          { status: 401 }
        );
      }
    }

    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // Day 23 window: users registered between 23 and 24 days ago
    // Meaning they have between 6.0 and 7.0 days remaining of their 30-day trial
    const day23Start = new Date(now - 24 * ONE_DAY_MS);
    const day23End = new Date(now - 23 * ONE_DAY_MS);

    // Fetch candidate students who registered in the Day 23 window
    const candidateUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: day23Start,
          lte: day23End,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscriptions: {
          where: {
            status: "ACTIVE",
            expiresAt: { gte: new Date() },
          },
          select: { id: true },
        },
        reminderNotices: {
          where: {
            kind: "trial_expiring_7d",
            periodKey: "30d_trial",
          },
          select: { id: true },
        },
      },
    });

    let sentCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const candidate of candidateUsers) {
      // 1. Skip if user already has an active subscription
      if (candidate.subscriptions.length > 0) {
        skippedCount++;
        continue;
      }

      // 2. Skip if already notified (idempotent check)
      if (candidate.reminderNotices.length > 0) {
        skippedCount++;
        continue;
      }

      // 3. Skip if no email address
      if (!candidate.email) {
        skippedCount++;
        continue;
      }

      try {
        const sendResult = await sendTrialReminderEmail({
          recipientEmail: candidate.email,
          recipientName: candidate.name || undefined,
          daysRemaining: 7,
          upgradeUrl: `${process.env.BETTER_AUTH_URL || "https://highschooltutor.ph"}/pricing`,
        });

        if (sendResult.success) {
          // Record notice in PostgreSQL for guaranteed idempotency
          await prisma.reminderNotice.create({
            data: {
              userId: candidate.id,
              kind: "trial_expiring_7d",
              periodKey: "30d_trial",
              channel: "email",
              destination: candidate.email,
              result: "sent",
              detail: `Dispatched with messageId: ${sendResult.messageId || "unknown"}`,
            },
          });
          sentCount++;
        } else {
          errors.push(`Failed to send to ${candidate.email}: ${sendResult.error || "Unknown error"}`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unexpected error sending notice";
        errors.push(`Error processing user ${candidate.id}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      processed: candidateUsers.length,
      sent: sentCount,
      skipped: skippedCount,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CronTrialReminders:FatalError]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error in cron handler",
      },
      { status: 500 }
    );
  }
}
