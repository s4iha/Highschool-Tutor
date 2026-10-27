# Feature Specification: UI Modernization and Diagnostic Learning Enhancements

**Feature Branch**: `002-ui-and-learning-enhancements`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User requirements covering 9 core platform improvements:
1. Subject Cards UI Overhaul (smooth elevation, job-card inspired metadata, fluid grid)
2. Filter Components Decluttering (consolidated controls, smart dropdowns/popovers, integrated search)
3. Subject Page Badges Decluttering (clean metadata hierarchy, subtle typography, unified badge styling)
4. Annual Pass Card Icon Upgrade (replacing Sparkles with Crown icon for VIP full-year access)
5. 30-Day Free Trial Hard Gate & 7-Day Expiration Email (strict gate on expiration, idempotent 7-day warning email)
6. Language Translation Integrity Fix (stem and explanation translated; multiple-choice options preserved untouched)
7. AI Study Prompt Question-Level Socratic Context (focusing AI guidance strictly on the active question and concept)
8. Accidental Interruption & 'Continue Quiz' Resumption (incremental answer persistence and resumption prompt)
9. Diagnostic 'Weak Points' & Focus Areas Feature (tracking DepEd DO 015 <75% competencies with 1-click targeted practice)

---

## Clarifications

### Session 2026-10-26

- Q: How should the platform enforce the 30-day trial expiration hard gate when a student without an active subscription accesses the application? → A: Contextual Lock & Modal: Allow browsing the dashboard and subject catalog with visual lock badges, but immediately intercept and block all lesson reading, quiz starts, and AI tutor clicks with the Upgrade Paywall modal.
- Q: What email delivery mechanism and background trigger should be implemented to dispatch the 7-day trial expiration reminder notices? → A: Secure Cron Route with Modular Transport: Create an `/api/cron/trial-reminders` endpoint (secured by a `CRON_SECRET` token) with a modular email adapter (Resend in production with console/mock fallback in local development), recording sent notices in `ReminderNotice`.
- Q: Where should the 'Continue Quiz' resumption banner and prompt appear when a student has an unfinished quiz session in progress? → A: Dual Surface (Dashboard & Subject Page): Display a prominent resumption card at the top of the Student Dashboard (/dashboard) and on the relevant Subject Curriculum page (/curriculum/[slug]), allowing 1-click resumption from either screen.
- Q: What criteria and granularity should qualify a curriculum topic as a 'Weak Point' on the subject overview page? → A: Topic Competency Level with Key Concept Tags (Latest Attempt Rule): Evaluates the student's most recent quiz attempt for each lesson topic; if the latest transmuted score is < 75%, it is flagged as a Weak Point displaying the topic title, score achieved, and sub-topic Key Concept tags, with a 1-click 'Practice This Topic' CTA. Scoring ≥ 75% on a retake clears it.
- Q: In translated quiz questions, should multiple-choice options (A, B, C, D) remain strictly in original English, or should an alternative option be supported? → A: Strict English Options: Only translate the question stem and explanation; options A, B, C, and D remain 100% in original English across all dialects without exception, ensuring formulas and standard scientific/mathematical terms stay completely uncorrupted.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 30-Day Free Trial Hard Gate & 7-Day Expiration Notice (Priority: P1)

As an educational SaaS platform operator, I want newly registered students to experience an unrestricted 30-day trial of all subjects, lessons, and AI tutoring, but have their core access strictly hard-gated upon expiration with a 7-day advance email warning, so that trialists clearly understand their access timeline and are motivated to subscribe to an Annual or Monthly Pass.

**Why this priority**: Directly impacts platform revenue and access control integrity. Without a hard gate, users may exploit unbounded access; without an advance notice, users experience sudden disruption rather than timely conversion.

