# Phase 0 Technical Research & Architecture Decisions: UI Modernization & Learning Enhancements

**Feature Branch**: `002-ui-and-learning-enhancements`  
**Date**: 2026-10-26  
**Status**: Completed  
**Spec Reference**: `specs/002-ui-and-learning-enhancements/spec.md`  

---

## Executive Summary

Feature 002 delivers an end-to-end upgrade of HighSchool Tutor across 9 core architectural and user-experience areas:
1. **Modernized Subject Cards & Fluid Responsive Grid** (smooth elevation, job-card inspired hierarchy, 1/2/3/4 column breakpoints).
2. **Consolidated Single-Bar Filter** (unified compact control bar, contextual popovers, integrated search, >50% vertical footprint reduction).
3. **Subject Detail Header Decluttering** (academic eyebrow metadata + single access/trial status badge).
4. **Annual Pass Brand Icon Upgrade** (replacing generic `Sparkles` with prestigious `Crown` in `CheckoutModal.tsx`).
5. **30-Day Free Trial Hard Gate & 7-Day Expiration Cron** (contextual lock, `/api/cron/trial-reminders` endpoint with `CRON_SECRET`, modular email adapter with Resend + console fallback, `ReminderNotice` idempotency).
6. **Multilingual Translation Integrity** (strict English preservation for options A, B, C, D across all Philippine dialects; stem & explanation translation with LaTeX protection).
7. **Question-Level Socratic Context** (dynamic active-question anchoring, competency framing, eliminating generic subject-wide lectures).
8. **Quiz State Auto-Persistence & Resumption** (`QuizSession` incremental answer saving, `activeQuestionIndex` cursor, dual-surface resumption cards on Dashboard and Subject pages).
9. **Diagnostic 'Weak Points' by Topic** (latest attempt rule <75% DepEd DO 015 threshold, lesson title, score, sub-topic keyConcepts tags, 1-click targeted practice launch).

---

## Area 1: Subject Cards Elevation & Fluid Responsive Grid

### Context & Problem Statement
The current catalog in `features/curriculum/components/SubjectCatalog.tsx` uses `hover:-translate-y-1` on subject cards. This causes jarring vertical jumps during rapid scrolling, trackpad swipes, or touch events. Furthermore, the cards lack a consistent visual rhythm: metadata chips, term badges, and lesson metrics lack structured vertical anchoring, and the responsive grid exhibits inconsistent column packing on large displays.

### Research Decisions & Technical Architecture
1. **Zero Y-Translation Elevation**:
   - Eliminate `hover:-translate-y-1` and `-translate-y-1`.
   - Apply smooth elevation transitions utilizing Tailwind CSS v4 shadow tokens:
     ```tsx
     className={cn(
       "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card",
       "transition-all duration-300 ease-out",
       "hover:shadow-md dark:hover:shadow-xl hover:border-primary/50 hover:ring-1 hover:ring-primary/20",
       isStudentGrade ? "border-primary/30" : "border-border/60"
     )}
     ```
2. **High-End Job-Card Inspired Internal Hierarchy**:
   - **Header**: Top-left discipline monogram/icon badge with primary accent background (`size-9 rounded-xl bg-primary/10 text-primary border border-primary/20`); Top-right status/term pill (`Quarter 1`, `Semester 1`, or student grade match).
   - **Body**: Bold subject title with `line-clamp-2 min-h-[2.75rem]`, accompanied by structured metadata chips: Grade Level, Track/Strand (for SHS), and DepEd MATATAG curriculum alignment.
   - **Footer**: Left: Curriculum scope metric badge (`{targetLessons} Lessons`, `DepEd DO 015 Aligned`); Right: High-contrast secondary action button (`Explore Subject` with animated right-arrow on group hover).
