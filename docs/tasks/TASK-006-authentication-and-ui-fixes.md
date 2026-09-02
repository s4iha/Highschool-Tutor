# Task 006 - Authentication and UI Fixes

**Skills to be used**: React, Tailwind CSS v4, NextAuth v5, Zustand, TanStack Query

## Description
Implement authentication, route protection, and UI fixes across the application as per user requirements:
1. Remove redundant toast message in `LessonList.tsx` when clicking 'Unlock Lesson'.
2. Move the sidebar collapse button to the right (absolute positioning) to prevent overlap with the logo.
3. Remove the 'Sparkle' icon in the auth page and ensure it has no scrollable overflow regardless of zoom.
4. Add 'See Password' functionality in the auth page.
5. Move the toast alignment to the bottom right in `layout.tsx`.
6. Implement custom JWT authentication (using `jose` and `bcryptjs`) and API routes to enforce authentication logic (protect `/curriculum` and `/dashboard`).
7. Add a non-dismissible onboarding modal for basic info configuration (using TanStack Query and Zustand, no Server Actions).
8. Add Google sign-in functionality in the auth page.

## Verification Checklist
- [x] Redundant toast removed.
- [x] Collapse button moved and no longer overlaps logo.
- [x] Sparkle icon removed and Auth page has no scroll/overflow.
- [x] Password visibility toggle works.
- [x] Toasts appear at bottom-right.
- [x] `/curriculum` routes redirect to login if unauthenticated.
- [x] Onboarding modal displays correctly and saves data via TanStack Query and API routes.
- [x] Google Sign-In button added.
- [x] Build and unit tests pass cleanly without errors.
