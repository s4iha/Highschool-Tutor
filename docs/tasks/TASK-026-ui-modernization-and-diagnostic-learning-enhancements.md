# Task 026 - UI Modernization and Diagnostic Learning Enhancements

**Skills to be used**: `frontend-ui-engineering`, `design-taste-frontend`, `high-end-visual-design`, `redesign-existing-projects`, `senior-backend`, `security-and-hardening`, `security-compliance`, `prompt-engineer`, `prompt-engineering-patterns`, `test-driven-development`, `code-review-and-quality`, `atomic-commit`, `color-theory`, `dark-mode-generation`

---

## Description

Implement the comprehensive architectural upgrade and user-experience modernization across 9 critical areas of HighSchool Tutor as specified in `specs/002-ui-and-learning-enhancements/`:

1. **Modernized Subject Cards & Fluid Responsive Grid**:
   - Eliminate vertical jumping (`hover:-translate-y-1` replaced with `translate-y-0`).
   - Implement smooth Tailwind CSS v4 elevation shadows (`hover:shadow-md dark:hover:shadow-xl hover:border-primary/50`).
   - Standardize internal Job-Card visual rhythm: discipline icon/monogram badge, term/status pill, bold title with 2-line clamping, structured academic metadata tags (Grade Level, Track/Strand, DepEd MATATAG), curriculum scope metric (`X Lessons • DepEd DO 015 Aligned`), and high-contrast action button.
   - Refactor grid into a fluid layout: 1 col on mobile (<640px), 2 cols on tablet (640px-1023px), 3 cols on desktop (1024px-1535px), and 4 cols on ultra-wide screens (≥1536px up to `max-w-[1600px]`).

2. **Consolidated Single-Bar Filter**:
   - Unify the current 4-to-5 stacked filter rows into a single compact, sticky toolbar (`sticky top-16 z-20 backdrop-blur-md py-2.5`).
   - Segmented primary level switch (`All`, `Junior High School`, `Senior High School`).
   - Contextual secondary popover dropdowns: `Quarter` (Quarters 1–4) for JHS; `Semester` (Sem 1, Sem 2) and `Strand` (STEM, ABM, HUMSS, GAS, TVL) for SHS.
   - Integrated search input with instant debounced filtering, active filter count badge, and a 1-click "Reset Filters" button, cutting vertical screen height by >50%.

3. **Subject Detail Header Typography & Decluttering**:
   - Declutter the crowded 4-badge row on `/curriculum/[slug]` (`LessonList.tsx`).
   - Format curriculum metadata into a crisp typographic eyebrow line (`CODE • Level • Grade — Term`).
   - Reserve the badge container slot exclusively for the student's access/trial state (`30-Day Free Trial (Xd Left)`, `Subscription Active`, or `Trial Expired`).

4. **Annual Pass Brand Icon Upgrade**:
   - Upgrade the Annual Unlimited Pass card header in `CheckoutModal.tsx` from the generic `<Sparkles>` icon to the prestigious `<Crown>` icon from `lucide-react` styled in gold/amber (`text-amber-500 fill-amber-500/20`).
   - Reinforce VIP tier positioning alongside the highlighted `Save ₱1,089` annual discount badge.

5. **30-Day Free Trial Hard Gate & 7-Day Expiration Notice**:
   - Enforce contextual access hard gate: allow discovery browsing of catalog and dashboard with lock badges, but strictly block lesson reading, quiz starts, and AI tutor queries once an account exceeds 30 calendar days without an active subscription.
   - Implement `/api/cron/trial-reminders` endpoint secured by `Bearer CRON_SECRET` to identify accounts with exactly 7 days remaining (Day 23 of 30).
   - Dispatch advance reminder emails with direct upgrade links via modular email transport (`features/billing/services/email-service.ts` supporting Resend API in production with console logger fallback in development).
   - Record notices in PostgreSQL (`ReminderNotice` table) with composite uniqueness to guarantee 100% idempotent execution with zero duplicate emails.

6. **Multilingual Translation Integrity**:
   - Refactor `batchTranslateQuizQuestion` in `features/curriculum/api/gemini-service.ts` to translate ONLY the question stem and explanation when switching to Philippine dialects (Taglish, Cebuano, Ilocano).
   - Strictly preserve multiple-choice options A, B, C, and D in 100% original English across all dialects, protecting technical formulas, algebraic variables, and scientific nomenclature from corruption.
   - Validate LaTeX syntax parity (`$...$` and `$$...$$`) and implement in-memory caching (`${language}:${question}`).

