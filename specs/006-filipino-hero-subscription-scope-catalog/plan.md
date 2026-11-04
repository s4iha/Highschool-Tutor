# Implementation Plan: Authentic Filipino Hero Imagery, Frictionless Subscription Availment, DepEd MATATAG Scope Pages & Expanded Curriculum Catalog

**Branch**: `006-filipino-hero-subscription-scope-catalog` | **Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-filipino-hero-subscription-scope-catalog/spec.md` and user requirements from `docs/tasks/TASK-029-filipino-hero-subscription-scope-and-catalog.md`.

---

## Summary

HighSchool Tutor's core mission is providing a localized, culturally resonant, and pedagogically rigorous DepEd K-12 MATATAG classroom study companion. This implementation addresses four foundational gaps identified during user testing and `/grill-me` alignment:

1. **Hero Visual Grounding**: Replacing the foreign stock model in `HeroSection.tsx` with an authentic local Filipino student in a Philippine school uniform, framed in a 4:5 vertical portrait ratio with Next.js image optimization (`priority`).
2. **Frictionless Auth Intercept**: Eliminating the jarring 401 unauthorized error toast by checking client session before checkout, intercepting guests with an intuitive Auth Intercept dialog, preserving their return intent in `sessionStorage` (`hst_return_intent`), and automatically resuming PayMongo checkout post-login.
3. **Public DepEd MATATAG Scope Pages (`/subjects` & `/subjects/[slug]`)**: Creating public, SEO-indexed routes pre-rendered with `generateStaticParams()`, presenting official course titles, hours, prerequisites, competencies from `docs/resources/shs-subjects.md`, and injecting Schema.org `Course` and `BreadcrumbList` JSON-LD schemas into dynamic sitemaps.
4. **SHS Curriculum Catalog Expansion**: Adding the official DepEd Arts and Design Track (6 general subjects + 5 specializations), Sports Track (9 subjects), and core TVL specializations (AFA, IA, HE, ICT) to `curriculum-data.ts`, `TRACKS_DATA`, and unit tests.

---

## Technical Context

- **Framework**: Next.js 16 (App Router)
- **UI Runtime**: React 19 (Server and Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Lucide React icons, Shadcn UI (Radix Primitives)
- **State Management**:
  - **Server State**: TanStack Query (React Query) v5 for billing mutations and session queries.
  - **Client Ephemeral State**: Zustand v5 for UI modal states; `sessionStorage` with URL fallback for transient checkout return intent.
- **Authentication**: Better Auth with Google OAuth and Email/Password credentials.
- **Payment Gateway**: PayMongo Hosted Checkout API (`/api/v1/billing/checkout/create-session`) supporting QR Ph, GCash, Maya, and Cards.
- **SEO & Structured Data**: Schema.org `Course` & `BreadcrumbList` JSON-LD via `JsonLd.tsx`, dynamic sitemap via `app/sitemap.ts`.
- **Testing**: Jest with `@testing-library/react`.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-evaluated after Phase 1 design.*

| Principle | Requirement | Analysis & Alignment | Status |
| :--- | :--- | :--- | :--- |
| **I. FDA Modularity** | Code must be organized in `features/<domain>/{actions, api, components, hooks, schemas, types, utils}` with shared code in `shared/`. Routing only in `app/`. No business logic in `app/`. | Public pages in `app/subjects/` and `app/subjects/[slug]/` contain routing and metadata only, delegating presentation to `features/curriculum/components/` and SEO helpers to `features/seo/`. Auth intercept components reside strictly in `features/billing/components/` and hooks in `features/billing/hooks/`. | **PASS** |
| **II. Strict State Management** | TanStack Query v5 is the sole source of truth for async server state. Zustand v5 is strictly reserved for ephemeral client UI state. Never sync server state into client state via `useEffect`. No raw fetch in client components. | Auth intercept pre-flight inspects `useUser()` (TanStack Query) without syncing to Zustand. Return intent is transient ephemeral storage in `sessionStorage`. Checkout initiation uses `useCheckoutSession` (TanStack Query mutation). Zero raw fetch in client components. | **PASS** |
| **III. DepEd DO 015 s. 2026 Compliance** | Academic structures, learning competencies, and grading calculations must strictly comply with DepEd Order No. 015, s. 2026. Repealed DO 8 s. 2015 is forbidden. | Subject scope descriptions, time allotments (80h/sem, 20h PEH, 160-640h TVL), and competencies are derived strictly from official DepEd curriculum guides preserved in `docs/resources/shs-subjects.md`. | **PASS** |
| **IV. Socratic AI Tutoring Integrity** | Socratic pedagogy guiding students without direct answer disclosure. Multi-dialect localization. Validated Zod schemas. | Scope pages feature prominent "Practice with Socratic AI Tutor" conversion CTAs with context-preserved routing into the Socratic tutoring engine. | **PASS** |
| **V. Zero-Mock QA** | Real typed interfaces and production schemas. No dummy fallback values, no swallowed exceptions, no commented-out assertions. Full type checks, linting, and tests. | All entities are strictly typed (`SubjectScopeDefinition`, `ReturnIntent`, expanded `ShsSubjectDefinition`). Real static pre-rendering via `generateStaticParams()`. Automated Jest tests verify all 9 tracks in `tracks-data.test.ts`. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/006-filipino-hero-subscription-scope-catalog/
├── spec.md              # Requirements, user stories, and acceptance criteria
├── plan.md              # This file (architectural blueprint & technical context)
├── research.md          # Phase 0 architectural decisions & trade-off analysis
├── data-model.md        # Phase 1 data models & entity relationships
├── contracts/           # Phase 1 behavioral contracts
│   ├── auth-intercept-return-intent.contract.md
│   ├── subject-scope-page.contract.md
│   └── curriculum-catalog-expansion.contract.md
├── quickstart.md        # Phase 1 test and verification guide
└── tasks.md             # Phase 2 implementation task list (generated via /speckit-tasks)
```

