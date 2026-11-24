import {
  canAccessLesson,
  canAccessSubject,
  getTrialStatus,
} from "@/features/curriculum/utils/tier-guardrails";

describe("User Story 3: 30-Day Free Trial Tier Guardrails", () => {
  describe("canAccessLesson 30-Day Trial Logic", () => {
    it("allows access to Lessons 1 through 8 when 30-day trial is active", () => {
      // isSubscribed: false, maxFreeLessons: 3, isTrialActive: true, isTrialExpired: false
      for (let lesson = 1; lesson <= 8; lesson++) {
        expect(canAccessLesson(lesson, false, 3, true, false)).toBe(true);
      }
    });

    it("hard-locks all lessons (including Lesson 1) when trial has strictly expired without subscription", () => {
      // isSubscribed: false, maxFreeLessons: 3, isTrialActive: false, isTrialExpired: true
      expect(canAccessLesson(1, false, 3, false, true)).toBe(false);
      expect(canAccessLesson(4, false, 3, false, true)).toBe(false);
      expect(canAccessLesson(8, false, 3, false, true)).toBe(false);
    });

    it("allows subscribed users access even if trial is marked expired", () => {
      // isSubscribed: true, isTrialExpired: true
      expect(canAccessLesson(1, true, 3, false, true)).toBe(true);
      expect(canAccessLesson(8, true, 3, false, true)).toBe(true);
    });

    it("allows free preview of Lessons 1–3 for unexpired guest accounts without full trial", () => {
      // isSubscribed: false, isTrialActive: false, isTrialExpired: false
      expect(canAccessLesson(1, false, 3, false, false)).toBe(true);
      expect(canAccessLesson(2, false, 3, false, false)).toBe(true);
      expect(canAccessLesson(3, false, 3, false, false)).toBe(true);
      expect(canAccessLesson(4, false, 3, false, false)).toBe(false);
    });
  });

  describe("canAccessSubject 30-Day Trial Logic", () => {
    it("allows accessing new subjects beyond maxTrialSubjects when trial is active", () => {
      const alreadyEnrolled = ["subject-1", "subject-2", "subject-3"];
      // Trial is active -> unlimited subjects during trial
      expect(canAccessSubject(alreadyEnrolled, "subject-4", false, 3, true, false)).toBe(true);
    });

    it("hard-locks subject enrollment when trial has strictly expired without subscription", () => {
      const alreadyEnrolled = ["subject-1"];
      // Expired trial -> cannot enroll new subjects
      expect(canAccessSubject(alreadyEnrolled, "subject-2", false, 3, false, true)).toBe(false);
    });

    it("allows subscribed users to enroll unlimited subjects regardless of trial status", () => {
      const alreadyEnrolled = ["subject-1", "subject-2", "subject-3"];
      expect(canAccessSubject(alreadyEnrolled, "subject-4", true, 3, false, true)).toBe(true);
    });
  });

  describe("getTrialStatus Boundary Timing", () => {
    it("reports trial active with correct remaining days for fresh registration", () => {
      const justNow = new Date();
      const status = getTrialStatus(justNow, 30);
      expect(status.isTrialActive).toBe(true);
      expect(status.isExpired).toBe(false);
      expect(status.daysRemaining).toBe(30);
    });

    it("reports trial expired for registrations past 30 days", () => {
      const thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);
      const status = getTrialStatus(thirtyFiveDaysAgo, 30);
      expect(status.isTrialActive).toBe(false);
      expect(status.isExpired).toBe(true);
      expect(status.daysRemaining).toBe(0);
    });

    it("unlocks an expired account when Super Admin grants a TRIAL subscription override", () => {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const status = getTrialStatus(ninetyDaysAgo, 30, {
        status: "TRIAL",
        expiresAt: thirtyDaysFromNow,
      });

      expect(status.isTrialActive).toBe(true);
      expect(status.isExpired).toBe(false);
      expect(status.daysRemaining).toBe(30);
      expect(canAccessLesson(8, false, 3, status.isTrialActive, status.isExpired)).toBe(true);
    });

    it("immediately locks a recent account when Super Admin sets status to EXPIRED", () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const status = getTrialStatus(yesterday, 30, {
        status: "EXPIRED",
        expiresAt: new Date(Date.now() - 1000),
      });

      expect(status.isTrialActive).toBe(false);
      expect(status.isExpired).toBe(true);
      expect(canAccessLesson(1, false, 3, status.isTrialActive, status.isExpired)).toBe(false);
    });
  });
});