**Independent Test**:
- Create a student account with registration date > 30 days ago. Navigate to any lesson, quiz, or AI tutor drawer: verify the student is strictly blocked with a paywall modal offering subscription tiers.
- Simulate a student account whose trial expires in 7 days: verify the automated reminder process dispatches an email notice with accurate countdown days and a direct upgrade link, recording notice status to prevent repeat emails.

**Acceptance Scenarios**:

1. **Given** a student whose 30-day free trial has expired and who has no active subscription, **When** the student attempts to view a lesson, start a quiz (study or exam mode), or open the AI Tutor Drawer, **Then** the platform immediately presents an upgrade paywall blocking access and prompting them to select a subscription plan.
2. **Given** a student whose trial is active with exactly 7 days remaining (Day 23 of 30) and no active subscription, **When** the daily trial notification process executes, **Then** an email notice is sent warning them of trial expiration in 7 days with a direct CTA to upgrade, and an idempotent record is persisted to prevent duplicate notifications.
3. **Given** an active subscriber or a student within their 30-day trial window, **When** they access any lesson or quiz, **Then** access is granted immediately without paywall interruption.

---

### User Story 2 - Language Translation Accuracy for Multilingual Quizzes (Priority: P1)

As a multilingual high school student in the Philippines, I want to switch the quiz language to my preferred dialect (e.g., Taglish, Cebuano, or Ilocano) and read translated question scenarios and explanations while keeping multiple-choice options in their original standardized terminology, so that scientific terms and formulas remain clear and uncorrupted.

**Why this priority**: Translation currently modifies options A, B, C, and D, which translates technical formulas, standard mathematical symbols, and established scientific vocabulary into incorrect or incomprehensible dialect phrases, directly harming the student's test prep.

**Independent Test**:
- Open a Science or Math quiz (e.g., General Chemistry or Pre-Calculus), select "Taglish" or "Cebuano" in the translation control: verify the question text and explanation are translated, but options A, B, C, and D remain identical to their original English phrasing and formatting.

**Acceptance Scenarios**:

1. **Given** a quiz question with technical multiple-choice options (e.g., "A) Endothermic reaction", "B) Exothermic reaction"), **When** the student selects a Philippine dialect (e.g., Taglish or Cebuano), **Then** the question stem and explanation are translated into that dialect, while options A, B, C, and D remain in their original English technical form.
2. **Given** an active quiz in a translated dialect, **When** the student changes back to "English", **Then** the original English question, options, and explanation are displayed immediately.

---

### User Story 3 - Question-Specific Socratic AI Tutoring Guidance (Priority: P2)

As a student practicing in Study Mode, I want the AI Tutor to provide hints and Socratic guidance focused specifically on the active quiz question and its immediate learning competency, rather than offering broad subject-wide summaries, so that I receive immediate, actionable help to solve the problem myself.

**Why this priority**: When students ask for help on a specific math equation or chemistry concept, receiving a generic overview of the whole subject is frustrating and violates Socratic pedagogy.

**Independent Test**:
- In Study Mode on question #3 of a lesson, open the AI Tutor Drawer and click "Give me a hint": verify the AI's response specifically mentions the variables, concept, or scenario of question #3 without reciting broad subject background and without revealing the correct option letter.

**Acceptance Scenarios**:

1. **Given** a student viewing question #4 in Study Mode, **When** the student opens the AI Tutor Drawer and submits a question or requests a hint, **Then** the AI's response addresses the specific scenario, numbers, and competency of question #4, guiding the student step-by-step without giving away the answer.
2. **Given** a student who advances to question #5 in Study Mode, **When** the student interacts with the AI Tutor, **Then** the AI's contextual focus shifts to question #5's specific problem statement.

---

### User Story 4 - Quiz State Auto-Persistence & Resumption ('Continue Quiz') (Priority: P2)

As a student taking a practice or exam quiz, I want my submitted answers to be saved automatically as I progress so that if I accidentally close my tab, refresh the page, or lose connection, I can resume exactly where I left off with a "Continue Quiz" prompt rather than losing all my work.

