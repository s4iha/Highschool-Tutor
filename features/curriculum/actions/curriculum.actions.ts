"use server";

import { prisma } from "@/lib/prisma";
import { SUBJECT_BY_SLUG } from "../utils/curriculum-data";
import {
  generateLessonsForSubject,
  generateQuizForLesson,
  generateTutorReply,
  translateText,
} from "../api/gemini-service";
import {
  askTutorInputSchema,
  translateInputSchema,
  recordAttemptInputSchema,
} from "../schemas/curriculum.schema";
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
}> {
  try {
    const input = askTutorInputSchema.parse(rawInput);
    const subject = SUBJECT_BY_SLUG.get(input.subjectSlug);
    const subjectName = subject?.name || input.subjectSlug;

    const reply = await generateTutorReply({
      subjectName,
      lessonTitle: input.lessonTitle,
      question: input.question,
      options: input.options,
      answer: input.answer,
      explanation: input.explanation,
      language: input.language,
      history: input.history,
      message: input.message,
    });

    return { success: true, reply };
  } catch (error) {
    console.error("askTutorAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Tutor reply failed",
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

    const attempt = await prisma.quizAttempt.create({
      data: {
        subjectSlug: input.subjectSlug,
        subjectCode: input.subjectCode,
        lessonNumber: input.lessonNumber,
        lessonTitle: input.lessonTitle,
        score: input.score,
        total: input.total,
        mode: input.mode,
      },
    });

    return { success: true, attemptId: attempt.id };
  } catch (error) {
    console.error("recordQuizAttemptAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to record attempt",
    };
  }
}

export async function getSubjectProgressAction(subjectSlug: string): Promise<{
  lessonScores: Record<number, { bestScore: number; status: LessonProgressStatus; attemptsCount: number }>;
  totalMastered: number;
  totalLessons: number;
}> {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { subjectSlug },
      orderBy: { createdAt: "desc" },
    });

    const lessonScores: Record<
      number,
      { bestScore: number; status: LessonProgressStatus; attemptsCount: number }
    > = {};

    for (const a of attempts) {
      const percentage = (a.score / a.total) * 100;
      if (!lessonScores[a.lessonNumber]) {
        lessonScores[a.lessonNumber] = {
          bestScore: percentage,
          status: percentage >= 75 ? "Mastered" : "Needs Review",
          attemptsCount: 1,
        };
      } else {
        lessonScores[a.lessonNumber].attemptsCount += 1;
        if (percentage > lessonScores[a.lessonNumber].bestScore) {
          lessonScores[a.lessonNumber].bestScore = percentage;
          lessonScores[a.lessonNumber].status = percentage >= 75 ? "Mastered" : "Needs Review";
        }
      }
    }

    const totalMastered = Object.values(lessonScores).filter(
      (l) => l.status === "Mastered"
    ).length;

    return {
      lessonScores,
      totalMastered,
      totalLessons: Object.keys(lessonScores).length,
    };
  } catch (error) {
    console.error("getSubjectProgressAction error:", error);
    return {
      lessonScores: {},
      totalMastered: 0,
      totalLessons: 0,
    };
  }
}
