# Feature Specification: Dynamic Card Progress and Structured 3-Tab Lesson Reader

**Feature Branch**: `003-dynamic-progress-and-structured-lessons`  
**Task ID**: `TASK-027`  
**Created**: 2026-10-27  
**Status**: Draft (Approved via `/grill-me` alignment)  

---

## 1. Executive Summary & Background

In the current HighSchool Tutor platform, subject cards in the catalog (`SubjectCatalog.tsx`) display a static, redundant gray container (`bg-muted/40`) containing repetitive boilerplate (`Curriculum Scope: 8 Lessons` and `Grading Cycle: 4 DepEd Quarters`) that adds visual clutter without communicating personalized learning progress to students. Furthermore, subject exploration action buttons use generic labels ("Explore Subject"), subject detail views (`LessonList.tsx`) inconsistently mix "Lesson" and "Topic" terminology, and the lesson study reader (`LessonReaderModal.tsx`) renders lesson content in an unstructured, monolithic single-page markdown document that overwhelms high school students preparing for exams.

This specification defines the comprehensive upgrade for **TASK-027**, delivering:
1. **Dynamic Student Progress Overhaul on Subject Cards**: Eliminating static gray boxes in `SubjectCatalog.tsx` in favor of a sleek, minimalist one-liner metric showing live student topic completion (`Not Started • 0/8 Topics`, `In Progress • 3/8 Topics (38%)` with active progress bar, or `✓ Completed • 8/8 Topics` with emerald indicator, and a guest fallback). Action buttons are elevated to `Review Subject` with smooth hover micro-interactions. Server progress data is fetched via an optimized indexed Server Action (`getUserCatalogProgressAction`) and consumed via TanStack Query (`useCatalogProgressQuery`).
2. **Subject Detail Header & Terminology Alignment**: Standardizing academic terminology across `LessonList.tsx` to "8 Topics" instead of "8 Lessons", "Topic #{number}: {title}", and "Practice This Topic".
3. **Structured 3-Tab Lesson Reader**: Refactoring `LessonReaderModal.tsx` into a high-yield, 3-tab study experience:
   - 📘 **Tab 1: Study Notes**: Concept overview, DepEd MATATAG competencies, definitions, and core principles.
   - ✏️ **Tab 2: Worked Examples**: 1–2 step-by-step solved sample problems with formulas, derivations, and clear explanations.
   - 💡 **Tab 3: Quick Review & Pitfalls**: Common exam traps, test-taking tips, and high-yield takeaway bullet points (`keyTakeaways`).
   - Persistent, sticky bottom bar with a prominent "Start Practice Drill" CTA button triggering the quiz workflow.
4. **Guaranteed Structured AI Generation & Starter Fallback**: Refactoring Gemini prompts and structured JSON schemas in `gemini-service.ts` to output 5 discrete fields (`overview`, `studyNotes`, `workedExamples`, `pitfalls`, `keyTakeaways`), upgrading the fallback starter template in `getLessonMaterialAction` for instant complete 3-tab rendering on ungenerated topics, and guaranteeing robust backwards-compatibility for legacy single-document markdown entries via a resilient markdown section parser.

---

## 2. Clarifications & Alignment from `/grill-me`

- **Q1: What should subject cards display for unauthenticated guests or while student progress is loading?**  
  *Resolution*: Render the subtle fallback `8 DepEd Topics • Practice Drills` with a neutral or subtle progress bar, preventing layout shift while maintaining high aesthetic standards.
- **Q2: How is subject completion calculated for the catalog cards?**  
  *Resolution*: A topic is counted as completed for a user if they have recorded at least one completed quiz attempt for that topic (`prisma.quizAttempt`). The aggregate query groups by `subjectSlug` and counts unique `lessonNumber` entries per subject for the user, comparing against the total topics count (default 8).