**Why this priority**: High school students often experience unstable mobile connectivity or accidental browser closes. Losing a 24-question test halfway through creates high user frustration and abandonment.

**Independent Test**:
- Start a 15-question quiz in Exam Mode, answer questions 1 through 5, and close or reload the browser window. Navigate back to the subject or quiz page: verify a prominent "Continue Quiz" banner or modal appears displaying 5 of 15 questions answered, allowing 1-click resumption with answers intact, or an option to discard and restart.

**Acceptance Scenarios**:

1. **Given** an active quiz session in progress, **When** the student selects an answer for any question, **Then** the system automatically records the answer progress to the server-side quiz session.
2. **Given** a student with an incomplete quiz session, **When** they visit the Student Dashboard (`/dashboard`) or the relevant Subject Curriculum page (`/curriculum/[slug]`), **Then** the interface displays an active resumption card indicating incomplete progress (e.g., "You have an unfinished Exam Quiz: 6 of 15 answered") with "Resume Quiz" and "Discard" actions.
3. **Given** the student clicks "Resume Quiz", **Then** the quiz loads with all previously selected answers preserved and sets the active question index to the first unanswered question.
4. **Given** the student clicks "Discard", **Then** the previous incomplete session is marked abandoned or archived, and the student may configure and start a fresh quiz session.

---

### User Story 5 - Responsive Subject Cards UI Overhaul & Fluid Grid (Priority: P3)

As a student browsing high school subjects, I want to explore subject cards with a modern, elegant visual design inspired by high-end job and course cards, featuring smooth drop shadow transitions without abrupt vertical movement, structured metadata tags, and consistent fluid responsiveness across mobile, tablet, desktop, and ultra-wide displays.

**Why this priority**: The catalog is the student's entry point to learning. The current `hover:-translate-y-1` transition feels jittery, and the card layout lacks structured metadata tags and visual rhythm.

**Independent Test**:
- Open the Subject Catalog on viewport widths from 360px (mobile) to 1920px (desktop): verify fluid grid columns adapt cleanly, hover interactions apply smooth deep shadows without vertical jump, and every card clearly displays subject icon, status/term pill, title, structured tags (Track, Semester, Grade), lesson count metric, and an action button.

**Acceptance Scenarios**:

1. **Given** a student hovering over any subject card, **When** the mouse enters or leaves the card, **Then** the card transitions smoothly with an elegant, soft deep drop shadow (`hover:shadow-md` or `hover:shadow-xl`) and subtle border emphasis, with zero vertical translation (`translate-y-0`).
2. **Given** any subject card in the catalog, **When** rendered on any device, **Then** it consistently presents:
   - Top-left: Subject discipline icon or monogram
   - Top-right: Term or status pill (e.g., `Quarter 1`, `Semester 1`, or student grade match)
   - Middle: Bold subject title with clean line-clamping and structured metadata chips (Track, Strand, Grade Level, DepEd MATATAG)
   - Bottom: Curriculum metrics (e.g., "10 Lessons", "DepEd DO 015 Aligned") on the left, and a high-contrast action button ("Explore Subject") on the right.
3. **Given** screen viewports of varying widths, **When** the catalog is viewed on mobile (<640px), tablet (640px-1024px), desktop (1024px-1536px), and ultra-wide (>1536px), **Then** the grid seamlessly reflows into 1, 2, 3, and 4 columns respectively without horizontal overflow or misaligned button baselines.

---

### User Story 6 - Streamlined Catalog Filtering & Decluttered Subject Badges (Priority: P3)

As a student or teacher navigating the curriculum, I want a clean, decluttered filter bar and simplified subject page header so that I can quickly find relevant subjects without being overwhelmed by multiple stacked rows of buttons, chips, and competing status badges.

