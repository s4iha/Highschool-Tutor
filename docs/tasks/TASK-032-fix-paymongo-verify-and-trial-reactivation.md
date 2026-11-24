# Task 032 - Fix PayMongo Checkout Verification & Super Admin Trial Re-activation

**Skills to be used**: `task-implementation`, `systematic-debugging`, `senior-backend`, `frontend-ui-engineering`, `security-and-hardening`, `test-driven-development`.

## Description

Resolve two critical production/local workflow bugs:
1. **PayMongo Checkout Verification Stuck on "Verifying Payment..."**:
   - `create-session/route.ts` used Stripe-specific `{CHECKOUT_SESSION_ID}` in `success_url`, which PayMongo leaves unreplaced (`%7BCHECKOUT_SESSION_ID%7D`), causing `GET /api/v1/billing/checkout/verify-session` to return `404`.
   - Update `create-session/route.ts` to include `&ref=${encodeURIComponent(referenceNumber)}` in `success_url`, update `verify-session/route.ts` to resolve by `session_id`, `ref`, or latest user transaction fallback (excluding literal `{CHECKOUT_SESSION_ID}`), and add an error/retry state in `PaymentCelebrationDialog.tsx`.
2. **Super Admin Trial Re-activation Not Unlocking Student Actions**:
   - `getTrialStatus()` only evaluated `user.createdAt`, ignoring `Subscription` records granted or updated by the Super Admin (`status: "TRIAL"` or `"EXPIRED"`).
   - `PATCH /api/v1/admin/students` lacked `ADMIN` role verification, `runAsAdmin`, and `expiresAt` updates when re-activating or expiring a student's subscription/trial.
   - Update `getTrialStatus()` to honor `subscriptionOverride` (`TRIAL` with `expiresAt > now` -> active; `EXPIRED` -> expired), pass subscription status across all server/client `getTrialStatus()` call sites, and harden `PATCH /api/v1/admin/students`.

## Verification Checklist

- [x] `create-session/route.ts` passes `ref=${referenceNumber}` in `success_url` instead of `{CHECKOUT_SESSION_ID}`.
- [x] `verify-session/route.ts` resolves by `session_id`, `ref`, or latest user transaction fallback and reconciles via PayMongo API.
- [x] `PaymentCelebrationDialog.tsx` & `useVerifySession.ts` support `ref` and show error + retry state if verification fails.
- [x] `getTrialStatus()` in `tier-guardrails.ts` honors `Subscription` (`TRIAL` and `EXPIRED` overrides) and all callers pass it.
- [x] `PATCH /api/v1/admin/students` enforces `ADMIN` role, uses `runAsAdmin`, and sets `expiresAt`.
- [x] Unit tests, `npm run lint`, and `npm run build` pass with zero errors.
