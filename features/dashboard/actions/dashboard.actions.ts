"use server";

import { prisma, runWithUser } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { SUBJECT_BY_SLUG } from "@/features/curriculum/utils/curriculum-data";

export interface DashboardMetrics {
  enrolledCount: number;
  completedQuizzesCount: number;
  totalQuizzesCount: number;
  transmutedAverage: number | null;
  transmutedRemarks: string;
  totalAiCreditsRemaining: number;
  totalAiCreditsMax: number;
}

export interface ActiveLearningResume {
  subjectSlug: string;
  subjectName: string;
  subjectGrade: string;
  subjectTerm: string;
  lessonNumber: number;
  lessonTitle: string;
  progressPercent: number;
  hasAttempts: boolean;
}

export interface EnrolledSubjectItem {
  id: string;
  code: string;
  slug: string;
  name: string;
  grade: string;
  term: string;
  level: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  lastScorePercent?: number;
}

export interface DashboardRealtimeData {
  metrics: DashboardMetrics;
  activeLearning: ActiveLearningResume | null;
  enrolledSubjects: EnrolledSubjectItem[];
}

export async function completeTourAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    await runWithUser(sessionUser.id, async (tx) => {
      await tx.profile.update({
        where: { id: sessionUser.id },
        data: { hasCompletedTour: true },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("completeTourAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update tour status",
    };
  }
}

/**
 * DepEd DO 015 s. 2026 MATATAG Transmutation Formula
 * Transmuted = 60 + (Raw% * 0.40) where Raw% >= 60% maps to >= 75%
 */
function calculateTransmutedGrade(score: number, total: number): number {
  if (total <= 0) return 0;
  const rawPercentage = (score / total) * 100;
  if (rawPercentage >= 100) return 100;
  if (rawPercentage <= 0) return 60;
  const transmuted = 60 + (rawPercentage * 40) / 100;
  return Math.min(100, Math.max(60, Math.round(transmuted * 10) / 10));
}

function getTransmutedRemarks(avg: number | null): string {
  if (avg === null) return "No evaluations yet";
  if (avg >= 90) return "Outstanding (DepEd)";
  if (avg >= 85) return "Very Satisfactory";
  if (avg >= 80) return "Satisfactory";
  if (avg >= 75) return "Fairly Satisfactory (Passed)";
  return "Did Not Meet Expectations";
}

export async function getDashboardDataAction(): Promise<{
  success: boolean;
  data?: DashboardRealtimeData;
  error?: string;
}> {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = sessionUser.id;

    // 1. Fetch Trial Subjects (enrolled subjects)
    const trialSubjects = await prisma.trialSubject.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch User's Quiz Attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // 3. Calculate Enrolled Subject Data & Progress
    const enrolledSubjects: EnrolledSubjectItem[] = trialSubjects.map((ts) => {
      const subject = SUBJECT_BY_SLUG.get(ts.subjectSlug);
      const subAttempts = attempts.filter((a) => a.subjectSlug === ts.subjectSlug);
      const completedLessons = new Set(subAttempts.map((a) => a.lessonNumber)).size;
      const totalLessons = 12; // DepEd curriculum standard
      const progressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

      const lastAttempt = subAttempts[0];
      const lastScorePercent =
        lastAttempt && lastAttempt.total > 0
          ? Math.round((lastAttempt.score / lastAttempt.total) * 100)
          : undefined;

      return {
        id: ts.id,
        code: subject?.code || ts.subjectSlug.toUpperCase(),
        slug: ts.subjectSlug,
        name: subject?.name || ts.subjectSlug,
        grade: subject?.grade || "High School",
        term: subject?.term || "Trimester 1",
        level: subject?.level || "Junior High School",
        completedLessons,
        totalLessons,
        progressPercent,
        lastScorePercent,
      };
    });

    // 4. Calculate Unique Completed Quizzes & Transmuted Average
    const uniqueLessonAttempts = new Set<string>();
    let totalTransmutedScore = 0;
    let countedAttempts = 0;

    for (const att of attempts) {
      uniqueLessonAttempts.add(`${att.subjectSlug}-${att.lessonNumber}`);
      if (att.total > 0) {
        totalTransmutedScore += calculateTransmutedGrade(att.score, att.total);
        countedAttempts += 1;
      }
    }

    const transmutedAverage =
      countedAttempts > 0 ? Math.round((totalTransmutedScore / countedAttempts) * 10) / 10 : null;

    // 5. Total available quizzes across enrolled subjects (or default 48 if at max 4 subjects, 12 per subject)
    const totalQuizzesCount = Math.max(trialSubjects.length * 12, 12);

    // 6. Calculate Remaining AI Credits for the Day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayUsage = await prisma.aiCreditUsage.aggregate({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
      _sum: {
        credits: true,
      },
    });

    const usedCredits = todayUsage._sum.credits || 0;
    const maxCredits = 20; // Free tier standard
    const remainingCredits = Math.max(0, maxCredits - usedCredits);

    const metrics: DashboardMetrics = {
      enrolledCount: trialSubjects.length,
      completedQuizzesCount: uniqueLessonAttempts.size,
      totalQuizzesCount,
      transmutedAverage,
      transmutedRemarks: getTransmutedRemarks(transmutedAverage),
      totalAiCreditsRemaining: remainingCredits,
      totalAiCreditsMax: maxCredits,
    };

    // 7. Calculate "Resume Active Learning" target
    let activeLearning: ActiveLearningResume | null = null;

    if (attempts.length > 0) {
      const latestAttempt = attempts[0];
      const subject = SUBJECT_BY_SLUG.get(latestAttempt.subjectSlug);
      const subAttempts = attempts.filter((a) => a.subjectSlug === latestAttempt.subjectSlug);
      const completedLessons = new Set(subAttempts.map((a) => a.lessonNumber)).size;
      const progressPercent = Math.min(100, Math.round((completedLessons / 12) * 100));

      activeLearning = {
        subjectSlug: latestAttempt.subjectSlug,
        subjectName: subject?.name || latestAttempt.subjectSlug,
        subjectGrade: subject?.grade || "Grade 11",
        subjectTerm: subject?.term || "Semester 1",
        lessonNumber: Math.min(12, latestAttempt.lessonNumber + 1),
        lessonTitle: latestAttempt.lessonTitle || `Lesson ${latestAttempt.lessonNumber}`,
        progressPercent,
        hasAttempts: true,
      };
    } else if (enrolledSubjects.length > 0) {
      const firstEnrolled = enrolledSubjects[0];
      const subject = SUBJECT_BY_SLUG.get(firstEnrolled.slug);
      activeLearning = {
        subjectSlug: firstEnrolled.slug,
        subjectName: firstEnrolled.name,
        subjectGrade: subject?.grade || firstEnrolled.grade,
        subjectTerm: subject?.term || firstEnrolled.term,
        lessonNumber: 1,
        lessonTitle: "Lesson 1: Introduction & Key Competencies",
        progressPercent: 0,
        hasAttempts: false,
      };
    }

    return {
      success: true,
      data: {
        metrics,
        activeLearning,
        enrolledSubjects,
      },
    };
  } catch (error) {
    console.error("getDashboardDataAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load dashboard data",
    };
  }
}