**Why this priority**: The current catalog displays up to four stacked filter rows (tabs + JHS quarters + SHS semesters + SHS strands + search bar), and the subject page header stacks 4 bulky badges in a single line, causing visual clutter and cognitive overload.

**Independent Test**:
- In the Subject Catalog, check the filter area: verify controls are consolidated into a unified filter bar with smart contextual selectors and integrated search.
- Open any subject page (`/curriculum/[slug]`): verify the header displays a refined typographic hierarchy (e.g., breadcrumb/eyebrow for grade and track) and at most one prominent access badge, eliminating redundant or clashing pill badges.

**Acceptance Scenarios**:

1. **Given** the Subject Catalog filter area, **When** viewed on desktop or mobile, **Then** filters are consolidated into a clean bar featuring:
   - Primary level toggle (All, Junior High, Senior High)
   - Contextual secondary filter (dropdown/popover for Quarters in JHS or Semesters/Strands in SHS)
   - Integrated search input with instantaneous filtering
   - Clear active filters indicator and a 1-click "Reset Filters" action when non-default filters are active.
2. **Given** the subject detail header on `/curriculum/[slug]`, **When** rendered, **Then** subject code, grade level, and semester/quarter are displayed as a subtle, legible typographic metadata line, leaving the badge slot exclusively for access/trial status (e.g., `Active Trial: 14 days left` or `Subscription Active`).

---

### User Story 7 - Subject Diagnostic "Weak Points" by Topic & Targeted Practice (Priority: P4)

As a student aiming to master my high school subjects under DepEd MATATAG standards, I want to see a diagnostic "Weak Points" / "Focus Areas" section on my subject overview page that pinpoints specific lesson topics where my latest score is below 75%, displaying the sub-topic Key Concepts and providing a 1-click "Practice This Topic" CTA to turn my weak areas into mastered competencies.

**Why this priority**: Helps students pinpoint exactly which concepts (e.g., "Balancing Reactions" in Stoichiometry) they struggle with, rather than generic subject repeating, directly reinforcing the DepEd DO 015 s. 2026 mastery objective (transmuted passing threshold ≥ 75%).

**Independent Test**:
- Complete a quiz with a score below 75% (<10/15 correct): navigate to that subject's curriculum page and verify a "Focus Areas / Weak Points" diagnostic card appears, displaying the lesson topic name, latest score achieved, sub-topic Key Concept tags, and a "Practice This Topic" button that launches a targeted quiz.

**Acceptance Scenarios**:

1. **Given** a student whose latest quiz attempt for a lesson topic has a transmuted score < 75%, **When** the student opens the subject page, **Then** a prominent "Weak Points / Focus Areas" diagnostic card is displayed detailing the weak lesson topic, latest score percentage, and sub-topic Key Concept tags.
2. **Given** a weak point item in the diagnostic section, **When** the student clicks the "Practice This Topic" CTA, **Then** the platform initiates a targeted quiz focused specifically on that topic and its key concepts.
3. **Given** a student who retakes the quiz and achieves a passing score (≥ 75%), **When** the subject page refreshes, **Then** that topic is immediately cleared from "Weak Points" and marked as "Mastered" / "Practice Passed".

---

### User Story 8 - Annual Pass Brand Icon Upgrade (Priority: P5)

As a prospective subscriber evaluating pricing plans, I want the Annual Pass card in the checkout modal to feature a prestigious, clear icon (Crown) rather than a generic sparkles icon, reinforcing that this pass provides the complete, unrestricted VIP school year access.

**Why this priority**: The `Sparkles` icon is already used for general AI hints and trial notifications throughout the app; using `Crown` for the Annual Unlimited Pass creates clear tier distinction and visual prestige.

**Independent Test**:
- Open the checkout modal from any paywall or pricing trigger: verify the Annual Pass card displays the `Crown` icon with gold/primary styling, clearly differentiating it from the Monthly plan.

**Acceptance Scenarios**:

1. **Given** the Checkout modal is opened, **When** viewing the Annual Unlimited card, **Then** the card header displays the `Crown` icon alongside the "Annual Unlimited" title.

---

### Edge Cases

- **Expired Trial + Active Subscription**: If a student's trial duration has passed 30 days, but they have purchased a Monthly or Annual subscription (`status: ACTIVE`), the system must grant full access without paywall interruption.
- **Trial Expiration Email Idempotency**: If a student's trial reaches the 7-day threshold, the reminder service must only send the email once; multiple background runs on the same day must not trigger duplicate emails.
- **Offline / Mid-Quiz Disconnection**: When a student answers a question while offline, the client must queue or retry the progress update so answers are not discarded upon reconnect.
- **Single Unanswered Question Resumption**: If a student answered all questions but closed the window before the final submission screen, resuming must allow them to review answers and submit for official DO 015 grading.
- **No Weak Points Available**: For a student who has not yet taken a quiz, or has passed all quizzes with ≥75%, the "Weak Points" section must gracefully display an encouraging "All caught up! Zero weak points detected" state with an option to explore upcoming lessons.
- **Language Switch with Formulas**: Math expressions (e.g., `$x^2 + 2x + 1 = 0$`) must remain pristine and KaTeX-renderable in both translated stems and non-translated options.
- **Ultra-Wide Screens (>2560px)**: Subject card grids must maintain max-width bounds and avoid stretching cards excessively, capping at 4 to 5 balanced columns.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Trial Hard Gate & Email Warning
- **FR-001**: The system MUST verify a student's entitlement before rendering or executing curriculum lessons, quiz questions, exam mode, study mode, and the AI Tutor Drawer.
- **FR-002**: If a student's account registration age exceeds 30 days and the student has no active subscription (`status: ACTIVE`), the system MUST allow discovery browsing of the dashboard and subject catalog with visual lock badges, but MUST strictly intercept and hard-block any attempt to view lesson reading materials, launch quizzes, or open the AI Tutor with the Upgrade Paywall modal.
- **FR-003**: The system MUST provide an `/api/cron/trial-reminders` execution endpoint secured by a `Bearer CRON_SECRET` authorization token to identify trial accounts with exactly 7 days remaining before expiration (between 6.0 and 7.0 days).
- **FR-004**: For each eligible student identified in FR-003, the system MUST dispatch an email notification alerting them of their upcoming trial expiration with a direct CTA link to subscription checkout, utilizing a modular email service (Resend in production with console/mock logger fallback in local development).
- **FR-005**: The system MUST log the 7-day notification event in the database (`ReminderNotice` record with `userId` and `kind: "trial_expiring_7d"`) to guarantee idempotent execution and prevent duplicate email transmissions across multiple runs.

#### Translation & Multilingual Integrity
- **FR-006**: When a student selects a Philippine dialect (Taglish, Cebuano, Ilocano, etc.) for a quiz, the system MUST translate the question problem statement (stem) and the explanation.
- **FR-007**: The system MUST NOT translate multiple-choice options (A, B, C, D); all option texts, numerical values, and formulas MUST remain in their original English/standard format.
- **FR-008**: The system MUST cache translated question stems and explanations to avoid redundant generative API calls for identical dialect requests.
- **FR-009**: The system MUST preserve all LaTeX formatting delimiters (`$...$` and `$$...$$`) intact during translation so mathematical expressions render properly via KaTeX.

#### Question-Level Socratic AI Tutoring
- **FR-010**: When a student requests AI tutoring assistance during an active quiz in Study Mode, the AI system prompt MUST prioritize the active question's exact problem statement, options, and targeted competency over broad subject summaries.
- **FR-011**: The AI Tutor MUST follow strict Socratic guidance: asking probing diagnostic questions, explaining underlying concepts, and guiding the student step-by-step, while strictly refusing to reveal the correct option letter or final answer value.
- **FR-012**: When the student advances to a different question, the AI context MUST dynamically update to anchor to the newly active question.