3. **Fluid Responsive Grid Breakpoints**:
   - Mobile (< 640px): `grid-cols-1` (single column, full width touch targets).
   - Tablet (640px – 1023px): `sm:grid-cols-2` (2 balanced columns).
   - Desktop (1024px – 1535px): `lg:grid-cols-3` (3 standard columns).
   - Large / Ultra-Wide (≥ 1536px): `2xl:grid-cols-4` wrapped in a maximum width container (`max-w-7xl` or `max-w-[1600px]`) to prevent disproportionate card stretching.

### Alternatives Considered & Rejected
- **Preserving `-translate-y-1` with reduced distance**: Rejected because any vertical translation shifts the bounding box under the user's cursor, causing micro-flicker near borders on desktop and misfires on mobile touch.
- **Flexbox Auto-Wrapping**: Rejected because card heights and column widths vary depending on title length, breaking grid alignment.
- **Masonry Layout**: Rejected because cards with differing heights cause misaligned action button baselines across adjacent cards.

---

## Area 2: Consolidated Single-Bar Filter

### Context & Problem Statement
Currently, `SubjectCatalog.tsx` stacks 4 to 5 separate filter rows:
1. Primary Level Tabs (`All`, `Junior High School`, `Senior High School`).
2. JHS Quarter filter button row (`All Quarters`, `Q1`, `Q2`, `Q3`, `Q4`).
3. SHS Semester filter button row (`All Semesters`, `Sem 1`, `Sem 2`).
4. Search input row.
5. SHS Strand filter button row (`All Tracks`, `STEM`, `ABM`, `HUMSS`, `GAS`, `TVL`).

This consumes more than 280px of vertical height before a student can view any subject cards, causing heavy visual clutter and cognitive overhead.

### Research Decisions & Technical Architecture
1. **Unified Single-Row Sticky Header**:
   - Consolidate all filtering controls into a compact toolbar pinned at `sticky top-16 z-20 bg-background/80 backdrop-blur-md py-2.5 border-b border-border/40`.
2. **Segmented Level Switcher**:
   - Compact `Tabs` or segmented control: `All`, `Junior High (Grades 7–10)`, `Senior High (Grades 11–12)`.
3. **Smart Contextual Popover / Dropdown Selectors**:
   - Replace expansive horizontal button rows with contextual secondary dropdown selectors:
     - When viewing JHS or All: A compact `Quarter` dropdown select (`Quarter 1`, `Quarter 2`, `Quarter 3`, `Quarter 4`).
     - When viewing SHS: Compact `Semester` (`Sem 1`, `Sem 2`) and `Strand` (`STEM`, `ABM`, `HUMSS`, `GAS`, `TVL`) dropdown selects.
4. **Integrated Search & Active Filters Bar**:
   - Search input nested alongside filter dropdowns with instant debounced matching on subject code, title, and strand.
   - Real-time active filter counter pill (`Filtered: 2 active [x]`) and a 1-click "Reset" button that returns all controls to default with zero page reloads.

### Alternatives Considered & Rejected
- **Collapsible Filter Accordion**: Rejected because requiring students to toggle an accordion to filter by quarter or semester introduces unnecessary friction.
- **Left Sidebar Filtering**: Rejected because it consumes 25-30% of horizontal viewport width on desktop, which reduces grid columns from 3 or 4 down to 2, and requires a drawer on mobile.
- **Modal Dialog Filters**: Rejected because multi-step modal filtering is unsuitable for rapid subject discovery.

---

## Area 3: Subject Detail Header Typography & Decluttering

### Context & Problem Statement
In `features/curriculum/components/LessonList.tsx` (lines 190–222), the subject overview header places four bulky pill badges adjacent to each other on a single row:
1. Monogram code badge (`MATH7`).
2. Level badge (`Junior High School`).
3. Grade & Term badge (`Grade 7 • Quarter 1`).
4. Trial status badge (`30-Day Free Trial (14d Left • All Lessons Unlocked)`).

This layout causes awkward wrapping on mobile, looks crowded, and dilutes the visual priority of the user's access status.

