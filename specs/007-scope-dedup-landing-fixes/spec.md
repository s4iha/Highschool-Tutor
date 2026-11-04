# Feature Specification: Curriculum Scope Lesson Breakdown, Catalog Deduplication, Clean Hydration, Mastery-First Reframing & Targeted Practice Optimization

**Feature Branch**: `007-scope-dedup-landing-fixes`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "TASK-030: Full Curriculum Scope Content with 8-Lesson Syllabus Breakdown on /subjects/[slug] (including Grade 7-10 & Quarter 1-4 switcher for JHS), Deduplicate 324 Subjects to 108 Distinct Subjects on /subjects Catalog, Fix Landing Page and Global Shell Hydration Mismatches, Fix CTA Button Centering in AuthInterceptDialog, Remove Inaccurate 'Parent Reporting' & Teacher Gradebook Claims in Favor of Student Mastery & Weak Points, Remove Confusing Icons from Track & Strand Cards across Landing, /tracks, and /tracks/[id], Mastery-First Framing & Removal of Redundant/Aggressive 'Passing Grade ≥ 75%' Labels (US6), Accurate Diagnostic Mastery Visibility for 0-Attempt Users & Mobile Badge Responsiveness (US7), Diagnostic-Driven Targeted Practice Questions Prioritization & Card UI Cleanup (US8), and Eliminate [Sentinel] Better Auth Infrastructure Warning Log (US9)."

---

## Executive Summary

HighSchool Tutor provides Philippine secondary learners, educators, and parents with a DepEd Order No. 015, s. 2026 (MATATAG) aligned learning platform. Following the initial launch of public subject scope pages, marketing overhauls, and user testing feedback, nine distinct architectural, pedagogical, and visual inconsistencies were identified:

1. **Incomplete Subject Scope Syllabus Breakdown**: Public subject scope pages (`/subjects/[slug]`) currently show only 3–4 high-level competency bullets and career pathways, lacking the concrete 8-lesson syllabus breakdown (lesson titles, topic summaries, and key concepts) that students and teachers expect when evaluating DepEd curriculum coverage. Junior High School (JHS) scope pages lack an interactive mechanism to inspect competencies across different grade levels (Grades 7–10) and quarters (Quarters 1–4).
2. **Catalog Multiplication & Legacy Redundancies**: The public subject catalog (`/subjects`) lists 324 redundant cards because 8 JHS core subjects are multiplied across 4 Grades × 4 Quarters, compounded by 96 legacy trimester entries displaying identical content. In contrast, the authenticated platform organizes curriculum into 108 distinct subjects (8 JHS Core + 100 SHS).
3. **Hydration Discrepancies on Public Surfaces**: Client-side theme attribute injection on the root document element and premature client storage/cookie reading during modal initialization trigger server-client hydration divergence warnings on the landing page and global layout.
4. **Asymmetrical Subscription Action Alignment**: The primary action button within the guest subscription interception dialog pins its directional arrow to the far right edge while pulling text and leading icons to the left, degrading visual harmony and conversion readability.
5. **Inaccurate Marketing Claims Regarding Platform Capabilities**: Landing page copy advertises an "automated gradebook" and "parent reporting," and the interactive demo showcases a mock teacher gradebook with multi-student records and Learner Reference Numbers (LRNs). HighSchool Tutor is a student-centric learning companion focused on Socratic AI tutoring, DepEd DO 015 s. 2026 score transmutation, and individual competency mastery and weak-point tracking.
6. **Visual Ambiguity in Academic Track Cards**: Academic track cards across the landing page, tracks index, and track detail views display arbitrary generic icons that fail to represent the specialized disciplines accurately.
7. **Aggressive/Redundant "Passing Grade ≥ 75%" Terminology**: The UI repeatedly displays aggressive and redundant labels such as `"DepEd DO 015 Passing Grade ≥ 75%"`, `"Passed"`, `"Practice Passed"`, and `"PASSED (Outstanding)"` across cards, quiz headers, and dashboard summaries. This framing feels punitive rather than encouraging, obscuring the platform's core educational philosophy of mastery and competency readiness.
8. **Inaccurate Diagnostic Mastery Visibility for Zero-Attempt Users & Mobile Squishing**: `SubjectWeakPointsCard.tsx` mistakenly renders `"Diagnostic Mastery Achieved"` when a student has completed **zero** attempts in a subject (e.g., brand-new or expired free-trial students), misleading users into thinking they have mastered curriculum they never started. Additionally, on mobile viewports (< 640px), the diagnostic header text and its status badge squish into narrow vertical columns.
9. **Targeted Practice Lacks Diagnostic Intelligence & Has Visual Clutter**: The `"Targeted Practice"` action currently samples questions completely at random rather than intelligently prioritizing the student's previously missed/unanswered questions and matching against diagnosed `keyConcepts`. The action button also carries a distracting `<Sparkles />` icon that detracts from its diagnostic purpose.
10. **Extraneous Better Auth Infrastructure Warning**: A client import of `sentinelClient()` emits an unconfigured `[Sentinel] Default global identify ingestion is active but not recommended...` warning in browser and node logs on every session initialization.

