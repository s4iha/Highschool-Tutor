# Implementation Plan: Landing Page Overhaul & Conversion Optimization

**Branch**: `005-landing-page-overhaul` | **Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-landing-page-overhaul/spec.md`, SaaS landing page best practices (GetSpike & Lovable frameworks), and `/grill-me` alignment decisions.

---

## Summary

This feature executes a comprehensive overhaul of the HighSchool Tutor public landing page (`app/page.tsx` and `features/landing/components/*`). The overhaul eliminates conversion-degrading anti-patterns (fabricated vanity numbers, fake star ratings, artificial review counts, gratuitous `Sparkles` icons, and misplaced `<Code>` icons) and re-architects the page into an authentic, outcome-driven, Product-Led Growth (PLG) conversion narrative tailored specifically for Philippine high schoolers, parents, and teachers navigating the DepEd K-12 MATATAG curriculum (DepEd Order No. 015, s. 2026).

The technical approach introduces:
1. **Dynamic Stats Bar Architecture**: A Next.js Server Action (`getLandingStatsAction`) in `features/landing/actions/` backed by Prisma queries (`prisma.user.count` for active students and `prisma.quizAttempt.count`), equipped with an instantaneous, static fallback to authoritative catalog definitions (75+ subjects, 1,800+ drills, 600+ lesson modules, 100% DepEd DO 015 s. 2026 MATATAG, 30-Day Free Pass) and consumed via TanStack Query (`useLandingStatsQuery`) with zero layout shift (CLS = 0).
2. **PLG Narrative Re-sequencing**: Reordering the sections in `app/page.tsx` to surface the interactive product demonstration (`AcademicWorkflowDemo`) at Section 4 (immediately after `AboutSection` and BEFORE onboarding, categories, and pricing), establishing the "Show product before signup wall" standard.
3. **Strict Iconography & Design Discipline**: Complete purge of `Sparkles` across all landing components in favor of clean semantic Lucide icons (`GraduationCap`, `BookOpenCheck`, `Bot`, `ShieldCheck`, `ArrowRight`, `CheckCircle2`), populating the empty eyebrow badge in `HeroSection.tsx`, and replacing the developer `<Code>` icon on SHS Core with `GraduationCap`.
4. **Curriculum Taxonomy & Metadata Standardization**: Correcting track badge counts across all 7 tracks, removing fake star ratings in `PopularSubjectsSection`, replacing legacy non-DepEd "Trimester" (`g10-t1-sci`) with official DepEd "Quarter" (`g10-q1-sci`, Quarter 1), and updating marketing copy to reflect 75+ subjects, 8 lesson modules, and 24 practice drills.

---

## Technical Context

**Language/Version**: TypeScript 5.x (Strict Mode), Node.js 20+  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Radix UI Primitives / Shadcn UI, TanStack Query v5, Zod v4, Lucide React  
**Storage**: PostgreSQL 15+ (local Docker instance), Prisma ORM 7.9+ with `@prisma/adapter-pg`  
**Testing**: Jest, React Testing Library, ts-jest (`npm test`)  
**Target Platform**: Modern web browsers (Mobile-first: iOS Safari, Android Chrome, Desktop Chrome/Firefox/Edge)  
**Project Type**: Full-stack Next.js SaaS Web Application (Classroom Management SaaS for DepEd & CHED)  
**Performance Goals**:
- Core Web Vitals: Largest Contentful Paint (LCP) < 2.0s, First Input Delay (FID) / INP < 100ms, Cumulative Layout Shift (CLS) = 0.00
- 100% client-side instant responsiveness for `AcademicWorkflowDemo` (zero network latency for interactive questions and Socratic hints)
- SSR Time-to-First-Byte (TTFB) < 200ms protected by catalog fallback resilience  
**Constraints**:
- Strictly zero secret file exposure (`.env*` protected)
- Strictly zero mock/dummy fallback code in production logic; catalog constants represent real curriculum structures
- Strictly zero modifications to authenticated routes (`/dashboard/*`, `/admin/*`) or database schema migrations  
**Scale/Scope**:
- Public marketing surfaces: `app/page.tsx`, `features/landing/components/*`, `features/landing/actions/*`, `features/landing/hooks/*`, `features/landing/schemas/*`, `features/landing/types/*`
- 7 Academic Tracks, 75+ DepEd Subjects, 600+ Lesson Modules, 1,800+ Practice Drills

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Constitution Requirement | Alignment Status | Architectural Validation |
|---|---|---|---|
| **I. Feature-Driven Architecture (FDA) Modularity** | All domain code must reside under `features/<domain>/` with dedicated folders (`actions/`, `hooks/`, `schemas/`, `types/`, `components/`). `app/` handles App Router routing only without inline business logic. | **PASS** | Data access is encapsulated in `features/landing/actions/get-landing-stats.action.ts`, query hook in `features/landing/hooks/use-landing-stats.ts`, Zod schemas in `features/landing/schemas/`, and UI in `features/landing/components/`. `app/page.tsx` only handles session guard and section sequencing. |
| **II. Strict State Management & Unidirectional Flow** | TanStack Query v5 is the sole source of truth for server state. Zustand v5 is strictly for ephemeral UI state. Never sync TanStack Query to Zustand via `useEffect`. Client components must not use raw fetch/axios. | **PASS** | Stats data fetching is mediated through typed `useLandingStatsQuery` consuming the Server Action. Initial SSR data prevents layout shift. Ephemeral demo states (`selectedAnswer`, `isExplaining`) remain strictly local React state. |
| **III. DepEd MATATAG Compliance (DepEd DO 015, s. 2026)** | All academic structures and grade transmutations must comply with DepEd Order No. 015, s. 2026. Legacy DO 8 s. 2015 is repealed. Passing threshold ≥ 75%. | **PASS** | All landing metrics, badges, and demo gradebooks reference DO 015 s. 2026 official transmutation scales (60–100 scale, ≥ 75% passing). Non-DepEd "Trimesters" are purged in favor of official "Quarters". |
| **IV. Socratic AI Tutoring Integrity** | AI engine guides step-by-step reasoning without disclosing answers directly. Multi-dialect localization (Taglish, English, Cebuano, Ilocano). | **PASS** | `AcademicWorkflowDemo` showcases authentic Socratic hints ("Bakit Mali Ito?") and conceptual scaffolding without revealing raw test keys. |
| **V. Zero-Mock QA & Production Verification** | Real typed interfaces and production Prisma schemas. No dummy fallback mocks, swallowed exceptions, or skipped tests. Clean build and lint. | **PASS** | Catalog fallback constants represent verified DepEd curriculum realities (75+ subjects, 8 modules, 24 drills). Production build (`npm run build`) and unit tests (`npm test`) verify zero regressions. |

---

## Project Structure

### Documentation (`specs/005-landing-page-overhaul/`)

```text
specs/005-landing-page-overhaul/
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Quality checklist
├── plan.md              # Implementation plan (this file)
├── research.md          # Technical research & architectural decisions
├── data-model.md        # TypeScript types & Zod schemas
├── quickstart.md        # Verification commands & manual acceptance checklist
├── contracts/           # API and component contracts
│   ├── landing-stats.contract.ts
│   └── landing-sections.contract.ts
└── tasks.md             # Execution task breakdown (speckit-tasks output)
```

### Source Code (`highschool-tutor/`)

```text
app/
└── page.tsx                                            # Re-sequenced conversion narrative (Sections 1-9)

features/landing/
├── actions/
│   └── get-landing-stats.action.ts                     # Prisma engagement query + catalog fallback
├── constants/
│   ├── catalog-stats.ts                                # 75+ subjects, 1,800+ drills, 600+ modules, DO 015
│   └── popular-subjects.ts                             # Genuine curriculum metadata (Q1, 8 lessons, 24 drills)
├── hooks/
│   └── use-landing-stats.ts                            # TanStack Query hook with initialData
├── schemas/
│   └── landing-stats.schema.ts                         # Zod validation for Server Action return
├── types/
│   └── landing.types.ts                                # Domain interfaces (Stats, Categories, Subjects)
└── components/
    ├── index.ts                                        # Public component exports
    ├── HeroSection.tsx                                 # Outcome copy, eyebrow badge, PLG CTA + microcopy
    ├── StatsBar.tsx                                    # Live queries + catalog fallbacks, CLS=0
    ├── AboutSection.tsx                                # Problem/solution framing, 8 lessons & 24 drills
    ├── AcademicWorkflowDemo.tsx                        # Section 4 PLG preview before signup wall
    ├── HowToUseAppSection.tsx                          # 4-step guide, clean semantic icons (no Sparkles)
    ├── CategorySection.tsx                             # 7 tracks, corrected counts, GraduationCap for SHS Core
    ├── PopularSubjectsSection.tsx                      # DepEd Quarter 1, no fake stars/reviews, slug g10-q1-sci
    ├── TrialNoticeSection.tsx                          # Transparent 30-day trial (₱0, ₱299/mo, no card, no Sparkles)
    ├── CtaBanner.tsx                                   # Final conversion push: 75+ subjects, 8 modules, 24 drills
    ├── TrackDetail.tsx                                 # Corrected track counts, GraduationCap for SHS Core
    ├── HowItWorks.tsx                                  # Purged of Sparkles, 75+ subjects reference
    └── TermsOfService.tsx                              # Purged of Sparkles in subscription tier icon

tests/unit/
├── landing-stats.test.ts                               # Stats fallback & Server Action contract tests
├── tracks-data.test.ts                                 # Track badge counts & icon integrity tests
└── curriculum-data.test.ts                             # Quarter slug generation & parsing tests
```

---

## Skills Allocation Matrix

| Skill | Purpose & Assigned Work |
|---|---|
| **`design-taste-frontend`** | Visual polish, color token contrast, typography scale, thumb-zone ergonomics, and mobile layout discipline across `HeroSection`, `StatsBar`, `CategorySection`, and `TrialNoticeSection`. |
| **`frontend-ui-engineering`** | Component architecture, Radix/Shadcn UI composition, responsive CSS grid/flex structures, and clean icon swapping (`GraduationCap`, `Bot`, `ShieldCheck`). |
| **`seo`** | Heading hierarchy audit (`H1` in Hero -> `H2` in Sections -> `H3` in Cards), JSON-LD schema preservation, OpenGraph metadata, and canonical link integrity. |
| **`test-driven-development`** | Unit testing for Server Action contracts, catalog constants fallback resilience, and track data count assertions in `tests/unit/`. |
| **`atomic-commit`** | Logical, conventional git commits per functional chunk (`feat(landing): ...`, `fix(landing): ...`, `test(landing): ...`). |
| **`task-implementation`** | Step-by-step task tracking in `docs/tasks/TASK-028-landing-page-overhaul.md` and logging in `docs/backlog.md`. |
| **`speckit-plan`** / **`speckit-tasks`** | Spec-Kit specification, architectural design, and dependency-ordered task breakdown. |

---

## Phase 0: Research & Technical Feasibility

Completed in `specs/005-landing-page-overhaul/research.md`:
1. **Decision on Stats Bar**: Selected Server Action (`getLandingStatsAction`) + TanStack Query (`useLandingStatsQuery`) with static fallback constants to guarantee zero layout shift, resilient SSR TTFB, and authentic catalog numbers (75+ subjects, 1,800+ drills, 600+ modules, 100% DO 015 s. 2026).
2. **Decision on Section Sequencing**: Reordered `app/page.tsx` to position `AcademicWorkflowDemo` at Section 4 (right after `AboutSection` and before `HowToUseAppSection`, `CategorySection`, `PopularSubjectsSection`, and `TrialNoticeSection`), satisfying the Lovable/GetSpike PLG mandate: "Show the product before the signup wall".
3. **Decision on Iconography**: Complete purge of `Sparkles` icon across all landing page files (`HeroSection`, `HowToUseAppSection`, `TrialNoticeSection`, `TrackDetail`, `HowItWorks`, `TermsOfService`). Replaced developer `<Code>` icon on SHS Core with academic `GraduationCap` icon. Populated empty eyebrow badge in `HeroSection.tsx`.
4. **Decision on Curriculum Metadata**: Eliminated fake 4.9★ ratings and 2.4K reviews from `PopularSubjectsSection.tsx`. Replaced legacy "Trimester" (`g10-t1-sci`) with DepEd "Quarter" (`g10-q1-sci`, Quarter 1). Normalized track counts across `CategorySection.tsx` and `TrackDetail.tsx`.

---

## Phase 1: Data Model, Contracts & Design

Completed in:
- `specs/005-landing-page-overhaul/data-model.md`: Domain interfaces, Zod validation schemas, and constants for `LandingStats`, `TrackCategoryDefinition`, `FeaturedPopularSubject`, and `TRIAL_AND_PRICING_POLICY`.
- `specs/005-landing-page-overhaul/contracts/landing-stats.contract.ts`: Server Action and TanStack Query hook contract.
- `specs/005-landing-page-overhaul/contracts/landing-sections.contract.ts`: Component props, section order, and icon ban list.
- `specs/005-landing-page-overhaul/quickstart.md`: Automated CLI verification commands (PowerShell grep audits, Jest tests, `npm run build`) and visual acceptance checkpoints.

---

## Phase 2: Implementation Strategy (for `speckit-tasks`)

The implementation phase will be broken down into 6 discrete, dependency-ordered tasks:

1. **Task 1: Core Landing Stats Architecture & Fallback Constants**
   - Create `features/landing/types/landing.types.ts`
   - Create `features/landing/schemas/landing-stats.schema.ts`
   - Create `features/landing/constants/catalog-stats.ts`
   - Create `features/landing/actions/get-landing-stats.action.ts`
   - Create `features/landing/hooks/use-landing-stats.ts`
   - Create `tests/unit/landing-stats.test.ts`
2. **Task 2: Hero Section & Eyebrow Badge Overhaul (`HeroSection.tsx`)**
   - Populate empty top eyebrow badge with verified DepEd MATATAG text and `GraduationCap` icon
   - Refine headline to pass GetSpike specificity test for Philippine high schoolers
   - Update primary CTA to "Start 30-Day Free Trial" with microcopy ("₱0 upfront • No credit card required • Cancel anytime")
   - Align floating cards with authentic learning progress (General Math 75%, Socratic Taglish tutor, DO 015 88% mastery)
3. **Task 3: Stats Bar Overhaul (`StatsBar.tsx`)**
   - Connect `StatsBar.tsx` to `useLandingStatsQuery`
   - Eliminate fabricated figures (15K students, 98.2% pass rate, 130+ subjects, 12/24 lessons)
   - Render 75+ DepEd Subjects, 1,800+ Practice Drills, 600+ Lesson Modules, and 100% DepEd DO 015 s. 2026 Aligned
   - Guarantee zero layout shift (CLS = 0)
4. **Task 4: Section Re-sequencing in `app/page.tsx` & Product Preview Priority**
   - Move `AcademicWorkflowDemo` to Section 4 (immediately after `AboutSection` and before `HowToUseAppSection`)
   - Verify SEO heading hierarchy (H1 -> H2 -> H3) and JSON-LD metadata preservation
   - Update `AboutSection.tsx` copy from 12 lessons to 8 standardized lesson modules
5. **Task 5: Curriculum Categories, Track Taxonomy & Iconography Purge**
   - Update `CategorySection.tsx`: replace `<Code>` icon on SHS Core with `GraduationCap`; correct subject counts across all 7 tracks; update copy to 8 modules
   - Update `TrackDetail.tsx`: replace `<Code>` icon on SHS Core with `GraduationCap`; update subject counts and module counts; purge `Sparkles`
   - Update `HowToUseAppSection.tsx`, `TrialNoticeSection.tsx`, `HowItWorks.tsx`, `TermsOfService.tsx`: purge all occurrences of `Sparkles`
   - Update `CtaBanner.tsx`: copy reflecting 75+ subjects, 8 lessons, 24 drills; primary CTA "Start 30-Day Free Trial"
6. **Task 6: Popular Subjects Standardization & Quality Verification**
   - Overhaul `PopularSubjectsSection.tsx`: eliminate star ratings and review counts; render genuine curriculum metadata (Grade Level, DepEd Quarter, 8 Lessons & 24 Practice Drills, DO 015 Transmutation badge)
   - Replace legacy `g10-t1-sci` ("Grade 10 • Trimester 1") with `g10-q1-sci` ("Grade 10 • Quarter 1")
   - Run automated verification: PowerShell grep audits, unit tests (`npm test`), Next.js build (`npm run build`), and linting (`npm run lint`)
   - Update task file `docs/tasks/TASK-028-landing-page-overhaul.md` and change log in `docs/backlog.md`

---

## Complexity Tracking

*No constitutional violations exist. Architecture strictly adheres to FDA, TanStack Query single-source-of-truth, DepEd DO 015 s. 2026 compliance, and zero-mock testing standards.*
