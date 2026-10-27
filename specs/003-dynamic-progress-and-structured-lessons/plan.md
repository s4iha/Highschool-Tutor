# Implementation Plan: Dynamic Card Progress and Structured 3-Tab Lesson Reader

**Feature Branch**: `003-dynamic-progress-and-structured-lessons`  
**Task ID**: `TASK-027`  
**Date**: 2026-10-27  
**Spec Reference**: `specs/003-dynamic-progress-and-structured-lessons/spec.md`  

---

## 1. Summary of Changes

This implementation plan delivers a cohesive upgrade across 4 core areas of HighSchool Tutor:
1. **Dynamic Catalog Card Progress (`SubjectCatalog.tsx`)**:
   - Removes the static, redundant `bg-muted/40` gray container ("Curriculum Scope: 8 Lessons", "Grading Cycle: 4 DepEd Quarters").
   - Implements dynamic student progress metrics per subject card:
     - Not Started: `Not Started • 0/8 Topics` (subtle progress track).
     - In Progress: `In Progress • ${completed}/${total} Topics (${percent}%)` (colored active progress bar).
     - Completed: `✓ Completed • ${total}/${total} Topics` (emerald completion badge).
     - Guest / Loading fallback: `8 DepEd Topics • Practice Drills`.
   - Updates card action buttons from `Explore Subject` to `Review Subject` with smooth hover micro-interaction.
   - Adds `getUserCatalogProgressAction` in `features/curriculum/actions/curriculum.actions.ts` querying `prisma.quizAttempt` by `userId`, aggregating completed topics per `subjectSlug`, consumed via TanStack Query hook `useCatalogProgressQuery` in `features/curriculum/hooks/useCatalogProgressQuery.ts`.
2. **Subject Detail Terminology Alignment (`LessonList.tsx`)**:
   - Unifies curriculum terminology across the page: "8 Topics" instead of "8 Lessons", "Topic #{number}: {title}", and "Practice This Topic".
3. **Structured 3-Tab Lesson Reader (`LessonReaderModal.tsx`)**:
   - Replaces the single monolithic markdown view with a 3-tab study reader using Radix/Shadcn `Tabs`:
     - 📘 **Tab 1: Study Notes**: Concept overview, DepEd MATATAG competencies, definitions, and core principles.
     - ✏️ **Tab 2: Worked Examples**: 1–2 step-by-step solved sample problems with formulas, derivations, and clear explanations.
     - 💡 **Tab 3: Quick Review & Pitfalls**: Common exam traps, test-taking tips, and high-yield takeaway bullet points (`keyTakeaways`).
   - Sticky bottom bar featuring a prominent `Start Practice Drill` CTA button triggering quiz configuration.
4. **Guaranteed Structured AI Generation & Starter Template (`gemini-service.ts` & `lesson-material.actions.ts`)**:
   - Refactors `generateLessonContentWithGemini` to guarantee structured generation with 5 discrete fields: `overview`, `studyNotes`, `workedExamples`, `pitfalls`, and `keyTakeaways`.
   - Upgrades fallback starter synthesis in `getLessonMaterialAction` so ungenerated topics immediately render complete, rich Markdown in all 3 tabs.
   - Implements `parseStructuredLessonContent` helper to guarantee 100% backwards-compatibility for existing single-document markdown records in PostgreSQL.

---

## 2. Technical Context & Environment

- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict mode).
- **Styling**: Tailwind CSS v4, Shadcn UI (`Tabs`, `Card`, `Badge`, `Button`, `Progress`, `Dialog`), Lucide React icons.
- **ORM & Database**: Prisma ORM 7.9+ on PostgreSQL 15+ (`prisma.quizAttempt`, `prisma.lessonMaterial`).
- **State Management**:
  - **Server State**: TanStack Query v5 (`useCatalogProgressQuery`, `useQuery`).
  - **Client Ephemeral State**: Zustand v5 (`useAiPromptsModalStore`, `useUpgradeModalStore`).
- **AI Engine**: Google Gemini 3.5 Flash Lite via `@/features/curriculum/api/gemini-service.ts`.
- **Pedagogical Standard**: DepEd Order No. 015, s. 2026 MATATAG K-12 Grading System.

---

## 3. Constitution & Architecture Guardrails Check

| Principle / Rule | Status | Implementation Guarantee |
| :--- | :---: | :--- |
| **Principle I: Feature-Driven Architecture (FDA)** | **PASS** | All logic encapsulated in `features/curriculum/` (`actions/`, `api/`, `components/`, `hooks/`, `schemas/`, `types/`, `utils/`). Zero business logic placed in Next.js `app/` routes. |
| **Principle II: Strict State Management Separation** | **PASS** | TanStack Query v5 is the sole source of truth for user catalog progress (`useCatalogProgressQuery`). Zustand is strictly used for modal visibility (`useAiPromptsModalStore`). Zero `useEffect` syncing of server state into Zustand. |
| **Principle III: DepEd DO 015 s. 2026 Compliance** | **PASS** | Evaluates student mastery and passing criteria using DO 015 standards (transmuted grade ≥ 75%). Topic completion aligns with verified quiz attempt records. |
| **Principle IV: Educational Quality & Socratic Integrity** | **PASS** | Lesson reader tabs deliver structured scaffolding: definitions first (Tab 1), solved applications with derivations second (Tab 2), and exam pitfalls with takeaways third (Tab 3). |
| **Principle V: Zero-Mock Quality Assurance** | **PASS** | Interacts with live Prisma models (`quizAttempt`, `lessonMaterial`) with typed Server Actions and Zod validation. No mock fallback data or swallowed errors. |