- **Q3: What happens if an existing lesson in PostgreSQL (`lesson_materials`) only contains a legacy flat markdown document?**  
  *Resolution*: Backwards-compatibility is strictly maintained. A parser utility (`parseStructuredLessonContent`) detects whether the content is structured JSON or delimited markdown (e.g. `## 1. Key Concepts`, `## 2. Step-by-Step`, `## 3. Common Misconceptions`). If delimited, it partitions content into the 3 tabs. If unstructured, it places the markdown in Tab 1 (Study Notes), displays a contextual prompt in Tab 2 (Worked Examples), and synthesizes summary bullet points in Tab 3 (Quick Review).
- **Q4: How does the bottom action bar in `LessonReaderModal.tsx` behave on long lesson notes?**  
  *Resolution*: It is fixed/sticky at the base of the modal with a subtle top border and backdrop blur, ensuring students can launch the practice drill at any moment during study without scrolling to the bottom.

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 (Priority: P1) - Dynamic Subject Card Progress & Sleek Visual Rhythm
**As a** student browsing the subject catalog (`/curriculum`),  
**I want to** immediately see my personalized topic completion progress for every subject right on the catalog cards without static repetitive clutter,  
**So that** I know exactly which subjects require my attention and can jump back in with confidence.

#### Acceptance Criteria:
1. **SC-001 (Static Box Removal)**: The redundant gray container (`bg-muted/40`) containing "Curriculum Scope: 8 Lessons" and "Grading Cycle: 4 DepEd Quarters" is completely eliminated from both JHS and SHS cards in `SubjectCatalog.tsx`.
2. **SC-002 (Not Started State)**: For an authenticated user who has completed 0 topics in a subject, the card renders `Not Started • 0/8 Topics` with an empty or subtle track progress bar.
3. **SC-003 (In Progress State)**: For an authenticated user who has completed $K$ of $N$ topics ($0 < K < N$), the card renders `In Progress • ${completed}/${total} Topics (${percent}%)` with an active colored progress bar matching the subject accent.
4. **SC-004 (Completed State)**: For an authenticated user who has completed all topics ($K = N$), the card displays `✓ Completed • ${total}/${total} Topics` with an emerald badge/indicator.
5. **SC-005 (Guest / Loading State)**: For guest/unauthenticated users or during initial query load, the card renders `8 DepEd Topics • Practice Drills`.
6. **SC-006 (Action Button)**: Action button label is updated from `Explore Subject` to `Review Subject` with smooth hover micro-interaction (`ChevronRight` translates smoothly).
7. **SC-007 (High-Efficiency Fetching)**: `getUserCatalogProgressAction` executes a single indexed query over `prisma.quizAttempt` filtered by `userId`, aggregating completed topics per `subjectSlug` with zero N+1 database queries. Consumed via `useCatalogProgressQuery` with 2-minute stale time.

---

### User Story 2 (Priority: P1) - Structured 3-Tab Lesson Reader with Sticky Action Bar
**As a** high school student preparing for a DepEd quarterly exam or diagnostic drill,  
**I want** lesson study material organized into distinct tabs for Study Notes, Worked Examples, and Quick Review/Pitfalls,  
**So that** I can systematically grasp concepts, see step-by-step problem walkthroughs, and avoid common test traps before taking the quiz.

#### Acceptance Criteria:
1. **SC-008 (3-Tab Navigation)**: `LessonReaderModal.tsx` incorporates Radix/Shadcn UI `Tabs` with 3 accessible tabs:
   - 📘 **Tab 1: Study Notes**: Concept overview, DepEd MATATAG competencies, definitions, and core principles.
   - ✏️ **Tab 2: Worked Examples**: 1–2 step-by-step solved sample problems with formulas, derivations, and clear explanations.
   - 💡 **Tab 3: Quick Review & Pitfalls**: Common exam traps, test-taking tips, and high-yield takeaway bullet points (`keyTakeaways`).
