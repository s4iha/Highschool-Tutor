import {
  calculateDepEdTransmutation,
  getDepEdTransmutationRemarks,
} from "@/features/curriculum/utils/transmutation";
import { getSubjectProgressAction } from "@/features/curriculum/actions/curriculum.actions";
import { getDashboardDataAction } from "@/features/dashboard/actions/dashboard.actions";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";

jest.mock("@/lib/prisma", () => {
  const p = {
    quizAttempt: { findMany: jest.fn() },
    trialSubject: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
    adminConfig: { findFirst: jest.fn() },
    aiCreditUsage: { aggregate: jest.fn() },
    cachedLesson: { findUnique: jest.fn(), upsert: jest.fn() },
    cachedQuiz: { findUnique: jest.fn(), upsert: jest.fn() },
    subscription: { findFirst: jest.fn() },
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

describe("DepEd DO 015 s. 2026 Grade Transmutation", () => {
  describe("calculateDepEdTransmutation", () => {
    it("returns 0 if total is 0 or negative", () => {
      expect(calculateDepEdTransmutation(0, 0)).toBe(0);
      expect(calculateDepEdTransmutation(5, -1)).toBe(0);
    });

    it("transmutes 0% raw score to 60 (minimum transmutation floor)", () => {
      expect(calculateDepEdTransmutation(0, 10)).toBe(60);
      expect(calculateDepEdTransmutation(-2, 10)).toBe(60);
    });

    it("transmutes 60% raw score to official passing mark of 75", () => {
      expect(calculateDepEdTransmutation(6, 10)).toBe(75);
      expect(calculateDepEdTransmutation(12, 20)).toBe(75);
      expect(calculateDepEdTransmutation(15, 25)).toBe(75);
    });

    it("transmutes 100% raw score to 100", () => {
      expect(calculateDepEdTransmutation(10, 10)).toBe(100);
      expect(calculateDepEdTransmutation(24, 24)).toBe(100);
      expect(calculateDepEdTransmutation(30, 24)).toBe(100);
    });

    it("correctly interpolates scores below 60% using the lower segment formula", () => {
      // 30% raw score: round(60 + (30/60) * 14) = round(60 + 7) = 67
      expect(calculateDepEdTransmutation(3, 10)).toBe(67);
      // 15% raw score: round(60 + (15/60) * 14) = round(60 + 3.5) = 64
      expect(calculateDepEdTransmutation(1.5, 10)).toBe(64);
    });

    it("correctly interpolates scores between 60% and 100% using the upper segment formula", () => {
      // 80% raw score: round(75 + ((80-60)*25)/40) = round(75 + 12.5) = 88
      expect(calculateDepEdTransmutation(8, 10)).toBe(88);
      // 90% raw score: round(75 + ((90-60)*25)/40) = round(75 + 18.75) = 94
      expect(calculateDepEdTransmutation(9, 10)).toBe(94);
    });
  });

  describe("getDepEdTransmutationRemarks", () => {
    it("handles null or undefined average", () => {
      expect(getDepEdTransmutationRemarks(null)).toBe("No evaluations yet");
    });

    it("returns 'Mastered (Outstanding)' for grades >= 90", () => {
      expect(getDepEdTransmutationRemarks(95)).toBe("Mastered (Outstanding)");
      expect(getDepEdTransmutationRemarks(90)).toBe("Mastered (Outstanding)");
    });

    it("returns 'Mastered (Very Satisfactory)' for grades 85-89", () => {
      expect(getDepEdTransmutationRemarks(88)).toBe("Mastered (Very Satisfactory)");
      expect(getDepEdTransmutationRemarks(85)).toBe("Mastered (Very Satisfactory)");
    });

    it("returns 'Proficient (Satisfactory)' for grades 80-84", () => {
      expect(getDepEdTransmutationRemarks(82)).toBe("Proficient (Satisfactory)");
      expect(getDepEdTransmutationRemarks(80)).toBe("Proficient (Satisfactory)");
    });

    it("returns 'Competency Met' for passing grades 75-79", () => {
      expect(getDepEdTransmutationRemarks(75)).toBe("Competency Met");
      expect(getDepEdTransmutationRemarks(78)).toBe("Competency Met");
    });

    it("returns 'Needs Review (<75%)' for failing grades < 75", () => {
      expect(getDepEdTransmutationRemarks(74)).toBe("Needs Review (<75%)");
      expect(getDepEdTransmutationRemarks(60)).toBe("Needs Review (<75%)");
    });
  });

  describe("User Story 4: Progress Guard and Unified Transmutation", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("returns empty progress immediately without DB query when unauthenticated", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue(null);

      const res = await getSubjectProgressAction("g7-q1-math");
      expect(res.totalAttempted).toBe(0);
      expect(res.totalMastered).toBe(0);
      expect(Object.keys(res.lessonScores).length).toBe(0);
      expect(prisma.quizAttempt.findMany).not.toHaveBeenCalled();
    });

    it("computes DepEd DO 015 transmuted average (60% raw -> 75 transmuted) in getDashboardDataAction", async () => {
      (getCurrentUser as jest.Mock).mockResolvedValue({
        id: "student-1",
        email: "test@student.ph",
      });

      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([
        { id: "ts-1", subjectSlug: "g7-q1-math" },
      ]);

      (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue([
        {
          id: "att-1",
          subjectSlug: "g7-q1-math",
          lessonNumber: 1,
          score: 6,
          total: 10,
          createdAt: new Date(),
        },
      ]);

      (prisma.adminConfig.findFirst as jest.Mock).mockResolvedValue({
        targetLessonsPerSubject: 8,
      });

      (prisma.aiCreditUsage.aggregate as jest.Mock).mockResolvedValue({
        _sum: { credits: 0 },
      });

      const res = await getDashboardDataAction();
      expect(res.success).toBe(true);
      expect(res.data?.metrics.transmutedAverage).toBe(75);
      expect(res.data?.metrics.transmutedRemarks).toBe("Competency Met");
    });
  });
});
