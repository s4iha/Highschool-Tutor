# Task 027 - Dynamic Card Progress and Structured 3-Tab Lesson Reader

**Skills to be used**: `frontend-ui-engineering`, `design-taste-frontend`, `minimalist-ui`, `high-end-visual-design`, `senior-backend`, `prompt-engineer`, `prompt-engineering-patterns`, `test-driven-development`, `code-review-and-quality`, `atomic-commit`

---

## Description

Implement the complete architectural upgrade across 4 core educational surfaces of HighSchool Tutor as specified in `specs/003-dynamic-progress-and-structured-lessons/`:

1. **Catalog Cards Dynamic Progress Overhaul (`SubjectCatalog.tsx`)**:
   - Eliminate the redundant static gray container (`bg-muted/40`) containing repetitive boilerplate ("Curriculum Scope: 8 Lessons" and "Grading Cycle: 4 DepEd Quarters") from both JHS and SHS subject cards.
   - Replace it with a sleek, minimalist one-liner metric showing live student progress per subject:
     - **Not Started**: subtle one-liner `Not Started • 0/8 Topics` with a subtle progress indicator track.
     - **In Progress**: `In Progress • ${completed}/${total} Topics (${percent}%)` with an active colored progress bar reflecting completed topics.
     - **Completed / Mastered**: `✓ Completed • ${total}/${total} Topics` with an emerald badge/indicator.
     - **Guest / Unauthenticated / Loading Fallback**: `8 DepEd Topics • Practice Drills`.
   - Update action button text from generic `Explore Subject` to `Review Subject` with smooth hover micro-interaction.
   - Implement `getUserCatalogProgressAction` in `features/curriculum/actions/curriculum.actions.ts` querying `prisma.quizAttempt` for the logged-in user in a single indexed query grouped by `subjectSlug` and returning a `UserCatalogProgressMap`, consumed via TanStack Query hook `useCatalogProgressQuery` in `SubjectCatalog.tsx`.

2. **Subject Detail Header & Terminology Alignment (`LessonList.tsx`)**:
   - Align academic terminology across the subject curriculum view:
     - Header title: "Curriculum Topics ({count})" instead of "Curriculum Lessons".
     - Progress description: "{completed} of {total} topics completed".
     - Topic card title: "Topic #{number}: {title}".
     - Primary drill button: "Practice This Topic".
     - Page subtitle refined for topic mastery and practice drills.

3. **Structured 3-Tab Lesson Reader (`LessonReaderModal.tsx`)**:
   - Transform the current single-page modal into a structured 3-tab study reader using Radix/Shadcn `Tabs`:
     - 📘 **Tab 1: Study Notes**: Concept overview, DepEd MATATAG competencies, definitions, and core principles.
     - ✏️ **Tab 2: Worked Examples**: 1–2 step-by-step solved sample problems with formulas, derivations, and clear explanations.
     - 💡 **Tab 3: Quick Review & Pitfalls**: Common exam traps, test-taking tips, and high-yield takeaway bullet points (`keyTakeaways`).
   - Implement a sticky persistent bottom bar with a prominent `Start Practice Drill` CTA button that smoothly triggers quiz setup / runner.
   - Preserve the `AI Prompts for this Topic` trigger button in the modal header.

4. **Guaranteed Structured AI Generation & Starter Template Enhancement (`gemini-service.ts` & `lesson-material.actions.ts`)**:
   - Refactor `generateLessonContentWithGemini` to guarantee structured generation with 5 discrete fields:
     - `overview`: string
     - `studyNotes`: string
     - `workedExamples`: string (guaranteed step-by-step problem walkthroughs)
     - `pitfalls`: string (common exam traps and mistakes)
     - `keyTakeaways`: string[]
   - Update `getLessonMaterialAction` fallback starter template so that ungenerated topics immediately render with complete, beautifully formatted Markdown in all 3 tabs.
   - Implement `parseStructuredLessonContent` utility in `features/curriculum/utils/lesson-content-parser.ts` guaranteeing 100% backwards-compatibility for existing single-document markdown records in PostgreSQL.

---

## Skills Allocation Matrix

