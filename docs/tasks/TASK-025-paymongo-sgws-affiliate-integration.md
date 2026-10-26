# Task 025 - PayMongo Hosted Checkout Gateway & SGWS Affiliate Integration

**Skills to be used**: `senior-backend`, `security-and-hardening`, `frontend-ui-engineering`, `design-taste-frontend`, `color-theory`, `dark-mode-generation`, `test-driven-development`, `code-review-and-quality`, `atomic-commit`

## Description

Implement the automated payment processing and affiliate referral pipeline for HighSchool Tutor by integrating the **PayMongo Hosted Checkout Gateway** (`/v2/checkout_sessions`) and the **SGWS Affiliates Portal** (`sgws-affiliates.sgws.tech`). This replaces legacy manual GCash/Maya screenshot uploads and 24-hour administrative approval with an instantaneous, automated payment provisioning flow.

### Key Objectives & Deliverables:
1. **PayMongo Hosted Checkout Session Creation (P1 - MVP)**:
   - Server-side authoritative integer centavos pricing calculation (`toCentavos`) to eliminate floating-point rounding errors:
     - Monthly Access Pass: ₱299.00 (`29900` centavos, 30 days access)
     - Annual Unlimited Pass: ₱2,499.00 (`249900` centavos, 365 days access, saving ₱1,089 vs. monthly billing)
   - Support for Philippine domestic payment rails: QR Ph, GCash, Maya, Debit/Credit cards, GrabPay, and Direct Online Banking.
   - Endpoint: `POST /api/v1/billing/checkout/create-session`
   - Reconciliation Endpoint: `GET /api/v1/billing/checkout/verify-session`
2. **SGWS Affiliate Referral Tracking & Resilient Validation (P2)**:
   - 30-day non-destructive cookie retention (`sgws_ref`) capturing `?ref=CODE` and `?referral=CODE` via hybrid middleware (`proxy.ts`) and client-side SPA observer (`ReferralTracker.tsx`).
   - Standardized collision-free reference numbers:
     - Affiliate: `SGWS-highschool-tutor-{referralCode}-{timestamp}`
     - Direct: `HST-DIRECT-{timestamp}`
   - Resilient upstream validation against `sgws-affiliates.sgws.tech` with an `AbortController` 2,500ms timeout guardrail and graceful fallback to direct checkout if the affiliate service is slow or down.
   - Proxy Endpoint: `POST /api/v1/referrals/validate`
3. **Automated Webhook Fulfillment & Idempotent Provisioning (P3)**:
   - Webhook Receiver Endpoint: `POST /api/v1/webhooks/paymongo`
   - Cryptographic HMAC-SHA256 signature verification (`t`, `te`, `li`) using `crypto.timingSafeEqual` and 300-second replay window tolerance.
   - Atomic `prisma.$transaction` fulfillment: updates `PaymentTransaction` to `PAID`, sets `Subscription` to `ACTIVE`, and stacks subscription periods (`expiresAt = currentExpiresAt + durationDays`).
   - In-memory concurrency locks keyed by session ID to guarantee 100% idempotent fulfillment under concurrent or retried webhook deliveries.
4. **Subscription Management UI & Manual Transfer Deprecation (P4)**:
   - Overhaul `shared/components/ui/UpgradeModal.tsx` and create `features/billing/components/CheckoutModal.tsx`:
     - Completely eliminate manual GCash/Maya receiver phone numbers, payment instruction text, and 24-hour verification delay messages.
     - Live debounced referral code input with verified partner badge (`useValidateReferralCode`).
     - Prominent highlight for Annual Unlimited Pass savings of ₱1,089.
   - Post-checkout reconciliation and celebratory dialog (`PaymentCelebrationDialog.tsx`) upon redirect to `/dashboard?payment=success&session_id=...`.
   - Modernize `features/admin/components/settings/AdminSettingsPage.tsx` by replacing manual GCash/Maya inputs with PayMongo Gateway Integration status badges (API Mode, Webhook URL, SGWS Product Slug, Hosted Checkout active).