7. **Question-Level Socratic AI Context**:
   - Refactor `buildTutorSystemPrompt` in `features/curriculum/api/gemini-service.ts` to anchor Gemini guidance specifically to the active question's numbers, variables, and competency, eliminating generic subject-wide lectures.
   - Enforce strict Socratic hints without giving away correct option letters or final values.
   - Update `AITutorDrawer.tsx` to render an active question indicator banner (`Anchored to Question #{index + 1}`), question preview snippet, and question-specific quick prompts that dynamically shift as the student navigates between questions.

8. **Quiz State Auto-Persistence & Resumption ('Continue Quiz')**:
   - Add `activeQuestionIndex Int @default(0)` and index `@@index([userId, completedAt, createdAt])` to `QuizSession` in `prisma/schema.prisma`.
   - Implement typed Server Actions (`saveQuizProgressAction`, `getActiveQuizSessionAction`, `discardQuizSessionAction`) with 300ms debounced saving on option selection.
   - Build dual-surface `ActiveQuizResumptionCard.tsx` on the Student Dashboard (`/dashboard`) and Subject Curriculum page (`/curriculum/[slug]`) allowing 1-click resumption with restored answers and cursor position, or session discard.
   - Maintain strict Exam Mode security: correct answers and explanations remain hidden on the server until official submission.

9. **Diagnostic 'Weak Points' by Topic & Targeted Practice**:
   - Implement `getSubjectWeakPointsAction` in `features/curriculum/actions/curriculum.actions.ts` using the **Latest Attempt Rule** against DepEd DO 015 s. 2026 standards (transmuted passing threshold < 75%).
   - Extract sub-topic `keyConcepts` tags from `CachedLesson` for actionable study guidance.
   - Create `SubjectWeakPointsCard.tsx` on `/curriculum/[slug]` with a 1-click `Practice This Topic` CTA that initializes an immediate 10-question Study Mode quiz session.
   - Retaking the quiz with a passing score (≥ 75%) immediately clears the topic from Weak Points.

---

## Skills Allocation Matrix

| Task Group | Skill(s) Allocated | Primary Focus & Deliverables |
| :--- | :--- | :--- |
| **1. UI Modernization & Responsive Grid** (Subject Cards, Single-Bar Filter, Header Typography, Crown Icon) | `frontend-ui-engineering`<br>`design-taste-frontend`<br>`high-end-visual-design`<br>`redesign-existing-projects` | - Remove `hover:-translate-y-1` and apply smooth Tailwind v4 shadow transitions.<br>- Build fluid responsive grid (1, 2, 3, 4 columns).<br>- Consolidate 5-row filter into single sticky toolbar with contextual popovers.<br>- Format academic eyebrow typography and single access badge in `LessonList.tsx`.<br>- Upgrade `CheckoutModal.tsx` Annual Pass to gold/amber `Crown` icon. |
| **2. Backend Persistence, Hard Gate & Cron** (Auto-Persistence, Resumption, Trial Hard Gate, Reminder Cron) | `senior-backend`<br>`security-and-hardening`<br>`security-compliance` | - Add `activeQuestionIndex` to `QuizSession` in `prisma/schema.prisma`.<br>- Implement `saveQuizProgressAction`, `getActiveQuizSessionAction`, `discardQuizSessionAction`.<br>- Implement `/api/cron/trial-reminders` route verifying `CRON_SECRET`.<br>- Build modular `email-service.ts` adapter (Resend + console logger).<br>- Enforce idempotent logging via `ReminderNotice`.<br>- Enforce 30-day hard gate in `tier-guardrails.ts`. |
| **3. AI Pedagogy & Localization Integrity** (Question-Level Socratic Context, English Option Preservation) | `prompt-engineer`<br>`prompt-engineering-patterns` | - Restructure `buildTutorSystemPrompt` to anchor strictly to active question numbers, variables, and competency.<br>- Update `batchTranslateQuizQuestion` to translate only stem and explanation, keeping options A, B, C, D 100% in English.<br>- Validate KaTeX LaTeX syntax preservation (`$...$`, `$$...$$`).<br>- Add question anchor indicators and context updating in `AITutorDrawer.tsx`. |
| **4. Diagnostic Learning & Targeted Practice** (Topic Weak Points, DepEd DO 015 Transmutation, 1-Click Practice) | `senior-backend`<br>`frontend-ui-engineering` | - Implement `getSubjectWeakPointsAction` using the Latest Attempt Rule.<br>- Compute DO 015 s. 2026 transmuted scores (< 75% threshold).<br>- Extract sub-topic `keyConcepts` from `CachedLesson`.<br>- Build `SubjectWeakPointsCard.tsx` with 1-click targeted quiz launcher.<br>- Verify retake pass (≥ 75%) immediately clears weak points. |
| **5. Testing, Verification & Task Management** (E2E Verification, Task Tracking, Atomic Git Commits) | `test-driven-development`<br>`code-review-and-quality`<br>`atomic-commit` | - Run unit tests for transmutation, guardrails, and translation integrity.<br>- Execute end-to-end manual checks per `quickstart.md`.<br>- Create `docs/tasks/TASK-026-ui-modernization-and-diagnostic-learning-enhancements.md`.<br>- Log changes in `docs/backlog.md`.<br>- Execute atomic git commits adhering to conventional commit specs. |

