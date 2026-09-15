"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { SUBJECT_BY_SLUG } from "../utils/curriculum-data";
import { canAccessLesson } from "../utils/tier-guardrails";
import { getQuizAction, recordQuizAttemptAction } from "./curriculum.actions";
import { sampleQuizQuestions } from "../utils/quiz-sampler";
import { Prisma } from "@prisma/client";
import type { QuizQuestion } from "../types/curriculum.types";

export interface CreateQuizSessionInput {
  subjectSlug: string;
  lessonNumber: number;
  mode: "study" | "exam";
  count: number;
}

/**
 * Creates a server-locked quiz session.
 * Enforces server-side lesson paywalls, validates question counts,
 * and locks quiz parameters to prevent client URL manipulation.
 */
export async function createQuizSessionAction(input: CreateQuizSessionInput): Promise<{
  success: boolean;
  sessionId?: string;
  error?: string;
}> {
  try {
    const subject = SUBJECT_BY_SLUG.get(input.subjectSlug);
    if (!subject) {
      return { success: false, error: "Subject not found" };
    }

    const lessonNum = Number(input.lessonNumber);
    if (isNaN(lessonNum) || lessonNum < 1 || lessonNum > 20) {
      return { success: false, error: "Invalid lesson number" };
    }

    const sessionUser = await getCurrentUser();

    // 1. Enforce Server-Side Lesson Access Guardrails
    let isSubscribed = false;
    if (sessionUser?.id) {
      const activeSub = await prisma.subscription.findFirst({
        where: {
          userId: sessionUser.id,
          status: "ACTIVE",
          expiresAt: { gte: new Date() },
        },
      });
      isSubscribed = !!activeSub;
    }

    if (!canAccessLesson(lessonNum, isSubscribed)) {
      return {
        success: false,
        error: `Lesson ${lessonNum} is locked for free-tier accounts. Please upgrade to access lessons beyond Lesson 3.`,
      };
    }

    // 2. Validate Mode and Clamp Allowed Question Counts
    const mode = input.mode === "exam" ? "exam" : "study";
    const allowedCounts = [5, 10, 15, 20, 24];
    let count = Number(input.count);
    if (!allowedCounts.includes(count)) {
      count = 10;
    }

    // 3. Fetch Quiz Questions Pool
    const quizResult = await getQuizAction(input.subjectSlug, lessonNum);
    if (!quizResult.success || !quizResult.questions || quizResult.questions.length === 0) {
      return { success: false, error: quizResult.error || "Failed to load quiz questions" };
    }

    // 4. Sample the specific questions for this session
    const sampled = sampleQuizQuestions(quizResult.questions, count);

    // 5. Create immutable QuizSession record
    const session = await prisma.quizSession.create({
      data: {
        userId: sessionUser?.id ?? null,
        subjectSlug: input.subjectSlug,
        lessonNumber: lessonNum,
        lessonTitle: quizResult.lessonTitle,
        mode,
        questionCount: sampled.length,
        questions: sampled as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      success: true,
      sessionId: session.id,
    };
  } catch (err) {
    console.error("createQuizSessionAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create quiz session",
    };
  }
}

/**
 * Retrieves a quiz session by ID.
 * In exam mode, correct answers and explanations are stripped until completion
 * to prevent devtools inspection.
 */
export async function getQuizSessionAction(sessionId: string): Promise<{
  success: boolean;
  session?: {
    id: string;
    subjectSlug: string;
    lessonNumber: number;
    lessonTitle: string;
    mode: "study" | "exam";
    questionCount: number;
    questions: QuizQuestion[];
    completedAt: Date | null;
    score: number | null;
    total: number | null;
  };
  error?: string;
}> {
  try {
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return { success: false, error: "Quiz session not found or expired" };
    }

    const sessionUser = await getCurrentUser();
    // If session was created by an authenticated user, require matching user
    if (session.userId && sessionUser?.id && session.userId !== sessionUser.id) {
      return { success: false, error: "Unauthorized access to quiz session" };
    }

    let questions = session.questions as unknown as QuizQuestion[];

    // If Exam mode and not yet submitted, hide correct answer & explanation
    if (session.mode === "exam" && !session.completedAt) {
      questions = questions.map((q) => ({
        ...q,
        answer: "" as unknown as QuizQuestion["answer"],
        explanation: "",
      }));
    }

    return {
      success: true,
      session: {
        id: session.id,
        subjectSlug: session.subjectSlug,
        lessonNumber: session.lessonNumber,
        lessonTitle: session.lessonTitle,
        mode: session.mode as "study" | "exam",
        questionCount: session.questionCount,
        questions,
        completedAt: session.completedAt,
        score: session.score,
        total: session.total,
      },
    };
  } catch (err) {
    console.error("getQuizSessionAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load quiz session",
    };
  }
}

/**
 * Evaluates student answers against the server-stored session questions.
 * Eliminates client-side score trust and records official attempt.
 */
export async function submitQuizSessionAction(
  sessionId: string,
  userAnswers: Record<number, "A" | "B" | "C" | "D">
): Promise<{
  success: boolean;
  score?: number;
  total?: number;
  questions?: QuizQuestion[];
  error?: string;
}> {
  try {
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return { success: false, error: "Quiz session not found" };
    }

    const sessionUser = await getCurrentUser();
    if (session.userId && sessionUser?.id && session.userId !== sessionUser.id) {
      return { success: false, error: "Unauthorized access to submit quiz session" };
    }

    const questions = session.questions as unknown as QuizQuestion[];
    const total = questions.length;

    // Server-Side Verification: Compare userAnswers against original stored questions
    let verifiedScore = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] && userAnswers[idx] === q.answer) {
        verifiedScore++;
      }
    });

    // Mark session as completed with server-verified score
    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        userAnswers: userAnswers as unknown as Prisma.InputJsonValue,
        score: verifiedScore,
        total,
        completedAt: new Date(),
      },
    });

    // Record verified attempt in PostgreSQL
    const subject = SUBJECT_BY_SLUG.get(session.subjectSlug);
    await recordQuizAttemptAction({
      subjectSlug: session.subjectSlug,
      subjectCode: subject?.code || session.subjectSlug,
      lessonNumber: session.lessonNumber,
      lessonTitle: session.lessonTitle,
      score: verifiedScore,
      total,
      mode: session.mode as "study" | "exam",
    });

    return {
      success: true,
      score: verifiedScore,
      total,
      questions,
    };
  } catch (err) {
    console.error("submitQuizSessionAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit quiz session",
    };
  }
}
