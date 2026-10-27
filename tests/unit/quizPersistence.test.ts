import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import {
  saveQuizProgressAction,
  getActiveQuizSessionAction,
  discardQuizSessionAction,
  getQuizSessionAction,
} from "@/features/curriculum/actions/quiz-session.actions";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    quizSession: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("@/features/auth/lib/session", () => ({
  getCurrentUser: jest.fn(),
}));

describe("Quiz State Auto-Persistence & Resumption (User Story 4)", () => {
  const mockUser = {
    id: "student_uuid_123",
    email: "student@deped.gov.ph",
    role: "STUDENT",
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
  });

  describe("saveQuizProgressAction", () => {
    it("should successfully save active question index and user answers", async () => {
      (prisma.quizSession.findUnique as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: mockUser.id,
        completedAt: null,
      });
      (prisma.quizSession.update as jest.Mock).mockResolvedValue({
        id: "session_abc",
        activeQuestionIndex: 3,
        userAnswers: { "0": "A", "1": "B", "2": "C" },
      });

      const res = await saveQuizProgressAction({
        sessionId: "session_abc",
        activeQuestionIndex: 3,
        userAnswers: { "0": "A", "1": "B", "2": "C" },
      });

      expect(res.success).toBe(true);
      expect(prisma.quizSession.update).toHaveBeenCalledWith({
        where: { id: "session_abc" },
        data: {
          activeQuestionIndex: 3,
          userAnswers: { "0": "A", "1": "B", "2": "C" },
        },
      });
    });

    it("should reject save if session belongs to a different authenticated user", async () => {
      (prisma.quizSession.findUnique as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: "different_student_999",
        completedAt: null,
      });

      const res = await saveQuizProgressAction({
        sessionId: "session_abc",
        activeQuestionIndex: 1,
        userAnswers: { "0": "A" },
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/unauthorized/i);
      expect(prisma.quizSession.update).not.toHaveBeenCalled();
    });

    it("should reject save if session has already been completed/submitted", async () => {
      (prisma.quizSession.findUnique as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: mockUser.id,
        completedAt: new Date(),
      });

      const res = await saveQuizProgressAction({
        sessionId: "session_abc",
        activeQuestionIndex: 5,
        userAnswers: { "0": "A" },
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/already completed/i);
      expect(prisma.quizSession.update).not.toHaveBeenCalled();
    });

    it("should fail validation if activeQuestionIndex is negative or invalid", async () => {
      const res = await saveQuizProgressAction({
        sessionId: "session_abc",
        activeQuestionIndex: -1,
        userAnswers: {},
      });

      expect(res.success).toBe(false);
      expect(prisma.quizSession.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("getActiveQuizSessionAction", () => {
    it("should return the latest active uncompleted session with answered count", async () => {
      (prisma.quizSession.findFirst as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: mockUser.id,
        subjectSlug: "general-mathematics",
        lessonNumber: 3,
        lessonTitle: "Rational Equations",
        mode: "study",
        questionCount: 10,
        activeQuestionIndex: 2,
        userAnswers: { "0": "A", "1": "C" },
        completedAt: null,
        createdAt: new Date("2026-10-26T10:00:00Z"),
      });

      const res = await getActiveQuizSessionAction();

      expect(res.success).toBe(true);
      expect(res.activeSession).toBeDefined();
      expect(res.activeSession?.id).toBe("session_abc");
      expect(res.activeSession?.answeredCount).toBe(2);
      expect(res.activeSession?.activeQuestionIndex).toBe(2);
    });

    it("should filter by subjectSlug when provided", async () => {
      (prisma.quizSession.findFirst as jest.Mock).mockResolvedValue(null);

      const res = await getActiveQuizSessionAction("earth-and-life-science");

      expect(res.success).toBe(true);
      expect(res.activeSession).toBeNull();
      expect(prisma.quizSession.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: mockUser.id,
            subjectSlug: "earth-and-life-science",
            completedAt: null,
          }),
        })
      );
    });

    it("should return null if user is not authenticated", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue(null);

      const res = await getActiveQuizSessionAction();

      expect(res.success).toBe(true);
      expect(res.activeSession).toBeNull();
      expect(prisma.quizSession.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("discardQuizSessionAction", () => {
    it("should delete session when user is authorized", async () => {
      (prisma.quizSession.findUnique as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: mockUser.id,
        completedAt: null,
      });
      (prisma.quizSession.delete as jest.Mock).mockResolvedValue({
        id: "session_abc",
      });

      const res = await discardQuizSessionAction("session_abc");

      expect(res.success).toBe(true);
      expect(prisma.quizSession.delete).toHaveBeenCalledWith({
        where: { id: "session_abc" },
      });
    });

    it("should reject discard if session belongs to another user", async () => {
      (prisma.quizSession.findUnique as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: "other_user",
        completedAt: null,
      });

      const res = await discardQuizSessionAction("session_abc");

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/unauthorized/i);
      expect(prisma.quizSession.delete).not.toHaveBeenCalled();
    });
  });

  describe("getQuizSessionAction restoration", () => {
    it("should return activeQuestionIndex and userAnswers in the session payload", async () => {
      (prisma.quizSession.findUnique as jest.Mock).mockResolvedValue({
        id: "session_abc",
        userId: mockUser.id,
        subjectSlug: "general-mathematics",
        lessonNumber: 2,
        lessonTitle: "Rational Functions",
        mode: "study",
        questionCount: 10,
        questions: [{ question: "Q1", options: { A: "1", B: "2", C: "3", D: "4" }, answer: "A", explanation: "Exp" }],
        activeQuestionIndex: 2,
        userAnswers: { "0": "A", "1": "D" },
        completedAt: null,
        score: null,
        total: null,
      });

      const res = await getQuizSessionAction("session_abc");

      expect(res.success).toBe(true);
      expect(res.session?.activeQuestionIndex).toBe(2);
      expect(res.session?.userAnswers).toEqual({ "0": "A", "1": "D" });
    });
  });
});
