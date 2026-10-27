import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    quizAttempt: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    quizSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
    },
    lessonMaterial: {
      findUnique: jest.fn(),
    },
    cachedLesson: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    cachedQuiz: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    trialSubject: {
      findUnique: jest.fn().mockResolvedValue({ id: "ts_1" }),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/features/auth/lib/session", () => ({
  getCurrentUser: jest.fn(),
}));

import {
  getSubjectWeakPointsAction,
  createTargetedPracticeAction,
} from "@/features/curriculum/actions/curriculum.actions";

describe("Diagnostic 'Weak Points' by Topic (DepEd DO 015 s. 2026 Passing Threshold < 75%)", () => {
  const mockUser = {
    id: "student_weak_points_123",
    email: "student@deped.gov.ph",
    role: "STUDENT",
    createdAt: new Date(),
  };

  const testSubjectSlug = "g11-s1-genmath";

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (prisma.cachedLesson.findUnique as jest.Mock).mockResolvedValue({
      lessons: [
        { number: 1, title: "Functions and Relations", summary: "Basics of functions", keyConcepts: ["Domain", "Range"] },
        { number: 2, title: "Rational Functions", summary: "Rational functions", keyConcepts: ["Asymptotes", "Intercepts"] },
      ],
    });
    (prisma.cachedQuiz.findUnique as jest.Mock).mockResolvedValue({
      questions: [
        { question: "Q1", options: { A: "1", B: "2", C: "3", D: "4" }, answer: "A", explanation: "Exp" },
      ],
      lessonTitle: "Functions and Relations",
    });
  });

  describe("getSubjectWeakPointsAction", () => {
    it("should return weak points when latest attempt has a transmuted grade < 75%", async () => {
      // Latest attempt for lesson 1 is 5/10 (50% raw -> 71% transmuted < 75%)
      // Latest attempt for lesson 2 is 8/10 (80% raw -> 88% transmuted >= 75%)
      const attempts = [
        {
          id: "att_1",
          userId: mockUser.id,
          subjectSlug: testSubjectSlug,
          lessonNumber: 1,
          lessonTitle: "Functions and Relations",
          score: 5,
          total: 10,
          mode: "study",
          createdAt: new Date("2026-10-26T14:00:00Z"), // latest for lesson 1
        },
        {
          id: "att_2",
          userId: mockUser.id,
          subjectSlug: testSubjectSlug,
          lessonNumber: 2,
          lessonTitle: "Rational Functions",
          score: 8,
          total: 10,
          mode: "study",
          createdAt: new Date("2026-10-26T13:00:00Z"), // latest for lesson 2
        },
        {
          id: "att_3",
          userId: mockUser.id,
          subjectSlug: testSubjectSlug,
          lessonNumber: 1,
          lessonTitle: "Functions and Relations",
          score: 9,
          total: 10,
          mode: "study",
          createdAt: new Date("2026-10-25T10:00:00Z"), // older attempt for lesson 1 (ignored by Latest Attempt Rule)
        },
      ];

      (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue(attempts);

      const res = await getSubjectWeakPointsAction(testSubjectSlug);

      expect(res.success).toBe(true);
      expect(res.weakPoints).toHaveLength(1);
      expect(res.weakPoints[0].lessonNumber).toBe(1);
      expect(res.weakPoints[0].lessonTitle).toBe("Functions and Relations");
      expect(res.weakPoints[0].transmutedScore).toBeLessThan(75);
      expect(res.weakPoints[0].status).toBe("Needs Review");
      expect(res.weakPoints[0].keyConcepts).toEqual(["Domain", "Range"]);
    });

    it("should remove topic from weak points when student retakes and passes (Latest Attempt Rule)", async () => {
      // Student retook Lesson 1 and achieved 9/10 (94% transmuted >= 75%)
      const attempts = [
        {
          id: "att_retake",
          userId: mockUser.id,
          subjectSlug: testSubjectSlug,
          lessonNumber: 1,
          lessonTitle: "Functions and Relations",
          score: 9,
          total: 10,
          mode: "study",
          createdAt: new Date("2026-10-26T15:00:00Z"), // latest retake: passed!
        },
        {
          id: "att_old_fail",
          userId: mockUser.id,
          subjectSlug: testSubjectSlug,
          lessonNumber: 1,
          lessonTitle: "Functions and Relations",
          score: 4,
          total: 10,
          mode: "study",
          createdAt: new Date("2026-10-26T10:00:00Z"), // older failed attempt
        },
      ];

      (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue(attempts);

      const res = await getSubjectWeakPointsAction(testSubjectSlug);

      expect(res.success).toBe(true);
      expect(res.weakPoints).toHaveLength(0); // All attempted lessons passed!
    });

    it("should return empty list when no attempts exist for the subject", async () => {
      (prisma.quizAttempt.findMany as jest.Mock).mockResolvedValue([]);

      const res = await getSubjectWeakPointsAction(testSubjectSlug);

      expect(res.success).toBe(true);
      expect(res.weakPoints).toEqual([]);
    });
  });

  describe("createTargetedPracticeAction", () => {
    it("should create a targeted quiz session for the weak lesson in Study mode", async () => {
      (prisma.quizSession.create as jest.Mock).mockResolvedValue({
        id: "targeted_session_123",
      });

      const res = await createTargetedPracticeAction({
        subjectSlug: testSubjectSlug,
        lessonNumber: 1,
      });

      expect(res.success).toBe(true);
      expect(res.sessionId).toBe("targeted_session_123");
      expect(res.redirectUrl).toContain("sessionId=targeted_session_123");
    });
  });
});
