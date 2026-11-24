# Tasks: End-to-End Quiz Generation & Student Workflow Reliability

**Input**: Design documents from `/specs/008-fix-quiz-workflow-bugs/`  
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/workflow-fixes.contract.md](./contracts/workflow-fixes.contract.md)  
**Tests**: Included per mandatory TDD workflow (`test-driven-development` skill) and Constitution Principle V.  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Task Tracking & Workspace Initialization)

**Purpose**: Initialize task tracking file required by Workspace Rule 4 and `task-implementation` skill.

- [x] T001 Create task tracking file `docs/tasks/TASK-031-fix-quiz-workflow-bugs.md` documenting the root causes, allocated skills from `C:\Users\Dell\.gemini\skills`, and verification checklist

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema migration, shared DepEd DO 015 s. 2026 transmutation utility, and curriculum schema updates that MUST be complete before user stories can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Create idempotent PostgreSQL migration in `prisma/migrations/20261124130000_sync_admin_config_and_quiz_sessions/migration.sql` adding `"admin_config"."availableQuestionCounts" TEXT NOT NULL DEFAULT '5, 10, 15, 20'`, `"quiz_sessions"."activeQuestionIndex" INTEGER NOT NULL DEFAULT 0`, index `"quiz_sessions_userId_completedAt_createdAt_idx"`, and index `"reminder_notices_userId_kind_idx"`
- [x] T003 Apply database migration and regenerate Prisma client (`npx prisma migrate deploy` and `npx prisma generate`) against `prisma/schema.prisma`
- [x] T004 [P] Write failing unit tests for DepEd DO 015 s. 2026 piecewise grade transmutation (`0% -> 60`, `60% -> 75`, `100% -> 100`) and mastery descriptors in `__tests__/curriculum/transmutation.test.ts`
- [x] T005 Implement shared `calculateDepEdTransmutation` and `getDepEdTransmutationRemarks` utilities in `features/curriculum/utils/transmutation.ts` to pass `__tests__/curriculum/transmutation.test.ts`
- [x] T006 [P] Update `subjectSchema` term validation regex in `features/curriculum/schemas/curriculum.schema.ts` to accept `Quarter [1-4]`, `Trimester [1-3]`, and `Semester [1-2]`

**Checkpoint**: Database columns `availableQuestionCounts` and `activeQuestionIndex` exist in PostgreSQL, and shared DO 015 transmutation utility is tested and ready.

---

## Phase 3: User Story 1 - Reliable Quiz Question Generation & Session Persistence (Priority: P1) 🎯 MVP

**Goal**: Ensure quiz questions and lesson outlines generate reliably using `gemini-3.5-flash-lite` (with `maxOutputTokens: 8192` for 24-question pools and curated MATATAG syllabus fallback for lesson outlines), resilient `AdminConfig` lookups, and seamless quiz session resumption via both `?session=` and `?sessionId=` URL parameters.

**Independent Test**: Log in as a student, open an uncached subject, start a 10-question quiz on Lesson 1, answer 3 questions, navigate back to the subject page, click "Resume Quiz", and verify the session restores at Question 3/4 with saved answers and zero `P2022` errors.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Write unit tests for `getLessonsAction` curated MATATAG syllabus fallback, `ensureSubjectEnrolledAction` resilient `AdminConfig` fallback, and dynamic `availableQuestionCounts` parsing in `__tests__/curriculum/quiz-generation-and-session.test.ts`

### Implementation for User Story 1