5. **Quality Assurance & Verification (P7)**:
   - Comprehensive test suite for HMAC verification, replay rejection, referral timeouts, and webhook idempotency.
   - Validation against all 6 scenarios in `specs/001-paymongo-sgws-integration/quickstart.md`.
   - Full CI checks: `npm run test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

## Verification Checklist

### Phase 1: Setup & Constants
- [x] Verify environment variable schemas in `.env.example` (`PAYMONGO_SECRET_KEY`, `PAYMONGO_PUBLIC_KEY`, `PAYMONGO_WEBHOOK_SECRET`, `SGWS_AFFILIATES_API_URL`, `NEXT_PUBLIC_PRODUCT_SLUG`, `NEXT_PUBLIC_APP_URL`)
- [x] Implement affiliate constants in `lib/affiliate/constants.ts`
- [x] Implement pricing utilities and centavos converter in `features/billing/utils/pricing.ts` (Monthly ₱299, Annual ₱2,499, ₱1,089 savings calculation)

### Phase 2: Foundational & Database Schema
- [x] Add `PaymentTransaction` model to `prisma/schema.prisma` with relations to `User` and `Subscription`
- [x] Update `AdminConfig.annualPricePhp` default to 2499 in `prisma/schema.prisma`
- [x] Execute `npx prisma db push` and `npx prisma generate` cleanly
- [x] Create TypeScript types and interfaces in `features/billing/types/billingTypes.ts`
- [x] Create Zod validation schemas in `features/billing/schemas/checkoutSchemas.ts`

### Phase 3: User Story 1 - Direct Student Subscription Checkout (P1)
- [x] Write unit and contract tests in `tests/unit/paymongoCheckout.test.ts`
- [x] Implement PayMongo API client in `lib/paymongo/client.ts` with Basic Auth and domestic payment rails
- [x] Implement API route `POST /api/v1/billing/checkout/create-session` in `app/api/v1/billing/checkout/create-session/route.ts`
- [x] Implement status verification route `GET /api/v1/billing/checkout/verify-session` in `app/api/v1/billing/checkout/verify-session/route.ts`
- [x] Create client API helpers in `features/billing/api/checkoutApi.ts`
- [x] Implement TanStack Query mutation hook `useCheckoutSession` in `features/billing/hooks/useCheckoutSession.ts`

### Phase 4: User Story 2 - Affiliate Referral Tracking & Validation (P2)
- [x] Write unit tests for reference generator and timeout handling in `tests/unit/referenceNumber.test.ts` and `tests/unit/sgwsAffiliateService.test.ts`
- [x] Implement reference number generator and parser in `lib/affiliate/referenceNumber.ts`
- [x] Implement cookie extraction and retention helpers in `lib/affiliate/cookies.ts`
- [x] Implement SGWS validation service with `AbortController` 2,500ms timeout in `lib/affiliate/sgwsService.ts`
- [x] Implement proxy route `POST /api/v1/referrals/validate` in `app/api/v1/referrals/validate/route.ts`
- [x] Update middleware in `proxy.ts` to capture and preserve `sgws_ref` cookie with 30-day TTL
- [x] Create SPA client referral observer in `shared/components/marketing/ReferralTracker.tsx`

### Phase 5: User Story 3 - Webhook Fulfillment & Idempotent Provisioning (P3)
- [x] Write HMAC signature verification and replay window tests in `tests/unit/paymongoSignature.test.ts`
- [x] Write idempotency, period stacking, and lock concurrency tests in `tests/unit/paymentFulfillmentService.test.ts`
- [x] Implement HMAC-SHA256 signature verification in `lib/paymongo/webhook.ts` with `crypto.timingSafeEqual`
- [x] Implement atomic payment fulfillment and period stacking in `lib/services/paymentFulfillmentService.ts`
- [x] Implement webhook receiver endpoint `POST /api/v1/webhooks/paymongo` in `app/api/v1/webhooks/paymongo/route.ts`

### Phase 6: User Story 4 - In-App Subscription Management & Checkout UI (P4)
- [x] Implement live debounced referral code hook `useValidateReferralCode` in `features/billing/hooks/useValidateReferralCode.ts`
- [x] Implement status polling hook `useVerifySession` in `features/billing/hooks/useVerifySession.ts`
- [x] Overhaul `shared/components/ui/UpgradeModal.tsx`: remove manual GCash/Maya text, integrate PayMongo session creation, live referral validation, and Annual Pass ₱1,089 savings
- [x] Create modular `CheckoutModal.tsx` in `features/billing/components/CheckoutModal.tsx`
- [x] Create `PaymentCelebrationDialog.tsx` in `features/billing/components/PaymentCelebrationDialog.tsx` for `/dashboard?payment=success`
- [x] Modernize `features/admin/components/settings/AdminSettingsPage.tsx` with PayMongo status badges

### Phase 7: Polish & Cross-Cutting Verification
- [x] Validate all 6 scenarios in `specs/001-paymongo-sgws-integration/quickstart.md`
- [x] Update API documentation in `docs/api-reference/api-endpoints.md`
- [x] Unit tests pass cleanly: `npm run test`
- [x] TypeScript strict typecheck passes cleanly: `npx tsc --noEmit`
- [x] Linting passes cleanly: `npm run lint`
- [x] Production build succeeds: `npm run build`