This specification formalizes the requirements, user stories, acceptance criteria, data models, and success metrics to establish an authoritative, deduplicated, hydration-clean, mastery-first, and diagnostically intelligent learning experience.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive 8-Lesson Syllabus & Scope Breakdown on Subject Scope Pages (Priority: P1)

A high school learner, teacher, or parent visits a public subject scope page (e.g., `/subjects/g7-q1-math` or `/subjects/g11-s1-genmath`) to review official DepEd curriculum requirements. On the scope page:
- The visitor sees an **8-Lesson Syllabus & Topic Breakdown** clearly organized from Lesson 1 to Lesson 8. Each lesson entry displays its official lesson number, concise descriptive title, 1–2 sentence topic summary, and 3–5 key concept tags.
- The syllabus sits seamlessly alongside Prescribed Learning Competencies, official time allotment, prerequisites, and Higher Education & Career Pathways.
- For Junior High School (JHS) core subjects, the page provides an intuitive **Grade Selector (Grades 7, 8, 9, 10)** and **Quarter Selector (Quarters 1, 2, 3, 4)**. Changing the grade or quarter dynamically updates the displayed course description, learning competencies, and the 8-lesson syllabus to match that specific grade and quarter level without requiring a full page reload or breaking browser history.
- For Senior High School (SHS) subjects, the page presents the semester-specific 8-lesson syllabus and competencies directly aligned with that course.

**Why this priority**: Prospective students and teachers evaluate curriculum relevance based on syllabus depth. Providing an explicit 8-lesson breakdown with interactive grade/quarter switching turns subject scope pages into authoritative educational references, dramatically increasing organic engagement and conversion.

**Independent Test**: Can be tested independently by navigating directly to `/subjects/g7-q1-math` and `/subjects/g11-s1-genmath`. Confirm that all 8 lessons are rendered with titles, summaries, and concept tags. On the JHS page, switch between Grade 7 and Grade 9, or Quarter 1 and Quarter 3, and verify that the syllabus, competencies, and subject metadata immediately update to reflect the selected grade and quarter.

**Acceptance Scenarios**:

1. **Given** any public subject scope page (`/subjects/[slug]`), **When** the page renders, **Then** it MUST display an "8-Lesson Syllabus & Topic Breakdown" section containing exactly 8 structured lesson cards (numbered 1 through 8).
2. **Given** any lesson card within the syllabus breakdown, **When** viewed by a user, **Then** it MUST display:
   - Lesson index badge (e.g., "Lesson 1", "Lesson 2").
   - Descriptive lesson title aligned with DepEd MATATAG competencies.
   - Comprehensive topic summary explaining the core instructional focus.
   - 3 to 5 key concept pills highlighting vital formulas, principles, or vocabulary.
3. **Given** a visitor viewing any of the 8 Junior High School core subjects, **When** interacting with the scope header, **Then** an interactive Grade Picker (Grades 7, 8, 9, 10) and Quarter Picker (Quarters 1, 2, 3, 4) MUST be present.
4. **Given** an interactive Grade or Quarter selection change on a JHS scope page, **When** the user clicks an alternate grade or quarter, **Then**:
   - The competencies list updates to match the selected grade and quarter.
   - The 8-lesson syllabus breakdown updates with the corresponding curriculum lessons.
   - The displayed DepEd subject code and description reflect the selected grade and quarter.
   - The primary practice action link updates to target the selected grade and quarter.
5. **Given** a Senior High School subject scope page, **When** rendered, **Then** it displays the specific semester-aligned syllabus and competencies without irrelevant JHS quarter pickers.

---

### User Story 2 - Deduplicated, Canonical 108-Subject Public Curriculum Catalog (Priority: P1)

A user explores the public curriculum catalog at `/subjects`. Instead of encountering an overwhelming wall of 324 redundant cards containing duplicated JHS subjects across quarters and obsolete trimester entries:
- The catalog displays exactly **108 distinct curriculum subjects**: **8 Junior High School Core Subjects** (representing comprehensive Grades 7–10 coverage) and **100 Senior High School Subjects** (spanning Core, Applied, STEM, ABM, HUMSS, GAS, TVL, Arts & Design, and Sports).
- All 96 legacy trimester codes and cards (e.g., `G7-T1-*` displaying as "Quarter 1") and duplicate quarterly cards for the same JHS subject are eliminated from the public catalog grid.
- Each JHS subject card in the catalog clearly indicates its multi-grade scope ("Grades 7–10 • 4 Quarters • 32 Lessons Total") and links directly to its canonical scope page.
- Direct navigation to any legacy or existing slug (e.g., `/subjects/g7-q1-math` or `/subjects/g7-t1-math`) continues to resolve successfully to valid scope content without broken links or 404 errors.

**Why this priority**: Browsing 324 items with 28 near-identical cards per subject creates confusion and cognitive overload. Streamlining the public catalog to 108 distinct subjects mirrors the clean structure of the authenticated platform, enhances discoverability, and establishes professional curriculum architecture.

**Independent Test**: Navigate to `/subjects` in a browser. Verify that the total subject count displayed in the catalog is exactly 108 (8 JHS subjects and 100 SHS subjects). Verify that no duplicate cards for English, Science, or Math appear in the JHS section. Verify that searching or filtering by track displays the expected deduplicated results.

**Acceptance Scenarios**:

1. **Given** the public catalog page at `/subjects`, **When** the catalog renders with all filters set to default, **Then** the catalog MUST present exactly 108 distinct subject cards (8 Junior High School core subjects and 100 Senior High School subjects).
2. **Given** the JHS section of the catalog, **When** inspecting the subject cards, **Then** each of the 8 core subjects (English, Filipino, Mathematics, Science, Araling Panlipunan, Edukasyon sa Pagpapakatao, MAPEH, TLE) appears exactly once.
3. **Given** any JHS subject card in `/subjects`, **When** viewed, **Then** it indicates comprehensive grade span (Grades 7–10) and official 4-quarter structure rather than pinning to a single quarter.
4. **Given** a user or search crawler accessing an existing canonical slug (e.g., `/subjects/g7-q1-math`), **When** requesting the URL, **Then** the page resolves with complete scope data, ensuring zero broken links or regressions for indexed URLs.
5. **Given** the search and filter controls on `/subjects`, **When** filtering by Academic Level ("Junior High School" vs. "Senior High School") or Track/Strand, **Then** counts and displayed cards accurately reflect the 108 distinct subject dataset.

---

### User Story 3 - Clean, Hydration-Safe Page Delivery Across Public Surfaces (Priority: P2)

A visitor lands on the HighSchool Tutor homepage or navigates through public pages:
- The browser console remains pristine, showing zero React hydration mismatch warnings or error dialogs.
- The document root element smoothly accepts system and user theme settings without triggering attribute discrepancies between server-rendered HTML and client hydration.
- The application shell cleanly mounts global upgrade and referral tracking modals without executing premature client-side storage or cookie queries during initial component initialization.

**Why this priority**: Hydration errors produce noticeable layout flicker, degrade Lighthouse performance scores, interfere with React 19 concurrent hydration, and project an unpolished developer experience to technically inclined evaluators.

**Independent Test**: Open an incognito browser window with Developer Tools open to the Console tab. Load `/`, `/subjects`, and `/subjects/g11-s1-genmath`. Verify that zero hydration warning badges, error overlays, or console errors appear during initial render and subsequent interactions.

**Acceptance Scenarios**:

1. **Given** a visitor loading any public page, **When** the initial HTML document hydrates, **Then** the document root element MUST NOT generate any hydration attribute mismatch warnings.
2. **Given** the global layout shell containing the subscription upgrade modal, **When** the component tree initializes, **Then** referral tracking and storage queries MUST synchronize safely after hydration, preventing server-versus-client initial state divergence.
3. **Given** a visitor with an active affiliate referral cookie, **When** loading the homepage, **Then** the application attributes the referral accurately without triggering hydration warnings.
4. **Given** automated verification runs, **When** running lint and build audits, **Then** the application builds cleanly with zero React hydration warnings.

---

### User Story 4 - Transparent Platform Positioning: Student Mastery & Weak Points (Priority: P2)

A student, parent, or school administrator reviews the HighSchool Tutor landing page:
- Marketing copy accurately represents platform capabilities, highlighting student-centric DepEd DO 015 s. 2026 score transmutation, passing score standards (≥ 75%), Socratic AI guidance, and per-subject competency mastery and weak-point tracking.
- All references to an "automated gradebook" and "parent reporting" are replaced with descriptions of individual student diagnostic progress and exam preparation tools.
- In the interactive landing page demo (`AcademicWorkflowDemo`), the second tab is titled **"Student Mastery & Weak Points"** (replacing the mock "Teacher & DepEd Gradebook").
- Selecting "Student Mastery & Weak Points" renders a realistic student diagnostic overview:
  - Transmuted Grade and Mastery Status under DepEd DO 015 s. 2026 (e.g., "Transmuted Grade: 88.5 • Mastered").
  - Identified Weak Points & Topics Needing Review (listing specific competencies, quiz scores, and key concept tags requiring reinforcement).
  - Remediation Action Prompts allowing the student to launch targeted drills on their weak competencies.

**Why this priority**: Misrepresenting product features creates false expectations for educators looking for school-wide grading administration while obscuring the platform's actual value proposition: empowering individual high schoolers to master DepEd competencies and pass their exams.

**Independent Test**: Inspect the landing page at `/`. Check the "About" section, "How to Use" section (Step 04), and the interactive demo tabs. Confirm that no mentions of "automated gradebook" or "parent reporting" exist. Switch to the "Student Mastery & Weak Points" tab in the interactive demo and verify that it displays personal competency mastery, weak points, and targeted review drills.

**Acceptance Scenarios**:

1. **Given** the "About" section on the landing page, **When** reviewing the platform benefits, **Then** the copy emphasizes DepEd DO 015 s. 2026 score transmutation, competency mastery, and targeted weak-point review, with zero references to automated gradebooks or parent reporting.
2. **Given** the "How to Use" onboarding guide (Step 04), **When** read by a user, **Then** the subtitle and checklist highlight individual score transmutation, mastery targets (≥ 75%), and targeted competency diagnosis rather than multi-student gradebook audits.
3. **Given** the interactive demo component, **When** viewing available demonstration modes, **Then** the second tab MUST be labeled "Student Mastery & Weak Points".
4. **Given** the "Student Mastery & Weak Points" demo tab is active, **When** reviewing the displayed interface, **Then** it renders:
   - Overall Subject Transmuted Grade (60–100 scale) with MATATAG mastery indicator.
   - Breakdown of specific lessons with scores, passing status, and flagged weak concepts.
   - Clear diagnostic feedback explaining where the student needs additional review.
   - Actionable "Review with Socratic AI" prompt for identified weak points.
   - Zero mock student rosters, multi-student tables, or Learner Reference Numbers (LRNs).

