# Interface & Action Contracts: End-to-End Quiz Generation & Student Workflow Reliability

**Feature**: `008-fix-quiz-workflow-bugs`  
**Date**: 2026-11-24

---

## 1. DepEd DO 015 s. 2026 Transmutation Utility Contract

**Module**: `features/curriculum/utils/transmutation.ts`

```ts
export function calculateDepEdTransmutation(score: number, total: number): number;
export function getDepEdTransmutationRemarks(avg: number | null): string;
```

- Must return `60` when `score === 0` and `total > 0`.
- Must return `75` when `(score / total) * 100 === 60`.
- Must return `100` when `score >= total` and `total > 0`.
- Must be used identically by:
  - `features/dashboard/actions/dashboard.actions.ts` (`getDashboardDataAction`)
  - `features/curriculum/actions/curriculum.actions.ts` (`getSubjectProgressAction`, `getUserQuizAttemptsAction`, `getSubjectWeakPointsAction`)
  - `features/curriculum/components/QuizRunner.tsx`

---

## 2. Server Action Contracts

### 2.1 `getLessonsAction(subjectSlug: string)`
**Module**: `features/curriculum/actions/curriculum.actions.ts`
- **Primary**: Query `prisma.cachedLesson.findUnique({ where: { subjectSlug } })`. If missing, invoke `generateLessonsForSubject(subject)` via Gemini (`gemini-3.5-flash-lite` minimum) and cache in `cached_lessons`.
- **Fallback**: If `generateLessonsForSubject` throws an error, resolve `getSubjectScopeDefinition(subjectSlug)?.lessons` from `features/curriculum/utils/subject-scope-data.ts`, map each `SubjectScopeLesson` to `Lesson` (`{ number: l.lessonNumber, title: l.title, summary: l.summary, keyConcepts: l.keyConcepts }`), and return `{ success: true, lessons }`.

### 2.2 `ensureSubjectEnrolledAction(subjectSlug: string)`
**Module**: `features/curriculum/actions/curriculum.actions.ts`
- Wraps `prisma.adminConfig.findFirst()` in a `try/catch` with default fallback values (`maxTrialSubjects = 3`, `trialDurationDays = 30`).
- Calls `canAccessSubject(enrolledSlugs, subjectSlug, isSubscribed, maxTrialSubjects, trialStatus.isTrialActive, trialStatus.isExpired)`.
- Upserts/creates `prisma.trialSubject` for the authenticated student.

### 2.3 `getLessonMaterialAction(subjectSlug: string, lessonNumber: number)`
**Module**: `features/curriculum/actions/lesson-material.actions.ts`
- Validates lesson access via `canAccessLesson(num, isSubscribed, maxFreeLessons, trialStatus.isTrialActive, trialStatus.isExpired)`.
- Invokes `await ensureSubjectEnrolledAction(subjectSlug)` for authenticated non-admin students so viewing a lesson enrolls the subject into `trial_subjects`.

### 2.4 `createQuizSessionAction(input: CreateQuizSessionInput)`
**Module**: `features/curriculum/actions/quiz-session.actions.ts`
- Parses allowed question counts dynamically from `adminConfig?.availableQuestionCounts` (falling back to `[5, 10, 15, 20, 24]`).
- Creates a `QuizSession` row with `activeQuestionIndex: 0`.

### 2.5 `getSubjectProgressAction(subjectSlug: string)`
**Module**: `features/curriculum/actions/curriculum.actions.ts`
- If `!sessionUser?.id`, immediately returns `{ lessonScores: {}, totalAttempted: 0, totalMastered: 0, totalLessons: 0 }` without querying `prisma.quizAttempt`.

---

## 3. Route & Component Contracts

### 3.1 Quiz Route Guard (`app/(dashboard)/curriculum/[slug]/quiz/[lesson]/page.tsx`)
- Accepts `searchParams: Promise<{ session?: string; sessionId?: string; mode?: string; count?: string }>`.
- Resolves `isSubscribed` (active subscription or `sessionUser?.role === "ADMIN"`) and `trialStatus = getTrialStatus(sessionUser?.createdAt, trialDurationDays)`.
- Evaluates `canAccessLesson(lessonNumber, isSubscribed, maxFreeLessons, trialStatus.isTrialActive, trialStatus.isExpired)`.
- Passes `initialSessionId={resolvedSearchParams.session || resolvedSearchParams.sessionId}` to `<QuizRunner />`.

### 3.2 Subject Lessons Route (`app/(dashboard)/curriculum/[slug]/page.tsx`)
- Resolves `isSubscribed` on the server and passes `<LessonList subject={subject} isSubscribed={isSubscribed} />`.