- [x] T008 [P] [US1] Configure `maxOutputTokens: 8192` in `callGemini` `generationConfig` inside `features/curriculum/api/gemini-service.ts` to prevent 24-question JSON array truncation on `gemini-3.5-flash-lite`
- [x] T009 [US1] Update `getLessonsAction` and `ensureSubjectEnrolledAction` in `features/curriculum/actions/curriculum.actions.ts` to wrap `prisma.adminConfig.findFirst()` in a resilient `try/catch` default fallback and fall back to `getSubjectScopeDefinition(subjectSlug)?.lessons` from `features/curriculum/utils/subject-scope-data.ts` if Gemini lesson generation fails
- [x] T010 [US1] Update `createQuizSessionAction` in `features/curriculum/actions/quiz-session.actions.ts` to parse allowed question counts dynamically from `adminConfig?.availableQuestionCounts` (with resilient `try/catch` fallback to `[5, 10, 15, 20, 24]`)
- [x] T011 [US1] Update `LessonQuizPage` in `app/(dashboard)/curriculum/[slug]/quiz/[lesson]/page.tsx` to accept both `session` and `sessionId` in `searchParams` and pass `initialSessionId={resolvedSearchParams.session || resolvedSearchParams.sessionId}` to `QuizRunner`
- [x] T012 [US1] Update `QuizRunner` in `features/curriculum/components/QuizRunner.tsx` to resolve `session` or `sessionId` from URL search params and display specific, actionable error messages when `createQuizSessionAction` or `getQuizAction` fails

**Checkpoint**: User Story 1 is complete — lesson outlines, 24-question Gemini quiz generation, and quiz session resumption/targeted practice work end-to-end without `P2022` errors.

---

## Phase 4: User Story 2 - Seamless Account Creation, Login & Onboarding State Synchronization (Priority: P1)

**Goal**: Immediately synchronize authenticated user state across TanStack Query upon registration, login, onboarding, and logout, and ensure the Onboarding modal initializes a valid Senior High grading period (`Semester 1` for `Grade 11`/`Grade 12`) with zero pre-enrolled subjects.

**Independent Test**: Open `/register`, create a new student account, click "Get Started" in `<OnboardingModal />` with default selections, and verify `/dashboard` immediately renders the student's name, `Grade 11 • STEM Strand`, `Semester 1`, and live dashboard metrics (`0` Enrolled Subjects) without a browser refresh.

### Tests for User Story 2 ⚠️

- [x] T013 [P] [US2] Write unit tests for onboarding default `gradeLevel` + `termPreference` resolution (`Grade 11 -> Semester 1`, `Grade 7 -> Quarter 1`) in `__tests__/auth/onboarding-defaults.test.ts`

### Implementation for User Story 2

- [x] T014 [P] [US2] Update `AuthPageContent` in `features/auth/components/AuthPage.tsx` to inject `useQueryClient()` and invalidate `["currentUser"]` and `["student", "dashboard-data"]` inside `authMutation.onSuccess` before `router.push(destination)`
- [x] T015 [P] [US2] Update `OnboardingForm` in `features/auth/components/OnboardingModal.tsx` to initialize `termPreference` to `"Semester 1"` when default `gradeLevel` is Senior High (`Grade 11` or `Grade 12`) and `"Quarter 1"` when Junior High, and invalidate both `["currentUser"]` and `["student", "dashboard-data"]` on mutation success
- [x] T016 [P] [US2] Update `DashboardSidebar` in `features/dashboard/components/DashboardSidebar.tsx` to clear cached user, dashboard, and quiz queries via `queryClient.clear()` in `handleLogout` before redirecting to `/login`

**Checkpoint**: User Story 2 is complete — account creation, login, onboarding defaults, and logout synchronize client state immediately.

---

## Phase 5: User Story 3 - Accurate Subject Enrollment & 30-Day Free Trial Lesson Access (Priority: P2)

**Goal**: Auto-enroll subjects into `trial_subjects` when a student views a lesson ("View Lesson") or starts a quiz ("Take Quiz"), pass `trialStatus.isExpired` to `canAccessSubject`, pass `isSubscribed` to `LessonList`, and pass full 30-day trial status to `canAccessLesson` in `LessonQuizPage` so trial students can take quizzes on Lessons 1–8 without false paywall redirects.

**Independent Test**: Log in as a student within their 30-day free trial, open `/curriculum/[slug]`, click "View Lesson" on Lesson 1 (verifying the subject is added to Enrolled Subjects), and click "Take Quiz" on Lesson 4 (verifying the quiz page loads without redirecting to `?upgrade=true`).

### Tests for User Story 3 ⚠️

