# Task 031 - End-to-End Quiz Generation & Student Workflow Reliability

**Skills to be used**: `task-implementation`, `systematic-debugging`, `senior-backend`, `frontend-ui-engineering`, `design-taste-frontend`, `color-theory`, `dark-mode-generation`, `security-and-hardening`, `test-driven-development`, `code-review-and-quality`.

## Description

Fix the failure of quiz question generation (`P2022 ColumnNotFound: admin_config.availableQuestionCounts` and unmigrated `quiz_sessions.activeQuestionIndex`) and resolve all identified bugs and friction points affecting the complete student lifecycle: Account Creation (`/register`) -> Onboarding (`OnboardingModal`) -> Choosing a Subject (`/curriculum` and `/curriculum/[slug]`) -> Attempting a Quiz (`/curriculum/[slug]/quiz/[lesson]`).

### Root Causes Addressed:
1. **Unmigrated Database Columns & Indexes**:
   - `admin_config.availableQuestionCounts` exists in `schema.prisma` but was missing from PostgreSQL migrations, causing `getDashboardDataAction` and `ensureSubjectEnrolledAction` to throw `P2022 ColumnNotFound`.
   - `quiz_sessions.activeQuestionIndex` was missing from PostgreSQL migrations, crashing quiz session persistence.
   - Missing indexes on `quiz_sessions(userId, completedAt, createdAt)` and `reminder_notices(userId, kind)`.
2. **Gemini Lesson Generation & Question Pool Truncation**:
   - Missing `maxOutputTokens: 8192` in `gemini-service.ts` for 24-question pools.
   - Missing fallback to curated MATATAG syllabus in `getLessonsAction` if AI generation fails or encounters transient network errors.
3. **Stale Query Caches on Auth Transitions**:
   - `RootLayout` loads `<OnboardingModal />`, calling `useUser()` on `/login` and `/register` and caching `{ user: null }` for 5 minutes.
   - Successful login/registration and onboarding failed to invalidate `["currentUser"]` and `["student", "dashboard-data"]`.
   - Logout failed to clear the TanStack Query cache.
4. **Onboarding Grading Period Mismatch**:
   - Default `Grade 11` initialized with `"Quarter 1"` instead of `"Semester 1"`.
   - `curriculum.schema.ts` regex rejected `Semester [1-2]`.
5. **30-Day Free Trial & Subject Enrollment Access**:
   - Auto-enrollment missing on "View Lesson" (`getLessonMaterialAction`).
   - `LessonQuizPage` passed truncated trial status to `canAccessLesson`, blocking 30-day trial students from taking quizzes on Lessons 4–8.
   - `LessonList` lacked `isSubscribed` resolution.
6. **Inconsistent Grading & Unauthenticated Progress Queries**:
   - `dashboard.actions.ts` used a legacy linear formula (`60 + raw% * 0.40`) while other components used DepEd DO 015 s. 2026 piecewise transmutation.
   - `getSubjectProgressAction` lacked an unauthenticated guard (`!sessionUser?.id`), running pointless DB queries.
   - `QuizRunner` lacked student tutoring persona integration and proper subscription tier detection.

## Verification Checklist

- [x] Database migration `20261124130000_sync_admin_config_and_quiz_sessions` deployed successfully.
- [x] DepEd DO 015 s. 2026 piecewise transmutation utility implemented and tested (`0% -> 60`, `60% -> 75`, `100% -> 100`).
- [x] `curriculum.schema.ts` regex accepts `Quarter [1-4]`, `Trimester [1-3]`, and `Semester [1-2]`.
- [x] Unit tests for quiz generation, lesson fallback, and resilient admin config pass.
- [x] `gemini-service.ts` configured with `maxOutputTokens: 8192`.
- [x] `getLessonsAction` falls back to curated MATATAG syllabus on error.
- [x] Resilient `try/catch` wraps `AdminConfig` queries in `curriculum.actions.ts`, `quiz-session.actions.ts`, and `dashboard.actions.ts`.
- [x] Quiz route and `QuizRunner` accept both `?session=` and `?sessionId=`.
- [x] Onboarding defaults to `Semester 1` for Senior High (Grade 11/12) and `Quarter 1` for Junior High (Grade 7-10).
- [x] Auth login, registration, and onboarding invalidate TanStack Query caches immediately.
- [x] Logout clears the TanStack Query client cache.
- [x] Active 30-day trial students can access and take quizzes for Lessons 1–8 without false paywall redirects.
- [x] Viewing a lesson (`getLessonMaterialAction`) auto-enrolls the subject.
- [x] Transmuted grades match DepEd DO 015 s. 2026 across Dashboard, Subject Progress, Weak Points, and Quiz Runner.
- [x] Student tutoring persona (`socratic`, `detailed`, `exam-prep`) passed into AI Tutor drawer.
- [x] Full build (`npm run build`), lint (`npm run lint`), and tests (`npm test`) pass with zero errors.