### Research Decisions & Technical Architecture
1. **Academic Eyebrow Typographic Hierarchy**:
   - Transform curriculum metadata into a crisp, readable typographic eyebrow line:
     ```tsx
     <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
       <span className="font-mono font-bold uppercase tracking-wider text-primary">
         {subject.code}
       </span>
       <span>•</span>
       <span>{subject.level}</span>
       <span>•</span>
       <span>{subject.grade} — {subject.term}</span>
     </div>
     ```
2. **Single High-Priority Access/Trial Badge Slot**:
   - Reserve the dedicated badge container exclusively for subscription or trial access state:
     - **Active Subscription**:
       `<Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 gap-1.5 font-bold"><CheckCircle2 className="size-3 text-emerald-600" /> Subscription Active</Badge>`
     - **Active Trial**:
       `<Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-500/10 gap-1.5 font-bold"><Clock className="size-3 text-emerald-600" /> 30-Day Free Trial ({trialStatus.daysRemaining}d Left)</Badge>`
     - **Expired Trial**:
       `<Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-500/10 gap-1.5 font-bold"><Lock className="size-3 text-amber-600" /> Trial Expired (Upgrade to Unlock)</Badge>`

### Alternatives Considered & Rejected
- **Removing Academic Metadata**: Rejected because students and teachers need immediate confirmation of the subject code, grade, and quarter/semester.
- **Tooltip Metadata**: Rejected because tooltips are hidden on mobile devices and reduce discoverability.

---

## Area 4: Annual Pass Brand Icon Upgrade

### Context & Problem Statement
In `features/billing/components/CheckoutModal.tsx` (line 161), the Annual Unlimited Pass card header currently displays the `<Sparkles>` icon:
`<Sparkles className="size-4 text-primary" />`.
The `Sparkles` icon is already used for general AI hints, new feature announcements, and trial notifications across the app. This dilutes the Annual Pass's positioning as the top-tier VIP offering.

### Research Decisions & Technical Architecture
1. **Crown Icon Placement**:
   - Replace `<Sparkles>` with `<Crown>` from `lucide-react`:
     ```tsx
     <div className="flex items-center gap-1.5 mb-1">
       <Crown className="size-4 text-amber-500 fill-amber-500/20" />
       <span className="text-sm font-semibold text-foreground">Annual Unlimited</span>
     </div>
     ```
2. **Visual Distinction**:
   - Pair the `Crown` icon with gold/amber styling (`text-amber-500`) and a badge (`Save ₱1,089`), clearly communicating that the Annual Pass provides full VIP school-year access.

### Alternatives Considered & Rejected
- **Keeping `Sparkles`**: Rejected due to icon collision and lack of premium tier distinction.
- **Using `ShieldCheck` or `Star`**: Rejected because `Crown` is universally recognized in SaaS pricing as the unrestricted, premier tier.

---

## Area 5: 30-Day Free Trial Hard Gate & 7-Day Expiration Email

### Context & Problem Statement
The 30-day trial model must be enforced consistently across both client UI and server actions. If a student's trial expires without an active subscription, the platform must allow discovery browsing of the catalog and dashboard with lock indicators, but strictly block lesson reading, quiz starts, and AI tutor queries. Additionally, students with 7 days remaining before expiration must receive an advance email warning to prevent sudden drop-offs.

### Research Decisions & Technical Architecture
1. **Contextual Hard Gate Logic**:
   - In `features/curriculum/utils/tier-guardrails.ts`:
     ```ts
     export function canAccessLesson(
       lessonNumber: number,
       isSubscribed: boolean = false,
       maxFreeLessons: number = FREE_TIER_MAX_LESSONS_PER_SUBJECT,
       isTrialActive: boolean = false
     ): boolean {
       // If student is subscribed or within their 30-day trial, grant full access
       if (isSubscribed || isTrialActive) return true;
       // Once 30-day trial has expired and no active subscription, all lessons are strictly locked
       return false;
     }
     ```
   - In Server Actions (`createQuizSessionAction`, `getLessonMaterialAction`, `askTutorAction`): Verify subscription and trial status server-side. Return explicit error code `TRIAL_EXPIRED` if access is denied.
   - In Client UI: Catch `TRIAL_EXPIRED` or check `trialStatus.isExpired` to invoke `openUpgradeModal({ featureName, reason })`.
