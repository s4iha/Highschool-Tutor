import {
  getLessonsAction,
  ensureSubjectEnrolledAction,
} from "@/features/curriculum/actions/curriculum.actions";
import { createQuizSessionAction } from "@/features/curriculum/actions/quiz-session.actions";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import * as geminiService from "@/features/curriculum/api/gemini-service";

jest.mock("@/lib/prisma", () => {
  const p = {
    user: { findUnique: jest.fn() },
    cachedLesson: { findUnique: jest.fn(), upsert: jest.fn() },
    cachedQuiz: { findUnique: jest.fn(), upsert: jest.fn() },
    trialSubject: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
    subscription: { findFirst: jest.fn() },
    adminConfig: { findFirst: jest.fn() },
    quizSession: { create: jest.fn(), findUnique: jest.fn() },
  };
  return {
    prisma: p,
    default: p,
    runWithUser: jest.fn((userId, fn) => fn(p)),
    __esModule: true,
  };
});

jest.mock("@/features/auth/lib/session", () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock("@/features/curriculum/api/gemini-service", () => ({
  generateLessonsForSubject: jest.fn(),
  generateQuizForLesson: jest.fn(),
}));

describe("User Story 1: Reliable Quiz Question Generation & Session Persistence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLessonsAction MATATAG Syllabus Fallback", () => {
    it("falls back to curated MATATAG syllabus lessons when Gemini AI throws an error", async () => {
      // No cached lesson
      (prisma.cachedLesson.findUnique as jest.Mock).mockResolvedValue(null);
      // Gemini throws error (e.g. rate limit or API error)
      (geminiService.generateLessonsForSubject as jest.Mock).mockRejectedValue(
        new Error("Gemini quota exceeded or network failure")
      );

      const result = await getLessonsAction("g7-q1-math");
      expect(result.success).toBe(true);
      expect(result.lessons.length).toBeGreaterThan(0);
      expect(result.lessons[0]).toHaveProperty("title");
      expect(result.lessons[0]).toHaveProperty("keyConcepts");
    });
  });

  describe("ensureSubjectEnrolledAction Resilient AdminConfig Fallback", () => {
    it("safely falls back to default limits when prisma.adminConfig.findFirst throws P2022", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "student-1",
        role: "USER",
        createdAt: new Date().toISOString(),
      });
      (prisma.trialSubject.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.subscription.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        createdAt: new Date().toISOString(),
      });

      // Simulate P2022 ColumnNotFound error
      (prisma.adminConfig.findFirst as jest.Mock).mockRejectedValue(
        new Error("The column admin_config.availableQuestionCounts does not exist")
      );

      (prisma.trialSubject.create as jest.Mock).mockResolvedValue({
        id: "ts-1",
        userId: "student-1",
        subjectSlug: "g7-q1-math",
      });

      const result = await ensureSubjectEnrolledAction("g7-q1-math");
      expect(result.success).toBe(true);
      expect(result.enrolled).toBe(true);
      expect(prisma.trialSubject.create).toHaveBeenCalled();
    });
  });

  describe("createQuizSessionAction Dynamic Question Counts", () => {
    it("parses custom allowed question counts from AdminConfig and honors selected count", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "student-1",
        role: "USER",
        createdAt: new Date().toISOString(),
      });
      (prisma.subscription.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.trialSubject.findUnique as jest.Mock).mockResolvedValue({ id: "ts-1" });
      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.adminConfig.findFirst as jest.Mock).mockResolvedValue({
        availableQuestionCounts: "5, 10, 15, 20",
        maxFreeLessons: 3,
        trialDurationDays: 30,
      });

      // Mock cached quiz with 24 questions
      const mockQuestions = Array.from({ length: 24 }, (_, i) => ({
        question: `Question ${i + 1}`,
        options: { A: "1", B: "2", C: "3", D: "4" },
        answer: "A",
        explanation: "Test explanation",
      }));

      (prisma.cachedQuiz.findUnique as jest.Mock).mockResolvedValue({
        questions: mockQuestions,
        lessonTitle: "Lesson 1: Intro",
      });

      (prisma.quizSession.create as jest.Mock).mockImplementation(({ data }) => ({
        id: "session-123",
        ...data,
      }));

      const result = await createQuizSessionAction({
        subjectSlug: "g7-q1-math",
        lessonNumber: 1,
        mode: "study",
        count: 15,
      });

      expect(result.success).toBe(true);
      expect(result.sessionId).toBe("session-123");
      expect(prisma.quizSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            questionCount: 15,
          }),
        })
      );
    });
  });
});