---

### User Story 5 - Clean Academic Track Cards & Centered Subscription Dialog (Priority: P3)

A user explores academic tracks on the homepage, tracks catalog (`/tracks`), or track detail pages (`/tracks/[id]`), or initiates subscription checkout while signed out:
- In the homepage tracks section (`CategorySection`), tracks index (`/tracks`), and track detail views (`TrackDetail`), all track cards feature clean, typography-led headers without arbitrary generic icons. Cards emphasize track title, grade span, subject count badges, and clear descriptive copy.
- In the guest subscription interception dialog (`AuthInterceptDialog`), the primary call-to-action button ("Continue to Sign In / Sign Up") displays its leading sign-in icon, button text, and directional arrow in a harmoniously centered, balanced alignment.

**Why this priority**: Removing arbitrary icons creates a cohesive, mature aesthetic that lets curriculum details stand out. Centering the action button in the auth modal provides visual polish, reinforces confidence, and eliminates awkward visual asymmetry during the critical conversion step.

**Independent Test**:
1. View the landing page categories section, `/tracks`, and `/tracks/stem-strand`. Confirm that no generic icons appear on track cards or headers.
2. Open the subscription checkout modal as a guest (e.g., by clicking "Start Monthly Subscription"). Verify that in the Auth Intercept dialog, the "Continue to Sign In / Sign Up" button elements are centered and evenly spaced.

**Acceptance Scenarios**:

1. **Given** the track categories grid on the landing page (`CategorySection`), **When** rendered, **Then** track cards MUST NOT display generic icons in their headers or badge containers.
2. **Given** the public tracks catalog (`/tracks`) and track detail pages (`/tracks/[id]`), **When** viewed, **Then** track cards and headers MUST use clean, typography-led badges and titles with zero generic icons.
3. **Given** an unauthenticated visitor opening the subscription interception dialog (`AuthInterceptDialog`), **When** inspecting the primary action button, **Then** the leading icon, text label ("Continue to Sign In / Sign Up"), and trailing arrow MUST be centered as a unified group without edge-pinning margins.

---

### User Story 6 - Mastery-First Framing & Elimination of Redundant DO 015 / Passing Labels (Priority: P1)

A student explores their curriculum progress, quiz attempts, and dashboard:
- The interface consistently frames educational progress around **Mastery & Competency Readiness** rather than bureaucratic pass/fail testing.
- Aggressive/redundant terminology such as `"DepEd DO 015 Passing Grade ≥ 75%"`, `"Passed"`, `"Practice Passed"`, and `"PASSED (Outstanding)"` is replaced with clear, encouraging descriptors:
  - `"Mastery Target ≥ 75%"` (indicating the official DepEd DO 015 proficiency benchmark).
  - `"Mastered"` (for lessons achieving score ≥ 75%).
  - `"Practice Proficient"` (for drills where the student demonstrates competent understanding).
  - `"All Mastered"` (for subjects with 100% of attempted lessons meeting or exceeding proficiency).
  - `"Needs Review"` (for lessons falling under the 75% mastery benchmark).
- Repetitive, cluttering `"DepEd DO 015 s. 2026"` / `"DO 015 Graded"` badges on individual subject cards, quiz mode pills, and popular subject cards are removed, while strictly preserving the official DepEd DO 015 60–100 score transmutation engine under the hood.

**Why this priority**: Educationally sound, growth-oriented language fosters student confidence and encourages consistent practice. Eliminating repetitive bureaucratic badges removes visual noise and modernizes the learning interface while preserving pedagogical compliance.

**Independent Test**:
1. Inspect `LessonList.tsx`, `QuizRunner.tsx`, `SubjectWeakPointsCard.tsx`, and `StudentDashboardView.tsx`.
2. Verify that lesson status badges display `"Mastered"` instead of `"Practice Passed"` or `"Passed"`.
3. Verify that the threshold badge displays `"Mastery Target ≥ 75%"` instead of `"DepEd DO 015 Passing Grade ≥ 75%"`.
4. Verify that popular subject cards and quiz mode pills do not show repetitive "DO 015 Graded" badges.

**Acceptance Scenarios**:

1. **Given** lesson cards in `LessonList.tsx` and dashboard summaries, **When** a student achieves a transmuted score ≥ 75%, **Then** the status badge MUST display `"Mastered"` instead of `"Passed"` or `"Practice Passed"`.
2. **Given** diagnostic and weak-point cards, **When** displaying the benchmark score, **Then** the badge MUST state `"Mastery Target ≥ 75%"`.
3. **Given** subject cards across the public catalog and student dashboard, **When** rendered, **Then** individual cards MUST NOT render redundant `"DepEd DO 015 s. 2026"` or `"DO 015 Graded"` badges.
4. **Given** any quiz score calculation, **When** converting raw scores to final grades, **Then** the underlying DepEd DO 015 s. 2026 60–100 transmutation algorithm MUST remain strictly operational and mathematically unchanged.