2. **Automated 7-Day Expiration Cron Route (`/api/cron/trial-reminders`)**:
   - Pinned at `app/api/cron/trial-reminders/route.ts`.
   - Secured via HTTP Header: `Authorization: Bearer <CRON_SECRET>` verified against `process.env.CRON_SECRET`.
   - Eligibility Query:
     - Users with NO active subscription (`Subscription.status = 'ACTIVE'` and `expiresAt > now`).
     - Account created between 23.0 and 24.0 days ago (meaning exactly 7 days remaining in the 30-day window: `expiresAt = createdAt + 30 days`).
     - No existing `ReminderNotice` of kind `"trial_expiring_7d"` for this user.
3. **Modular Email Transport Adapter**:
   - Implement `features/billing/services/email-service.ts`:
     - Primary: Resend API adapter (`https://api.resend.com/emails`) triggered when `process.env.RESEND_API_KEY` is present.
     - Fallback: Local development console logger that prints structured email payloads with upgrade URLs.
4. **Idempotency Guarantee via `ReminderNotice`**:
   - Record sent notices in PostgreSQL:
     ```ts
     await prisma.reminderNotice.create({
       data: {
         userId: user.id,
         kind: "trial_expiring_7d",
         periodKey: "day_7",
         channel: "email",
         destination: user.email,
         result: "sent",
         detail: JSON.stringify({ daysRemaining: 7, trialExpiresAt }),
       },
     });
     ```
   - Composite unique constraint `@@unique([userId, kind, periodKey, channel])` prevents duplicate notices even if the cron runs multiple times daily.

### Alternatives Considered & Rejected
- **Hard-Blocking Login/Catalog on Expiry**: Rejected per Clarification 1; students must be able to log in, explore the catalog, and view pricing plans to purchase.
- **Client-Triggered Email on Login**: Rejected because students who do not log in on Day 23 would never receive the expiration warning.
- **Pure In-Memory / Cron State**: Rejected because server restarts or serverless function invocations would lose notification history and cause duplicate emails.

---

## Area 6: Multilingual Translation Integrity

### Context & Problem Statement
In `features/curriculum/api/gemini-service.ts`, `batchTranslateQuizQuestion` currently translates the question stem, all 4 options, and the explanation into the chosen Philippine dialect (e.g., Taglish, Cebuano, Ilocano).
Translating multiple-choice options garbles scientific formulas, algebraic variables, chemical formulas (e.g., $H_2SO_4$), and standardized terminology.

### Research Decisions & Technical Architecture
1. **Strict English Preservation for Options A, B, C, D**:
   - Clarification 5 and FR-006 / FR-007 mandate: Translate ONLY the question stem (`question`) and the `explanation`.
   - Multiple-choice options A, B, C, and D remain 100% in their original English form across all Philippine dialects.
2. **Updated Gemini Prompt & Output Schema**:
   - Prompt directive:
     ```text
     Translate ONLY the question stem and the explanation into ${language}.
     Do NOT translate or modify options A, B, C, D. All option texts, numerical values, and formulas must remain in their original English format.
     Preserve all LaTeX math expressions ($...$ and $$...$$) exactly as written.
     ```
   - JSON Schema for Gemini structured output:
     ```json
     {
       "type": "OBJECT",
       "properties": {
         "question": { "type": "STRING" },
         "explanation": { "type": "STRING" }
       },
       "required": ["question", "explanation"]
     }
     ```
3. **Response Assembly & KaTeX Delimiter Protection**:
   - Assemble final object:
     ```ts
     return {
       question: result.question,
       options: item.options, // 100% untouched original English options
       explanation: result.explanation,
     };
     ```
   - Validate LaTeX balance: Ensure unescaped `$` counts are even in both translated stems and explanations before serving.