- [x] T017 [P] [US3] Write unit tests verifying 30-day active trial vs expired trial access in `canAccessLesson` and `canAccessSubject` (Lessons 1–8 unlocked during active trial, locked on expiry) in `__tests__/curriculum/tier-guardrails.test.ts`

### Implementation for User Story 3

- [x] T018 [P] [US3] Update `ensureSubjectEnrolledAction` in `features/curriculum/actions/curriculum.actions.ts` to pass `trialStatus.isExpired` as the 6th argument to `canAccessSubject` and allow `ADMIN` role bypass
- [x] T019 [P] [US3] Update `getLessonMaterialAction` in `features/curriculum/actions/lesson-material.actions.ts` to call `await ensureSubjectEnrolledAction(subjectSlug)` for authenticated students after verifying lesson access, and update `features/curriculum/components/LessonReaderModal.tsx` to invalidate `["student", "dashboard-data"]` when lesson material is loaded
- [x] T020 [P] [US3] Update `SubjectLessonsPage` in `app/(dashboard)/curriculum/[slug]/page.tsx` to resolve the authenticated user's active subscription/admin status and pass `isSubscribed` to `<LessonList subject={subject} isSubscribed={isSubscribed} />`
- [x] T021 [P] [US3] Update `LessonList` in `features/curriculum/components/LessonList.tsx` to derive `effectiveIsSubscribed` from `isSubscribed || user?.role === "ADMIN" || user?.subscription?.status === "ACTIVE"` and handle `?upgrade=true` in `searchParams` by opening `UpgradeModal`
- [x] T022 [US3] Update `LessonQuizPage` in `app/(dashboard)/curriculum/[slug]/quiz/[lesson]/page.tsx` to compute `trialStatus = getTrialStatus(sessionUser?.createdAt, trialDurationDays)` with resilient `AdminConfig` lookup and pass `(lessonNumber, isSubscribed, maxFreeLessons, trialStatus.isTrialActive, trialStatus.isExpired)` to `canAccessLesson`

**Checkpoint**: User Story 3 is complete — 30-day trial students and subscribers have consistent access across Lessons 1–8, and viewing a lesson or taking a quiz enrolls the subject.

---

## Phase 6: User Story 4 - Consistent DepEd DO 015 s. 2026 Grading & Personalized AI Tutoring (Priority: P2)

**Goal**: Unify all DepEd DO 015 s. 2026 grade transmutation calculations across the Dashboard Overview, Subject Progress, Recent Practice Tests, Weak Points, and Quiz Runner; protect `getSubjectProgressAction` against unauthenticated cross-user queries; and wire the student's saved `tutoringPersona` and subscription status into `QuizRunner`.

**Independent Test**: Complete a 10-question quiz with a 6/10 (60% raw) score and verify that the Quiz Summary, Recent Practice Tests, Subject Progress, and Dashboard Overview Mastery Average all display `75%` ("Competency Met"), and that `AITutorDrawer` receives the student's configured `tutoringPersona`.

### Tests for User Story 4 ⚠️

- [x] T023 [P] [US4] Write unit tests verifying unauthenticated `getSubjectProgressAction` returns empty progress and dashboard transmutation matches `calculateDepEdTransmutation` in `__tests__/curriculum/transmutation.test.ts`

### Implementation for User Story 4

- [x] T024 [P] [US4] Update `getDashboardDataAction` in `features/dashboard/actions/dashboard.actions.ts` to use `calculateDepEdTransmutation` and `getDepEdTransmutationRemarks` from `features/curriculum/utils/transmutation.ts` and wrap `prisma.adminConfig.findFirst()` in a resilient `try/catch`
- [x] T025 [P] [US4] Update `getSubjectProgressAction`, `getUserQuizAttemptsAction`, and `getSubjectWeakPointsAction` in `features/curriculum/actions/curriculum.actions.ts` to use `calculateDepEdTransmutation` from `features/curriculum/utils/transmutation.ts` and return empty progress immediately when `!sessionUser?.id` in `getSubjectProgressAction`
- [x] T026 [US4] Update `QuizRunner` in `features/curriculum/components/QuizRunner.tsx` to use `calculateDepEdTransmutation` for the results summary, set `isPremiumUser = user?.role === "ADMIN" || user?.subscription?.status === "ACTIVE"`, and pass `persona={(user?.profile?.tutoringPersona as "socratic" | "detailed" | "exam-prep") || "socratic"}` to `<AITutorDrawer />`

