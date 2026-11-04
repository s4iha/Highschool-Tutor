# Task 030 - Subject Scope 8-Lesson Syllabus Breakdown, Public Catalog Deduplication (108 Subjects), Hydration Fixes, Mastery-First Framing & Targeted Practice Optimization

**Skills to be used**: `frontend-ui-engineering`, `design-taste-frontend`, `color-theory`, `dark-mode-generation`, `senior-backend`, `systematic-debugging`, `test-driven-development`, `code-review-and-quality`, `seo`, `task-implementation`

## Description

Implement the core curriculum, architectural, visual alignment, and diagnostic learning enhancements specified in `specs/007-scope-dedup-landing-fixes/spec.md`:

1. **Full Curriculum Scope & 8-Lesson Syllabus Breakdown on `/subjects/[slug]` (US1 - Priority P1)**:
   - Provide complete 8-lesson syllabus breakdown for all 108 DepEd MATATAG subjects (Lessons 1–8 with lesson index, title, 2–3 sentence topic summary, 3–5 key concept tags, and 3 practice drills totaling 24 drills per subject).
   - Provide an interactive **Grade (Grades 7–10) & Quarter (Quarters 1–4) Switcher** for the 8 Junior High School Core subjects (`ENG`, `FIL`, `MATH`, `SCI`, `AP`, `ESP`, `MAPEH`, `TLE`) that dynamically updates competencies, 8-lesson syllabus, and practice CTA links (`/curriculum/g{7..10}-q{1..4}-{abbr}`) without page reloads.

2. **Deduplicated Public Catalog (`/subjects`: 324 → 108 Subjects) (US2 - Priority P1)**:
   - Deduplicate `/subjects` from 324 redundant items to exactly **108 distinct subjects** (8 JHS Core covering Grades 7–10 • Quarters 1–4 + 100 Senior High School subjects), eliminating all 96 legacy trimester cards (`T1–T3`) and redundant quarterly cards from the grid.
   - Update `getAllSubjectScopeDefinitions()` to return 108 items and `getAllSubjectScopeSlugs()` to return 228 canonical slugs, maintaining backwards-compatible route resolution for legacy trimester bookmarks.

3. **Zero Hydration Errors on Landing Page & Global Shell (US3 - Priority P2)**:
   - Add `suppressHydrationWarning` to the root `<html lang="en">` in `app/layout.tsx` to accommodate `next-themes`.
   - Statically initialize `referralInput` and `showReferralInput` in `features/billing/components/CheckoutModal.tsx` during SSR and synchronize with `getClientReferralCookie()` exclusively inside a client-side `useEffect`.

4. **Centered Subscription Intercept Modal CTA (US5 - Priority P3)**:
   - Remove `ml-auto` from the right arrow in `features/billing/components/AuthInterceptDialog.tsx` so the leading `<LogIn />` icon, text label, and trailing arrow are horizontally centered together.

5. **Accurate Feature Claims & Student Mastery Workflow Demo (US4 - Priority P2)**:
   - Remove unsupported claims of "parent reporting" and "automated gradebook" from `AboutSection.tsx` and `HowToUseAppSection.tsx`.
   - Replace the mock teacher LMS table in `AcademicWorkflowDemo.tsx` with an authentic "Student Mastery & Weak Points" preview demonstrating DO 015 transmuted scores, per-lesson mastery statuses, and diagnostic weak points.

6. **Clean Iconless Academic Track Cards (US5 - Priority P3)**:
   - Remove decorative track icons from `CategorySection.tsx`, `app/tracks/page.tsx`, and `TrackDetail.tsx` for clean, professional typography-first headers.

