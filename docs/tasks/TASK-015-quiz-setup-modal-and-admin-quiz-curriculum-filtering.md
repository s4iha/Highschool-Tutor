# Task 015 - Quiz Setup Modal & Admin Quiz Curriculum Filtering

**Skills to be used**: task-implementation

## Description

Address two user-driven workflow improvements across student and admin experiences:

### Part 1: Student Quiz Launch Modal Flow
1. Refactor the student quiz setup from a separate screen into a dialog modal on `LessonList.tsx`:
   - Entire lesson card is hoverable and clickable (`cursor-pointer`), opening the configuration modal.
   - Retain accessibility guardrails (if locked/premium, clicking opens the upgrade modal).
   - In the modal, render a chip-based selector for question count (`5`, `10`, `15`, `20`, `All (24)`), defaulting to `10`.
   - In the modal, render Study Mode vs Exam Mode cards with explicit launch buttons that navigate to `/curriculum/[slug]/quiz/[lessonNumber]?mode=[study|exam]&count=[selectedCount]`.
2. Update `QuizRunner.tsx`:
   - Eliminate the `phase` state ("setup" vs "quiz") so students jump straight into practice.
   - Read `count` from search parameters, defaulting to 10 (or clamping to total available).
   - Randomly sample questions immediately upon receiving quiz questions.
   - Update the "Retake Quiz" action to instantly restart the quiz with a fresh sample using the same count and mode.
   - Update the "Change Options" button to navigate back to `/curriculum/[slug]` so the student can re-select settings from the modal.
3. Remove redundant standalone `QuizSetup.tsx`.

### Part 2: Admin Quiz Configuration & Curriculum Filtering
1. Subject Selector Enhancement in `AdminQuizConfigPage.tsx`:
   - Replace the flat `<select>` dropdown with a categorized, searchable selector grouped by DepEd Grade Level (Junior High: Grade 7, Grade 8, Grade 9, Grade 10; Senior High: Grade 11, Grade 12).
   - Provide live filtering by subject name, code, or grade.
2. Real Curriculum Lesson Outlines:
   - Instead of hardcoding "Lesson 1" through "Lesson 12", fetch the real curriculum lessons using `getLessonsAction(selectedSubjectSlug)` via TanStack Query.
   - Render a vertical list/card layout showing the lesson number, real lesson title (e.g., "Sets and Real Number System"), summary snippet, and status (e.g., cached vs draft).
   - Selecting a lesson card updates `selectedLesson` and populates the quiz bank editor with the actual lesson title.

## Verification Checklist

- [x] Lesson cards on `LessonList.tsx` are hoverable and clickable, opening the quiz setup modal.
- [x] Quiz setup modal displays question count chips (5, 10, 15, 20, All) and Study/Exam options.
- [x] Launching from modal opens `QuizRunner` directly into question 1 with the configured count.
- [x] Retaking a quiz immediately restarts with the same count and mode.
- [x] "Change Options" redirects back to the lesson list.
- [x] Admin Quiz Config page groups subjects cleanly by Grade Level.
- [x] Admin Quiz Config page dynamically fetches and displays real curriculum lesson titles instead of "Lesson 1–12".
- [x] Selecting a lesson properly loads the editor with its title and questions.
- [x] Unit tests and Next.js build pass cleanly with zero errors.