---

## 4. Skills Allocation Matrix

| Skill Group | Allocated Skill(s) | Primary Deliverables & Focus Areas |
| :--- | :--- | :--- |
| **Group 1: Catalog Cards Dynamic Progress & Responsive Polish** | `frontend-ui-engineering`<br>`design-taste-frontend`<br>`minimalist-ui`<br>`high-end-visual-design` | - Eliminate `bg-muted/40` static box in `SubjectCatalog.tsx`.<br>- Build dynamic progress one-liner and progress bar (Not Started, In Progress, Completed, Guest fallback).<br>- Update action button to `Review Subject` with smooth hover micro-interaction.<br>- Verify mobile and desktop responsiveness. |
| **Group 2: High-Performance Aggregation Action & Data Hook** | `senior-backend`<br>`code-review-and-quality` | - Implement `getUserCatalogProgressAction` in `features/curriculum/actions/curriculum.actions.ts`.<br>- Execute single indexed query over `prisma.quizAttempt` filtering by `userId` and grouping unique `lessonNumber`s per `subjectSlug`.<br>- Create `useCatalogProgressQuery` TanStack Query hook with caching and optimistic defaults.<br>- Define TypeScript types in `curriculum.types.ts`. |
| **Group 3: Structured 3-Tab Lesson Reader & Modal Refactor** | `frontend-ui-engineering`<br>`high-end-visual-design` | - Refactor `LessonReaderModal.tsx` to use Shadcn `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`).<br>- Organize Tab 1 (Study Notes), Tab 2 (Worked Examples), Tab 3 (Quick Review & Pitfalls).<br>- Implement sticky persistent bottom bar with `Start Practice Drill` CTA.<br>- Preserve header `AI Prompts for this Topic` trigger and responsive scrolling. |
| **Group 4: Structured AI Generation, Starter Synthesis & Backwards Compatibility** | `prompt-engineer`<br>`prompt-engineering-patterns`<br>`senior-backend` | - Refactor `generateLessonContentWithGemini` in `gemini-service.ts` to enforce 5-property JSON schema (`overview`, `studyNotes`, `workedExamples`, `pitfalls`, `keyTakeaways`).<br>- Upgrade fallback starter generation in `getLessonMaterialAction` to populate all 3 tabs.<br>- Create `parseStructuredLessonContent` utility to parse legacy single-document markdown rows into 3 tabs seamlessly. |
| **Group 5: Terminology Standardization & Curriculum Integration** | `frontend-ui-engineering`<br>`code-review-and-quality` | - Update `LessonList.tsx`: "Curriculum Topics", "Topic #{number}: {title}", and "Practice This Topic".<br>- Align progress bar summary and hero subtitle. |
| **Group 6: Verification, Testing & Conventional Commits** | `test-driven-development`<br>`atomic-commit` | - Write unit tests for `parseStructuredLessonContent` and `getUserCatalogProgressAction` aggregation in `tests/unit/catalogProgressAndLessonReader.test.ts`.<br>- Execute `npm run build` and `npm run lint` for zero-error verification.<br>- Record backlog entry in `docs/backlog.md` and commit atomically. |

---

## 5. Detailed Design by Layer

### 5.1 Backend: Catalog Progress Aggregation Action
- **File**: `features/curriculum/actions/curriculum.actions.ts`
- **Function**: `getUserCatalogProgressAction(): Promise<UserCatalogProgressMap>`
- **Logic**:
  1. Retrieve active user session via `getCurrentUser()`. If unauthenticated, return `{}`.
  2. Query `prisma.quizAttempt.findMany` where `userId: sessionUser.id`, selecting `subjectSlug` and `lessonNumber`. (Leverages composite index `@@index([userId, subjectSlug, lessonNumber])`).
  3. Aggregate into a map: for each `subjectSlug`, track a `Set<number>` of unique attempted `lessonNumber`s.
  4. Return `{ [subjectSlug: string]: { completed: number; total: number } }` where `total = targetLessonsPerSubject` (default 8).

### 5.2 Hook: TanStack Query `useCatalogProgressQuery`
- **File**: `features/curriculum/hooks/useCatalogProgressQuery.ts`
- **Implementation**:
  ```ts
  export function useCatalogProgressQuery() {
    const { user } = useUser();
    return useQuery<UserCatalogProgressMap>({
      queryKey: ["user-catalog-progress", user?.id],
      queryFn: async () => {
        if (!user?.id) return {};
        return await getUserCatalogProgressAction();
      },
      enabled: !!user?.id,
      staleTime: 1000 * 60 * 2,
    });
  }
  ```