7. **Mastery-First Framing & Removal of Redundant "DepEd DO 015 Passing Grade ≥ 75%" Labels (US6 - Priority P1)**:
   - Replace aggressive/redundant claims of "Passing Grade ≥ 75%" / "Passed" / "Practice Passed" / "PASSED (Outstanding)" with authentic **Mastery & Competency Readiness** terminology (`Mastery Target ≥ 75%`, `Mastered`, `Practice Proficient`, `All Mastered`, `Needs Review`) across `SubjectWeakPointsCard.tsx`, `LessonList.tsx`, `QuizRunner.tsx`, `curriculum.actions.ts`, `dashboard.actions.ts`, `StudentDashboardView.tsx`, `AcademicWorkflowDemo.tsx`, `HowToUseAppSection.tsx`, and `PopularSubjectsSection.tsx`.
   - Remove repetitive `"DepEd DO 015 s. 2026"` / `"DO 015 Graded"` badges on individual subject cards, quiz mode pills, and popular subject cards while keeping the underlying 60–100 score calculation engine intact.

8. **Accurate Diagnostic Mastery Visibility & Mobile Badge Responsiveness (US7 - Priority P1)**:
   - Update `getSubjectWeakPointsAction` in `features/curriculum/actions/curriculum.actions.ts` to return `totalAttemptedLessons: number` (`latestAttemptByLesson.size`).
   - Update `SubjectWeakPointsCard.tsx` to return `null` (hide the diagnostic card completely) when `totalAttemptedLessons === 0` so users who have not attempted any lessons in a subject (including expired free-trial users with 0 attempts) never falsely see `"Diagnostic Mastery Achieved"`.
   - Only render `"Diagnostic Mastery Achieved"` when `totalAttemptedLessons > 0` and `weakPoints.length === 0`.
   - Fix mobile alignment of the `"Diagnostic Mastery Achieved"` header and its `"Mastery Target ≥ 75%"` badge using responsive `flex-wrap items-center gap-2` and `shrink-0 whitespace-nowrap` so neither text nor badge squishes into narrow vertical columns on mobile screens.
   - Also fix mobile wrapping on the `"Curriculum Lessons (X)"` header row in `LessonList.tsx`.

9. **Diagnostic-Driven Targeted Practice Questions, Mobile Weak-Point Card UI & Button Cleanup (US8 - Priority P1)**:
   - Upgrade `createTargetedPracticeAction` (and helper `selectTargetedPracticeQuestions`) in `features/curriculum/actions/curriculum.actions.ts` and `features/curriculum/utils/quiz-sampler.ts`:
     - Query the student's previous `QuizSession` records for `(userId, subjectSlug, lessonNumber)` to identify questions the student previously answered **incorrectly** or left **unanswered**.
     - Score/rank the remaining questions in the lesson's 24-question pool by matching against the lesson's diagnostic `keyConcepts` keywords (in `question` and `explanation`).
     - Assemble the targeted practice quiz by prioritizing: (1) previously missed/unanswered questions from past sessions, (2) concept-matched questions targeting the lesson's `keyConcepts`, and (3) remaining questions if needed to fill the target count (or AI-generated weak-concept questions when the pool has fewer than required questions).
   - In `SubjectWeakPointsCard.tsx`:
     - Remove the `<Sparkles />` icon from the `"Targeted Practice"` button (leaving clean `"Targeted Practice"` text + `<ArrowRight />`).
     - Fix mobile layout of `SubjectWeakPointsCard.tsx`: use responsive header layout (`flex flex-wrap items-start sm:items-center justify-between gap-2`) with `shrink-0 whitespace-nowrap` on the `{totalWeakPoints} Competencies Under 75%` badge, clean concept pill wrapping, and full-width mobile (`w-full sm:w-auto`) button sizing.

10. **Eliminate `[Sentinel]` Better Auth Infrastructure Warning Log (US9 - Priority P2)**:
    - Remove the unconfigured `sentinelClient()` plugin and `@better-auth/infra/client` import from `features/auth/lib/auth-client.ts` so `[Sentinel] Default global identify ingestion is active but not recommended...` never logs in development or production.

