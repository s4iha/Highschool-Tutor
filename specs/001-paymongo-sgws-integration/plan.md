# Implementation Plan: PayMongo Payment Gateway & SGWS Affiliate Integration

**Branch**: `001-paymongo-sgws-integration` | **Date**: 2026-10-26 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from [`spec.md`](./spec.md), confirmed grill-me design decisions, and constitution rules.

---

## Summary

This plan details the end-to-end architectural implementation for integrating the **PayMongo Hosted Checkout Gateway** (`/v2/checkout_sessions`) and the **SGWS Affiliates Portal** (`sgws-affiliates.sgws.tech`) into HighSchool Tutor. 

The feature replaces the legacy manual GCash/Maya screenshot uploads and 24-hour manual administrative approvals with an automated, instant payment provisioning pipeline. Authenticated students can choose between a Monthly Access Pass (₱299, 30 days) and an Annual Unlimited Pass (₱2,499, 365 days, saving ₱1,089 / >30% discount vs. monthly billing). The system supports Philippine domestic payment rails (QR Ph, GCash, Maya, Cards, GrabPay, Online Banking), captures and persists affiliate referrals via a 30-day cookie (`sgws_ref`), validates partner credentials with an `AbortController` 2,500ms timeout guardrail, cryptographically verifies incoming PayMongo webhooks via HMAC-SHA256, and executes atomic, idempotent fulfillment with subscription period stacking.

---

## Technical Context

- **Language/Version**: TypeScript 5.x (Strict mode), Node.js 20+ runtime
- **Primary Dependencies**: 
  - Next.js 16.3.3 (App Router)
  - React 19.2.8
  - Prisma ORM 7.9.1 (`@prisma/client`, `@prisma/adapter-pg`)
  - PostgreSQL 15+ (with `pg.Pool`)
  - Zod 4.5.4 (validation across Server Actions, API routes, and webhook payloads)
  - TanStack Query v5 (`@tanstack/react-query` v5.102.8 for server state)
  - Zustand v5 (`zustand` v5.0.15 for ephemeral UI state)
  - Better Auth 1.7.4 (session authentication & role guardrails)
  - Tailwind CSS v4, Lucide React, Sonner (toast notifications)
- **Storage**: PostgreSQL 15+ with Prisma schema models: `User`, `Subscription`, `PaymentTransaction` (new), `AdminConfig`, and preserved legacy `Payment`.
- **Testing**: Jest 30.5.0 + `ts-jest` for unit, contract, and idempotency tests.
- **Target Platform**: Desktop and Mobile responsive web browsers, Next.js server runtime on Vercel/Node.
- **Project Type**: Full-Stack Web Application (Feature-Driven Architecture modular structure).
- **Performance Goals**: 
  - Checkout session creation: < 1,500ms
  - Referral code validation: < 400ms (hard 2,500ms circuit breaker timeout)
  - Webhook processing & entitlement provisioning: < 800ms
  - Client status reconciliation polling: 3–5s upon redirect
- **Constraints**: 
  - Zero client-side price tampering (server-calculated integer centavos).
  - Timing-safe HMAC-SHA256 signature verification with 300-second replay window.
  - Zero checkout blocking on affiliate service degradation.
  - Subscription period stacking: preserve active remaining days on upgrade.
  - 100% webhook idempotency with in-memory lock + DB row checks.
- **Scale/Scope**: High concurrency payment handling for Philippine high school students, parents, and DepEd/CHED partner educators.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle / Gate | Assessment | Status |
|:---|:---|:---|
| **I. Feature-Driven Architecture (FDA) Modularity** | All domain components, hooks, schemas, and actions are structured in `features/billing/`. Cross-cutting infrastructure resides in `lib/paymongo/`, `lib/affiliate/`, and `lib/services/`. App router handles HTTP routes only in `app/api/v1/`. No business logic placed in routing files. | **PASS** |
| **II. Strict State Management & Unidirectional Flow** | TanStack Query v5 is the sole source of truth for all billing and user entitlement server queries. Zustand v5 is strictly reserved for ephemeral client modal state (`useUpgradeModalStore`). No TanStack Query state is synced into Zustand via `useEffect`. Zero raw fetch calls in client UI. | **PASS** |
| **III. DepEd MATATAG Compliance (DO 015, s. 2026)** | Payment unlocking directly provides immediate access to DepEd MATATAG curriculum materials and quarter exam drill runners. Legacy DO 8 s. 2015 is not referenced. | **PASS** |
| **IV. Socratic AI Tutoring Integrity** | Unlocking subscriptions restores full unlimited access to Socratic AI tutoring credits without revealing direct quiz answers. | **PASS** |
| **V. Zero-Mock Quality Assurance** | Schema changes are backed by real Prisma models (`PaymentTransaction`). Webhook tests use real cryptographic HMAC computation. No swallowing exceptions or dummy fallbacks. | **PASS** |

