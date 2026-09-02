import {
  canAccessLesson,
  canAccessSubject,
  getTierEntitlements,
  FREE_TIER_MAX_TRIAL_SUBJECTS,
  FREE_TIER_MAX_LESSONS_PER_SUBJECT,
} from "@/features/curriculum/utils/tier-guardrails";

describe("Tier Guardrails & Entitlement Logic", () => {
  describe("Free Tier Constraints", () => {
    it("should allow access to lessons 1, 2, and 3 for free tier users", () => {
      expect(canAccessLesson(1, false)).toBe(true);
      expect(canAccessLesson(2, false)).toBe(true);
      expect(canAccessLesson(3, false)).toBe(true);
    });

    it("should block access to lesson 4 and above for free tier users", () => {
      expect(canAccessLesson(4, false)).toBe(false);
      expect(canAccessLesson(8, false)).toBe(false);
      expect(canAccessLesson(12, false)).toBe(false);
    });

    it("should allow free users to access subjects up to the trial limit", () => {
      const enrolled = ["genmath", "earthsci"];
      expect(canAccessSubject(enrolled, "precalc", false)).toBe(true);
    });

    it("should block free users when reaching the max trial subjects limit of 3", () => {
      const enrolled = ["genmath", "earthsci", "precalc"];
      expect(canAccessSubject(enrolled, "bascalc", false)).toBe(false);
      // But allow access to already enrolled subject
      expect(canAccessSubject(enrolled, "genmath", false)).toBe(true);
    });

    it("should return correct entitlements metadata for free tier", () => {
      const entitlements = getTierEntitlements(false);
      expect(entitlements.isSubscribed).toBe(false);
      expect(entitlements.maxTrialSubjects).toBe(FREE_TIER_MAX_TRIAL_SUBJECTS);
      expect(entitlements.maxLessonsPerSubject).toBe(FREE_TIER_MAX_LESSONS_PER_SUBJECT);
      expect(entitlements.canAccessAllLessons).toBe(false);
      expect(entitlements.canAccessAllSubjects).toBe(false);
    });
  });

  describe("Premium Tier Entitlements", () => {
    it("should allow access to any lesson number for premium users", () => {
      expect(canAccessLesson(1, true)).toBe(true);
      expect(canAccessLesson(4, true)).toBe(true);
      expect(canAccessLesson(12, true)).toBe(true);
      expect(canAccessLesson(99, true)).toBe(true);
    });

    it("should allow access to any subject regardless of enrollment count for premium users", () => {
      const enrolled = ["s1", "s2", "s3", "s4", "s5"];
      expect(canAccessSubject(enrolled, "s6", true)).toBe(true);
    });

    it("should return correct entitlements metadata for premium tier", () => {
      const entitlements = getTierEntitlements(true);
      expect(entitlements.isSubscribed).toBe(true);
      expect(entitlements.canAccessAllLessons).toBe(true);
      expect(entitlements.canAccessAllSubjects).toBe(true);
      expect(entitlements.unlimitedAiTutor).toBe(true);
    });
  });
});