### Concrete Source Code Layout

```text
app/
├── sitemap.ts                                          # App Router dynamic XML sitemap (indexes /subjects and /subjects/[slug])
├── subjects/
│   ├── page.tsx                                        # Public DepEd MATATAG curriculum catalog (Server Component)
│   └── [slug]/
│       └── page.tsx                                    # Dynamic subject scope route (generateStaticParams, metadata, JSON-LD)
└── tracks/
    └── [id]/
        └── page.tsx                                    # Track detail route (supports arts-design-track and sports-track)

features/
├── billing/
│   ├── components/
│   │   ├── CheckoutModal.tsx                           # Updated with client auth pre-flight intercept & Auth Intercept view
│   │   └── AuthInterceptDialog.tsx                     # Optional modular intercept sub-component
│   ├── hooks/
│   │   ├── useCheckoutSession.ts                       # PayMongo mutation hook
│   │   └── useCheckoutReturnIntent.ts                  # Intent resumption hook post-authentication
│   └── types/
│       └── billingTypes.ts                             # ReturnIntent and checkout types
│
├── curriculum/
│   ├── components/
│   │   ├── PublicSubjectCatalog.tsx                    # Client-side searchable and filterable catalog
│   │   └── SubjectScopeView.tsx                        # Subject scope view (hours, prerequisites, competencies, description)
│   ├── types/
│   │   ├── curriculum.types.ts                         # Expanded ShsStrand, Subject, DistinctSubject, SubjectScopeDefinition
│   │   └── subjectScope.types.ts                       # Subject scope definitions
│   └── utils/
│       ├── curriculum-data.ts                          # Expanded SHS catalog (Arts & Design, Sports, TVL specializations)
│       └── subject-scope-data.ts                       # Scope resolver mapping slugs to DepEd descriptions, hours, prerequisites
│
├── landing/
│   └── components/
│       ├── HeroSection.tsx                             # Updated with authentic Filipino portrait, 4:5 ratio, priority
│       └── TrackDetail.tsx                             # TRACKS_DATA updated with arts-design-track, sports-track, and full TVL
│
└── seo/
    └── utils/
        ├── schemaBuilders.ts                           # buildSubjectCourseSchema() & buildBreadcrumbSchema()
        └── sitemapBuilder.ts                           # Appends /subjects and /subjects/[slug] routes to sitemap

tests/
└── unit/
    ├── tracks-data.test.ts                             # Updated to verify all 9 tracks, modules, and data completeness
    ├── subject-scope.test.ts                           # Unit test verifying scope resolver, hours, and prerequisites
    └── auth-intercept.test.ts                          # Unit test verifying return intent storage and resumption logic
```