*All architectural gates passed cleanly.*

---

## Project Structure

### Documentation (this feature)

```text
specs/001-paymongo-sgws-integration/
├── spec.md              # Feature specification & requirements
├── plan.md              # This implementation plan
├── research.md          # Phase 0 research & technical decisions
├── data-model.md        # Phase 1 data model & Prisma schema diff
├── quickstart.md        # Phase 1 runnable verification scenarios
└── contracts/           # Phase 1 API specifications
    ├── checkout-api.md  # POST /create-session & GET /verify-session
    ├── referrals-api.md # POST /api/v1/referrals/validate
    └── webhooks-api.md  # POST /api/v1/webhooks/paymongo
```

### Source Code Organization (FDA Pattern)

```text
prisma/
└── schema.prisma                                     # Added PaymentTransaction model, updated relations

lib/
├── paymongo/
│   ├── client.ts                                     # PayMongo API client (Basic auth, /v2/checkout_sessions)
│   └── webhook.ts                                    # HMAC-SHA256 signature verification & timing-safe equality
├── affiliate/
│   ├── constants.ts                                  # Cookie names, TTL, product slug, timeout constants
│   ├── referenceNumber.ts                            # Reference number builder & parser (SGWS- vs HST-DIRECT-)
│   ├── cookies.ts                                    # Cookie extraction & preservation helpers
│   └── sgwsService.ts                                # SGWS Affiliates Portal validation with AbortController
└── services/
    └── paymentFulfillmentService.ts                  # Idempotent fulfillment, in-memory locking, period stacking

features/billing/
├── api/
│   └── checkoutApi.ts                                # Client API helpers for checkout session generation
├── components/
│   ├── CheckoutModal.tsx                             # Unified checkout modal (plan selection, partner badge)
│   └── PaymentCelebrationDialog.tsx                  # Celebratory modal on successful redirect
├── hooks/
│   ├── useCheckoutSession.ts                         # Mutation hook for checkout initiation
│   ├── useVerifySession.ts                           # Query hook for post-redirect status polling
│   └── useValidateReferralCode.ts                    # Debounced query hook for live referral code checking
├── schemas/
│   └── checkoutSchemas.ts                            # Zod schemas for checkout and referral payloads
├── types/
│   └── billingTypes.ts                               # TypeScript types and interfaces
└── utils/
    └── pricing.ts                                    # Centavos conversion, savings calculation, plan catalog

features/admin/
└── components/settings/
    └── AdminSettingsPage.tsx                         # Replaced manual GCash/Maya inputs with PayMongo status card

shared/
├── components/
│   ├── ui/
│   │   └── UpgradeModal.tsx                          # Updated with PayMongo checkout integration & savings callouts
│   └── marketing/
│       └── ReferralTracker.tsx                       # Root layout client observer for SPA referral capture
└── hooks/
    └── useUpgradeModalStore.ts                       # Ephemeral modal toggle store

app/
└── api/
    └── v1/
        ├── billing/
        │   └── checkout/
        │       ├── create-session/
        │       │   └── route.ts                      # POST /api/v1/billing/checkout/create-session
        │       └── verify-session/
        │           └── route.ts                      # GET /api/v1/billing/checkout/verify-session
        ├── referrals/
        │   └── validate/
        │       └── route.ts                          # POST /api/v1/referrals/validate
        └── webhooks/
            └── paymongo/
                └── route.ts                          # POST /api/v1/webhooks/paymongo

tests/
└── unit/
    ├── paymongoSignature.test.ts                     # HMAC verification, replay window, tampered body tests
    ├── referenceNumber.test.ts                       # Reference number formatting & decomposition tests
    ├── sgwsAffiliateService.test.ts                  # Referral validation, 2.5s AbortController timeout tests
    └── paymentFulfillmentService.test.ts             # Idempotency, concurrency locks, period stacking tests
```

---

## Implementation Phases & Deliverables