#### Quiz State Auto-Persistence & Resumption
- **FR-013**: The system MUST incrementally persist student answers to the database session record as each question is answered or modified during an active quiz session.
- **FR-014**: The system MUST track the active question index within the quiz session record to restore exact cursor position upon resumption.
- **FR-015**: When a student loads the Student Dashboard (`/dashboard`) or visits the Subject Curriculum page (`/curriculum/[slug]`) for a subject containing an incomplete quiz session (`completedAt: null`), the system MUST display a prominent "Continue Quiz" resumption banner showing the active mode, lesson title, and completion count (e.g., "7 of 15 answered").
- **FR-016**: The resumption banner MUST provide two distinct user actions: "Resume Quiz" (which navigates directly into the session with saved answers restored) and "Discard" (which cancels the session and allows a fresh start).
- **FR-017**: In Exam Mode, resumed sessions MUST NOT disclose correct answers or explanations prior to final submission.

#### Subject Cards UI & Responsive Grid
- **FR-018**: The subject card hover interaction MUST replace vertical jump translations (`hover:-translate-y-1`) with a smooth elevation drop shadow (`hover:shadow-md` or `hover:shadow-xl`) and subtle border color transition.
- **FR-019**: Each subject card MUST display a dedicated top header containing a subject discipline icon/monogram on the left and a status/term pill on the right.
- **FR-020**: Each subject card MUST display structured metadata tags indicating Grade Level, Track/Strand (for SHS), and DepEd MATATAG curriculum alignment.
- **FR-021**: Each subject card footer MUST place curriculum metrics (e.g., total lessons count) on the left and a high-contrast action button on the right.
- **FR-022**: The subject catalog grid MUST be fluidly responsive across breakpoints: 1 column on mobile (<640px), 2 columns on tablet (640px-1023px), 3 columns on standard desktop (1024px-1535px), and 4 columns on large/ultra-wide screens (≥1536px).

#### Filter & Header Badges Decluttering
- **FR-023**: The subject catalog filter section MUST consolidate multi-row controls into a streamlined filter bar combining level selection, contextual secondary filters, and search.
- **FR-024**: Secondary filters (JHS Quarters, SHS Semesters, SHS Strands) MUST be displayed contextually based on the active level selection rather than showing all permutations simultaneously.
- **FR-025**: The filter bar MUST provide an integrated search input with real-time title/code filtering and a visible "Clear Filters" button when filters are active.
- **FR-026**: The subject detail page header MUST declutter the current 4-badge row by formatting academic hierarchy (code, grade, semester) as clean typographic metadata and reserving the badge container exclusively for access/trial status.

#### Diagnostic Weak Points & Focus Areas
- **FR-027**: The system MUST evaluate the student's most recent quiz attempt per lesson topic to identify weak points where the latest transmuted score is below the DepEd passing threshold (< 75%).
- **FR-028**: The subject curriculum page MUST render a dedicated "Weak Points" / "Focus Areas" diagnostic card displaying the weak lesson topic title, latest score achieved, and sub-topic Key Concept tags.
- **FR-029**: Each weak point item MUST provide a 1-click CTA button ("Practice This Topic") that launches a targeted quiz focused specifically on that lesson topic and its key concepts; achieving a transmuted score ≥ 75% on retake MUST immediately clear the item from Weak Points.
- **FR-030**: When no weak points exist for a student in a given subject, the section MUST display an encouraging mastery confirmation state.

#### Visual Icon Refinements
- **FR-031**: In the Checkout Modal, the Annual Pass card header MUST display the `Crown` icon instead of the generic `Sparkles` icon.
- **FR-032**: The Annual Pass card MUST maintain distinct visual emphasis as the recommended value tier.

---

### Key Entities

