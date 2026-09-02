# Task 007 - Security RLS, Admin Access Protection, Dashboard & Sidebar Optimizations, and Auth Refactoring

**Skills to be used**: `prompt-engineering`, Next.js 16 App Router, TypeScript, Tailwind CSS v4, Prisma ORM, TanStack Query, Zustand, Zod.

## Description

Implement security guardrails, access control, and user experience enhancements for HighSchool Tutor:
1. Add and enforce strict Postgres Row Level Security (RLS) policies across all domain tables with Prisma connection helper `runWithUser`.
2. Restrict `/admin` portal access to users with `ADMIN` role via Next.js `proxy.ts` middleware, redirecting students to `/dashboard`.
3. Provide a dedicated "Select Mode" dialog for lessons in `LessonList.tsx` allowing students to choose between Study Mode and Exam Mode upon selecting a lesson.
4. Add logout functionality (`/api/auth/logout`) and logout button in the dashboard sidebar.
5. Make Onboarding Modal dynamic: automatically hide tracks/strands for Junior High School (Grades 7–10) and only display Senior High School strands for Grades 11 and 12.
6. Optimize Dashboard Sidebar layout, remove the DepEd Curriculum Tracks section, remove redundant navigation items, and increase logo size.
7. Connect Dashboard Settings tab to real profile data with TanStack Query fetching and mutations.
8. Update website favicon to the squared official logo.
9. Move Better Auth files from `lib/` to `features/auth/lib/` to adhere to Feature-Driven Architecture (FDA).

## Verification Checklist

- [x] Strict RLS migration script and `runWithUser` helper created in `lib/prisma.ts` / `prisma/migrations/`.
- [x] Admin route protection enforced in `proxy.ts` with role-based JWT payload validation.
- [x] Lesson cards updated with clean mode selection dialog in `LessonList.tsx`.
- [x] Logout endpoint `/api/auth/logout` created and logout button functioning in `DashboardSidebar.tsx`.
- [x] Dynamic grade-level and strand conditional rendering in `OnboardingModal.tsx`.
- [x] Sidebar optimized: DepEd curriculum tracks removed, redundant items removed, logo size increased.
- [x] Settings tab populated with real user/profile data and mutation updates in `StudentDashboardView.tsx`.
- [x] Favicon updated to squared logo in `app/layout.tsx`.
- [x] Auth files moved to `features/auth/lib/` and imports resolved.
- [x] Zero TypeScript errors (`npx tsc --noEmit`), full test pass (`npm test`), and production build pass (`npm run build`).