### Phase 0: Research & Clarification (Completed)
- Documented PayMongo API v2 Checkout Sessions architecture, Basic Auth, and domestic payment method rails.
- Specified HMAC-SHA256 cryptographic signature header parsing, 300-second replay window, and `crypto.timingSafeEqual`.
- Defined SGWS referral tracking with `sgws_ref` 30-day cookie, server proxy, `AbortController` 2.5s timeout, and standardized reference numbers.
- Designed subscription period stacking logic (`expiresAt = currentExpiresAt + durationDays`).
- Designed in-memory locking + DB transaction idempotency.
- **Artifact**: [`research.md`](./research.md)

### Phase 1: Design & API Contracts (Completed)
- **Data Model**: Authored [`data-model.md`](./data-model.md) with `PaymentTransaction` entity, `Subscription` updates, state transition diagrams, and Prisma schema diff.
- **Checkout API**: Authored [`contracts/checkout-api.md`](./contracts/checkout-api.md) for session creation and verification.
- **Referrals API**: Authored [`contracts/referrals-api.md`](./contracts/referrals-api.md) for live partner validation proxy.
- **Webhooks API**: Authored [`contracts/webhooks-api.md`](./contracts/webhooks-api.md) for cryptographic webhook receiver.
- **Quickstart Guide**: Authored [`quickstart.md`](./quickstart.md) detailing 6 runnable validation scenarios.

---

## Skills Allocation Matrix

The table below maps specialized engineering skills from `C:\Users\Dell\.gemini\skills` to specific implementation files and quality checkpoints:

| Target File / Module | Assigned Skill | Specialized Responsibilities & Focus Areas |
|:---|:---|:---|
| `lib/paymongo/client.ts` | `senior-backend` | Robust HTTP communication with PayMongo API v2, Base64 auth encoding, error mapping, and integer centavos calculations. |
| `lib/paymongo/webhook.ts` | `security-and-hardening` | HMAC-SHA256 signature verification, parsing `Paymongo-Signature`, timing-safe equality (`crypto.timingSafeEqual`), and 300-second replay tolerance. |
| `lib/affiliate/sgwsService.ts` | `senior-backend` | Upstream SGWS integration, `AbortController` with 2,500ms timeout guardrail, Zod schema parsing, and graceful degradation fallback. |
| `lib/affiliate/cookies.ts` & `referenceNumber.ts` | `security-and-hardening` | Secure cookie attribute configuration (HttpOnly, SameSite=Lax, Secure), non-overwriting cookie retention, and collision-free reference formatting. |
| `lib/services/paymentFulfillmentService.ts` | `senior-backend` | Idempotent transaction execution, in-memory concurrency locks, Prisma `$transaction` isolation, and subscription period stacking math. |
| `app/api/v1/billing/checkout/create-session/route.ts` | `senior-backend` | Session authentication guardrails (`getCurrentUser()`), Zod payload validation, and server-authoritative price resolution. |
| `app/api/v1/webhooks/paymongo/route.ts` | `security-and-hardening` | Preserving byte-for-byte raw body (`req.text()`), signature verification pipeline, and webhook event dispatching. |
| `features/billing/components/CheckoutModal.tsx` & `UpgradeModal.tsx` | `frontend-ui-engineering` | Accessible dialog UX, plan selection, partner badge display, annual savings callouts (₱1,089 savings), and seamless redirect triggering. |
| `features/billing/components/PaymentCelebrationDialog.tsx` | `frontend-ui-engineering` | Post-checkout celebratory dialog upon return to `/dashboard?payment=success`, query param cleanup, and cache invalidation. |
| `features/admin/components/settings/AdminSettingsPage.tsx` | `frontend-ui-engineering` | Replacing legacy GCash/Maya inputs with modern PayMongo status badges (Active mode, webhook URL, SGWS product slug). |
| `tests/unit/*.test.ts` | `test-driven-development` | Comprehensive unit tests for HMAC signatures, replay rejection, referral timeouts, and idempotent double-webhook executions. |
| Pre-implementation & PR Review | `code-review-and-quality` | Strict compliance auditing against constitution principles, TypeScript strict typing, and zero mock code rules. |
| Git Commits & Versioning | `atomic-commit` | Structuring clean, conventional, logical atomic commits (`feat:`, `fix:`, `test:`, `docs:`). |

---

## Complexity Tracking

*GATE: Must be empty if zero violations exist.*

No constitutional violations or unwarranted complexity. The implementation strictly complies with all principles defined in `.specify/memory/constitution.md` and the project-level `GEMINI.md`.