- **Subject Presentation Model**: Represents a curriculum subject's visual card layout, including discipline icon, code, title, grade level, track/strand, term pill, lesson count, and navigation route.
- **Filter State Model**: Represents the student's active catalog filters (curriculum level, JHS quarter, SHS semester, SHS strand, search query, and computed match counts).
- **Trial Entitlement & Notice Record**: Represents a student's trial entitlement state (creation timestamp, trial duration days, days remaining, expiration timestamp, hard-gate lock status) and records dispatched notices to ensure idempotency.
- **Multilingual Quiz Item**: Represents a quiz question containing a translated problem statement and explanation, paired with immutable original-language multiple-choice options.
- **Socratic Tutoring Prompt Context**: Represents the localized prompt context passed to the AI Tutor, anchored specifically to the active question's problem statement, options, underlying competency, and student query.
- **Persistent Quiz Session State**: Represents an in-flight or completed quiz session, tracking user ID, subject, lesson, mode, question pool, incrementally saved answers map, active question cursor, and completion timestamp.
- **Competency Weak Point Diagnostic**: Represents an identified area of academic struggle for a student within a subject, characterized by lesson number, title, competency summary, transmuted score (<75%), attempt count, and practice recommendation.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of expired trial users without an active subscription are blocked from accessing lessons, quizzes, and AI tutoring via the hard paywall gate.
- **SC-002**: 100% of trial-expiring reminder emails dispatched to students with 7 days remaining are delivered idempotently, with zero duplicate notices recorded for the same expiration period.
- **SC-003**: In 100% of translated quiz questions (across Taglish, Cebuano, and Ilocano), options A, B, C, and D remain in their standard original English form, with zero corrupted technical terms or formulas.
- **SC-004**: 100% of mathematical formulas in translated quiz stems and explanations render successfully without LaTeX syntax errors.
- **SC-005**: 100% of AI Tutor responses in Study Mode directly address the specific active quiz question scenario without reciting general subject-level introductions.
- **SC-006**: 100% of user answers selected during an active quiz are incrementally persisted, allowing seamless resumption with zero answer loss after browser refresh or tab close.
- **SC-007**: Subject catalog card hover elevation animates smoothly with zero vertical Y-axis jumping (`translate-y: 0px`) across all tested browsers.
- **SC-008**: Subject catalog layout maintains fluid responsiveness across 360px (mobile), 768px (tablet), 1280px (desktop), and 1920px+ (ultra-wide) viewports with zero horizontal scrolling or clipping.
- **SC-009**: Subject catalog filter vertical footprint is reduced by at least 50% compared to the legacy 4-row layout.
- **SC-010**: Students can identify weak points (<75% DepEd mastery) and launch targeted remedial practice in 2 clicks or fewer from the subject page.

---

## Assumptions

1. **Free Trial Duration**: Default trial window is 30 calendar days from the user's account creation timestamp (`user.createdAt`), unless an admin explicitly overrides the duration in settings.
2. **Hard Gate Policy**: When the 30-day trial expires, all core educational features (lessons, quizzes, AI tutor) are locked. Free browsing of the subject catalog and profile settings remains accessible so students can review plans and purchase subscriptions.
3. **DepEd DO 015 Mastery Standard**: A transmuted score of ≥ 75% represents DepEd passing/mastery. Any lesson quiz attempt yielding a transmuted score below 75% is classified as a "Weak Point / Focus Area".
4. **Email Dispatch Infrastructure**: The platform utilizes a modular email adapter supporting Resend API in production with a development console/mock logger, triggered via a secured `/api/cron/trial-reminders` endpoint with `ReminderNotice` records ensuring idempotency.
5. **Session Abandonment Threshold**: Incomplete quiz sessions that have been untouched for over 14 days are considered expired and will not trigger resumption banners.
6. **Device Compatibility**: Responsive grid rules target modern CSS Grid and Flexbox standards supported by all evergreen mobile and desktop web browsers.