| Task Group | Skill(s) Allocated | Primary Focus & Deliverables |
| :--- | :--- | :--- |
| **1. UI Modernization & Dynamic Cards** (`SubjectCatalog.tsx`) | `frontend-ui-engineering`<br>`design-taste-frontend`<br>`minimalist-ui`<br>`high-end-visual-design` | - Remove `bg-muted/40` static box in `SubjectCatalog.tsx`.<br>- Render dynamic progress one-liner and bar (Not Started, In Progress, Completed, Guest fallback).<br>- Update action button to `Review Subject` with smooth hover micro-interaction.<br>- Optimize fluid responsive layout across screen sizes. |
| **2. Aggregation Action & State Management** (`curriculum.actions.ts`, `useCatalogProgressQuery.ts`) | `senior-backend`<br>`code-review-and-quality` | - Implement `getUserCatalogProgressAction` using indexed `prisma.quizAttempt` query with zero N+1 overhead.<br>- Create `useCatalogProgressQuery` TanStack Query hook with caching and optimistic fallbacks.<br>- Define strict TypeScript types in `curriculum.types.ts`. |
| **3. Structured 3-Tab Lesson Reader** (`LessonReaderModal.tsx`) | `frontend-ui-engineering`<br>`high-end-visual-design` | - Build 3-tab layout using Shadcn `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`).<br>- Scaffold Tab 1 (Study Notes), Tab 2 (Worked Examples), Tab 3 (Quick Review & Pitfalls).<br>- Build sticky persistent bottom action bar with `Start Practice Drill` CTA button.<br>- Ensure independent scrolling and mobile responsiveness. |
| **4. AI Pedagogy & Resilient Starter Synthesis** (`gemini-service.ts`, `lesson-material.actions.ts`) | `prompt-engineer`<br>`prompt-engineering-patterns`<br>`senior-backend` | - Enforce 5-property JSON schema in `generateLessonContentWithGemini`.<br>- Upgrade fallback starter template in `getLessonMaterialAction` to populate all 3 tabs.<br>- Create `parseStructuredLessonContent` to parse legacy flat markdown into 3 tabs seamlessly. |
| **5. Terminology Standardization** (`LessonList.tsx`) | `frontend-ui-engineering`<br>`code-review-and-quality` | - Align terminology: "Curriculum Topics", "Topic #{number}: {title}", and "Practice This Topic".<br>- Update progress descriptions and hero subtitles. |
| **6. Testing, Quality Assurance & Commits** | `test-driven-development`<br>`atomic-commit` | - Write unit tests in `tests/unit/catalogProgressAndLessonReader.test.ts`.<br>- Run `npm test`, `npx tsc --noEmit`, and `npm run lint` for 100% verification.<br>- Log entry in `docs/backlog.md` and commit atomically. |

---

## Verification Checklist

- [ ] Static gray container (`bg-muted/40`) eliminated from JHS and SHS cards in `SubjectCatalog.tsx`
- [ ] Dynamic progress metrics rendered accurately per subject (Not Started, In Progress, Completed with emerald badge, Guest fallback)
- [ ] Action buttons updated from `Explore Subject` to `Review Subject` with smooth hover transition
- [ ] `getUserCatalogProgressAction` executes single indexed query over `prisma.quizAttempt` with zero N+1 overhead
- [ ] `useCatalogProgressQuery` correctly provides cached student subject progress to `SubjectCatalog.tsx`
- [ ] `LessonReaderModal.tsx` structured into 3 tabs (📘 Study Notes, ✏️ Worked Examples, 💡 Quick Review & Pitfalls)
- [ ] Persistent sticky bottom bar features `Start Practice Drill` CTA button triggering quiz workflow
- [ ] Header preserves `AI Prompts for this Topic` trigger button
- [ ] `gemini-service.ts` generates structured output adhering to 5-property JSON schema
- [ ] Fallback starter template in `getLessonMaterialAction` populates complete Markdown in all 3 tabs immediately
- [ ] `parseStructuredLessonContent` handles JSON, partitioned markdown, and legacy flat markdown with 100% backwards compatibility
- [ ] `LessonList.tsx` displays unified terminology ("Curriculum Topics", "Topic #{number}: {title}", "Practice This Topic")
- [ ] Unit tests pass in `tests/unit/catalogProgressAndLessonReader.test.ts`
- [ ] TypeScript check passes with zero errors (`npx tsc --noEmit`)
- [ ] Production build and linting pass cleanly (`npm run lint`, `npm run build`)
- [ ] Task completion logged in `docs/backlog.md`
