# Task 010 - User Preferences, Pricing, Landing Enhancements, and Session Management

**Skills to be used**: task-implementation

## Description

Implement the 12 core platform enhancements and cleanups:
1. Update subscription/payment options to support purchasing 1 specific grade level or all levels (Grades 7–12 bundle).
2. Add dedicated informational pages for each track/strand in 'Explore Subjects by Academic Track & Strand' (`/tracks/[id]`).
3. Ensure comprehensive logout functionality (Better Auth + custom JWT session clearing).
4. Remove the mock 'Student View / Admin Portal' toggle in `DashboardHeader.tsx`.
5. Add a student Preference settings tab/card for configuring Light and Dark mode preferences.
6. Rename "DepEd Quizzes" to "Practice Tests" across the dashboard and curriculum navigation.
7. Dynamically update the Socratic AI Tutor greeting message when switching language modes (English / Taglish / Filipino).
8. Inherit and display the Google profile picture (`image`) when logged in.
9. Remove the icons from navigation buttons in the landing page header (`Navbar.tsx`).
10. Remove all mentions of offline cache and local storage from the Privacy Policy and Terms of Service.
11. Enforce session state redirect in `proxy.ts`: prevent logged-in users from visiting the landing page (`/`), redirecting them to `/dashboard`.
12. Verify and document the global one-time lesson generation caching mechanism in PostgreSQL (`CachedLesson`).

## Verification Checklist

- [x] Update `SubPlan` enum and billing models in `prisma/schema.prisma`, sync DB with `prisma db push` and `prisma generate`
- [x] Create `/tracks/[id]` route and link cards from `CategorySection.tsx`
- [x] Implement and verify logout action across all dashboard/navigation components
- [x] Remove mock role toggle from `DashboardHeader.tsx`
- [x] Add Theme Preference toggle in Student Preferences / Settings
- [x] Rename DepEd Quizzes to Practice Tests across all UI touchpoints
- [x] Update AI greeting dynamically upon language change in Socratic AI Tutor
- [x] Display Google OAuth profile avatar in headers/sidebars if present
- [x] Clean navigation button icons in landing page `Navbar.tsx`
- [x] Remove offline caching and local storage claims from `PrivacyPolicy.tsx` and `TermsOfService.tsx`
- [x] Update Next.js 16 `proxy.ts` to redirect authenticated users away from `/` to `/dashboard`
- [x] Verify `CachedLesson` one-time lesson generation pipeline and write tests/docs
- [x] Verify `npm run build`, `npm run lint`, and `npm test` pass cleanly
