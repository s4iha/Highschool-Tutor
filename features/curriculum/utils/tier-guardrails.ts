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

/**
 * Calculates trial status based on the user's registration date.
 */
export function getTrialStatus(
  createdAt?: string | Date | null,
  trialDays: number = DEFAULT_TRIAL_DURATION_DAYS
): TrialStatus {
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
  const now = Date.now();
  const totalTrialMs = trialDays * 24 * 60 * 60 * 1000;
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
  }
): TierEntitlements {
  const trialStatus = limits?.userCreatedAt
    ? getTrialStatus(
        limits.userCreatedAt,
        limits?.trialDurationDays ?? DEFAULT_TRIAL_DURATION_DAYS
      )
    : undefined;

  const isTrialActive = trialStatus?.isTrialActive ?? false;
  const isTrialExpired = trialStatus?.isExpired ?? false;
  const hasFullAccess = isSubscribed || isTrialActive;

  if (hasFullAccess) {
    return {
      isSubscribed,
      isTrialActive,
      trialStatus,
      maxTrialSubjects: Infinity,
      maxLessonsPerSubject: Infinity,
      canAccessAllLessons: true,
      canAccessAllSubjects: true,
      unlimitedAiTutor: true,
      isHardLocked: false,
    };
  }

  // Hard locked when trial has expired and user is not subscribed
  const isHardLocked = !isSubscribed && isTrialExpired;

  return {
    isSubscribed: false,
    isTrialActive: false,
    trialStatus,
    maxTrialSubjects: isHardLocked ? 0 : (limits?.maxTrialSubjects ?? FREE_TIER_MAX_TRIAL_SUBJECTS),
    maxLessonsPerSubject: isHardLocked ? 0 : (limits?.maxLessonsPerSubject ?? FREE_TIER_MAX_LESSONS_PER_SUBJECT),
    canAccessAllLessons: false,
    canAccessAllSubjects: false,
    unlimitedAiTutor: false,
    isHardLocked,
  };
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
