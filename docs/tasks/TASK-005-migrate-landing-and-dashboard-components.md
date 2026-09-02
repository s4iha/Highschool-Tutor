# Task 005 - Migrate Landing Page and Dashboard Components from College Tutor

**Skills to be used**: `task-implementation`, `frontend-ui-engineering`

## Description
Migrate and adapt landing page components and student dashboard components from the College Tutor repository (`C:\Users\Dell\college-tutor`) to Highschool Tutor (`C:\Users\Dell\Desktop\highschool-tutor`) to maintain consistent branding and user experience across both applications. Refactor all components to comply with Highschool Tutor's Feature-Driven Architecture (FDA), Shadcn UI component design system, Zustand client stores, and Highschool curriculum data structures.

## Verification Checklist
- [x] Migrate and refactor landing page components in `features/landing/components/` (`HeroSection.tsx`, `CategorySection.tsx`, `PopularSubjectsSection.tsx`, `AcademicWorkflowDemo.tsx`, `CtaBanner.tsx`, `AboutSection.tsx`, `StatsBar.tsx`).
- [x] Refactor dashboard components in `features/dashboard/components/` (`DashboardShell.tsx`, `DashboardHeader.tsx`, `DashboardSidebar.tsx`, `StudentDashboardView.tsx`) to integrate seamlessly with Highschool Tutor and Zustand state.
- [x] Ensure all imported/migrated components use Highschool Tutor's UI primitives (Shadcn UI in `shared/components/ui/`) and Highschool curriculum/grade levels instead of college degrees.
- [x] Update `app/page.tsx` and create `app/(dashboard)/dashboard/page.tsx` route to use the newly migrated components.
- [x] Verify `npm run build`, `npx tsc --noEmit`, and `npm test` execute cleanly with zero errors.
