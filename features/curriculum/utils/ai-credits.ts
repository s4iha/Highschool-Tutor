import { prisma, runWithUser } from "@/lib/prisma";

export const FREE_TIER_DAILY_CREDITS = 20;

export interface AiCreditCheckResult {
  allowed: boolean;
  remaining: number;
  isUnlimited?: boolean;
  error?: string;
}

/**
 * Checks if a user has available daily AI credits and consumes 1 credit if permitted.
 * Premium subscribers with ACTIVE status have unlimited credits.
 */
export async function checkAndConsumeAiCredit(
  userId: string | null | undefined,
  action: "quiz_generation" | "ai_tutor" | "translation"
): Promise<AiCreditCheckResult> {
  // Allow unauthenticated guest users up to 3 trial actions without user record
  if (!userId) {
    return { allowed: true, remaining: 3, isUnlimited: false };
  }

  // 1. Check if user has an active premium subscription
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      expiresAt: { gte: new Date() },
    },
  });

  if (activeSub) {
    return { allowed: true, remaining: 9999, isUnlimited: true };
  }

  // 2. Compute today's usage for free tier
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const usageAggregate = await prisma.aiCreditUsage.aggregate({
    where: {
      userId,
      createdAt: { gte: todayStart },
    },
    _sum: {
      credits: true,
    },
  });

  const usedToday = usageAggregate._sum.credits || 0;

  if (usedToday >= FREE_TIER_DAILY_CREDITS) {
    return {
      allowed: false,
      remaining: 0,
      isUnlimited: false,
      error:
        "You have reached your daily limit of 20 free AI credits. Upgrade to a HighSchool Tutor Pass for unlimited AI tutoring, or return tomorrow for 20 new credits!",
    };
  }

  // 3. Consume 1 credit within RLS session
  try {
    await runWithUser(userId, async (tx) => {
      await tx.aiCreditUsage.create({
        data: {
          userId,
          action,
          credits: 1,
        },
      });
    });
  } catch (err) {
    console.error("Failed to record AI credit usage:", err);
  }

  return {
    allowed: true,
    remaining: Math.max(0, FREE_TIER_DAILY_CREDITS - (usedToday + 1)),
    isUnlimited: false,
  };
}

/**
 * Sanitize student input to protect against injection and script attacks.
 */
export function sanitizeStudentInput(text: string, maxLength = 500): string {
  if (!text) return "";

  // 1. Trim and enforce length limit
  let cleaned = text.trim().slice(0, maxLength);

  // 2. Strip HTML tags and script elements
  cleaned = cleaned.replace(/<[^>]*>?/gm, "");

  // 3. Neutralize common prompt injection directives
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /disregard\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /system\s+prompt/gi,
    /jailbreak/gi,
    /DAN\s+mode/gi,
  ];

  for (const pattern of injectionPatterns) {
    cleaned = cleaned.replace(pattern, "[removed]");
  }

  return cleaned;
}
