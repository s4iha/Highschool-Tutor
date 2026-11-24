# Task 034 - Trial Subject Access, Timer Badge, and Enterprise Tier Entitlements

**Skills to be used**: task-implementation

## Description

Address critical gaps in the student onboarding, free trial access, and subscription entitlement architecture:
1. **Free Trial Subject Access & Dashboard Flow**:
   - Students during their 30-day free trial experienced a false paywall: after opening 1 subject, the Dashboard Enrolled Subjects tab displayed an "Unlock More Subjects" button that triggered the upgrade modal, with no way to browse the curriculum catalog.
   - Onboarding (`/api/user/onboarding`) did not provision starter subjects, leaving new students with an empty enrolled list until navigating manually.
   - The Overview tab rendered two identical "Enrolled Subjects" KPI cards.
   - `/api/user/me` omitted `EXPIRED` subscription records, breaking client-side trial expiration overrides.
2. **Trial Badge Visual Icon**:
   - Replaced misleading `Sparkles` icon with `Timer` icon in `TrialCountdownWidget.tsx` and `LessonList.tsx` for the days-remaining trial badges.
3. **Enterprise-Ready Entitlements & Guardrails**:
   - Unified `getTierEntitlements()` in `tier-guardrails.ts` with `subscriptionOverride` support.
   - Differentiated tiers: 30-day Free Trial gets all subjects + all lessons in Study Mode + 20 daily AI credits; Paid Passes (`ACTIVE` Monthly/Annual) and `ADMIN` unlock Exam Mode (Graded), Multi-Dialect Translation, and Unlimited AI Tutoring.
   - Added fair-use burst and daily rate-limiting guardrails to `ai-credits.ts` to prevent Gemini API cost abuse.

## Verification Checklist

- [x] Shared starter-subject enrollment utility implemented and integrated into `/api/user/onboarding` and `/api/user/profile`.
- [x] `StudentDashboardView.tsx` renders "Explore Curriculum" during active trials/paid passes and only shows "Unlock More Subjects" when expired/unsubscribed.
- [x] Duplicate KPI card in `StudentDashboardView.tsx` replaced with "Mastered Lessons".
- [x] `/api/user/me` fetches latest subscription status including `EXPIRED`.
- [x] `Sparkles` icon replaced with `Timer` icon in `TrialCountdownWidget.tsx` and `LessonList.tsx`.
- [x] `tier-guardrails.ts` unified with `subscriptionOverride`, `canAccessExamMode`, and entitlement definitions.
- [x] Exam Mode gated to `ACTIVE` / `ADMIN` in `LessonList.tsx` and `createQuizSessionAction`.
- [x] `ai-credits.ts` includes fair-use rate limiting guardrails.
- [x] All unit and integration tests pass cleanly (`npm test`).
- [x] ESLint passes with 0 errors and 0 warnings (`npm run lint`).
- [x] Next.js production build succeeds with all static pages prerendered (`npm run build`).