### Alternatives Considered & Rejected
- **Option Translation with a Glossary Whitelist**: Rejected because glossaries are brittle, difficult to maintain across multiple regional dialects, and frequently miss edge-case technical terminology.
- **Translating Options in Humanities but not STEM**: Rejected because maintaining separate dialect translation rules creates unpredictable behavior and user confusion.

---

## Area 7: Question-Level Socratic Context

### Context & Problem Statement
Currently, `buildTutorSystemPrompt` in `gemini-service.ts` receives general lesson metadata and conversation history. In Study Mode, when a student opens the AI Tutor Drawer and asks for a hint, the AI frequently delivers broad, subject-wide introductory summaries instead of addressing the specific question number and variables on screen. Furthermore, advancing to subsequent questions does not update the AI's anchoring.

### Research Decisions & Technical Architecture
1. **Prompt Anchoring to Active Question**:
   - Refactor `buildTutorSystemPrompt` to explicitly instruct:
     ```text
     CRITICAL ANCHORING INSTRUCTION:
     You are assisting the student exclusively on the active quiz question below:
     Question: "${params.question}"
     Targeted Competency: "${params.lessonTitle}"
     Options: A) ${params.options.A}, B) ${params.options.B}, C) ${params.options.C}, D) ${params.options.D}

     SOCRATIC DIRECTIVE:
     - Do NOT lecture broadly on the overall subject.
     - Focus your guidance directly on the specific numbers, variables, and scenario in this question.
     - Guide the student step-by-step through the first diagnostic step.
     - NEVER reveal the correct option letter (${params.answer}) or final answer value.
     ```
2. **Dynamic UI Anchoring in `AITutorDrawer`**:
   - Add an active question indicator banner at the top of the chat:
     `Anchored to Question #{activeQuestionIndex + 1}` with a snippet of the question stem.
   - When the student advances to a different question:
     - Clear the previous question's ephemeral chat context or insert a visual separator (`--- Shifted to Question #{index + 1} ---`).
     - Reset quick-action prompt buttons to question-specific triggers:
       - "Give me a hint for this question"
       - "What concept does this problem test?"
       - "What is the first step to solve this?"

### Alternatives Considered & Rejected
- **Sharing Full Chat History Across All Questions**: Rejected because when a student moves from Question 2 (kinematics) to Question 3 (thermodynamics), a unified conversation history confuses Gemini into combining formulas from both questions.
- **Forcing the Drawer to Close on Question Change**: Rejected because it causes poor UX for students who keep the drawer open while navigating through questions.

---

## Area 8: Quiz Auto-Persistence & Resumption ('Continue Quiz')

### Context & Problem Statement
When students take a 10 to 24 question quiz on mobile or spotty Wi-Fi, accidental browser reloads, incoming phone calls, or tab closures cause them to lose all selected answers. Currently, `QuizRunner.tsx` stores answers in client `useState`, and only persists them upon final `submitQuizSessionAction`.

### Research Decisions & Technical Architecture
1. **Prisma Model Updates (`QuizSession`)**:
   - Add cursor tracking:
     `activeQuestionIndex Int @default(0)`
   - Utilize existing `userAnswers Json?` to store a map of answered questions:
     `Record<number, "A" | "B" | "C" | "D">`.
2. **Incremental Answer Persistence Server Action**:
   - Implement `saveQuizProgressAction(sessionId: string, activeQuestionIndex: number, userAnswers: Record<number, "A" | "B" | "C" | "D">)`:
     - Verifies session ownership against `sessionUser.id`.
     - Persists answers and cursor position to PostgreSQL with debounced calls (300ms) on option selection.
3. **Session Querying & Discard Actions**:
   - `getActiveQuizSessionAction(subjectSlug?: string)`:
     - Finds uncompleted quiz sessions (`completedAt: null`) created within the past 14 days for the authenticated user.
     - Computes answered count (e.g., 7 of 15).
   - `discardQuizSessionAction(sessionId: string)`:
     - Deletes or archives the incomplete session, allowing the student to start fresh.