---

## Implementation Tasks

### Phase 1: Setup & Environment
- [x] T001 Update Prisma schema in `prisma/schema.prisma` to add `activeQuestionIndex Int @default(0)` and index `@@index([userId, completedAt, createdAt])` to `QuizSession`, and add index `@@index([userId, kind])` to `ReminderNotice`.
- [x] T002 Apply database migration sync and regenerate client via `npx prisma db push` and `npx prisma generate` in `prisma/schema.prisma`.
- [x] T003 Verify environment variable declarations in `.env.example` adding `CRON_SECRET` and optional `RESEND_API_KEY` configurations.

### Phase 2: Foundational Prerequisites
- [x] T004 Create modular email transport service in `features/billing/services/email-service.ts` supporting Resend API in production with console logger fallback for local development.
- [x] T005 Define shared curriculum domain and filter types in `features/curriculum/types/curriculum.types.ts` (`WeakPointTopic`, `SubjectWeakPointsResult`, `CatalogFilterState`, `SubjectCardPresentation`, `TranslatableQuizQuestion`).
- [x] T006 Define quiz session persistence and resumption types in `features/curriculum/types/quiz-session.types.ts` (`ActiveQuizSessionInfo`, `SaveQuizProgressInput`, `ActiveQuizSessionSummary`).
- [x] T007 Define Zod validation schemas for translations, filters, and weak points in `features/curriculum/schemas/curriculum.schemas.ts`.
- [x] T008 Update 30-day hard gate access logic in `features/curriculum/utils/tier-guardrails.ts` (`canAccessLesson`) to strictly lock lessons, quizzes, and AI tutor for expired trialists without active subscriptions.

### Phase 3: User Story 1 (Priority: P1) - 30-Day Free Trial Hard Gate & 7-Day Expiration Notice 🎯 MVP
- [x] T009 Write unit tests for 30-day hard gate access control and 7-day expiration eligibility in `tests/unit/trialGuardrailsAndCron.test.ts`.
- [x] T010 Implement `/api/cron/trial-reminders` route in `app/api/cron/trial-reminders/route.ts` validating Bearer `CRON_SECRET`, scanning 23-day accounts, dispatching emails via `email-service.ts`, and persisting `ReminderNotice` records for idempotency.
- [x] T011 Enforce server-side `canAccessLesson` hard-gate verification in `features/curriculum/actions/lesson-material.actions.ts` returning `TRIAL_EXPIRED` error code when trial is expired.
- [x] T012 Enforce server-side trial status verification in `createQuizSessionAction` in `features/curriculum/actions/quiz-session.actions.ts` blocking study and exam quiz starts for expired trialists with `TRIAL_EXPIRED`.
- [x] T013 Enforce server-side trial verification in `askTutorAction` in `features/curriculum/actions/curriculum.actions.ts` rejecting AI tutoring requests for expired trialists with `TRIAL_EXPIRED`.
- [x] T014 Integrate client-side paywall interceptor in `features/curriculum/components/LessonList.tsx`, `QuizRunner.tsx`, and `AITutorDrawer.tsx` to automatically trigger `openUpgradeModal` upon catching `TRIAL_EXPIRED`.

