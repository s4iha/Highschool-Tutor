# Feature Specification: End-to-End Quiz Generation & Student Workflow Reliability

**Feature Branch**: `008-fix-quiz-workflow-bugs`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Find what is causing the failure of the generation of the questions. Additionally, find any bugs/errors that may affect the whole workflow starting from creation of account -> onboarding -> choosing a subject -> attempting a quiz"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reliable Quiz Question Generation & Session Persistence (Priority: P1)

A student selects a DepEd K-12 or MATATAG subject and lesson, configures their desired question count and mode (Study Mode or Exam Mode), and starts a quiz. The system reliably generates or retrieves the quiz questions, creates a persistent quiz session, tracks the student's active question progress, and allows seamless resumption or targeted practice without database schema errors or silent generation failures.

**Why this priority**: Question generation and quiz execution are the core value proposition of HighSchool Tutor. Currently, unmigrated database columns (`admin_config.availableQuestionCounts` and `quiz_sessions.activeQuestionIndex`) and URL parameter mismatches (`?sessionId=` vs `?session=`) completely block quiz generation, dashboard loading, and quiz resumption.

**Independent Test**: Can be fully tested by logging in as a student, choosing a new subject and lesson, starting a 10-question quiz, answering 3 questions, closing and resuming the quiz from the Subject or Dashboard card, and submitting the quiz to receive a DepEd DO 015 s. 2026 transmuted grade.

**Acceptance Scenarios**:

1. **Given** a student selects a subject they have not previously enrolled in and clicks "Take Quiz" on Lesson 1, **When** the quiz initializes, **Then** the system reads system configuration without missing-column errors, auto-enrolls the subject into the student's enrolled list, and loads the quiz questions.
2. **Given** a subject has no cached lesson outline in the database, **When** the student opens the subject's lesson studio, **Then** the system generates the lesson outline via the primary AI engine (using minimum model `gemini-3.5-flash-lite`) and automatically falls back to the curated 8-lesson DepEd MATATAG syllabus if the AI service is temporarily unavailable.
3. **Given** a student has an in-progress quiz session or launches a Targeted Practice drill from the Diagnostic Weak Points card, **When** they click "Resume Quiz" or "Targeted Practice", **Then** the quiz page recognizes the session identifier from the URL (`session` or `sessionId`) and restores their exact question list, active question index, and saved answers rather than creating a new quiz.
4. **Given** an AI generation request encounters a transient failure or quota limit, **When** the quiz cannot be generated after retries, **Then** the student sees a clear, actionable error reason and retry option instead of a generic empty state.

---

### User Story 2 - Seamless Account Creation, Login & Onboarding State Synchronization (Priority: P1)

A new or returning student registers an account or signs in and is redirected to the Student Dashboard. Their authenticated profile state is immediately synchronized across the entire interface without requiring a manual browser refresh, and first-time students complete an accurate academic profile setup in the Onboarding modal.

**Why this priority**: Currently, visiting `/login` or `/register` caches an unauthenticated user state (`null`) for 5 minutes. Because login and registration do not invalidate this cached user state, the dashboard treats newly logged-in students as unauthenticated and fails to load dashboard metrics or quiz attempts. Additionally, the Onboarding modal defaults to an invalid Senior High / Junior High combination (`Grade 11` with `Quarter 1`).

**Independent Test**: Can be fully tested by opening `/register` in a fresh browser session, creating a new account, completing the Onboarding modal with default selections, and verifying that the Student Dashboard immediately displays the student's name, grade level, valid semester/quarter, and live dashboard metrics with zero enrolled subjects initially.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/register` or `/login` (where initial check shows no logged-in user) and submits valid credentials, **When** authentication succeeds and redirects to `/dashboard`, **Then** the client user state immediately refreshes to reflect the authenticated student and loads their live dashboard data without requiring a page reload.
2. **Given** a newly registered student opens the Onboarding modal with the default grade level (`Grade 11`), **When** they click "Get Started" without manually changing the grading period dropdown, **Then** their profile is saved with a valid Senior High grading period (`Semester 1`) matching the displayed option rather than `Quarter 1`.
3. **Given** a newly registered student completes the Onboarding modal, **When** they land on the Student Dashboard, **Then** their Enrolled Subjects list starts empty so they can freely choose their own subjects from the Curriculum Catalog.
4. **Given** an authenticated student clicks "Log Out" from the dashboard sidebar, **When** logout completes, **Then** all cached user, dashboard, and quiz attempt states are cleared before returning to `/login`.

---

### User Story 3 - Accurate Subject Enrollment & 30-Day Free Trial Lesson Access (Priority: P2)

A student in their active 30-day free trial (or with an active subscription) browses the Curriculum Catalog, explores subject outlines, reads lesson study materials, and takes quizzes across all lessons (Lessons 1–8) with consistent entitlement rules and accurate subject enrollment tracking.

