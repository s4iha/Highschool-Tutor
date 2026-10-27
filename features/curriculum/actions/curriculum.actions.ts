"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { SUBJECT_BY_SLUG } from "../utils/curriculum-data";
import {
  generateLessonsForSubject,
  generateQuizForLesson,
  generateTutorReply,
  translateText,
  batchTranslateQuizQuestion,
} from "../api/gemini-service";
import {
  askTutorInputSchema,
  translateInputSchema,
  batchTranslateQuizInputSchema,
  recordAttemptInputSchema,
  targetedPracticeInputSchema,
} from "../schemas/curriculum.schema";
import { sampleQuizQuestions } from "../utils/quiz-sampler";
import {
  checkAndConsumeAiCredit,
  getAiCreditBalance,
  sanitizeStudentInput,
  validateEducationalQuery,
} from "../utils/ai-credits";
import {
  canAccessSubject,
  canAccessLesson,
  getTrialStatus,
  FREE_TIER_MAX_TRIAL_SUBJECTS,
} from "../utils/tier-guardrails";
import type {
  Lesson,
  QuizQuestion,
  LessonProgressStatus,
} from "../types/curriculum.types";

export async function getLessonsAction(subjectSlug: string): Promise<{
  success: boolean;
  lessons: Lesson[];
  error?: string;
}> {
  try {
    const subject = SUBJECT_BY_SLUG.get(subjectSlug);
    if (!subject) {
      return { success: false, lessons: [], error: `Subject not found for slug: ${subjectSlug}` };
    }

    // 1. Check PostgreSQL cache
    const cached = await prisma.cachedLesson.findUnique({
      where: { subjectSlug },
    });

    if (cached && Array.isArray(cached.lessons) && cached.lessons.length > 0) {
      return { success: true, lessons: cached.lessons as unknown as Lesson[] };
    }

    // 2. Generate via Gemini AI
    const generated = await generateLessonsForSubject(subject);

    // 3. Store in PostgreSQL cache
    await prisma.cachedLesson.upsert({
      where: { subjectSlug },
      update: {
        subjectLabel: subject.name,
        lessons: generated as unknown as object,
      },
      create: {
        subjectSlug,
        subjectLabel: subject.name,
        lessons: generated as unknown as object,
      },
    });

    return { success: true, lessons: generated };
  } catch (error) {
    console.error("getLessonsAction error:", error);
    return {
      success: false,
      lessons: [],
      error: error instanceof Error ? error.message : "Failed to load lessons",
    };
  }
}

export async function ensureSubjectEnrolledAction(subjectSlug: string): Promise<{
  success: boolean;
  enrolled: boolean;
  error?: string;
}> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { success: true, enrolled: false };
    }

    const existing = await prisma.trialSubject.findUnique({
      where: {
        userId_subjectSlug: {
          userId: sessionUser.id,
          subjectSlug,
        },
      },
    });

    if (existing) {
      return { success: true, enrolled: true };
    }

    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId: sessionUser.id,
        status: "ACTIVE",
      },
    });
    const isSubscribed = !!activeSub;

    const enrolled = await prisma.trialSubject.findMany({
      where: { userId: sessionUser.id },
      select: { subjectSlug: true },
    });
    const enrolledSlugs = enrolled.map((e) => e.subjectSlug);

    const user = prisma.user
      ? await prisma.user.findUnique({
          where: { id: sessionUser.id },
          select: { createdAt: true },
        })
      : null;

    const adminConfig = await prisma.adminConfig.findFirst();
    const maxTrialSubjects = adminConfig?.maxTrialSubjects ?? FREE_TIER_MAX_TRIAL_SUBJECTS;
    const trialStatus = getTrialStatus(user?.createdAt, adminConfig?.trialDurationDays ?? 30);

    if (!canAccessSubject(enrolledSlugs, subjectSlug, isSubscribed, maxTrialSubjects, trialStatus.isTrialActive)) {
      return {
        success: false,
        enrolled: false,
        error: `Free tier limit reached: Your 30-day free trial has ended or you have reached the maximum allowed trial subjects (${maxTrialSubjects}). Upgrade to HighSchool Tutor Pass to unlock all subjects.`,
      };
    }

    const subject = SUBJECT_BY_SLUG.get(subjectSlug);
    await prisma.trialSubject.create({
      data: {
        userId: sessionUser.id,
        subjectSlug,
        subjectLabel: subject?.name || subjectSlug,
      },
    });

    return { success: true, enrolled: true };
  } catch (error) {
    console.error("ensureSubjectEnrolledAction error:", error);
    return {
      success: false,
      enrolled: false,
      error: error instanceof Error ? error.message : "Failed to enroll subject",
    };
  }
}