---

### User Story 7 - Accurate Diagnostic Mastery Visibility for Zero-Attempt Users & Mobile Responsiveness (Priority: P1)

A student who has just enrolled in a subject or has completed **zero lesson attempts** opens the subject's curriculum page:
- The system evaluates their attempt history and detects `totalAttemptedLessons === 0`.
- The diagnostic weak-point card (`SubjectWeakPointsCard.tsx`) returns `null` and remains **completely hidden**. The student is never presented with a false `"Diagnostic Mastery Achieved"` message before taking any quizzes.
- When the student attempts at least one lesson (`totalAttemptedLessons > 0`) and has zero lessons under 75% (`weakPoints.length === 0`), the card proudly displays `"Diagnostic Mastery Achieved"`.
- On mobile viewports (down to 320px width), the `"Diagnostic Mastery Achieved"` card header and its `"Mastery Target ≥ 75%"` badge utilize responsive wrapping (`flex-wrap items-center gap-2` with `shrink-0 whitespace-nowrap`), preventing text or badge truncation and avoiding squished vertical columns.
- The `"Curriculum Lessons (X)"` header row in `LessonList.tsx` also wraps cleanly on small screens without overlapping buttons or action icons.

**Why this priority**: Displaying "Mastery Achieved" to students with zero quiz attempts is a major credibility failure that erodes trust in the diagnostic engine. Responsive mobile layouts ensure the diagnostic card is fully readable across smartphones used by Filipino learners.

**Independent Test**:
1. Log in as a student with zero quiz attempts for a subject. View the subject curriculum page and verify that `SubjectWeakPointsCard` is completely hidden.
2. Complete one lesson quiz with a score ≥ 75%. Reload and confirm that `"Diagnostic Mastery Achieved"` appears.
3. Test on a 320px mobile viewport in Chrome DevTools. Verify that the header and `"Mastery Target ≥ 75%"` badge wrap naturally without squishing or clipping.

**Acceptance Scenarios**:

1. **Given** a user viewing a subject where `totalAttemptedLessons === 0`, **When** the diagnostic card evaluates status, **Then** `SubjectWeakPointsCard` MUST return `null` and render nothing.
2. **Given** a user with `totalAttemptedLessons > 0` and `weakPoints.length === 0`, **When** rendered, **Then** the card MUST display `"Diagnostic Mastery Achieved"`.
3. **Given** the diagnostic mastery header on any mobile screen width (≥ 320px), **When** rendered, **Then** the heading and `"Mastery Target ≥ 75%"` badge MUST wrap cleanly without squishing into vertical columns.
4. **Given** `LessonList.tsx`, **When** viewed on mobile screens, **Then** the `"Curriculum Lessons (X)"` header row MUST wrap its title, badges, and controls responsively.

---

### User Story 8 - Diagnostic-Driven Targeted Practice Question Prioritization & Card UI Cleanup (Priority: P1)

A student identifies a weak point in their diagnostic overview (e.g., Lesson 2: Rational Functions with score < 75%) and clicks `"Targeted Practice"`:
- The system generates an intelligent targeted practice session specifically constructed to help the student conquer their known difficulties:
  1. **Priority 1 (Missed & Unanswered Questions)**: It inspects previous `QuizSession` records for that student, subject, and lesson, prioritizing questions the student previously answered incorrectly or skipped.
  2. **Priority 2 (Concept-Matched Questions)**: For remaining slots, it scans the lesson's question pool and scores questions based on keyword matching against the diagnosed `keyConcepts` (in both question prompt and detailed explanation).
  3. **Priority 3 (Pool Fill)**: Any remaining slots are filled from the lesson's broader pool (or AI-generated if fewer than required).
- In `SubjectWeakPointsCard.tsx`:
  - The `"Targeted Practice"` button removes the confusing `<Sparkles />` icon, displaying clean, authoritative text (`"Targeted Practice"`) with a trailing directional arrow (`<ArrowRight />`).
  - The card header features a responsive layout (`flex flex-wrap items-start sm:items-center justify-between gap-2`), with `shrink-0 whitespace-nowrap` on the `{totalWeakPoints} Competencies Under 75%` badge.
  - The action button expands to full width (`w-full sm:w-auto`) on mobile viewports for effortless touch interaction.

**Why this priority**: Generic random sampling wastes student time on questions they already understand. Prioritizing questions they previously missed alongside concept-matched drills directly targets learning deficits, fulfilling the promise of authentic AI-guided diagnostic remediation.

**Independent Test**:
1. Take a 5-question quiz for Lesson 1 and intentionally answer Questions 1 and 3 incorrectly.
2. Launch a Targeted Practice session for Lesson 1.
3. Inspect the generated session questions: verify that Questions 1 and 3 are included first, followed by questions matching Lesson 1's key concepts.
4. Verify that the Targeted Practice button in the UI has no sparkles icon and expands to full width on mobile viewports.

**Acceptance Scenarios**:

1. **Given** a student initiating a targeted practice session, **When** `createTargetedPracticeAction` executes, **Then** it MUST assemble questions prioritizing:
   - Questions previously answered incorrectly or unanswered by that student in prior sessions for that lesson.
   - Questions matching the lesson's diagnostic `keyConcepts` keywords in question text or explanation.
   - Remaining unattempted questions from the lesson pool.
2. **Given** the `"Targeted Practice"` button in `SubjectWeakPointsCard.tsx`, **When** rendered, **Then** it MUST NOT contain a `<Sparkles />` icon.
3. **Given** a mobile viewport (< 640px), **When** viewing `SubjectWeakPointsCard.tsx`, **Then** the `"Targeted Practice"` button MUST render with full width (`w-full`) for easy tapping.
4. **Given** the weak-point count badge (`{totalWeakPoints} Competencies Under 75%`), **When** displayed, **Then** it MUST have `shrink-0 whitespace-nowrap` preventing multi-line badge wrapping.

---

### User Story 9 - Clean Authentication Client Logs (Removal of Sentinel Warning) (Priority: P2)

A developer or administrator inspects browser console logs during development or production usage:
- The authentication initialization executes cleanly without emitting extraneous infrastructure warnings.
- Specifically, the warning:
  `[Sentinel] Default global identify ingestion is active but not recommended...`
  is completely eliminated by removing the unconfigured `sentinelClient()` plugin from `features/auth/lib/auth-client.ts`.

**Why this priority**: Extraneous warning logs in production create developer alarm, clutter console logs during debugging, and suggest unfinished infrastructure configuration.

**Independent Test**: Load the application in a local browser session with DevTools Console open. Perform a sign-in or session check. Verify that zero `[Sentinel]` warnings appear in the console.

**Acceptance Scenarios**:

1. **Given** `features/auth/lib/auth-client.ts`, **When** `createAuthClient` initializes, **Then** `sentinelClient()` MUST NOT be registered as an active plugin.
2. **Given** any browser session initializing authentication, **When** inspecting console output, **Then** zero `[Sentinel]` log entries MUST appear.

---

### Edge Cases

- **Direct Navigation to Obsolete Trimester URL**: If a visitor or external link navigates to a legacy trimester slug (e.g., `/subjects/g7-t1-math`), the system MUST seamlessly map the request to the canonical subject scope (e.g., `/subjects/g7-q1-math`) or render the comprehensive subject scope with the first quarter active, avoiding 404 errors.
- **JHS Grade/Quarter Switcher Rapid Toggling**: If a user rapidly clicks between different grades and quarters on a JHS scope page, the view MUST synchronously update its displayed competencies and 8-lesson syllabus without state corruption, stale data overlap, or UI flickering.
- **Subject with No Direct Prerequisites**: When a subject has no required prerequisites (e.g., Grade 7 English or introductory SHS subjects), the scope page MUST explicitly state "No Prerequisite" rather than displaying an empty container or undefined text.
- **Offline or Slow Network State During Scope Browsing**: All 8-lesson syllabus definitions and scope metadata for public pages MUST be available statically or synchronously from client curriculum definitions, ensuring immediate rendering without waiting for external AI generation or database roundtrips.
- **Disabled Client Cookies / Storage**: If a user has cookies or local storage disabled, the subscription modal and referral tracker MUST fail gracefully without throwing unhandled exceptions or breaking the sign-in redirect flow.
- **Zero Quiz Attempts in Subject**: If a student has zero attempts in a subject, `SubjectWeakPointsCard` MUST return `null` and remain hidden, preventing false "Mastery Achieved" claims.
- **Student Retrying Lesson Without Past Errors**: If a student scored 100% on their only attempt and requests targeted practice, the selection algorithm MUST match against the lesson's diagnostic `keyConcepts` and fill from the pool without error.
- **Ultra-Narrow Mobile Viewport (320px–360px)**: Diagnostic card headers, badges, and action buttons MUST wrap gracefully with `flex-wrap` and `shrink-0` without horizontal page scrolling or truncated text.

---

## Requirements *(mandatory)*

### Functional Requirements

#### 1. 8-Lesson Syllabus & Scope Breakdown on `/subjects/[slug]`
- **FR-001**: System MUST render an 8-Lesson Syllabus & Topic Breakdown section on every public subject scope page (`/subjects/[slug]`).
- **FR-002**: Each lesson item within the syllabus MUST specify:
  1. Sequential lesson number (Lesson 1 through Lesson 8).
  2. Descriptive lesson title aligned with DepEd MATATAG curriculum standards.
  3. Topic instructional summary (1–2 sentences describing the core learning objective).
  4. 3 to 5 key concept tags highlighting critical formulas, terms, or principles.
- **FR-003**: System MUST provide an interactive Grade Selector (Grades 7, 8, 9, 10) and Quarter Selector (Quarters 1, 2, 3, 4) on public scope pages for all 8 Junior High School core subjects.
- **FR-004**: Selecting a grade or quarter on a JHS scope page MUST dynamically update the displayed:
  - Official DepEd Subject Code.
  - Course Overview Description.
  - Prescribed Learning Competencies.
  - 8-Lesson Syllabus Breakdown.
  - Primary practice call-to-action link pointing to the corresponding learning destination.
