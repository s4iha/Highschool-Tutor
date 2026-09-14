import {
  completeTourAction,
  getDashboardDataAction,
} from "@/features/dashboard/actions/dashboard.actions";
import { prisma, runWithUser } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    profile: {
      update: jest.fn(),
    },
    trialSubject: {
      findMany: jest.fn(),
    },
    quizAttempt: {
      findMany: jest.fn(),
    },
    aiCreditUsage: {
      aggregate: jest.fn(),
    },
  },
  runWithUser: jest.fn(),
}));

jest.mock("@/features/auth/lib/session", () => ({
  getCurrentUser: jest.fn(),
}));

describe("Dashboard Server Actions & Real-Time Aggregations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("completeTourAction", () => {
    it("should return unauthorized if user is not logged in", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue(null);

      const res = await completeTourAction();
      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("should update profile hasCompletedTour to true for authenticated user", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({ id: "user-123" });
      const mockUpdate = jest.fn().mockResolvedValue({ id: "user-123", hasCompletedTour: true });

      (runWithUser as jest.Mock).mockImplementation(async (_userId, callback) => {
        return callback({
          profile: { update: mockUpdate },
        });
      });

      const res = await completeTourAction();
      expect(res.success).toBe(true);
      expect(runWithUser).toHaveBeenCalledWith("user-123", expect.any(Function));
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { hasCompletedTour: true },
      });
    });
  });

  describe("getDashboardDataAction", () => {
    it("should return unauthorized if user is not logged in", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue(null);

      const res = await getDashboardDataAction();
      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized");
    });

    it("should return empty metrics and null activeLearning for brand new user with no attempts or enrollments", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({ id: "new-student-1" });
      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.aiCreditUsage.aggregate as jest.Mock).mockResolvedValue({
        _sum: { credits: 0 },
      });

      const res = await getDashboardDataAction();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();

      const { metrics, activeLearning, enrolledSubjects } = res.data!;
      expect(metrics.enrolledCount).toBe(0);
      expect(metrics.completedQuizzesCount).toBe(0);
      expect(metrics.transmutedAverage).toBeNull();
      expect(metrics.transmutedRemarks).toBe("No evaluations yet");
      expect(metrics.totalAiCreditsRemaining).toBe(20);
      expect(activeLearning).toBeNull();
      expect(enrolledSubjects).toEqual([]);
    });

    it("should compute real-time metrics, transmutation average, and next active learning target", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({ id: "active-student-1" });
      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([
        { id: "ts-1", subjectSlug: "genmath", createdAt: new Date() },
      ]);
      (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue([
        {
          id: "att-1",
          subjectSlug: "genmath",
          lessonNumber: 1,
          lessonTitle: "Functions and Graphs",
          score: 10,
          total: 10, // 100% raw -> 100 transmuted
          mode: "exam",
          createdAt: new Date(),
        },
        {
          id: "att-2",
          subjectSlug: "genmath",
          lessonNumber: 2,
          lessonTitle: "Rational Functions",
          score: 6,
          total: 10, // 60% raw -> 60 + 24 = 84 transmuted
          mode: "exam",
          createdAt: new Date(Date.now() - 10000),
        },
      ]);
      (prisma.aiCreditUsage.aggregate as jest.Mock).mockResolvedValue({
        _sum: { credits: 3 },
      });

      const res = await getDashboardDataAction();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();

      const { metrics, activeLearning, enrolledSubjects } = res.data!;
      expect(metrics.enrolledCount).toBe(1);
      expect(metrics.completedQuizzesCount).toBe(2);
      expect(metrics.transmutedAverage).toBe(92); // (100 + 84) / 2 = 92
      expect(metrics.transmutedRemarks).toBe("Outstanding (DepEd)");
      expect(metrics.totalAiCreditsRemaining).toBe(17); // 20 - 3

      // Active learning points to next lesson after latest attempt (lesson 1 + 1 = 2)
      expect(activeLearning).toBeDefined();
      expect(activeLearning?.subjectSlug).toBe("genmath");
      expect(activeLearning?.lessonNumber).toBe(2);
      expect(activeLearning?.hasAttempts).toBe(true);

      // Enrolled subjects progress
      expect(enrolledSubjects).toHaveLength(1);
      expect(enrolledSubjects[0].slug).toBe("genmath");
      expect(enrolledSubjects[0].completedLessons).toBe(2);
    });
  });
});
