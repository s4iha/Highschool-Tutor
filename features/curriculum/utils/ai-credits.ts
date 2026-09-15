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
        "You have reached your daily limit of 20 free AI credits. Upgrade to a HighSchool Tutor Pass for unlimited AI tutoring, or return tomorrow (resets daily at midnight PHT) for 20 new credits!",
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
 * Get current AI credit balance without consuming a credit.
 */
export async function getAiCreditBalance(userId: string | null | undefined): Promise<{
  remaining: number;
  totalMax: number;
  isUnlimited: boolean;
}> {
  if (!userId) {
    return { remaining: 3, totalMax: 3, isUnlimited: false };
  }

  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      expiresAt: { gte: new Date() },
    },
  });

  if (activeSub) {
    return { remaining: 9999, totalMax: 9999, isUnlimited: true };
  }

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
  const remaining = Math.max(0, FREE_TIER_DAILY_CREDITS - usedToday);

  return {
    remaining,
    totalMax: FREE_TIER_DAILY_CREDITS,
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
    /forget\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /system\s+prompt/gi,
    /jailbreak/gi,
    /DAN\s+mode/gi,
    /you\s+are\s+now\s+(an?\s+)?unrestricted/gi,
    /act\s+as\s+(an?\s+)?unrestricted/gi,
    /pretend\s+(to\s+be\s+)?(an?\s+)?unrestricted/gi,
    /bypass\s+(all\s+)?(rules|filters|safeguards|limits)/gi,
    /override\s+(all\s+)?(rules|instructions|directives)/gi,
    /reveal\s+(your\s+)?(system\s+prompt|instructions|initial\s+prompt)/gi,
    /output\s+(your\s+)?(system\s+prompt|initial\s+prompt)/gi,
    /what\s+(is|are)\s+your\s+(system\s+prompt|core\s+instructions)/gi,
    /developer\s+mode/gi,
  ];

  for (const pattern of injectionPatterns) {
    cleaned = cleaned.replace(pattern, "[removed]");
  }

  return cleaned;
}

/**
 * Validates whether a query is suitable for the educational AI tutor.
 * Blocks obvious non-academic abuse, jailbreaks, and prompt hacking attempts.
 */
export function validateEducationalQuery(text: string): { allowed: boolean; reason?: string } {
  if (!text || !text.trim()) {
    return { allowed: false, reason: "Please enter a question or topic to discuss with your AI tutor." };
  }

  const trimmed = text.trim();
  if (trimmed.length < 2) {
    return { allowed: false, reason: "Your question is too short. Please provide more context." };
  }

  // Check for severe prompt extraction / jailbreak patterns
  const heavyJailbreakPatterns = [
    /\b(ignore|disregard|forget)\s+all\s+(previous|prior)\s+instructions\b/i,
    /\b(jailbreak|dan\s+mode|developer\s+mode)\b/i,
    /\b(reveal|show|output|print)\s+(your\s+)?(system\s+prompt|instructions)\b/i,
    /\bbypass\s+(all\s+)?(content\s+filters|guardrails|safety\s+filters)\b/i,
  ];

  for (const pattern of heavyJailbreakPatterns) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        reason: "I am your DepEd K-12 Socratic AI Tutor. Please keep questions focused on learning and curriculum topics!",
      };
    }
  }

  return { allowed: true };
}