### Phase 4: User Story 2 (Priority: P1) - Language Translation Integrity
- [x] T015 Write unit tests for translation integrity, English option preservation, and LaTeX syntax protection in `tests/unit/translationIntegrity.test.ts`.
- [x] T016 Refactor `batchTranslateQuizQuestion` in `features/curriculum/api/gemini-service.ts` to instruct Gemini to translate ONLY stem and explanation while strictly preserving options A, B, C, D in 100% English.
- [x] T017 Add LaTeX delimiter count parity validation (`$...$`, `$$...$$`) and in-memory caching (`${language}:${question}`) in `features/curriculum/api/gemini-service.ts`.
- [x] T018 Update `batchTranslateAction` in `features/curriculum/actions/curriculum.actions.ts` to validate inputs using `batchTranslateQuizInputSchema` and return verified translated items.
- [x] T019 Integrate translated question rendering into `features/curriculum/components/QuizRunner.tsx` ensuring KaTeX expressions render without errors for both translated stems and English options.

### Phase 5: User Story 3 (Priority: P2) - Question-Level Socratic AI Context
- [x] T020 Write unit tests for Socratic prompt construction and active question anchoring in `tests/unit/socraticPrompt.test.ts`.
- [x] T021 Refactor `buildTutorSystemPrompt` in `features/curriculum/api/gemini-service.ts` to anchor strictly to active question numbers, variables, and competency, enforcing Socratic hints and prohibiting revealing correct answers.
- [x] T022 Update `features/curriculum/components/AITutorDrawer.tsx` to add dynamic active question banner (`Anchored to Question #{activeQuestionIndex + 1}`), question snippet preview, and question-specific quick action prompt buttons.
- [x] T023 Update question transition listener in `features/curriculum/components/QuizRunner.tsx` to pass active question index and details into `AITutorDrawer` whenever the student navigates between questions.

### Phase 6: User Story 4 (Priority: P2) - Quiz State Auto-Persistence & Resumption ('Continue Quiz')
- [x] T024 Write unit tests for quiz progress auto-persistence, cursor resumption, and session discard in `tests/unit/quizPersistence.test.ts`.
- [x] T025 Implement `saveQuizProgressAction` in `features/curriculum/actions/quiz-session.actions.ts` with Zod validation, user ownership verification, and active cursor + userAnswers JSON updates.
- [x] T026 Implement `getActiveQuizSessionAction` and `discardQuizSessionAction` in `features/curriculum/actions/quiz-session.actions.ts` with 14-day recency window and answer counting logic.
- [x] T027 Update `getQuizSessionAction` in `features/curriculum/actions/quiz-session.actions.ts` to restore `activeQuestionIndex` and `userAnswers`, while keeping correct answers and explanations hidden in incomplete Exam Mode.
- [x] T028 Create `ActiveQuizResumptionCard.tsx` component in `features/curriculum/components/ActiveQuizResumptionCard.tsx` displaying mode, lesson title, progress count, Resume button, and Discard button.
- [x] T029 Integrate auto-save debouncing (300ms) and initial cursor/answers restoration into `features/curriculum/components/QuizRunner.tsx`.
- [x] T030 Embed `ActiveQuizResumptionCard` on Student Dashboard in `app/(student)/dashboard/page.tsx`.
- [x] T031 Embed `ActiveQuizResumptionCard` on Subject Curriculum page in `app/(student)/curriculum/[slug]/page.tsx`.

### Phase 7: User Story 5 (Priority: P3) - Responsive Subject Cards UI Overhaul & Fluid Grid
- [x] T032 Implement modernized subject card component with zero Y-translation, smooth Tailwind v4 shadow elevation (`hover:shadow-md dark:hover:shadow-xl`), and job-card header/body/footer structure in `features/curriculum/components/SubjectCatalog.tsx`.
- [x] T033 Implement fluid responsive grid container (1 col mobile, 2 col tablet, 3 col desktop, 4 col ultra-wide up to `max-w-[1600px]`) in `features/curriculum/components/SubjectCatalog.tsx`.
- [x] T034 Verify subject discipline monograms, term pills, academic tags (Grade, Track, MATATAG), and lesson metrics baselines across cards in `features/curriculum/components/SubjectCatalog.tsx`.

### Phase 8: User Story 6 (Priority: P3) - Streamlined Catalog Filtering & Decluttered Badges
- [x] T035 Consolidate multi-row filter bar into a single-row sticky toolbar with segmented level toggle (`All`, `JHS`, `SHS`), contextual dropdown popovers (JHS Quarters, SHS Semesters/Strands), integrated search input, active filter counter, and 1-click reset in `features/curriculum/components/SubjectCatalog.tsx`.
- [x] T036 Declutter subject detail header in `features/curriculum/components/LessonList.tsx` by replacing the 4-badge row with academic eyebrow metadata typography (`CODE • Level • Grade — Term`) and reserving the badge container exclusively for single access/trial status.