export async function getQuizAction(
  subjectSlug: string,
  lessonNumber: number,
  refresh: boolean = false
): Promise<{
  success: boolean;
  questions: QuizQuestion[];
  lessonTitle: string;
  error?: string;
}> {
  try {
    const subject = SUBJECT_BY_SLUG.get(subjectSlug);
    if (!subject) {
      return { success: false, questions: [], lessonTitle: "", error: "Subject not found" };
    }

    // 0. Auto-enroll student or verify trial subject access limit
    const sessionUser = await getCurrentUser();
    if (sessionUser?.id) {
      const enrollCheck = await ensureSubjectEnrolledAction(subjectSlug);
      if (!enrollCheck.success) {
        return {
          success: false,
          questions: [],
          lessonTitle: "",
          error: enrollCheck.error || "Trial subject limit reached",
        };
      }
    }

    // 1. Check cached lesson title
    const lessonsResult = await getLessonsAction(subjectSlug);
    const matchedLesson = lessonsResult.lessons.find((l) => l.number === lessonNumber);
    const lessonTitle = matchedLesson?.title || `Lesson ${lessonNumber}`;

    // 2. Check cached quiz in DB if not refreshing
    if (!refresh) {
      const cached = await prisma.cachedQuiz.findUnique({
        where: {
          subjectSlug_lessonNumber: {
            subjectSlug,
            lessonNumber,
          },
        },
      });

      if (cached && Array.isArray(cached.questions) && cached.questions.length > 0) {
        return {
          success: true,
          questions: cached.questions as unknown as QuizQuestion[],
          lessonTitle: cached.lessonTitle,
        };
      }
    }

    // 3. Generate via Gemini AI
    const questions = await generateQuizForLesson(subject, lessonNumber, lessonTitle);

    // 4. Save to PostgreSQL cache
    await prisma.cachedQuiz.upsert({
      where: {
        subjectSlug_lessonNumber: {
          subjectSlug,
          lessonNumber,
        },
      },
      update: {
        lessonTitle,
        questions: questions as unknown as object,
      },
      create: {
        subjectSlug,
        lessonNumber,
        lessonTitle,
        questions: questions as unknown as object,
      },
    });

    return { success: true, questions, lessonTitle };
  } catch (error) {
    console.error("getQuizAction error:", error);
    return {
      success: false,
      questions: [],
      lessonTitle: "",
      error: error instanceof Error ? error.message : "Failed to load quiz",
    };
  }
}