**Why this priority**: Currently, students in their active 30-day free trial see Lessons 4–8 unlocked on the subject page, but clicking "Take Quiz" on Lessons 4–8 triggers a server-side redirect blocking them because the quiz route omits the student's trial status. Furthermore, reading a lesson does not enroll the subject, and active subscribers do not have their subscription status passed to the lesson studio or translation controls.

**Independent Test**: Can be tested by taking a student within their 30-day free trial, opening a subject from the catalog, clicking "View Lesson" on Lesson 1 (verifying the subject appears in Enrolled Subjects), and clicking "Take Quiz" on Lesson 4 (verifying the quiz loads without redirecting back to an upgrade prompt).

**Acceptance Scenarios**:

1. **Given** a student browses a subject outline at `/curriculum/[slug]`, **When** they only view the lesson list without opening a lesson or starting a quiz, **Then** the subject is not yet added to their Enrolled Subjects list.
2. **Given** a student is on `/curriculum/[slug]`, **When** they click "View Lesson" to study lesson material or click "Take Quiz" to start a drill, **Then** the system automatically enrolls the subject into their Enrolled Subjects list (subject to active trial or subscription entitlements).
3. **Given** a student is within their active 30-day free trial or holds an active subscription, **When** they navigate to `/curriculum/[slug]/quiz/[lesson]` for any lesson (including Lessons 4 and above), **Then** the server-side access guard permits entry and loads the quiz runner.
4. **Given** a student's 30-day free trial has expired and they do not have an active subscription, **When** they attempt to enroll a new subject, read lesson material, or start a quiz, **Then** the system consistently enforces the trial expiration gate and prompts them to upgrade.

---

### User Story 4 - Consistent DepEd DO 015 s. 2026 Grading & Personalized AI Tutoring (Priority: P2)

A student completes quizzes and uses the AI Tutor during Study Mode. Their Mastery Average on the Dashboard Overview matches the official DepEd Order No. 015, s. 2026 transmutation scale used in the Quiz Runner and Recent Practice Tests list, and the AI Tutor respects the student's saved tutoring persona and subscription tier.

**Why this priority**: Currently, the Dashboard Overview uses a linear formula (`60 + raw% * 0.40`) where a 38% raw score is displayed as 75.2% ("Competency Met") and a 60% raw score is displayed as 84%, contradicting the official DepEd DO 015 s. 2026 piecewise transmutation formula (`60% raw = 75% passing`) shown in the Quiz Runner and Recent Practice Tests list. Additionally, the Quiz Runner hardcodes the AI Tutor persona to `"socratic"` instead of using the student's saved preference.

**Independent Test**: Can be tested by completing a 10-question quiz with a score of 6/10 (60% raw), verifying that both the Quiz Results card, the Recent Practice Tests list, and the Dashboard Overview Mastery Average display `75%` ("Competency Met"), and verifying that changing the tutoring persona in Settings updates the AI Tutor behavior in the Quiz Runner.

**Acceptance Scenarios**:

1. **Given** a student completes a quiz with a 60% raw score (e.g., 6 out of 10), **When** viewing the Quiz Summary, Recent Practice Test Transmutations, Subject Progress, and Dashboard Overview Mastery Average, **Then** all four views consistently compute a transmuted grade of `75%` under DepEd DO 015 s. 2026.
2. **Given** a student selects a tutoring persona (`Socratic`, `Detailed Explanation`, or `Exam Prep`) in Student Settings, **When** they open the AI Tutor drawer during a Study Mode quiz, **Then** the AI Tutor initializes with and applies their chosen persona.
3. **Given** a student has an active subscription (or Admin role), **When** they use dialect translation controls in the Quiz Runner or view the Subject Lesson List, **Then** premium dialect options and full-access badges reflect their active subscription status.

---

### Edge Cases