---

## Core Architecture & Data Flow

### 1. Auth Intercept & Return Intent Resumption Flow

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Unauthenticated Guest
    participant Modal as CheckoutModal
    participant Storage as sessionStorage ("hst_return_intent")
    participant Auth as AuthPage / Better Auth
    participant Resume as useCheckoutReturnIntent
    participant API as /api/v1/billing/checkout/create-session
    participant Gateway as PayMongo Hosted Gateway

    Guest->>Modal: Clicks "Proceed to PayMongo Checkout" (Annual Plan)
    Modal->>Modal: Pre-flight check: user === null
    Note over Modal: Suppresses network call; NO 401 error toast!
    Modal->>Storage: Stores { planId: "ANNUAL", referralCode, sourceUrl, timestamp }
    Modal->>Modal: Renders Auth Intercept View ("Sign In or Create Account")
    Guest->>Auth: Authenticates with Google or Email/Password
    Auth->>Resume: User transitions to authenticated
    Resume->>Storage: Detects pending "hst_return_intent" (< 2 hours old)
    Resume->>Storage: Immediately removes "hst_return_intent" (prevents loops)
    Resume->>API: POST /api/v1/billing/checkout/create-session { planId: "ANNUAL" }
    API-->>Resume: Returns { checkoutUrl: "https://paymongo.page/..." }
    Resume->>Gateway: Automatically navigates to PayMongo Checkout
```

### 2. Static Pre-Rendering & Dynamic Scope Flow

```mermaid
flowchart LR
    subgraph Build Time
        CATALOG["curriculum-data.ts\n(SUBJECTS array)"]
        SCOPE_DATA["subject-scope-data.ts\n(Official DepEd Metadata)"]
        GSP["generateStaticParams()"]
        STATIC_HTML["Pre-rendered HTML /subjects/[slug] (85+ pages)"]
        SITEMAP["sitemap.xml (All canonical URLs)"]

        CATALOG --> GSP
        GSP --> STATIC_HTML
        CATALOG --> SITEMAP
    end

    subgraph Runtime
        CRAWLER["Googlebot / Student Visitor"]
        CDN["Vercel Edge / Static Cache"]

        CRAWLER -->|Instant GET /subjects/g11-s1-genmath| CDN
        CDN -->|200 OK (<50ms)| CRAWLER
    end
```

---

## Constitution Check (Post-Design Re-Evaluation)

1. **Principle I (FDA Modularity)**: The concrete layout respects FDA boundaries. `app/` holds only routing and metadata generation. Visual views (`SubjectScopeView`, `PublicSubjectCatalog`) and utilities reside strictly in `features/curriculum/` and `features/billing/`.
2. **Principle II (State Management)**: No raw `fetch` calls in client components. Server queries remain in TanStack Query. Ephemeral UI states remain in Zustand or `sessionStorage`. Zero `useEffect` syncing of server query data into Zustand.
3. **Principle III (DepEd DO 015 s. 2026)**: Prescribed subject hours (80h/sem, 20h PEH, 160-640h TVL), competency frameworks, and prerequisite chains reflect official DepEd guidelines and DO 015, s. 2026.
4. **Principle IV (Socratic AI Tutoring)**: Public scope pages provide frictionless funneling into the Socratic AI tutoring engine without bypassing pedagogical scaffolding.
5. **Principle V (Zero-Mock QA)**: Real static routes, real typed interfaces, production-grade error handling, and comprehensive Jest unit tests without dummy mocks.

**Result**: Fully Aligned & Approved. Ready for Phase 2 task generation (`/speckit-tasks`).