export async function askTutorAction(rawInput: unknown): Promise<{
  success: boolean;
  reply?: string;
  error?: string;
  creditsRemaining?: number;
  isUnlimited?: boolean;
}> {
  try {
    const input = askTutorInputSchema.parse(rawInput);
    const sessionUser = await getCurrentUser();

    // Enforce 30-Day Trial Hard Gate for AI Tutoring
    if (sessionUser?.id && sessionUser.role !== "ADMIN") {
      const activeSub = await prisma.subscription.findFirst({
        where: {
          userId: sessionUser.id,
          status: "ACTIVE",
          expiresAt: { gte: new Date() },
        },
      });
      const trialStatus = getTrialStatus(sessionUser.createdAt);
      if (!activeSub && trialStatus.isExpired) {
        return {
          success: false,
          error: "TRIAL_EXPIRED",
        };
      }
    }
    

    // Educational content and jailbreak moderation check
    const validation = validateEducationalQuery(input.message);
    if (!validation.allowed) {
      return {
        success: false,
        error: validation.reason || "Please keep your questions focused on academic subjects and DepEd K-12 lessons.",
      };
    }

    // Check daily AI credits
    const creditCheck = await checkAndConsumeAiCredit(sessionUser?.id, "ai_tutor");
    if (!creditCheck.allowed) {
      return {
        success: false,
        error: creditCheck.error,
        creditsRemaining: 0,
        isUnlimited: false,
      };
    }

    const subject = SUBJECT_BY_SLUG.get(input.subjectSlug);
    const subjectName = subject?.name || input.subjectSlug;
    const sanitizedMessage = sanitizeStudentInput(input.message, 500);

    const reply = await generateTutorReply({
      subjectName,
      lessonTitle: input.lessonTitle,
      question: input.question,
      options: input.options,
      answer: input.answer,
      explanation: input.explanation,
      language: input.language,
      history: input.history,
      message: sanitizedMessage,
      persona: input.persona,
      questionIndex: input.questionIndex,
      totalQuestions: input.totalQuestions,
      userSelectedAnswer: input.userSelectedAnswer,
    });

    return {
      success: true,
      reply,
      creditsRemaining: creditCheck.remaining,
      isUnlimited: creditCheck.isUnlimited,
    };
  } catch (error) {
    console.error("askTutorAction error:", error);
    let errorMessage = "Tutor reply failed";
    if (error instanceof Error) {
      errorMessage = error.name === "ZodError" ? "Invalid input: Please check your message and try again." : error.message;
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getAiCreditsStatusAction(): Promise<{
  success: boolean;
  remaining: number;
  totalMax: number;
  isUnlimited: boolean;
}> {
  try {
    const sessionUser = await getCurrentUser();
    const balance = await getAiCreditBalance(sessionUser?.id);
    return { success: true, ...balance };
  } catch {
    return { success: false, remaining: 20, totalMax: 20, isUnlimited: false };
  }
}

export async function batchTranslateAction(rawInput: unknown): Promise<{
  success: boolean;
  data?: {
    question: string;
    options: { A: string; B: string; C: string; D: string };
    explanation: string;
  };
  error?: string;
}> {
  try {
    const input = batchTranslateQuizInputSchema.parse(rawInput);
    if (!input.language || input.language.toLowerCase() === "english") {
      return {
        success: true,
        data: {
          question: input.question,
          options: input.options,
          explanation: input.explanation,
        },
      };
    }

    const sessionUser = await getCurrentUser();
    const isFreeDialect =
      input.language.toLowerCase() === "english" ||
      input.language.toLowerCase() === "taglish";

    if (!isFreeDialect) {
      const activeSub = sessionUser?.id
        ? await prisma.subscription.findFirst({
            where: {
              userId: sessionUser.id,
              status: "ACTIVE",
              expiresAt: { gte: new Date() },
            },
          })
        : null;

      if (!activeSub) {
        return {
          success: false,
          error:
            "DIALECT_PREMIUM_REQUIRED: Regional mother-tongue dialects (Cebuano, Ilocano, Hiligaynon, etc.) require an active HighSchool Tutor pass. Free tier includes English and Taglish.",
        };
      }
    }

    const creditCheck = await checkAndConsumeAiCredit(sessionUser?.id, "translation");
    if (!creditCheck.allowed) {
      return { success: false, error: creditCheck.error };
    }

    const translated = await batchTranslateQuizQuestion(
      {
        question: input.question,
        options: input.options,
        explanation: input.explanation,
      },
      input.language
    );

    return { success: true, data: translated };
  } catch (error) {
    console.error("batchTranslateAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Translation failed",
    };
  }
}

export async function translateAction(rawInput: unknown): Promise<{
  success: boolean;
  text?: string;
  error?: string;
}> {
  try {
    const input = translateInputSchema.parse(rawInput);
    const translated = await translateText(input.text, input.language);
    return { success: true, text: translated };
  } catch (error) {
    console.error("translateAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Translation failed",
    };
  }
}

export async function recordQuizAttemptAction(rawInput: unknown): Promise<{
  success: boolean;
  attemptId?: string;
  error?: string;
}> {
  try {
    const input = recordAttemptInputSchema.parse(rawInput);
    const sessionUser = await getCurrentUser();

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: sessionUser?.id ?? null,
        subjectSlug: input.subjectSlug,
        subjectCode: input.subjectCode,
        lessonNumber: input.lessonNumber,
        lessonTitle: input.lessonTitle,
        score: input.score,
        total: input.total,
        mode: input.mode,
      },
    });

    // Auto-enroll trial subject on completed attempt if authenticated
    if (sessionUser?.id) {
      await ensureSubjectEnrolledAction(input.subjectSlug);
    }

    return { success: true, attemptId: attempt.id };
  } catch (error) {
    console.error("recordQuizAttemptAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record attempt",
    };
  }
}

