# Technical Research: End-to-End Quiz Generation & Student Workflow Reliability

**Feature**: `008-fix-quiz-workflow-bugs`  
**Date**: 2026-11-24

---

## Decision 1: Idempotent PostgreSQL Schema Synchronization for `AdminConfig` and `QuizSession`

- **Decision**: Create a new tracked, defensive SQL migration `prisma/migrations/20261124130000_sync_admin_config_and_quiz_sessions/migration.sql` using `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` to add:
  1. `"admin_config"."availableQuestionCounts" TEXT NOT NULL DEFAULT '5, 10, 15, 20'`
  2. `"quiz_sessions"."activeQuestionIndex" INTEGER NOT NULL DEFAULT 0`
  3. `"quiz_sessions_userId_completedAt_createdAt_idx"` on `"quiz_sessions"("userId", "completedAt", "createdAt")`
  4. `"reminder_notices_userId_kind_idx"` on `"reminder_notices"("userId", "kind")`
  Additionally, wrap `prisma.adminConfig.findFirst()` in a resilient helper with `try/catch` fallback defaults in `dashboard.actions.ts`, `curriculum.actions.ts`, and `quiz-session.actions.ts`.
- **Rationale**: Prisma ORM v7 generates `SELECT` statements containing every field declared in `schema.prisma`. Because `availableQuestionCounts` and `activeQuestionIndex` were added to `schema.prisma` without corresponding SQL migrations, PostgreSQL throws `P2022 (ColumnNotFound)` during `getDashboardDataAction`, `ensureSubjectEnrolledAction` (called at the start of `getQuizAction`), and `createQuizSessionAction`.
- **Alternatives Considered**:
  - Running `prisma db push` without a migration file: Rejected because Workspace Rule 10 strictly forbids unmigrated schema changes (`prisma migrate deploy` in production requires committed SQL migration files).

---

## Decision 2: Gemini 24-Question Pool Generation & Curated MATATAG Syllabus Fallback

- **Decision**:
  1. Keep `gemini-3.5-flash-lite` as the minimum default model in `features/curriculum/api/gemini-service.ts`.
  2. Keep the 24-question pool size per lesson in `generateQuizForLesson` (stored in `cached_quizzes`) so 5/10/15/20-question quizzes have variety across retakes, and explicitly set `maxOutputTokens: 8192` in `callGemini`'s `generationConfig` to prevent JSON array truncation.
  3. In `getLessonsAction(subjectSlug)` (`features/curriculum/actions/curriculum.actions.ts`), keep `generateLessonsForSubject(subject)` via Gemini AI as the primary generator when `cached_lessons` is empty, and add a `try/catch` fallback to `getSubjectScopeDefinition(subjectSlug)?.lessons` from `features/curriculum/utils/subject-scope-data.ts` so students always receive the curated 8-lesson DepEd MATATAG outline if Gemini is unreachable.
  4. In `QuizRunner.tsx`, capture and display specific error messages returned by `createQuizSessionAction` or `getQuizAction` so failures are never masked by a generic empty state.
- **Rationale**: Preserves dynamic AI generation while guaranteeing high output token capacity for 24-question JSON payloads and preventing empty subject pages when external AI calls fail.
- **Alternatives Considered**:
  - Reducing the question pool size to 10 or replacing Gemini lesson generation entirely with static data: Rejected per user decision during `/grill-me` clarification.

---

## Decision 3: Auth & Onboarding TanStack Query Cache Synchronization

- **Decision**:
  1. In `features/auth/components/AuthPage.tsx`, call `await queryClient.invalidateQueries({ queryKey: ["currentUser"] })` and `await queryClient.invalidateQueries({ queryKey: ["student", "dashboard-data"] })` inside `authMutation.onSuccess` before `router.push(destination)`.
  2. In `features/dashboard/components/DashboardSidebar.tsx`, call `queryClient.clear()` upon logout before redirecting to `/login`.
  3. In `features/auth/components/OnboardingModal.tsx`, derive the initial `termPreference` state from the initial `gradeLevel` (`"Semester 1"` when `Grade 11` or `Grade 12`, `"Quarter 1"` when `Grades 7–10`), invalidate `["currentUser"]` and `["student", "dashboard-data"]` on completion, and keep `trial_subjects` empty after onboarding.