### Phase 9: User Story 7 (Priority: P4) - Diagnostic 'Weak Points' by Topic & Targeted Practice
- [x] T037 Write unit tests for DepEd DO 015 s. 2026 transmutation, Latest Attempt Rule deduplication, and weak points detection in `tests/unit/weakPoints.test.ts`.
- [x] T038 Implement `getSubjectWeakPointsAction` in `features/curriculum/actions/curriculum.actions.ts` evaluating the most recent quiz attempt per lesson topic, checking against the < 75% transmuted passing threshold, and extracting sub-topic keyConcepts.
- [x] T039 Implement `createTargetedPracticeAction` in `features/curriculum/actions/curriculum.actions.ts` to configure an immediate 10-question Study Mode remedial quiz session for a flagged weak topic.
- [x] T040 Create `SubjectWeakPointsCard.tsx` in `features/curriculum/components/SubjectWeakPointsCard.tsx` rendering topic title, score badge, sub-topic keyConcepts tags, 1-click "Practice This Topic" CTA, and an encouraging zero-weak-points state.
- [x] T041 Embed `SubjectWeakPointsCard` into the Subject Detail Page in `app/(student)/curriculum/[slug]/page.tsx` and verify that passing retakes (≥75%) immediately clear the topic from weak points.

### Phase 10: User Story 8 (Priority: P5) - Annual Pass Brand Icon Upgrade
- [x] T042 Update `features/billing/components/CheckoutModal.tsx` to replace the `<Sparkles>` icon with `<Crown>` from `lucide-react`, styled in prestigious gold/amber (`text-amber-500 fill-amber-500/20`), on the Annual Unlimited Pass card.
- [x] T043 Verify visual tier distinction and savings badge (`Save ₱1,089`) between Monthly and Annual cards in `features/billing/components/CheckoutModal.tsx`.

### Phase 11: Polish, Quality Assurance & Verification
- [x] T044 Run strict TypeScript typecheck (`npx tsc --noEmit`) and fix any type discrepancies across all feature files.
- [x] T045 Run ESLint linter (`npm run lint`) and resolve any code style, unused variable, or formatting warnings.
- [x] T046 Execute automated Jest test suite (`npm test`) ensuring all unit tests pass cleanly with 100% success.
- [x] T047 Validate all 9 verification scenarios in `specs/002-ui-and-learning-enhancements/quickstart.md`.
- [x] T048 Document task completion summary and log entry in `docs/backlog.md`.

---

## Verification Checklist

### Functional Verification
- [x] **SC-001**: Expired trial users (> 30 days, no active subscription) are strictly blocked from lessons, quizzes, and AI tutor via the hard paywall gate.
- [x] **SC-002**: `/api/cron/trial-reminders` dispatches 7-day expiration reminder emails idempotently, logging records in `ReminderNotice` with 0 duplicate notices on rerun.
- [x] **SC-003**: 100% of translated quiz questions (Taglish, Cebuano, Ilocano) maintain options A, B, C, and D strictly in original English.
- [x] **SC-004**: 100% of mathematical formulas in translated stems and explanations render cleanly via KaTeX without syntax or delimiter errors.
- [x] **SC-005**: 100% of AI Tutor responses in Study Mode anchor directly to the active question's numbers, variables, and competency without giving away answers.
- [x] **SC-006**: Student answers are auto-saved incrementally to `QuizSession`; incomplete quizzes surface a dual-surface "Continue Quiz" resumption banner on Dashboard and Subject pages.
- [x] **SC-007**: Subject catalog card hover elevation animates smoothly with zero vertical translation (`translate-y: 0px`).
- [x] **SC-008**: Fluid responsive grid reflows seamlessly across 360px (1 col), 768px (2 col), 1280px (3 col), and 1920px (4 col) viewports.
- [x] **SC-009**: Catalog filter vertical footprint is reduced by >50% via the consolidated single-row sticky toolbar with contextual popovers.
- [x] **SC-010**: Lesson topics with latest transmuted score < 75% render as Weak Points with Key Concept tags and 1-click targeted practice; retake passing score (≥ 75%) immediately clears the weak point.
- [x] **SC-011**: Annual Pass card in `CheckoutModal.tsx` displays the `<Crown>` icon with gold/amber styling.

### Code Quality & Build Verification
- [x] `npx tsc --noEmit` exits with 0 errors
- [x] `npm run lint` passes cleanly
- [x] `npm test` passes cleanly
- [x] `npm run build` succeeds without compilation errors
