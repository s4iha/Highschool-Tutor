/**
 * Tier Guardrails & Entitlement Management
 * 
 * Free Tier Model (Task 026 & Spec-Kit Feature 002):
 * - 30-Day Full-Access Free Trial covering all lessons and subjects.
 * - During the 30-day window from user registration (or admin trial grant),
 *   students have complete, unrestricted access to all lessons and quizzes.
 * - Once the 30-day trial expires, lesson/quiz access requires an active
 *   Monthly or Annual subscription pass. Expired trialists are strictly hard-gated
 *   from accessing lessons, quizzes, and AI tutoring.
 * 
 * Premium Tier Entitlements:
 * - Unlimited Subject Enrollments (all DepEd JHS & SHS subjects)
 * - Full access to all lessons and quizzes
 * - Unlimited Google Gemini Socratic AI tutoring queries & hints
 * - Unlimited Exam Mode & Study Mode Quiz attempts
 */

export const FREE_TIER_MAX_TRIAL_SUBJECTS = 3;
export const FREE_TIER_MAX_LESSONS_PER_SUBJECT = 3;
export const DEFAULT_TRIAL_DURATION_DAYS = 30;

export interface TrialStatus {
  isTrialActive: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  percentRemaining: number;
  expiresAt: Date;
  isExpired: boolean;
}

export interface SubscriptionTrialOverride {
  status?: string | null;
  expiresAt?: string | Date | null;
}

/**
 * Calculates trial status based on explicit admin/subscription override first,
 * falling back to the user's registration date.
 */
export function getTrialStatus(
  createdAt?: string | Date | null,
  trialDays: number = DEFAULT_TRIAL_DURATION_DAYS,
  subscriptionOverride?: SubscriptionTrialOverride | null
): TrialStatus {
  const now = Date.now();
  const totalTrialMs = trialDays * 24 * 60 * 60 * 1000;

  if (subscriptionOverride?.status === "EXPIRED") {
    return {
      isTrialActive: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      percentRemaining: 0,
      expiresAt: subscriptionOverride.expiresAt
        ? new Date(subscriptionOverride.expiresAt)
        : new Date(0),
      isExpired: true,
    };
  }

  if (subscriptionOverride?.status === "TRIAL") {
    const expiresAt = subscriptionOverride.expiresAt
      ? new Date(subscriptionOverride.expiresAt)
      : new Date(now + totalTrialMs);
    const msRemaining = expiresAt.getTime() - now;

    if (msRemaining <= 0) {
      return {
        isTrialActive: false,
        daysRemaining: 0,
        hoursRemaining: 0,
        percentRemaining: 0,
        expiresAt,
        isExpired: true,
      };
    }

    const hoursRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60)));
    const daysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
    const percentRemaining = Math.min(
      100,
      Math.max(0, Math.round((msRemaining / totalTrialMs) * 100))
    );

    return {
      isTrialActive: true,
      daysRemaining,
      hoursRemaining,
      percentRemaining,
      expiresAt,
      isExpired: false,
    };
  }

  if (!createdAt) {
    return {
      isTrialActive: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      percentRemaining: 0,
      expiresAt: new Date(0),
      isExpired: true,
    };
  }

  const createdTime = new Date(createdAt).getTime();
  const expiresAt = new Date(createdTime + totalTrialMs);
  const msRemaining = expiresAt.getTime() - now;

  if (msRemaining <= 0) {
    return {
      isTrialActive: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      percentRemaining: 0,
      expiresAt,
      isExpired: true,
    };
  }

  const hoursRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60)));
  const daysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const percentRemaining = Math.min(100, Math.max(0, Math.round((msRemaining / totalTrialMs) * 100)));

  return {
    isTrialActive: true,
    daysRemaining,
    hoursRemaining,
    percentRemaining,
    expiresAt,
    isExpired: false,
  };
}

/**
 * Helper to determine if a student's trial has definitively expired.
 */
export function isUserTrialExpired(
  createdAt?: string | Date | null,
  trialDays: number = DEFAULT_TRIAL_DURATION_DAYS
): boolean {
  return getTrialStatus(createdAt, trialDays).isExpired;
}