**Checkpoint**: User Story 4 is complete — all views compute identical DepEd DO 015 s. 2026 transmuted grades and respect student tutoring persona and subscription tier.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality verification (`lint`, `test`, `build`) and change logging in `docs/backlog.md`.

- [x] T027 Run full test suite (`npm test`), ESLint (`npm run lint`), and production build (`npm run build`) to verify zero compilation, lint, or runtime errors
- [x] T028 Mark all checklist items complete in `docs/tasks/TASK-031-fix-quiz-workflow-bugs.md` and append completion entry to `docs/backlog.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories (`T002`–`T006`).
- **Phase 3 (US1 - P1 MVP)**: Depends on Phase 2 completion.
- **Phase 4 (US2 - P1)**: Depends on Phase 2 completion — can run in parallel with US1 (`T013`–`T016` touch only `features/auth/` and `features/dashboard/components/DashboardSidebar.tsx`).
- **Phase 5 (US3 - P2)**: Depends on Phase 2 and US1 (`T009`, `T011`).
- **Phase 6 (US4 - P2)**: Depends on Phase 2 (`T005`) and integrates with `curriculum.actions.ts`, `dashboard.actions.ts`, and `QuizRunner.tsx`.
- **Phase 7 (Polish)**: Depends on Phases 3–6 completion.

### Parallel Opportunities

- **Foundational Phase**: `T004`/`T005` (`transmutation.ts`) and `T006` (`curriculum.schema.ts`) can run in parallel with `T002`/`T003` (Prisma migration).
- **Cross-Story Parallelism**: All tasks in **User Story 2** (`T013`–`T016`) touch auth/sidebar files completely disjoint from **User Story 1** (`T007`–`T012`) and can be executed in parallel.
- **Within User Story 3**: `T019` (`lesson-material.actions.ts`), `T020` (`curriculum/[slug]/page.tsx`), and `T021` (`LessonList.tsx`) touch separate files and can be executed in parallel.

---

## Parallel Example: User Story 1 & User Story 2

```bash
# Parallel Batch A (Tests First):
Task T007: "Write unit tests for getLessonsAction fallback and resilient AdminConfig in __tests__/curriculum/quiz-generation-and-session.test.ts"
Task T013: "Write unit tests for onboarding default gradeLevel + termPreference resolution in __tests__/auth/onboarding-defaults.test.ts"

# Parallel Batch B (Disjoint Implementation Files):
Task T008: "Configure maxOutputTokens: 8192 in features/curriculum/api/gemini-service.ts"
Task T014: "Invalidate ['currentUser'] & ['student', 'dashboard-data'] in features/auth/components/AuthPage.tsx"
Task T015: "Fix default SHS termPreference ('Semester 1') in features/auth/components/OnboardingModal.tsx"
Task T016: "Clear TanStack Query cache on logout in features/dashboard/components/DashboardSidebar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational Migration)

1. Complete Phase 1 (`T001`) and Phase 2 (`T002`–`T006`) to apply the missing PostgreSQL columns (`availableQuestionCounts`, `activeQuestionIndex`) and shared DepEd DO 015 transmutation utility.
2. Complete Phase 3 (User Story 1: `T007`–`T012`) to restore reliable quiz generation, lesson outline fallback, and session resumption.
3. Validate quiz creation and resumption independently.

### Incremental Delivery

1. Deliver **Phase 4 (US2)** to fix post-login/registration stale user state and onboarding semester defaults.
2. Deliver **Phase 5 (US3)** to fix 30-day free trial access to Lessons 4–8 on the quiz route and auto-enroll subjects on lesson view.
3. Deliver **Phase 6 (US4)** to unify DepEd DO 015 s. 2026 grade transmutation across the dashboard and wire saved tutoring personas into the AI Tutor.
4. Execute **Phase 7 (Polish)** (`npm test`, `npm run lint`, `npm run build`, and `docs/backlog.md`).