- **FR-005**: Senior High School subject scope pages MUST display the complete 8-lesson syllabus corresponding to that specific course and semester.

#### 2. Deduplication of Public Curriculum Catalog (`/subjects`)
- **FR-006**: System MUST deduplicate the public `/subjects` catalog to exactly 108 distinct curriculum subjects:
  - Exactly 8 Junior High School Core Subjects (English, Filipino, Mathematics, Science, Araling Panlipunan, Edukasyon sa Pagpapakatao, MAPEH, TLE).
  - Exactly 100 Senior High School Subjects across Core, Applied, and Specialized tracks.
- **FR-007**: System MUST remove all 96 legacy trimester entries (`T1`, `T2`, `T3`) and redundant quarterly card duplicates from the public `/subjects` catalog grid.
- **FR-008**: Each JHS subject card in the public catalog MUST indicate full secondary coverage (Grades 7–10, 4 Quarters, 32 cumulative lessons) and route to its canonical scope page.
- **FR-009**: System MUST maintain backward compatibility for existing canonical subject slugs, ensuring all valid curriculum URLs resolve to complete scope views.

#### 3. Hydration Error Elimination
- **FR-010**: System MUST eliminate all server-versus-client hydration attribute mismatches on the root document element.
- **FR-011**: System MUST ensure that client-side storage, cookie parsing, and referral checks in global modals execute after component mounting, preventing hydration mismatches between SSR and CSR output.
- **FR-012**: System MUST render all public pages with zero React hydration errors or warnings in production and development console logs.

#### 4. Subscription Intercept Dialog Action Alignment
- **FR-013**: System MUST render the primary action button ("Continue to Sign In / Sign Up") in `AuthInterceptDialog` with centered, balanced alignment of its leading icon, text label, and directional arrow icon.

#### 5. Accurate Marketing Copy & Student Mastery Demo
- **FR-014**: System MUST remove all claims of "automated gradebook" and "parent reporting" from landing page marketing sections (`AboutSection`, `HowToUseAppSection`).
- **FR-015**: System MUST replace removed marketing claims with accurate descriptions of DepEd DO 015 s. 2026 score transmutation (60–100 scale), mastery benchmarks (`Mastery Target ≥ 75%`), and per-subject competency mastery and weak-point tracking.
- **FR-016**: System MUST replace the "Teacher & DepEd Gradebook" tab in `AcademicWorkflowDemo` with an interactive "Student Mastery & Weak Points" preview displaying:
  - Transmuted score and DepEd MATATAG mastery status.
  - Competency mastery badges and specific lessons flagged for review.
  - Actionable Socratic AI drill prompts targeting weak concepts.
  - Zero multi-student administrative rosters or Learner Reference Numbers (LRNs).

#### 6. Clean Academic Track Card Visuals
- **FR-017**: System MUST remove generic icons from track cards in the landing page `CategorySection`, the `/tracks` catalog, and `/tracks/[id]` detail views.
- **FR-018**: Track cards MUST utilize clean, typography-first headers emphasizing track name, grade level, subject count, and curriculum descriptions.

#### 7. Mastery-First Framing & Label Cleanup
- **FR-019**: System MUST reframe all student performance statuses from aggressive pass/fail language to mastery-first terminology:
  - `"Mastered"` replaces `"Passed"` and `"Practice Passed"` on lesson cards and progress trackers.
  - `"Mastery Target ≥ 75%"` replaces `"DepEd DO 015 Passing Grade ≥ 75%"`.
  - `"Practice Proficient"` replaces `"Passed"` in quiz completion screens.
  - `"All Mastered"` replaces `"All Passed"` on dashboard summaries.
- **FR-020**: System MUST remove repetitive `"DepEd DO 015 s. 2026"` and `"DO 015 Graded"` badges from individual subject cards, quiz mode pills, and popular subject cards, while keeping the 60–100 transmutation calculation intact.

#### 8. Accurate Diagnostic Mastery Visibility & Mobile Responsiveness
- **FR-021**: `getSubjectWeakPointsAction` MUST return `totalAttemptedLessons: number` reflecting the count of distinct lessons attempted by the student in that subject (`latestAttemptByLesson.size`).
- **FR-022**: `SubjectWeakPointsCard.tsx` MUST return `null` and remain hidden when `totalAttemptedLessons === 0`.
- **FR-023**: `SubjectWeakPointsCard.tsx` MUST ONLY display `"Diagnostic Mastery Achieved"` when `totalAttemptedLessons > 0` and `weakPoints.length === 0`.
- **FR-024**: The diagnostic mastery header and `"Mastery Target ≥ 75%"` badge MUST wrap responsively on mobile screens (`flex-wrap items-center gap-2` with `shrink-0 whitespace-nowrap`), preventing text or badge column squishing.
- **FR-025**: The `"Curriculum Lessons (X)"` header row in `LessonList.tsx` MUST wrap responsively on mobile screen sizes.

#### 9. Diagnostic-Driven Targeted Practice Questions & Button Cleanup
- **FR-026**: `createTargetedPracticeAction` (and helper `selectTargetedPracticeQuestions`) MUST prioritize questions in three tiers:
  1. Questions previously answered incorrectly or unanswered by the student in prior quiz sessions for that lesson.
  2. Questions matching the lesson's diagnostic `keyConcepts` keywords in question text or explanation.
  3. Remaining unattempted questions from the lesson pool.
