# Task 018 - OAuth User Profile Auto-Provisioning & Name Synchronization

**Skills to be used**: task-implementation

## Description

Address the discrepancy between local development and production environments regarding OAuth student profile synchronization. In local development, seed scripts or traditional registration explicitly provision `Profile` and `UserRole` records with complete student information. In production, users authenticating via Google OAuth with Better Auth are created directly in the "user" and "account" tables without an associated `Profile` record, leading to fallback placeholders ("Student", default grade levels) and preventing the onboarding modal from triggering.

Implementation goals:
1. **Server-Side Profile & Role Auto-Provisioning**:
   - In `app/api/user/me/route.ts`, automatically provision a `Profile` record if missing, pre-populating `fullName` from `user.name` and setting `hasOnboarded: false`.
   - Sync `user.name` into `profile.fullName` if the profile exists but has an empty full name.
   - Automatically assign the `STUDENT` role in `user_roles` if the user has no role assigned.
2. **Onboarding Modal Trigger & Pre-population**:
   - In `features/auth/hooks/useUser.ts`, trigger onboarding when a student user has either no profile or `!user.profile.hasOnboarded` (excluding `ADMIN` role).
   - In `features/auth/components/OnboardingModal.tsx`, pre-fill the name field with `user?.name` or `user?.profile?.fullName` so Google OAuth users do not have to retype their names.
3. **Robust Display Name Fallbacks**:
   - In `features/dashboard/components/StudentDashboardView.tsx` and `features/dashboard/components/DashboardSidebar.tsx`, trim and prioritize non-empty full names before falling back to `user.name`, and only then to "Student".
4. **Better Auth Lifecycle Hook**:
   - In `features/auth/lib/auth.ts`, add database hooks for user creation to ensure seamless initialization of profile and roles.

## Verification Checklist

- [x] `/api/user/me` auto-provisions a `Profile` record with `fullName: user.name` and `hasOnboarded: false` if not present.
- [x] `/api/user/me` ensures a `STUDENT` entry exists in `user_roles` if no role is found.
- [x] `useUser.ts` triggers `openOnboardingModal` for students where `!user.profile || !user.profile.hasOnboarded`.
- [x] `OnboardingModal.tsx` pre-populates the student's name from their Google profile.
- [x] `StudentDashboardView.tsx` and `DashboardSidebar.tsx` display the Google user's name immediately.
- [x] TypeScript compilation (`npx tsc --noEmit`), linting (`npm run lint`), unit tests, and production build pass cleanly with 0 errors.
