---
description: "Comprehensive task decomposition for Dynamic Card Progress and Structured 3-Tab Lesson Reader"
---

# Tasks: Dynamic Card Progress and Structured 3-Tab Lesson Reader

**Input**: Design documents from `/specs/003-dynamic-progress-and-structured-lessons/` (`spec.md`, `plan.md`)  
**Prerequisites**: `spec.md`, `plan.md`  
**Organization**: Tasks are grouped into Setup, Foundational, 4 User Story phases (P1 and P2), and Verification & Delivery.  

## Format: `[TaskID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Maps task to specific user story (`[US1]` through `[US4]`)
- Every task includes exact project-relative file paths in its description

---

## Phase 1: Setup & Environment (Shared Infrastructure)

**Purpose**: Verify database indexing, configuration values, and establish test suites.

- [ ] T001 Verify database indexes on `QuizAttempt` and `LessonMaterial` in `prisma/schema.prisma` ensuring index `@@index([userId, subjectSlug, lessonNumber])` is active.
- [ ] T002 [P] Create initial unit test file `tests/unit/catalogProgressAndLessonReader.test.ts` scaffolding test cases for progress calculations and structured lesson content parsing.

---

## Phase 2: Foundational Prerequisites (Domain Types & Content Parser Utility)

**Purpose**: Define typed contracts and content parsing utilities needed by all user stories.

**⚠️ CRITICAL**: Must be completed before User Story UI and Server Action implementation.

- [ ] T003 [P] Define `SubjectCatalogProgress`, `UserCatalogProgressMap`, and `StructuredLessonContent` types in `features/curriculum/types/curriculum.types.ts`.
- [ ] T004 [P] Update `LessonMaterialData` in `features/curriculum/actions/lesson-material.actions.ts` to include structured content fields (`overview`, `studyNotes`, `workedExamples`, `pitfalls`, `structuredContent`).
- [ ] T005 Create `features/curriculum/utils/lesson-content-parser.ts` implementing `parseStructuredLessonContent` to parse JSON strings, partitioned markdown with section headers, or flat markdown fallbacks into `StructuredLessonContent`.
- [ ] T006 Write comprehensive unit tests for `parseStructuredLessonContent` in `tests/unit/catalogProgressAndLessonReader.test.ts` covering JSON, delimited sections, and unstructured markdown inputs.

**Checkpoint**: Foundation ready — User Story implementation can proceed in parallel or prioritized sequence.

---

## Phase 3: User Story 1 (Priority: P1) - Dynamic Subject Card Progress Overhaul 🎯 MVP

**Goal**: Replace static gray boilerplate boxes in `SubjectCatalog.tsx` with dynamic, real-time student topic progress and update action buttons to `Review Subject`.  
**Independent Test**: Load the catalog as a guest (verify fallback), log in as a student with 0 attempts (verify "Not Started"), complete a quiz attempt (verify "In Progress • 1/8 Topics (13%)" with colored bar), and complete all 8 (verify "✓ Completed • 8/8 Topics" emerald indicator).

### Implementation for User Story 1

- [ ] T007 [US1] Implement `getUserCatalogProgressAction` in `features/curriculum/actions/curriculum.actions.ts` querying `prisma.quizAttempt` for the authenticated user, aggregating distinct attempted topics per `subjectSlug`, and returning `UserCatalogProgressMap`.
- [ ] T008 [P] [US1] Create TanStack Query hook `useCatalogProgressQuery` in `features/curriculum/hooks/useCatalogProgressQuery.ts` fetching user catalog progress with a 2-minute stale time and graceful unauthenticated handling.
- [ ] T009 [US1] Refactor JHS and SHS subject cards in `features/curriculum/components/SubjectCatalog.tsx` to eliminate the static `bg-muted/40` box ("Curriculum Scope: 8 Lessons", "Grading Cycle: 4 DepEd Quarters") and replace it with dynamic progress metrics (Not Started, In Progress with active colored bar, Completed with emerald badge, or Guest/Loading fallback).
- [ ] T010 [US1] Update card action button text from `Explore Subject` to `Review Subject` with smooth hover micro-interaction (`ChevronRight` translate) in `features/curriculum/components/SubjectCatalog.tsx`.
- [ ] T011 [US1] Write unit tests in `tests/unit/catalogProgressAndLessonReader.test.ts` verifying topic count aggregation and progress percentage calculation logic.

**Checkpoint**: User Story 1 is fully functional and independently verifiable against SC-001 through SC-007.

---

## Phase 4: User Story 2 (Priority: P1) - Structured 3-Tab Lesson Reader

**Goal**: Transform `LessonReaderModal.tsx` into a structured 3-tab study experience with Study Notes, Worked Examples, and Quick Review/Pitfalls, paired with a sticky persistent bottom CTA bar.  
**Independent Test**: Click any accessible lesson card on `/curriculum/[slug]`: verify modal opens with 3 tabs, switching tabs reveals corresponding content, AI Prompts modal button remains functional in header, and sticky bottom bar has prominent "Start Practice Drill" button that launches quiz setup.