4. **Dual Resumption Surfaces (Clarification 3)**:
   - **Student Dashboard (`/dashboard`)**: Displays a top resumption card:
     `"You have an unfinished Exam Quiz in General Biology: 7 of 15 answered"` with `Resume Quiz` and `Discard` buttons.
   - **Subject Curriculum Page (`/curriculum/[slug]`)**: Displays a matching resumption card above the lesson list for incomplete quizzes in that specific subject.
5. **Exam Mode Security**:
   - Resuming in Exam Mode restores answers and cursor position, but correct answers and explanations remain strictly hidden on the server until official submission.

### Alternatives Considered & Rejected
- **LocalStorage-Only Persistence**: Rejected because answers would not sync across devices (e.g. starting on phone, resuming on laptop) and would be lost if browser cache is cleared.
- **Persisting Every Keystroke as an Immutable Event**: Rejected as over-engineered for multiple-choice quizzes; updating the session row JSON column provides optimal performance and simplicity.

---

## Area 9: Diagnostic 'Weak Points' by Topic & Targeted Practice

### Context & Problem Statement
Students lack a centralized view of specific curriculum topics they have not yet mastered under DepEd DO 015 s. 2026 standards (transmuted score < 75%). They are forced to review individual past attempts to find gaps.

### Research Decisions & Technical Architecture
1. **Latest Attempt Rule (Clarification 4)**:
   - Query all `QuizAttempt` records for the authenticated student in the subject, ordered by `createdAt: "desc"`.
   - Take the most recent attempt for each unique `lessonNumber`.
   - Calculate transmuted score via DepEd DO 015 s. 2026 formula:
     ```ts
     const percentage = (score / total) * 100;
     let transmuted = 60;
     if (percentage >= 100) transmuted = 100;
     else if (percentage >= 60) transmuted = Math.round(75 + ((percentage - 60) * 25) / 40);
     else transmuted = Math.round(60 + (percentage / 60) * 14);
     ```
   - If `transmuted < 75`, classify the topic as an active **Weak Point**.
   - If a student retakes the quiz and scores `≥ 75%`, the latest attempt clears the weak point immediately.
2. **Key Concepts Extraction**:
   - Retrieve `keyConcepts` (e.g., `["Balancing Equations", "Molar Mass", "Combustion Reactions"]`) from `CachedLesson` or curriculum data for the weak lesson topic to give students actionable sub-topic focus tags.
3. **UI Diagnostic Card (`SubjectWeakPointsCard.tsx`)**:
   - Positioned on `/curriculum/[slug]` above the lesson list.
   - Renders each weak topic with:
     - Topic Title & Lesson Number
     - Achieved score & transmuted percentage with an alert badge (`Score: 60% • Needs Review`)
     - Sub-topic Key Concept tags
     - 1-click CTA: `Practice This Topic` (creates a targeted Study Mode session with 10 questions for that lesson).
4. **Empty State**:
   - If all attempted topics have latest transmuted scores ≥ 75% (or no quizzes attempted), display an encouraging mastery state:
     `"All caught up! Zero weak points detected in this subject."`

### Alternatives Considered & Rejected
- **Averaging All Historical Attempts**: Rejected because a student who scored 40% on their first try and 90% on their retake would have an average of 65% and remain falsely flagged as weak, penalizing learning progression.
- **Question-Level Tagging without Topic Grouping**: Rejected because students study by DepEd lesson modules; topic-level grouping provides clear, actionable study targets.

---

## Research Synthesis & Approved Architecture

All 9 areas have clear, validated implementation paths that integrate seamlessly into HighSchool Tutor's Feature-Driven Architecture (FDA), PostgreSQL database, Prisma ORM, and React 19 / Next.js 16 runtime. Zero unresolved technical blockers remain. Phase 1 (Data Model & Contracts) can proceed immediately.
