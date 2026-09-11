# Task 011 - Lesson Studio Layout Restoration, Enrolled Subjects View Toggle, Quiz DB Saves, and Sidebar Height

**Skills to be used**: task-implementation

## Description

Implement the 4 key fixes and enhancements requested for the lesson studio and student dashboard:
1. **Lesson Studio Layout Restoration & Navbar Leak Fix**: Relocate `/curriculum` inside `app/(dashboard)` and wrap with `app/(dashboard)/layout.tsx` using `DashboardShell`. Hide the marketing `Navbar` and `Footer` on all `/curriculum` routes.
2. **Enrolled Subjects View Toggle**: Add a Grid (Card) vs. List view toggle to the Enrolled Subjects tab in `StudentDashboardView.tsx`, persisting the student's preference in `localStorage` via Zustand (`useDashboardStore`).
3. **Quiz Attempt Database Linking & Verification**: Attach the authenticated user ID (`userId`) from `getCurrentUser()` to every `QuizAttempt` created in `recordQuizAttemptAction`, filter progress by `userId`, and provide user attempt retrieval in the student dashboard.
4. **Fixed-Height Sidebar with Always-Visible Logout**: Update `DashboardSidebar.tsx` with `sticky top-0 h-screen` and flexible scrolling layout so the student profile and logout section remain pinned to the bottom of the viewport on all screen heights.

## Verification Checklist

- [x] Create `app/(dashboard)/layout.tsx` wrapping all dashboard and curriculum pages in `DashboardShell`
- [x] Move `app/curriculum` to `app/(dashboard)/curriculum` and clean redundant shell wrappers in `dashboard/page.tsx`
- [x] Update `shared/components/layout/Navbar.tsx` and `Footer.tsx` to return `null` on `/curriculum` routes
- [x] Configure `useDashboardStore.ts` with persisted `subjectsViewMode` ("grid" | "list") using Zustand `persist`
- [x] Implement Grid and List view layouts with toggle buttons in `StudentDashboardView.tsx`
- [x] Update `recordQuizAttemptAction` and `getSubjectProgressAction` in `curriculum.actions.ts` to attach and filter by authenticated `userId`
- [x] Add `getUserQuizAttemptsAction` and connect to `StudentDashboardView.tsx` so real database attempts are rendered
- [x] Update `DashboardSidebar.tsx` to `sticky top-0 h-screen` with `flex-1 overflow-y-auto` nav and `shrink-0` pinned logout footer
- [x] Verify `npm run lint`, `npm test`, and `npm run build` pass cleanly without errors