### Implementation for User Story 2

- [ ] T012 [US2] Refactor `features/curriculum/components/LessonReaderModal.tsx` using Shadcn `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`) to render 3 dedicated tabs:
  - 📘 **Tab 1: Study Notes** (Concept overview, DepEd MATATAG competencies, definitions, and core principles)
  - ✏️ **Tab 2: Worked Examples** (1–2 step-by-step solved sample problems with formulas, derivations, and clear explanations)
  - 💡 **Tab 3: Quick Review & Pitfalls** (Common exam traps, test-taking tips, and high-yield takeaway bullet points)
- [ ] T013 [US2] Implement fixed/sticky bottom action bar in `features/curriculum/components/LessonReaderModal.tsx` featuring a prominent `Start Practice Drill` CTA button with play icon and smooth transition to `onStartQuiz()`.
- [ ] T014 [US2] Preserve the `AI Prompts for this Topic` button in the modal header of `features/curriculum/components/LessonReaderModal.tsx` triggering `useAiPromptsModalStore`.
- [ ] T015 [US2] Ensure scroll isolation and responsive tab trigger layout on mobile viewports within `features/curriculum/components/LessonReaderModal.tsx`.

**Checkpoint**: User Story 2 is fully functional and independently verifiable against SC-008 through SC-011.

---

## Phase 5: User Story 3 (Priority: P2) - Guaranteed Structured AI Generation & Starter Template Enhancement

**Goal**: Guarantee that AI generation outputs 5 structured fields and ungenerated topics synthesize rich starter markdown across all 3 tabs, while maintaining 100% backwards-compatibility for legacy records.  
**Independent Test**: Trigger AI lesson generation for a topic: verify Gemini returns all 5 fields. View an ungenerated topic: verify starter template immediately populates all 3 tabs with valid markdown. View a legacy DB row: verify parser gracefully separates sections.

### Implementation for User Story 3

- [ ] T016 [US3] Refactor `generateLessonContentWithGemini` in `features/curriculum/api/gemini-service.ts` to instruct Gemini to generate structured output matching a 5-property JSON schema (`overview`, `studyNotes`, `workedExamples`, `pitfalls`, `keyTakeaways`).
- [ ] T017 [US3] Update `generateLessonMaterialAiAction` in `features/curriculum/actions/lesson-material.actions.ts` to format and persist the structured lesson material with clean markdown section headers.
- [ ] T018 [US3] Upgrade the fallback starter template synthesis in `getLessonMaterialAction` in `features/curriculum/actions/lesson-material.actions.ts` to immediately generate rich, formatted Markdown across Study Notes, Worked Examples, and Quick Review/Pitfalls when no database entry exists.
- [ ] T019 [US3] Integrate `parseStructuredLessonContent` in `getLessonMaterialAction` in `features/curriculum/actions/lesson-material.actions.ts` so all returned `LessonMaterialData` objects include populated `structuredContent` properties.

**Checkpoint**: User Story 3 is fully functional and independently verifiable against SC-012 through SC-014.

---

## Phase 6: User Story 4 (Priority: P2) - Topic Terminology Alignment Across Subject Views

**Goal**: Standardize curriculum terminology from "Lesson" to "Topic" across `LessonList.tsx`.  
**Independent Test**: Navigate to `/curriculum/[slug]`: verify header says "Curriculum Topics", card titles say "Topic #{number}: {title}", buttons say "Practice This Topic", and progress bar says "{completed} of {total} topics completed".

### Implementation for User Story 4

- [ ] T020 [US4] Update header title from `Curriculum Lessons ({count})` to `Curriculum Topics ({count})` in `features/curriculum/components/LessonList.tsx`.
- [ ] T021 [US4] Update subject mastery progress description to `{attemptedCount} of {totalLessonsCount} topics completed` in `features/curriculum/components/LessonList.tsx`.
- [ ] T022 [US4] Update topic card titles to `Topic #{lesson.number}: {lesson.title}` and action button from `Take Quiz` to `Practice This Topic` in `features/curriculum/components/LessonList.tsx`.
- [ ] T023 [US4] Update hero subtitle and modal labels in `features/curriculum/components/LessonList.tsx` to align with topic terminology.

**Checkpoint**: User Story 4 is fully functional and independently verifiable against SC-015 through SC-018.

---

## Phase 7: Verification, Quality Assurance & Backlog Logging

**Purpose**: Execute full verification suite, verify zero type regressions, and document changes.

- [ ] T024 Run all unit tests via `npm test` verifying test pass in `tests/unit/catalogProgressAndLessonReader.test.ts`.
- [ ] T025 Execute type checking via `npx tsc --noEmit` verifying zero TypeScript compilation errors.
- [ ] T026 Execute production linting via `npm run lint` verifying zero lint violations.
- [ ] T027 Update `docs/tasks/TASK-027-dynamic-card-progress-and-structured-lesson-reader.md` marking completed tasks and verification checks.
- [ ] T028 Append implementation entry to `docs/backlog.md` detailing all delivered features, modified files, and verification results.