11. **Post-Review Polish & UI/UX Bug Fixes**:
    - **Bug #1 (Subjects Filtering & Smaller Screen Button Layout)**: Auto-reconcile level and strand filter combinations; add query-param deep-linking (`initialLevel`, `initialStrand`); populate missing `slug` properties in `tracks-data.ts`; add `flex-wrap` to filter buttons.
    - **Bugs #2 & #3 (Landing Page Padding & Large Section Gaps)**: Standardize vertical section padding to `py-12 sm:py-16 lg:py-20` and max-width gutters across all 9 landing sections; eliminate nested padding crowding.
    - **Bug #4 (Popular Subjects Touch/Mouse Swipable Track)**: Remove floating `<` and `>` chevron buttons obscuring subject card titles on mobile; add native horizontal drag-to-scroll and touch-snap swipe interaction.

---

## Verification Checklist

- [x] `features/curriculum/types/subjectScope.types.ts` exports `SubjectScopeLesson` and extends `SubjectScopeDefinition` with `lessons`, `isJhsCore`, and `abbr`
- [x] `features/curriculum/utils/subject-lessons-data.ts` provides authentic 8-lesson syllabus breakdowns for all 108 subjects and JHS grade×quarter variations
- [x] `SubjectScopeView.tsx` renders 8-Lesson Syllabus & Topic Breakdown section and JHS Grade/Quarter switcher with dynamic CTA links
- [x] `/subjects` renders exactly 108 distinct subjects and filters cleanly by level and strand
- [x] Root `<html>` in `app/layout.tsx` has `suppressHydrationWarning`
- [x] `CheckoutModal.tsx` initializes referral state deterministically on SSR
- [x] CTA in `AuthInterceptDialog.tsx` is centered without `ml-auto`
- [x] `AboutSection.tsx` and `HowToUseAppSection.tsx` contain zero occurrences of "parent reporting" or "automated gradebook"
- [x] `AcademicWorkflowDemo.tsx` showcases "Student Mastery & Weak Points" with dynamic bindings
- [x] Decorative track icons removed from `CategorySection.tsx`, `app/tracks/page.tsx`, and `TrackDetail.tsx`
- [x] Mastery-first framing (`Mastery Target ≥ 75%`, `Mastered`, `Practice Proficient`, `All Mastered`, `Needs Review`) replaces aggressive "Passing Grade ≥ 75%" labels across all components and actions
- [x] Repetitive DO 015 badges removed from cards and mode pills while preserving 60–100 calculation engine
- [x] `getSubjectWeakPointsAction` returns `totalAttemptedLessons: latestAttemptByLesson.size`
- [x] `SubjectWeakPointsCard.tsx` returns `null` when `totalAttemptedLessons === 0` (hiding the card completely)
- [x] `SubjectWeakPointsCard.tsx` only renders "Diagnostic Mastery Achieved" when `totalAttemptedLessons > 0` and `weakPoints.length === 0`
- [x] Diagnostic mastery header and badge wrap cleanly on mobile viewports (≥ 320px) with `shrink-0 whitespace-nowrap`
- [x] "Curriculum Lessons (X)" header in `LessonList.tsx` wraps cleanly on mobile
- [x] `createTargetedPracticeAction` prioritizes missed/unanswered questions, then `keyConcepts` matched questions, then pool fill
- [x] Targeted Practice button in `SubjectWeakPointsCard.tsx` has no sparkles icon and expands to full width on mobile
- [x] `sentinelClient()` removed from `features/auth/lib/auth-client.ts`, eliminating `[Sentinel]` console warnings
- [x] All automated unit tests pass cleanly (`npx jest`)
- [x] `npx tsc --noEmit` compiles with zero errors
- [x] `npm run lint` passes cleanly with 0 errors and 0 warnings
- [x] `npm run build` succeeds generating all static pages cleanly
- [x] Feature completion logged in `docs/backlog.md`