- **Rationale**: `RootLayout` mounts `<OnboardingModal />` on `/login` and `/register`, which executes `useUser()` with a 5-minute `staleTime` and caches `{ user: null }`. Without invalidating `["currentUser"]` on login/registration, `/dashboard` sees `user === null` and skips all `enabled: !!user?.id` queries (`useDashboardData` and `userAttemptsData`). Fixing `OnboardingForm` initial state also prevents saving `Grade 11` + `Quarter 1` when the student clicks "Get Started" with default selections.
- **Alternatives Considered**:
  - Setting `staleTime: 0` on `useUser()`: Rejected because it causes redundant `/api/user/me` network requests on every component mount across the app.

---

## Decision 4: Subject Enrollment on Lesson View / Quiz Start & 30-Day Trial Guardrail Parity

- **Decision**:
  1. Call `ensureSubjectEnrolledAction(subjectSlug)` inside `getLessonMaterialAction` (`features/curriculum/actions/lesson-material.actions.ts`) as well as `getQuizAction` and `recordQuizAttemptAction` (`features/curriculum/actions/curriculum.actions.ts`), while keeping `/curriculum/[slug]` outline browsing passive.
  2. Pass `trialStatus.isExpired` as the 6th argument to `canAccessSubject` in `ensureSubjectEnrolledAction`.
  3. In `app/(dashboard)/curriculum/[slug]/page.tsx`, resolve the current user's active subscription/admin status on the server and pass `isSubscribed` to `<LessonList subject={subject} isSubscribed={isSubscribed} />` (and also check `user?.subscription?.status === "ACTIVE" || user?.role === "ADMIN"` client-side in `LessonList.tsx`).
  4. In `app/(dashboard)/curriculum/[slug]/quiz/[lesson]/page.tsx`, compute the user's `trialStatus = getTrialStatus(sessionUser?.createdAt, trialDurationDays)` and pass `canAccessLesson(lessonNumber, isSubscribed, maxFreeLessons, trialStatus.isTrialActive, trialStatus.isExpired)` so active 30-day trial users can access Lessons 4–8 without false paywall redirects.
  5. Handle `?upgrade=true` in `LessonList.tsx` to automatically open `<UpgradeModal />` when redirected from a locked quiz URL.
- **Rationale**: Aligns server-side and client-side entitlement checks with the 30-day full-access trial policy and ensures opening a lesson ("View Lesson") or starting a quiz ("Take Quiz") enrolls the subject.
- **Alternatives Considered**:
  - Enrolling subjects on `/curriculum/[slug]` page visit: Rejected per user decision so passive browsing does not accidentally enroll subjects.

---

## Decision 5: Quiz Session Resumption URL Parameter Compatibility & DO 015 Transmutation Unification

- **Decision**:
  1. Support both `?session=` and `?sessionId=` in `app/(dashboard)/curriculum/[slug]/quiz/[lesson]/page.tsx` and `features/curriculum/components/QuizRunner.tsx`.
  2. Centralize the DepEd Order No. 015, s. 2026 piecewise transmutation formula in `features/curriculum/utils/transmutation.ts` (`calculateDepEdTransmutation` and `getDepEdTransmutationRemarks`) and replace the divergent linear formula (`60 + raw% * 0.40`) in `features/dashboard/actions/dashboard.actions.ts` as well as duplicate implementations in `curriculum.actions.ts` and `QuizRunner.tsx`.
  3. Require `sessionUser?.id` in `getSubjectProgressAction` (`features/curriculum/actions/curriculum.actions.ts`), returning empty progress when unauthenticated.
  4. Pass `user?.profile?.tutoringPersona` to `<AITutorDrawer />` and include `user?.subscription?.status === "ACTIVE"` in `isPremiumUser` inside `QuizRunner.tsx`.
- **Rationale**: Eliminates the `?sessionId=` vs `?session=` mismatch that broke "Resume Quiz" and "Targeted Practice", and guarantees 100% mathematical consistency for DepEd DO 015 s. 2026 transmuted grades across all views.
- **Alternatives Considered**:
  - Changing only `ActiveQuizResumptionCard`: Insufficient because `createTargetedPracticeAction` also generates `?sessionId=`, so supporting both parameters at the route and component level is backwards-compatible and defensive.