- **Unauthenticated or Expired Session on Subject Progress**: If a user's session expires while querying subject progress, the system MUST return an empty progress object rather than querying quiz attempts across all users without a user filter.
- **Database Configuration Unavailable or Missing Row**: If the system configuration record is missing or a database query fails when checking admin settings, the dashboard and enrollment checks MUST gracefully fall back to standard defaults (`30-day trial`, `8 target lessons`, `5, 10, 15, 20 question counts`) rather than crashing the page or blocking quiz creation.
- **Custom Admin Question Counts**: If an administrator configures custom question count options (e.g., `5, 10, 15, 20`), the quiz session creator MUST validate requested counts against the configured options rather than only a hardcoded array.
- **AI Service Rate Limit or Timeout on Lesson Outline**: If the primary AI service (`gemini-3.5-flash-lite` or higher) fails or times out when generating a subject's lesson outline, the system MUST transparently fall back to the curated 8-lesson DepEd MATATAG syllabus so the student is never stranded on an empty subject page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The persistence layer MUST synchronize all schema fields required by system configuration (`availableQuestionCounts`) and quiz session tracking (`activeQuestionIndex` and composite completion index) via tracked, idempotent database migrations so no `ColumnNotFound` errors occur at runtime.
- **FR-002**: System configuration lookups in dashboard aggregation and subject enrollment MUST be resilient, falling back to default DepEd MATATAG parameters if the configuration query fails.
- **FR-003**: When loading lessons for a subject with no cached lesson outline, the system MUST use the Gemini AI lesson generator (`gemini-3.5-flash-lite` minimum model) as the primary generator and fall back to the curated 8-lesson DepEd MATATAG syllabus from the static scope catalog only if the AI call fails.
- **FR-004**: Quiz generation and AI tutoring services MUST use `gemini-3.5-flash-lite` as the minimum baseline model and propagate descriptive, retryable error messages to the student interface if generation fails after retries.
- **FR-005**: Successful login and account registration MUST immediately invalidate and refresh the client's current-user query cache before or upon navigating to the dashboard, and logout MUST clear cached user, dashboard, and quiz state.
- **FR-006**: The Onboarding modal MUST initialize its default grading period (`Semester 1`) to match its default Senior High grade level (`Grade 11`), invalidate dashboard data upon completion, and leave the student's Enrolled Subjects list empty so they can choose subjects freely.
- **FR-007**: The system MUST automatically enroll a subject into the student's Enrolled Subjects list (`trial_subjects`) when the student opens a lesson (`View Lesson`) or starts/completes a quiz (`Take Quiz`), while allowing passive browsing of the subject's lesson outline without consuming enrollment.
- **FR-008**: Server-side and client-side lesson/subject access checks MUST consistently pass the student's active subscription status, 30-day free trial active status, and trial expiration status across the Subject Lesson List, Lesson Material Reader, Quiz Page route guard, and Quiz Session creation action.
- **FR-009**: The Quiz Page route and Quiz Runner MUST accept both `session` and `sessionId` URL query parameters so that "Resume Quiz" and "Targeted Practice" links restore the intended server-locked quiz session.
- **FR-010**: All grade transmutation calculations across the Dashboard Overview, Subject Progress, Recent Practice Tests, Weak Points diagnostics, and Quiz Runner MUST use the identical DepEd Order No. 015, s. 2026 piecewise transmutation formula (where 60% raw score transmutes to the 75% passing threshold).
- **FR-011**: Subject progress queries MUST strictly require an authenticated user ID and return empty progress when unauthenticated, preventing cross-user attempt aggregation.
- **FR-012**: The Quiz Runner MUST pass the authenticated student's saved `tutoringPersona` preference to the AI Tutor drawer and recognize active subscribers (`status === "ACTIVE"`) alongside administrators for premium dialect translation controls.

### Key Entities *(include if feature involves data)*

- **AdminConfig**: System-wide configuration storing pricing, trial duration (`trialDurationDays`), curriculum scope (`targetLessonsPerSubject`, `maxTrialSubjects`, `maxFreeLessons`), and allowed quiz lengths (`availableQuestionCounts`).
- **QuizSession**: Server-locked active or completed quiz instance storing the sampled `questions`, `userAnswers`, `activeQuestionIndex`, `questionCount`, `mode`, `score`, and `completedAt` timestamp.
- **Profile**: Student academic profile storing `fullName`, `gradeLevel`, `track`, `termPreference` (`Quarter 1–4` for JHS or `Semester 1–2` for SHS), `tutoringPersona`, and `hasOnboarded`.
- **TrialSubject**: Enrollment record linking a student (`userId`) to an active subject (`subjectSlug`) once they view a lesson or start a quiz.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of dashboard loads, subject enrollments, and quiz session creations execute with zero database missing-column (`P2022`) errors.
- **SC-002**: 100% of newly registered and newly logged-in students see their authenticated profile and dashboard metrics load immediately on `/dashboard` without a manual browser refresh.
- **SC-003**: 100% of students completing Onboarding with default Senior High settings are saved with a valid Senior High semester (`Semester 1`) and 0 pre-enrolled subjects.
- **SC-004**: 100% of students within an active 30-day free trial or active subscription can open lessons and start quizzes on Lessons 1 through 8 without unexpected paywall redirects.
- **SC-005**: 100% of "Resume Quiz" and "Targeted Practice" actions restore the existing quiz session's questions, active question index, and saved answers.
- **SC-006**: Transmuted grades displayed on the Dashboard Overview match the Quiz Runner and Recent Practice Tests views with 100% mathematical consistency under DepEd DO 015, s. 2026.

## Assumptions

- The minimum supported Google Gemini model for all AI generation and tutoring tasks in this environment is `gemini-3.5-flash-lite`.
- During an active 30-day free trial, students have full access to lessons and quizzes across the curriculum; once the 30-day trial expires, an active subscription is required.
- All database schema synchronization must be committed as formal SQL migration files under `prisma/migrations/` in accordance with workspace migration discipline.