export interface LessonProgressScore {
  bestScore: number;
  rawScore: number;
  totalQuestions: number;
  transmutedGrade: number;
  status: LessonProgressStatus;
  attemptsCount: number;
}

export async function getSubjectProgressAction(subjectSlug: string): Promise<{
  lessonScores: Record<number, LessonProgressScore>;
  totalAttempted: number;
  totalMastered: number;
  totalLessons: number;
}> {
  try {
    const sessionUser = await getCurrentUser();
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        subjectSlug,
        ...(sessionUser?.id ? { userId: sessionUser.id } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const lessonScores: Record<number, LessonProgressScore> = {};

    for (const a of attempts) {
      const percentage = a.total > 0 ? (a.score / a.total) * 100 : 0;
      // DepEd DO 015 s. 2026 Transmutation:
      let transmuted = 60;
      if (percentage >= 100) {
        transmuted = 100;
      } else if (percentage >= 60) {
        transmuted = Math.round(75 + ((percentage - 60) * 25) / 40);
      } else {
        transmuted = Math.round(60 + (percentage / 60) * 14);
      }

      // In DepEd DO 015, passing grade is >= 75% transmuted.
      // Full Competency Mastery requires at least 10 questions.
      const isPassing = transmuted >= 75;
      const isMastered = isPassing && a.total >= 10;
      const status: LessonProgressStatus = isMastered
        ? "Mastered"
        : isPassing
        ? "Practice Passed"
        : "Needs Review";

      if (!lessonScores[a.lessonNumber]) {
        lessonScores[a.lessonNumber] = {
          bestScore: percentage,
          rawScore: a.score,
          totalQuestions: a.total,
          transmutedGrade: transmuted,
          status,
          attemptsCount: 1,
        };
      } else {
        lessonScores[a.lessonNumber].attemptsCount += 1;
        if (percentage > lessonScores[a.lessonNumber].bestScore) {
          lessonScores[a.lessonNumber].bestScore = percentage;
          lessonScores[a.lessonNumber].rawScore = a.score;
          lessonScores[a.lessonNumber].totalQuestions = a.total;
          lessonScores[a.lessonNumber].transmutedGrade = transmuted;
          lessonScores[a.lessonNumber].status = status;
        }
      }
    }

    const totalAttempted = Object.keys(lessonScores).length;
    const totalMastered = Object.values(lessonScores).filter(
      (l) => l.status === "Mastered"
    ).length;

    return {
      lessonScores,
      totalAttempted,
      totalMastered,
      totalLessons: Object.keys(lessonScores).length,
    };
  } catch (error) {
    console.error("getSubjectProgressAction error:", error);
    return {
      lessonScores: {},
      totalAttempted: 0,
      totalMastered: 0,
      totalLessons: 0,
    };
  }
}

export interface UserQuizAttemptItem {
  id: string;
  lessonNumber: number;
  title: string;
  subject: string;
  subjectSlug: string;
  rawScore: string;
  score: number;
  total: number;
  transmutedGrade: number;
  status: string;
  date: string;
  mode: string;
}

export async function getUserQuizAttemptsAction(limit = 10): Promise<{
  success: boolean;
  attempts: UserQuizAttemptItem[];
}> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser?.id) {
      return { success: true, attempts: [] };
    }

    const records = await prisma.quizAttempt.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const attempts: UserQuizAttemptItem[] = records.map((rec) => {
      const percent = rec.total > 0 ? (rec.score / rec.total) * 100 : 0;
      // DepEd DO 015 s. 2026 transmutation formula:
      // 60% raw score transmutes to 75 (passing).
      let transmuted = 60;
      if (percent >= 100) {
        transmuted = 100;
      } else if (percent >= 60) {
        transmuted = Math.round(75 + ((percent - 60) * 25) / 40);
      } else {
        transmuted = Math.round(60 + (percent / 60) * 14);
      }

      let descriptor = "Did Not Meet Expectations (<75%)";
      if (transmuted >= 90) descriptor = "PASSED (Outstanding)";
      else if (transmuted >= 85) descriptor = "PASSED (Very Satisfactory)";
      else if (transmuted >= 80) descriptor = "PASSED (Satisfactory)";
      else if (transmuted >= 75) descriptor = "PASSED (Fairly Satisfactory)";

      const dateFormatted = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(rec.createdAt));

      return {
        id: rec.id,
        lessonNumber: rec.lessonNumber,
        title: `Lesson ${rec.lessonNumber}: ${rec.lessonTitle}`,
        subject: rec.subjectCode || rec.subjectSlug,
        subjectSlug: rec.subjectSlug,
        rawScore: `${rec.score} / ${rec.total}`,
        score: rec.score,
        total: rec.total,
        transmutedGrade: transmuted,
        status: descriptor,
        date: dateFormatted,
        mode: rec.mode,
      };
    });

    return { success: true, attempts };
  } catch (err) {
    console.error("getUserQuizAttemptsAction error:", err);
    return { success: false, attempts: [] };
  }
}