- **FR-027**: In `SubjectWeakPointsCard.tsx`, the `"Targeted Practice"` button MUST NOT render a `<Sparkles />` icon and MUST expand to full width (`w-full sm:w-auto`) on mobile viewports.

#### 10. Clean Authentication Infrastructure Logs
- **FR-028**: System MUST remove `sentinelClient()` from `features/auth/lib/auth-client.ts`, eliminating `[Sentinel]` identify ingestion warning logs in development and production.

---

### Key Entities

- **Subject Scope Definition**: Represents the complete public curriculum metadata for a DepEd subject.
  - *Attributes*: canonical slug, subject code, title, academic level (JHS/SHS), grade level, semester or quarter, track, strand, prescribed time allotment, prerequisite requirements, corequisites, course description, official competencies, career pathways, and 8-lesson syllabus breakdown.
- **Curriculum Lesson Scope**: Represents a single instructional lesson within a subject's 8-lesson syllabus.
  - *Attributes*: lesson number (1–8), lesson title, topic summary, key concept tags (array of 3–5 strings).
- **Distinct Curriculum Subject**: Represents a high-level curriculum offering in the catalog.
  - *Attributes*: unique identifier, subject name, academic level, grade span, default canonical slug, track, strand, total lesson count.
- **Subject Weak Points Diagnostic**: Represents an individual learner's diagnosed areas needing remediation.
  - *Attributes*: `subjectSlug`, `totalAttemptedLessons`, `totalWeakPoints`, `passingThreshold` (75), `weakPoints` list (lessonNumber, lessonTitle, rawScore, total, transmutedScore, status: "Needs Review", keyConcepts, lastAttemptDate).
- **Targeted Practice Session**: Represents an adaptive practice quiz session assembled from diagnostic data.
  - *Attributes*: sessionId, userId, subjectSlug, lessonNumber, questionCount, questions list (prioritizing missed/unanswered and concept-matched items).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of public subject scope pages (`/subjects/[slug]`) display a complete 8-lesson syllabus breakdown with titles, summaries, and 3–5 concept tags per lesson.
- **SC-002**: All 8 Junior High School core subjects feature functional Grade (7–10) and Quarter (1–4) selectors that update competencies and syllabus content within 50 milliseconds of user selection without page reloads.
- **SC-003**: The public curriculum catalog (`/subjects`) renders exactly 108 distinct subject cards, achieving a 66.7% reduction from the previous 324 redundant entries while preserving full curriculum coverage.
- **SC-004**: Zero React hydration warnings or errors occur across the homepage, public catalog, and subject scope pages during initial render or client navigation.
- **SC-005**: 100% of landing page marketing copy and interactive demonstrations reflect student-centric score transmutation and weak-point tracking, with zero remaining references to automated teacher gradebooks or parent reporting.
- **SC-006**: All track cards across the homepage, `/tracks`, and `/tracks/[id]` display clean typography-first headers with zero generic or confusing icons.
- **SC-007**: The primary CTA button in the subscription interception modal exhibits centered visual alignment across all supported viewport widths.
- **SC-008**: 100% of student and public surfaces display mastery-first terminology (`Mastery Target ≥ 75%`, `Mastered`, `Practice Proficient`), with zero remaining "Passing Grade ≥ 75%" or "Passed (Outstanding)" labels.
- **SC-009**: For any user with 0 completed lesson attempts in a subject, the diagnostic weak-point card renders `null` (completely hidden), preventing 100% of false-positive "Diagnostic Mastery Achieved" reports.
- **SC-010**: When a student has attempted ≥ 1 lesson and has 0 weak points, "Diagnostic Mastery Achieved" renders cleanly on mobile viewports (≥ 320px) without badge or text truncation or vertical stacking squish.
- **SC-011**: 100% of targeted practice sessions generated via `createTargetedPracticeAction` prioritize the student's previously missed/unanswered questions and lesson `keyConcepts` matches before falling back to generic questions.
- **SC-012**: The Targeted Practice button in `SubjectWeakPointsCard` displays clean text and trailing arrow without extraneous sparkle icons, expanding to full-width on mobile viewports (`< 640px`).
- **SC-013**: 100% of development and production console sessions execute without emitting `[Sentinel]` identify ingestion warning logs.

---

## Assumptions

- **Syllabus Standardization**: Every DepEd MATATAG subject in the HighSchool Tutor curriculum adheres to the standardized 8-lesson module structure per quarter/semester.
- **Static Availability**: All 8-lesson syllabus definitions, summaries, and key concepts are statically defined within curriculum data files, guaranteeing instant page rendering and complete search engine crawlability without database latency.
- **Preserved Slug Resolution**: Existing canonical subject slugs indexed by search engines or shared by users remain fully operational and resolve to the updated scope views.
- **Mastery Benchmark Integrity**: The DepEd DO 015 s. 2026 mathematical threshold (raw 60% = transmuted 75) remains the official benchmark for "Mastered" status across all subjects.
- **Authentication Isolation**: Authentication client configuration in `features/auth/lib/auth-client.ts` does not require Sentinel infrastructure plugins for standard email and Google OAuth flows.
