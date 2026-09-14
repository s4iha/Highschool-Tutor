/**
 * Tier Guardrails & Entitlement Management
 * 
 * Free Tier Constraints:
 * - Maximum of 3 Trial Subjects (configurable via AdminConfig)
 * - First 3 Lessons accessible per subject (configurable via AdminConfig)
 * 
 * Premium Tier Entitlements:
 * - Unlimited Subject Enrollments (all 130+ DepEd JHS & SHS subjects)
 * - Full access to all lessons (Lessons 1-12)
 * - Unlimited Google Gemini Socratic AI tutoring queries & hints
 * - Unlimited Exam Mode & Study Mode Quiz attempts
 */

export const FREE_TIER_MAX_TRIAL_SUBJECTS = 3;
export const FREE_TIER_MAX_LESSONS_PER_SUBJECT = 3;

export interface TierEntitlements {
  isSubscribed: boolean;
  maxTrialSubjects: number;
  maxLessonsPerSubject: number;
  canAccessAllLessons: boolean;
  canAccessAllSubjects: boolean;
  unlimitedAiTutor: boolean;
}

export function getTierEntitlements(
  isSubscribed: boolean = false,
  limits?: { maxTrialSubjects?: number; maxLessonsPerSubject?: number; enableAiTutorTrial?: boolean }
): TierEntitlements {
  if (isSubscribed) {
    return {
      isSubscribed: true,
      maxTrialSubjects: Infinity,
      maxLessonsPerSubject: Infinity,
      canAccessAllLessons: true,
      canAccessAllSubjects: true,
      unlimitedAiTutor: true,
    };
  }

  return {
    isSubscribed: false,
    maxTrialSubjects: limits?.maxTrialSubjects ?? FREE_TIER_MAX_TRIAL_SUBJECTS,
    maxLessonsPerSubject: limits?.maxLessonsPerSubject ?? FREE_TIER_MAX_LESSONS_PER_SUBJECT,
    canAccessAllLessons: false,
    canAccessAllSubjects: false,
    unlimitedAiTutor: limits?.enableAiTutorTrial ?? false,
  };
}

export function canAccessLesson(
  lessonNumber: number,
  isSubscribed: boolean = false,
  maxFreeLessons: number = FREE_TIER_MAX_LESSONS_PER_SUBJECT
): boolean {
  if (isSubscribed) return true;
  return lessonNumber <= maxFreeLessons;
}

export function canAccessSubject(
  enrolledSubjectSlugs: string[],
  targetSubjectSlug: string,
  isSubscribed: boolean = false,
  maxTrialSubjects: number = FREE_TIER_MAX_TRIAL_SUBJECTS
): boolean {
  if (isSubscribed) return true;
  if (enrolledSubjectSlugs.includes(targetSubjectSlug)) return true;
  return enrolledSubjectSlugs.length < maxTrialSubjects;
}