/**
 * Diagnostic Weak Points: Identifies topics within a subject where the student's
 * most recent quiz attempt falls below the DepEd DO 015 s. 2026 passing threshold (< 75%).
 * Implements the Latest Attempt Rule.
 */
export async function getSubjectWeakPointsAction(subjectSlug: string): Promise<{
  success: boolean;
  subjectSlug: string;
  weakPoints: Array<{
    lessonNumber: number;
    lessonTitle: string;
    rawScore: number;
    total: number;
    transmutedScore: number;
    status: "Needs Review";
    keyConcepts: string[];
    lastAttemptDate: Date;
  }>;
  totalWeakPoints: number;
  passingThreshold: number;
  error?: string;
}> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser?.id) {
      return {
        success: true,
        subjectSlug,
        weakPoints: [],
        totalWeakPoints: 0,
        passingThreshold: 75,
      };
    }

    // Query attempts in reverse chronological order
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        subjectSlug,
        userId: sessionUser.id,
      },
      orderBy: { createdAt: "desc" },
    });

    // Latest Attempt Rule: First attempt seen per lessonNumber is the most recent
    const latestAttemptByLesson = new Map<number, typeof attempts[0]>();
    for (const att of attempts) {
      if (!latestAttemptByLesson.has(att.lessonNumber)) {
        latestAttemptByLesson.set(att.lessonNumber, att);
      }
    }

    // Fetch curriculum lessons to resolve keyConcepts
    const lessonsResult = await getLessonsAction(subjectSlug);
    const lessonMap = new Map((lessonsResult.lessons || []).map((l) => [l.number, l]));

    const weakPoints: Array<{
      lessonNumber: number;
      lessonTitle: string;
      rawScore: number;
      total: number;
      transmutedScore: number;
      status: "Needs Review";
      keyConcepts: string[];
      lastAttemptDate: Date;
    }> = [];

    for (const [lessonNum, att] of latestAttemptByLesson.entries()) {
      const percentage = att.total > 0 ? (att.score / att.total) * 100 : 0;
      let transmuted = 60;
      if (percentage >= 100) {
        transmuted = 100;
      } else if (percentage >= 60) {
        transmuted = Math.round(75 + ((percentage - 60) * 25) / 40);
      } else {
        transmuted = Math.round(60 + (percentage / 60) * 14);
      }

      // DepEd DO 015 Passing Threshold: Transmuted score < 75 is a weak point
      if (transmuted < 75) {
        const lesson = lessonMap.get(lessonNum);
        weakPoints.push({
          lessonNumber: lessonNum,
          lessonTitle: att.lessonTitle || lesson?.title || `Lesson ${lessonNum}`,
          rawScore: att.score,
          total: att.total,
          transmutedScore: transmuted,
          status: "Needs Review",
          keyConcepts: lesson?.keyConcepts || [],
          lastAttemptDate: att.createdAt,
        });
      }
    }

    // Sort ascending by lesson number
    weakPoints.sort((a, b) => a.lessonNumber - b.lessonNumber);

    return {
      success: true,
      subjectSlug,
      weakPoints,
      totalWeakPoints: weakPoints.length,
      passingThreshold: 75,
    };
  } catch (err) {
    console.error("getSubjectWeakPointsAction error:", err);
    return {
      success: false,
      subjectSlug,
      weakPoints: [],
      totalWeakPoints: 0,
      passingThreshold: 75,
      error: err instanceof Error ? err.message : "Failed to load weak points",
    };
  }
}

