import {
  getTrialStatus,
  canAccessLesson,
  getTierEntitlements,
  isUserTrialExpired,
} from "@/features/curriculum/utils/tier-guardrails";

describe("Tier Guardrails & Trial Expiration Hard Gate", () => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  it("identifies active 30-day trials with correct days remaining", () => {
    const registered5DaysAgo = new Date(Date.now() - 5 * ONE_DAY_MS);
    const status = getTrialStatus(registered5DaysAgo, 30);

    expect(status.isTrialActive).toBe(true);
    expect(status.isExpired).toBe(false);
    expect(status.daysRemaining).toBe(25);
  });

  it("detects accounts within the 7-day pre-expiration notice window (Day 23 of 30)", () => {
    const registered23DaysAgo = new Date(Date.now() - 23 * ONE_DAY_MS);
    const status = getTrialStatus(registered23DaysAgo, 30);

    expect(status.isTrialActive).toBe(true);
    expect(status.isExpired).toBe(false);
    expect(status.daysRemaining).toBe(7);
  });

  it("identifies expired trials once registration exceeds 30 calendar days", () => {
    const registered31DaysAgo = new Date(Date.now() - 31 * ONE_DAY_MS);
    const status = getTrialStatus(registered31DaysAgo, 30);

    expect(status.isTrialActive).toBe(false);
    expect(status.isExpired).toBe(true);
    expect(status.daysRemaining).toBe(0);
    expect(isUserTrialExpired(registered31DaysAgo, 30)).toBe(true);
  });

  it("strictly hard-blocks lesson access for expired trialists who are not subscribed", () => {
    const registered35DaysAgo = new Date(Date.now() - 35 * ONE_DAY_MS);
    const trialStatus = getTrialStatus(registered35DaysAgo, 30);

    // Expired trialist (not subscribed)
    const canAccessLesson1 = canAccessLesson(
      1,
      false, // isSubscribed
      3,     // maxFreeLessons
      trialStatus.isTrialActive, // false
      trialStatus.isExpired      // true (hard gate)
    );
    expect(canAccessLesson1).toBe(false);

    const canAccessLesson5 = canAccessLesson(
      5,
      false,
      3,
      trialStatus.isTrialActive,
      trialStatus.isExpired
    );
    expect(canAccessLesson5).toBe(false);
  });

  it("grants complete access to active subscribers regardless of trial age", () => {
    const registered60DaysAgo = new Date(Date.now() - 60 * ONE_DAY_MS);
    const trialStatus = getTrialStatus(registered60DaysAgo, 30);

    const canAccess = canAccessLesson(
      8,
      true,  // isSubscribed = true
      3,
      trialStatus.isTrialActive,
      trialStatus.isExpired
    );
    expect(canAccess).toBe(true);
  });

  it("returns isHardLocked = true in getTierEntitlements for expired trialists", () => {
    const registered40DaysAgo = new Date(Date.now() - 40 * ONE_DAY_MS);
    const entitlements = getTierEntitlements(false, {
      userCreatedAt: registered40DaysAgo,
      trialDurationDays: 30,
    });

    expect(entitlements.isSubscribed).toBe(false);
    expect(entitlements.isTrialActive).toBe(false);
    expect(entitlements.isHardLocked).toBe(true);
    expect(entitlements.canAccessAllLessons).toBe(false);
    expect(entitlements.unlimitedAiTutor).toBe(false);
    expect(entitlements.maxLessonsPerSubject).toBe(0);
  });
});
