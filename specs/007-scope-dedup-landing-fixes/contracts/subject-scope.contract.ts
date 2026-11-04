/**
 * TypeScript Interface Contracts for Feature 007-scope-dedup-landing-fixes
 * Covers Subject Scope Syllabus, Catalog Deduplication, Diagnostic Mastery,
 * and Targeted Practice Question Prioritization.
 */

import type { QuizQuestion } from "@/features/curriculum/types/curriculum.types";

// ============================================================================
// 1. 8-Lesson Syllabus & Scope Breakdown Contracts
// ============================================================================

export interface SubjectScopeLesson {
  lessonNumber: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  practiceDrillsCount: number;
}

export interface SubjectScopeDefinition {
  slug: string;
  code: string;
  name: string;
  level: "Junior High School" | "Senior High School";
  grade: string;
  term: string;
  track: string;
  strand: string;
  timeAllotment: string;
  prerequisites: string[];
  corequisites?: string[];
  description: string;
  competencies: string[];
  tesdaNcLevel?: string | null;
  careerPathways?: string[];
  featuredModulesCount?: number;
  lessons: SubjectScopeLesson[];
  isJhsCore?: boolean;
  abbr?: string;
}

export interface JhsGradeQuarterScope {
  grade: "Grade 7" | "Grade 8" | "Grade 9" | "Grade 10";
  quarter: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Quarter 4";
  slug: string;
  description: string;
  competencies: string[];
  lessons: SubjectScopeLesson[];
}

// ============================================================================
// 2. Mastery-First Framing & Diagnostic Contracts
// ============================================================================

export type LessonProgressStatus =
  | "Not Started"
  | "In Progress"
  | "Needs Review"
  | "Practice Passed"       // Legacy compatibility
  | "Practice Proficient"   // Mastery-first label for score >= 75%
  | "Mastered";

export interface SubjectWeakPointsResult {
  success: boolean;
  subjectSlug: string;
  weakPoints: Array<{
    lessonNumber: number;
    lessonTitle: string;
    rawScore: number;
    total: number;
    transmutedScore: number;
    status: "Needs Review";
    keyConcepts: string[];
    lastAttemptDate: Date;
  }>;
  totalWeakPoints: number;
  totalAttemptedLessons: number;
  passingThreshold: number;
  error?: string;
}

// ============================================================================
// 3. Targeted Practice Selection Contracts
// ============================================================================

export interface TargetedPracticeSelectionParams {
  pool: QuizQuestion[];
  count: number;
  previousSessions?: Array<{
    questions: QuizQuestion[];
    userAnswers?: Record<string, string> | null;
  }>;
  keyConcepts?: string[];
}

export interface TargetedPracticeActionResult {
  success: boolean;
  sessionId?: string;
  redirectUrl?: string;
  error?: string;
}

// ============================================================================
// 4. Function Signature Specifications
// ============================================================================

export type SelectTargetedPracticeQuestionsFn = (
  params: TargetedPracticeSelectionParams
) => QuizQuestion[];

export type GetSubjectWeakPointsActionFn = (
  subjectSlug: string
) => Promise<SubjectWeakPointsResult>;

export type CreateTargetedPracticeActionFn = (
  input: {
    subjectSlug: string;
    lessonNumber: number;
    lessonTitle?: string;
    questionCount?: number;
  }
) => Promise<TargetedPracticeActionResult>;
