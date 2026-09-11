# Task 014 - Admin Header, Sidebar Dedup, and Student Quiz Setup Screen

**Skills to be used**: task-implementation

## Description

Implement user-requested UX fixes and enhancements:
1. Add an `AdminHeader` component in the administrative console for consistent navigation across desktop and mobile, equipped with:
   - Dynamic breadcrumb (`Admin Console / {Section}`)
   - Dark mode toggle (`useTheme()` from `next-themes`)
   - Notification bell trigger
   - Quick-switch link button to "Student Portal" (`/dashboard`)
   - Mobile hamburger button to open the administrative drawer
2. Mount `AdminHeader` inside `AdminSidebarLayout.tsx` and replace the previous minimal mobile-only header.
3. Remove the duplicate "Admin Console" link from `DashboardSidebar.tsx` nav items area (retaining only the button in `DashboardHeader.tsx`).
4. Implement an intermediate `QuizSetup` screen when launching a quiz (`/curriculum/[slug]/quiz/[lesson]`), allowing students to:
   - Review lesson details and confirm/switch quiz mode (`Study` vs `Exam`)
   - Select the number of questions for their quiz (predefined presets: `5`, `10`, `15`, `20`, `All`, defaulting to `10`)
   - Start the quiz with a randomly sampled subset (Fisher-Yates shuffle) of questions from the full cached bank
   - Ensure scoring, progress tracking, and DepEd DO 015 s. 2026 grade transmutations use the chosen question total.

## Verification Checklist

- [x] Admin console top header renders on both desktop and mobile with breadcrumbs, theme toggle, notifications, and Student Portal switcher
- [x] Student dashboard sidebar no longer renders the duplicate Admin Console button
- [x] Student dashboard header retains the Admin Console button for admin users
- [x] Quiz navigation renders the new Quiz Setup screen prior to starting the quiz
- [x] Student can select 5, 10, 15, 20, or All questions, and quiz samples questions randomly
- [x] Quiz submission records scores based on the selected question count
- [x] Unit tests covering quiz sampling and question count validation pass (35/35 passing)
- [x] Build (`npm run build`) and linter (`npm run lint`) pass cleanly without errors