2. **SC-009 (Sticky Action Bar)**: A persistent bottom bar contains the primary CTA button labeled `Start Practice Drill` (with play icon and arrow), which immediately closes the modal and opens the quiz setup/runner.
3. **SC-010 (AI Prompts Trigger)**: The header maintains the `AI Prompts for this Topic` button triggering `useAiPromptsModalStore`.
4. **SC-011 (Responsive Layout & Scroll Isolation)**: The modal content body is independently scrollable while the header and footer remain stationary. The tab triggers wrap or scale cleanly on mobile viewports.

---

### User Story 3 (Priority: P2) - DepEd MATATAG AI Content Generation & Resilient Starter Fallback
**As a** student or teacher accessing any curriculum topic,  
**I want** AI-generated lessons and fallback starter material to both provide rich, complete content across all three tabs,  
**So that** no tab is ever empty or missing crucial worked examples and exam pitfalls.

#### Acceptance Criteria:
1. **SC-012 (Structured Gemini Schema)**: `generateLessonContentWithGemini` in `features/curriculum/api/gemini-service.ts` uses an enforced JSON schema guaranteeing 5 discrete properties:
   - `overview`: string (essential question and competency intro)
   - `studyNotes`: string (core concepts, definitions, formulas)
   - `workedExamples`: string (step-by-step solved sample problems with derivations)
   - `pitfalls`: string (common exam traps, mistakes, test tips)
   - `keyTakeaways`: string[] (3-5 high-yield takeaway bullet points)
2. **SC-013 (Starter Template Synthesis)**: In `features/curriculum/actions/lesson-material.actions.ts`, when a topic has not been saved in PostgreSQL, `getLessonMaterialAction` synthesizes a rich starter object that populates all 3 tabs with valid Markdown tailored to the subject and topic key concepts.
3. **SC-014 (Backwards Compatibility Parser)**: A utility `parseStructuredLessonContent` parses legacy markdown rows from `prisma.lessonMaterial` by matching section headings or JSON structures, mapping content safely into the 3 tabs without runtime errors.

---

### User Story 4 (Priority: P2) - Topic Terminology Alignment Across Subject Views
**As a** student navigating a subject's curriculum page (`/curriculum/[slug]`),  
**I want** clear and uniform terminology referring to curriculum units as "Topics" rather than "Lessons",  
**So that** navigation is consistent between catalog cards, progress summaries, and drill launchers.

#### Acceptance Criteria:
1. **SC-015 (Card Header & Badges)**: In `LessonList.tsx`, the lessons header is updated to `Curriculum Topics ({count})`.
2. **SC-016 (Progress Bar Summary)**: Progress text is updated to `{attemptedCount} of {totalLessonsCount} topics completed`.
3. **SC-017 (Card Titles & Buttons)**: Topic cards display `Topic #{number}: {title}` and the primary drill button is labeled `Practice This Topic`.
4. **SC-018 (Page Subtitle)**: Hero description is refined to align with topic mastery and practice drills.

---

## 4. Non-Functional Requirements & Architecture Guardrails

- **FDA Architecture Compliance**: All code changes reside strictly in `features/curriculum/actions/`, `features/curriculum/api/`, `features/curriculum/components/`, `features/curriculum/hooks/`, and `features/curriculum/types/`. No logic placed in `app/`.
- **State Management Separation**: Server progress data is fetched via TanStack Query (`useCatalogProgressQuery`). Ephemeral modal state uses Zustand (`useAiPromptsModalStore`, `useUpgradeModalStore`). Zero syncing of server queries into Zustand stores via `useEffect`.
- **DepEd DO 015 s. 2026 Compliance**: All scoring, passing grades (≥ 75%), and mastery metrics strictly adhere to DepEd DO 015 s. 2026 standards.
- **Database Index Optimization**: The aggregation query in `getUserCatalogProgressAction` leverages the existing composite index `@@index([userId, subjectSlug, lessonNumber])` on `QuizAttempt` to guarantee sub-20ms query execution across thousands of student attempts.
- **Strict TypeScript & Zod**: Full type coverage with zero `any` assertions. Zod validation schemas for all actions and API inputs.