### 5.3 UI: Modernized Subject Cards (`SubjectCatalog.tsx`)
- Replace lines 226–243 (JHS) and 354–371 (SHS) with a sleek, minimalist progress element:
  - If `!user` or `isLoading`: render `<span className="text-xs text-muted-foreground font-medium">8 DepEd Topics • Practice Drills</span>`.
  - If `completed === 0`: render `<div className="space-y-1.5"><div className="flex justify-between text-xs text-muted-foreground"><span>Not Started</span><span>0/8 Topics</span></div><div className="h-1.5 w-full rounded-full bg-muted overflow-hidden" /></div>`.
  - If `0 < completed < total`: render `<div className="space-y-1.5"><div className="flex justify-between text-xs text-muted-foreground"><span className="text-primary font-medium">In Progress</span><span>{completed}/{total} Topics ({percent}%)</span></div><div className="h-1.5 w-full rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${percent}%` }} /></div></div>`.
  - If `completed >= total`: render `<div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"><CheckCircle2 className="size-3.5" /><span>✓ Completed • {total}/{total} Topics</span></div>`.
- Change button text to `Review Subject`.

### 5.4 AI Service: Structured Gemini Generation (`gemini-service.ts`)
- Refactor `generateLessonContentWithGemini`:
  - Enforce JSON schema:
    ```json
    {
      "type": "OBJECT",
      "properties": {
        "title": { "type": "STRING" },
        "overview": { "type": "STRING" },
        "studyNotes": { "type": "STRING" },
        "workedExamples": { "type": "STRING" },
        "pitfalls": { "type": "STRING" },
        "keyTakeaways": { "type": "ARRAY", "items": { "type": "STRING" } }
      },
      "required": ["title", "overview", "studyNotes", "workedExamples", "pitfalls", "keyTakeaways"]
    }
    ```
  - Assembles markdown content combining the 3 sections with standardized headers for storage in `dbMaterial.content` while also populating discrete fields.

### 5.5 Action & Parser: Resilient Starter Template & Backwards Compatibility
- **File**: `features/curriculum/utils/lesson-content-parser.ts`
- Implement `parseStructuredLessonContent(content: string, summary?: string | null, keyTakeaways?: string[] | null): StructuredLessonContent`:
  - If `content` is a JSON string containing the 5 fields, parse directly.
  - If markdown containing delimiters (`## 1. Study Notes` / `## 1. Key Concepts`, `## 2. Worked Examples` / `## 2. Step-by-Step`, `## 3. Quick Review` / `## 3. Common Misconceptions`), extract sections using regex partitions.
  - If flat markdown without headers, assign content to `studyNotes`, provide a helpful prompt in `workedExamples`, and format `summary` & `keyTakeaways` into `pitfalls`.
- In `getLessonMaterialAction`:
  - Synthesize a comprehensive starter template containing all 3 sections if not found in database.

### 5.6 UI: Structured 3-Tab Lesson Reader (`LessonReaderModal.tsx`)
- Incorporate `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/shared/components/ui/tabs`.
- Structure:
  - Header: Lesson number badge, subject code, title, "AI Prompts for this Topic" button.
  - Tabs Navigation:
    - `study-notes`: 📘 Study Notes
    - `worked-examples`: ✏️ Worked Examples
    - `pitfalls`: 💡 Quick Review & Pitfalls
  - Scrollable Tab Content View with `MarkdownRenderer`.
  - Sticky Bottom Bar:
    - Back button ("Close Notes").
    - Primary CTA: `Start Practice Drill` (triggering `onStartQuiz`).

### 5.7 UI: Terminology Standardization (`LessonList.tsx`)
- Standardize all occurrences of "Lesson" to "Topic":
  - Heading: `Curriculum Topics ({lessons.length})`
  - Subtitle: `Master each topic competency...`
  - Progress: `{attemptedCount} of {totalLessonsCount} topics completed`
  - Card Title: `Topic #{lesson.number}: {lesson.title}`
  - Action Button: `Practice This Topic`
  - Modal Footer: `Ready? Take Practice Drill`

---

## 6. Testing & Quality Verification Strategy

1. **Unit Testing (`tests/unit/catalogProgressAndLessonReader.test.ts`)**:
   - Verify `parseStructuredLessonContent` with JSON, partitioned markdown, and flat fallback markdown.
   - Verify catalog progress calculation logic across empty attempts, partial completions, and 100% mastery.
2. **Type Safety & Build Verification**:
   - Execute `npx tsc --noEmit` to verify 100% strict type compliance.
   - Execute `npm run lint` and `npm run build` to verify clean compilation with zero warnings or errors.
3. **Backlog Logging**:
   - Update `docs/backlog.md` with complete implementation details.