/**
 * Creates a targeted practice quiz session for a diagnosed weak point topic.
 */
export async function createTargetedPracticeAction(rawInput: unknown): Promise<{
  success: boolean;
  sessionId?: string;
  redirectUrl?: string;
  error?: string;
}> {
  try {
    const input = targetedPracticeInputSchema.parse(rawInput);
    const sessionUser = await getCurrentUser();

    // Check tier / trial access
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
    const trialStatus = getTrialStatus(sessionUser?.createdAt);
    if (!canAccessLesson(input.lessonNumber, isSubscribed, 3, trialStatus.isTrialActive, trialStatus.isExpired)) {
      return {
        success: false,
        error: trialStatus.isExpired ? "TRIAL_EXPIRED" : "Lesson locked. Upgrade to unlock all lessons.",
      };
    }

    const quizResult = await getQuizAction(input.subjectSlug, input.lessonNumber);
    if (!quizResult.success || !quizResult.questions || quizResult.questions.length === 0) {
      return { success: false, error: "Failed to load questions for targeted practice" };
    }

    const sampled = sampleQuizQuestions(quizResult.questions, input.questionCount || 10);
    const session = await prisma.quizSession.create({
      data: {
        userId: sessionUser?.id ?? null,
        subjectSlug: input.subjectSlug,
        lessonNumber: input.lessonNumber,
        lessonTitle: quizResult.lessonTitle || input.lessonTitle || `Lesson ${input.lessonNumber}`,
        mode: "study",
        questionCount: sampled.length,
        questions: sampled as unknown as object,
      },
    });

    return {
      success: true,
      sessionId: session.id,
      redirectUrl: `/curriculum/${input.subjectSlug}/quiz/${input.lessonNumber}?sessionId=${session.id}&mode=study`,
    };
  } catch (err) {
    console.error("createTargetedPracticeAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create targeted practice session",
    };
  }
}
