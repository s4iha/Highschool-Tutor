# Task 020 - Curriculum Deduplication and Grade Level Auto-Enrollment

**Skills to be used**: task-implementation, atomic-commit

## Description

Refactor the DepEd Curriculum Catalog to eliminate repetitive subject listings across grade levels and terms (compressing the 96 JHS entries down to 8 distinct core subjects, while maintaining 34 distinct SHS subjects). Add student profile grade level and term preference persistence in PostgreSQL via a new Prisma migration. Introduce a responsive Grade and Term selector atop the subject lessons view to dynamically route between grades/trimesters without visual clutter in the catalog. Implement lazy subject auto-enrollment (`TrialSubject`) upon a student's first quiz attempt with free-tier guardrails (3 grade-level slots max). Highlight the student's active grade level in the catalog with a "Your Grade" badge and prioritize it in the view.

## Verification Checklist

- [x] Database Schema: Add `termPreference String?` to `Profile` model in `prisma/schema.prisma` and create standard Prisma migration file with PostgreSQL RLS support.
- [x] Curriculum Data Utility: Export distinct JHS subjects (8 unique subjects) alongside the comprehensive flat list for routing and slug lookup.
- [x] Catalog UI Deduplication: Update `SubjectCatalog.tsx` to render 8 unique JHS cards and 34 SHS cards (~42 total instead of 130), replacing the grade select with Term/Semester filter chips.
- [x] Grade Prioritization: Display "Your Grade" badge and prioritize the student's enrolled/configured grade level at the top of the catalog.
- [x] Lesson View Grade/Term Picker: Add `GradeTermPicker` to the subject lesson outline view (`SubjectLessonList` / `/curriculum/[slug]`) allowing seamless switching between Grade 7–10 and Trimester 1–3 for JHS subjects.
- [x] Lazy Auto-Enrollment: Automatically create `TrialSubject` record on a student's first quiz attempt via `getQuizAction` / `recordQuizAttemptAction`, checking tier guardrails before enrolling.
- [x] Profile Onboarding: Update `OnboardingModal.tsx` and onboarding API to persist `termPreference` alongside `gradeLevel`.
- [x] Unit & Integration Tests: Add unit tests verifying curriculum deduplication, tier guardrails, and auto-enrollment logic.
- [x] Build and unit tests pass cleanly without errors (`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`).