export interface TierEntitlements {
  isSubscribed: boolean;
  isTrialActive: boolean;
  trialStatus?: TrialStatus;
  maxTrialSubjects: number;
  maxLessonsPerSubject: number;
  canAccessAllLessons: boolean;
  canAccessAllSubjects: boolean;
  unlimitedAiTutor: boolean;
  canAccessExamMode: boolean;
  canAccessTranslation: boolean;
  isHardLocked: boolean;
}

export function getTierEntitlements(
  isSubscribed: boolean = false,
  limits?: {
    maxTrialSubjects?: number;
    maxLessonsPerSubject?: number;
    enableAiTutorTrial?: boolean;
    userCreatedAt?: string | Date | null;
    trialDurationDays?: number;
    subscriptionOverride?: SubscriptionTrialOverride | null;
  }
): TierEntitlements {
  const trialStatus =
    limits?.userCreatedAt !== undefined || limits?.subscriptionOverride !== undefined
      ? getTrialStatus(
          limits.userCreatedAt,
          limits?.trialDurationDays ?? DEFAULT_TRIAL_DURATION_DAYS,
          limits?.subscriptionOverride
        )
      : undefined;

  const isTrialActive = trialStatus?.isTrialActive ?? false;
  const isTrialExpired = trialStatus?.isExpired ?? false;

  if (isSubscribed) {
    return {
      isSubscribed: true,
      isTrialActive: false,
      trialStatus,
      maxTrialSubjects: Infinity,
      maxLessonsPerSubject: Infinity,
      canAccessAllLessons: true,
      canAccessAllSubjects: true,
      unlimitedAiTutor: true,
      canAccessExamMode: true,
      canAccessTranslation: true,
      isHardLocked: false,
    };
  }

  if (isTrialActive) {
    return {
      isSubscribed: false,
      isTrialActive: true,
      trialStatus,
      maxTrialSubjects: Infinity,
      maxLessonsPerSubject: Infinity,
      canAccessAllLessons: true,
      canAccessAllSubjects: true,
      unlimitedAiTutor: false, // 20 daily credits during trial
      canAccessExamMode: false, // Study Mode only
      canAccessTranslation: false, // Exclusive to paid passes
      isHardLocked: false,
    };
  }

  // Hard locked when trial has expired and user is not subscribed
  const isHardLocked = isTrialExpired;

  return {
    isSubscribed: false,
    isTrialActive: false,
    trialStatus,
    maxTrialSubjects: isHardLocked ? 0 : (limits?.maxTrialSubjects ?? FREE_TIER_MAX_TRIAL_SUBJECTS),
    maxLessonsPerSubject: isHardLocked ? 0 : (limits?.maxLessonsPerSubject ?? FREE_TIER_MAX_LESSONS_PER_SUBJECT),
    canAccessAllLessons: false,
    canAccessAllSubjects: false,
    unlimitedAiTutor: false,
    canAccessExamMode: false,
    canAccessTranslation: false,
    isHardLocked,
  };
}

export function canAccessExamMode(
  isSubscribed: boolean = false,
  isAdmin: boolean = false
): boolean {
  return isSubscribed || isAdmin;
}

export function canAccessLesson(
  lessonNumber: number,
  isSubscribed: boolean = false,
  maxFreeLessons: number = FREE_TIER_MAX_LESSONS_PER_SUBJECT,
  isTrialActive: boolean = false,
  isTrialExpired: boolean = false
): boolean {
  if (isSubscribed) return true;
  if (isTrialActive) return true;
  // If the 30-day trial is strictly expired and not subscribed, lock completely
  if (isTrialExpired) return false;
  return lessonNumber <= maxFreeLessons;
}

export function canAccessSubject(
  enrolledSubjectSlugs: string[],
  targetSubjectSlug: string,
  isSubscribed: boolean = false,
  maxTrialSubjects: number = FREE_TIER_MAX_TRIAL_SUBJECTS,
  isTrialActive: boolean = false,
  isTrialExpired: boolean = false
): boolean {
  if (isSubscribed) return true;
  if (isTrialActive) return true;
  if (isTrialExpired) return false;
  if (enrolledSubjectSlugs.includes(targetSubjectSlug)) return true;
  return enrolledSubjectSlugs.length < maxTrialSubjects;
}
