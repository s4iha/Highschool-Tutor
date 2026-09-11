# Task 012 - Real-Time Subject Mastery Progress and Quiz Synchronization

**Skills to be used**: task-implementation

## Description

Fix the 0% subject mastery progress bug after quiz completion and ensure real-time progress synchronization across the platform:
1. **Real-Time TanStack Query Integration in LessonList**: Replace ad-hoc `useEffect` + `useState` in `LessonList.tsx` with TanStack Query (`useQuery`) with `refetchOnMount: "always"` and active cache invalidation.
2. **Instant Cache Invalidation in QuizRunner**: Update `QuizRunner.tsx` on quiz submit to invalidate query keys `["subject-progress", subject.slug]`, `["user-quiz-attempts"]`, and trigger `router.refresh()` so navigating back to the lesson list reflects real-time progress immediately.
3. **DO 015 DepEd Transmutation-Based Mastery**: Update `getSubjectProgressAction` in `curriculum.actions.ts` to compute transmuted scores via DepEd Order No. 015, s. 2026 (60% raw = 75 transmuted passing grade), track both `totalAttempted` and `totalMastered`, and return detailed lesson scoring metrics.
4. **Dynamic Progress UI in LessonList**: Display real-time curriculum completion percentage and mastery metrics in the Subject Mastery Progress card, updating immediately when a quiz is submitted.
5. **Dynamic Subject Progress in Student Dashboard**: Enhance `StudentDashboardView.tsx` to compute real-time subject progress, completed practice tests, and average scores from the student's recorded database attempts.

## Verification Checklist

- [x] Update `getSubjectProgressAction` in `curriculum.actions.ts` with DO 015 transmutation, `totalAttempted`, and detailed scores
- [x] Refactor `LessonList.tsx` to use TanStack Query (`useQuery`) for lessons and subject progress with automatic refetching
- [x] Connect `useQueryClient` in `QuizRunner.tsx` to invalidate `["subject-progress", subject.slug]` on submit and route back
- [x] Update Subject Mastery Progress card in `LessonList.tsx` to display completion percentage, mastery status, and transmuted scores
- [x] Update `StudentDashboardView.tsx` to calculate real-time subject progress from `userAttemptsData`
- [x] Verify `npm run lint`, `npm test`, and `npm run build` pass cleanly without errors
