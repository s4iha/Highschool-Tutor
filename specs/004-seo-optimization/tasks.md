---
description: "Actionable, dependency-ordered task list for Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization"
---

# Tasks: Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization

**Input**: Design documents from `/specs/004-seo-optimization/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`)

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `data-model.md`, `contracts/`

**Tests**: Unit tests using Jest/ts-jest in `__tests__/seo/` and deterministic validation scripts in `.agents/skills/seo/scripts/` (`validate_schema.py`, `robots_checker.py`, `sitemap_checker.py`, `social_meta.py`).

**Organization**: Tasks are grouped by user story to enable independent implementation, rigorous TDD testing, and incremental delivery of each capability.

## Format: `[ID] [P?] [Story] Description with exact file path`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Associated user story (e.g., US1, US2, US3, US4)
- Exact file paths are specified for every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory structure creation, and environment variable template configuration.

- [X] T001 Configure Jest test match to include `<rootDir>/__tests__/**/*.test.{ts,tsx}` in `jest.config.ts` and initialize directory structures for `features/seo/{components,types,utils}` and `__tests__/seo/`
- [X] T002 [P] Update environment configuration template with canonical site URL `NEXT_PUBLIC_SITE_URL` in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core SEO domain models, canonical URL resolution helpers, and site configuration infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Implement domain TypeScript interfaces (`SiteConfig`, `RobotsConfig`, `RobotsRule`, `SitemapEntry`, `ChangeFrequency`, `SchemaPostalAddress`, `SchemaEducationalOrganization`, `SchemaSearchAction`, `SchemaWebSite`, `SchemaFaqQuestion`, `SchemaFAQPage`, `SchemaCourse`, `SchemaBreadcrumbItem`, `SchemaBreadcrumbList`, `OpenGraphCardConfig`, `TwitterCardConfig`) in `features/seo/types/index.ts`
- [X] T004 Write unit test suite for site configuration and canonical URL sanitization in `__tests__/seo/siteConfig.test.ts`
- [X] T005 Implement canonical site configuration constants (`SITE_CONFIG`), URL resolution helpers (`getSiteUrl`, `getCanonicalUrl` stripping query parameters and hash fragments) in `features/seo/utils/siteConfig.ts`
- [X] T006 Create centralized barrel export for types, utils, and components in `features/seo/index.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Technical Crawlability & Canonical Indexing (Priority: P1) 🎯 MVP

**Goal**: Establish automated crawler discoverability for all public marketing and academic track pages via dynamic XML sitemap (`/sitemap.xml`) and robots policy (`/robots.txt`), while strictly quarantining private student learning zones (`/dashboard/*`), school administration portals (`/admin/*`), quiz runner sessions (`/curriculum/*`), and API routes (`/api/*`).

**Independent Test**: Request `GET /robots.txt` and `GET /sitemap.xml` directly; verify that public routes are permitted, protected paths are disallowed, the canonical sitemap is linked, and the sitemap enumerates exactly 12 public URLs (5 static + 7 dynamic academic tracks) matching the Sitemap 0.9 XML schema.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Write failing unit tests for robots crawl directives matrix (asserting allow rules for public marketing/track routes, disallow rules for `/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`, and sitemap declaration) in `__tests__/seo/robots.test.ts`
- [X] T008 [P] [US1] Write failing unit tests for dynamic sitemap builder (asserting 12 canonical URLs, ISO timestamps, priorities, and change frequencies derived from `TRACKS_DATA`) in `__tests__/seo/sitemap.test.ts`

### Implementation for User Story 1

- [X] T009 [US1] Implement robots directives builder function `buildRobotsConfig()` with public allow rules, private disallows, and canonical sitemap link in `features/seo/utils/robotsBuilder.ts`
- [X] T010 [US1] Implement App Router `robots.txt` dynamic route handler delegating to `buildRobotsConfig()` in `app/robots.ts`
- [X] T011 [US1] Implement dynamic sitemap builder `buildSitemapEntries()` enumerating 5 static routes and 7 dynamic tracks from `TRACKS_DATA` in `features/seo/utils/sitemapBuilder.ts`
- [X] T012 [US1] Implement App Router dynamic `sitemap.xml` route handler delegating to `buildSitemapEntries()` in `app/sitemap.ts`

**Checkpoint**: At this point, User Story 1 is fully functional and delivers the complete crawlability & sitemap MVP increment.

---

## Phase 4: User Story 2 - Rich Educational Structured Data & Search Enhancements (Priority: P2)

**Goal**: Inject Google Search Central and Schema.org compliant JSON-LD structured data (`EducationalOrganization`, `WebSite` with `SearchAction`, `FAQPage`, `Course`, `EducationalOccupationalCredential`, and `BreadcrumbList`) directly into server-rendered HTML payloads, enabling rich snippets and high-visibility knowledge graphs.

**Independent Test**: Parse `<script type="application/ld+json">` payloads across `/`, `/how-it-works`, `/tracks`, and `/tracks/[id]` routes; execute `.agents/skills/seo/scripts/validate_schema.py` to confirm 100% schema validity, absence of XSS characters, and presence of all required Schema.org properties.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US2] Write failing unit tests for Schema.org JSON-LD builders (`buildOrganizationSchema`, `buildWebSiteSchema`, `buildFAQPageSchema`, `buildCourseSchema`, `buildBreadcrumbSchema`) asserting compliance with contracts in `__tests__/seo/schemaBuilders.test.ts`
- [X] T014 [P] [US2] Write failing unit tests for `<JsonLd>` Server Component verifying XSS escaping of `<`, `>`, and `&` characters in `__tests__/seo/JsonLd.test.tsx`

### Implementation for User Story 2

- [X] T015 [US2] Implement Schema.org builders conforming to Google Search Central specifications in `features/seo/utils/schemaBuilders.ts`
- [X] T016 [US2] Implement pure Server Component `<JsonLd>` with secure serialization and XSS character replacement in `features/seo/components/JsonLd.tsx` and export from `features/seo/components/index.ts`
- [X] T017 [US2] Inject `EducationalOrganization` and `WebSite` with `SearchAction` JSON-LD schemas into root layout in `app/layout.tsx`
- [X] T018 [US2] Inject `FAQPage` JSON-LD schema with DepEd MATATAG and Socratic AI tutoring Q&A into `app/how-it-works/page.tsx`
- [X] T019 [US2] Inject `BreadcrumbList` JSON-LD schema into academic tracks catalog in `app/tracks/page.tsx`
- [X] T020 [US2] Inject dynamic `Course`, `EducationalOccupationalCredential`, and `BreadcrumbList` JSON-LD schemas into academic track detail route in `app/tracks/[id]/page.tsx`

**Checkpoint**: User Stories 1 and 2 are fully integrated; search engines receive complete machine-readable educational semantics across all public routes.

---

## Phase 5: User Story 3 - Social Graph Previews & Dynamic OpenGraph Card Generation (Priority: P3)

**Goal**: Deliver rich, branded social preview cards (1200x630) for Facebook, Twitter/X, Viber, Discord, and LinkedIn using Next.js `ImageResponse` with DepEd MATATAG badges, platform branding, and subject highlights, complemented by an immutable static PNG fallback.

**Independent Test**: Fetch `GET /opengraph-image` verifying 1200x630 PNG output, inspect `<meta property="og:*">` and `<meta name="twitter:*">` tags across all public routes, and run `.agents/skills/seo/scripts/social_meta.py` with 0 missing tags.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T021 [P] [US3] Write failing unit tests for OpenGraph and Twitter metadata builders in `__tests__/seo/metadataBuilders.test.ts`
- [X] T022 [P] [US3] Create static fallback OpenGraph preview graphic (1200x630 PNG) at `public/images/og-image.png`

### Implementation for User Story 3

- [X] T023 [US3] Implement OpenGraph and Twitter metadata helper functions `buildPageMetadata()` and `buildSocialCards()` in `features/seo/utils/metadataBuilders.ts`
- [X] T024 [US3] Implement dynamic 1200x630 OpenGraph card route with `ImageResponse`, brand marks, DepEd MATATAG badges, and subject pills in `app/opengraph-image.tsx`
- [X] T025 [US3] Integrate dynamic OpenGraph and Twitter card metadata for public marketing and track pages in `app/page.tsx`, `app/how-it-works/page.tsx`, `app/tracks/page.tsx`, and `app/tracks/[id]/page.tsx`

**Checkpoint**: User Stories 1, 2, and 3 are operational; social platforms generate branded cards with DepEd visual identity on link shares.

---

## Phase 6: User Story 4 - Multi-Route Metadata Consistency & Canonical URL Resolution (Priority: P4)

**Goal**: Enforce strict canonical metadata hygiene, localized language indicators (`en_PH` and `fil_PH`), parameter stripping on canonical tags, and root `metadataBase` inheritance across all public application routes (`/`, `/tracks`, `/tracks/[id]`, `/how-it-works`, `/privacy`, `/terms`).

**Independent Test**: Verify that all public HTML responses contain clean `<link rel="canonical">` and `og:url` tags pointing strictly to the base pathname without query parameters, and that visiting invalid track routes returns HTTP 404 with `noindex, nofollow` metadata.

### Implementation for User Story 4

- [X] T026 [US4] Configure authoritative `metadataBase` in root layout `app/layout.tsx` using `getSiteUrl()` to guarantee absolute URL resolution across all metadata tags
- [X] T027 [P] [US4] Configure canonical URL, localized language tags (`en_PH`, `fil_PH`), and page metadata in `app/page.tsx`
- [X] T028 [P] [US4] Configure canonical URL and explicit indexing metadata in `app/how-it-works/page.tsx`
- [X] T029 [P] [US4] Configure canonical URL and track directory metadata in `app/tracks/page.tsx`
- [X] T030 [US4] Implement `generateMetadata` for dynamic track details with fallback handling and `noindex, nofollow` metadata on invalid track slugs in `app/tracks/[id]/page.tsx`
- [X] T031 [P] [US4] Configure canonical URL and explicit index directives (`index: true, follow: true`) in `app/privacy/page.tsx`
- [X] T032 [P] [US4] Configure canonical URL and explicit index directives (`index: true, follow: true`) in `app/terms/page.tsx`

**Checkpoint**: All public routes maintain metadata consistency and canonical hygiene with zero relative URL leaks.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: System-wide SEO verification, strict linting, type validation, regression testing, production build verification, and task tracking updates.

- [X] T033 [P] Execute diagnostic script `.agents/skills/seo/scripts/validate_schema.py` across rendered JSON-LD structures to verify zero schema or formatting errors
- [X] T034 [P] Execute crawler verification script `.agents/skills/seo/scripts/robots_checker.py` and sitemap verification script `.agents/skills/seo/scripts/sitemap_checker.py` to assert crawl boundary enforcement
- [X] T035 [P] Execute social metadata diagnostic script `.agents/skills/seo/scripts/social_meta.py` verifying complete OpenGraph and Twitter card tags
- [X] T036 Run full test suite `npm test` verifying 100% pass across all unit and contract tests in `__tests__/seo/` and `tests/unit/`
- [X] T037 Run strict TypeScript compilation check `npx tsc --noEmit` to verify zero type errors
- [X] T038 Run ESLint verification `npm run lint` to ensure zero linting warnings or errors
- [X] T039 Run production Next.js build verification `npm run build` ensuring successful static generation and route compilation
- [X] T040 Update task documentation in `docs/tasks/TASK-027-seo-optimization.md` and log feature delivery in `docs/backlog.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies — executes immediately.
- **Phase 2: Foundational**: Depends on Phase 1 completion — **BLOCKS all user stories**.
- **Phase 3: User Story 1 (P1)**: Depends on Phase 2. Can proceed immediately to deliver core crawlability MVP.
- **Phase 4: User Story 2 (P2)**: Depends on Phase 2. Independent of US1, but integrates into shared routes (`app/layout.tsx`, `app/tracks/page.tsx`).
- **Phase 5: User Story 3 (P3)**: Depends on Phase 2. Can proceed in parallel with US1/US2.
- **Phase 6: User Story 4 (P4)**: Depends on Phase 2. Unifies metadataBase and route-level canonical tags.
- **Phase 7: Polish & Verification**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1 - Crawlability)**: Self-contained within `features/seo/utils/{robotsBuilder,sitemapBuilder}.ts` and `app/{robots,sitemap}.ts`.
- **User Story 2 (P2 - Structured Data)**: Self-contained within `features/seo/utils/schemaBuilders.ts` and `features/seo/components/JsonLd.tsx`.
- **User Story 3 (P3 - Social Previews)**: Self-contained within `features/seo/utils/metadataBuilders.ts` and `app/opengraph-image.tsx`.
- **User Story 4 (P4 - Metadata Hygiene)**: Integrates `buildPageMetadata()` and canonical URL utilities across page routes.

### Within Each User Story

1. Write unit / contract tests FIRST and verify failure.
2. Implement utility builders and components.
3. Integrate into App Router pages / route handlers.
4. Verify tests pass cleanly (Green) and refactor as needed.

---

## Parallel Opportunities

- **Phase 1**: `T002` (.env.example) can run in parallel with `T001` (Jest config).
- **Phase 2**: `T003` (type interfaces) can be drafted in parallel with test scaffolding.
- **Phase 3**: `T007` (robots tests) and `T008` (sitemap tests) can run concurrently.
- **Phase 4**: `T013` (schema tests) and `T014` (JsonLd component tests) can run concurrently.
- **Phase 5**: `T021` (metadata tests) and `T022` (static og-image) can run concurrently.
- **Phase 6**: `T027`, `T028`, `T029`, `T031`, and `T032` (metadata across static pages) can run concurrently.
- **Phase 7**: Validation scripts `T033`, `T034`, and `T035` can execute in parallel.

---

## Parallel Examples: User Stories

```bash
# Launch all test writing for User Story 1 together:
Task T007: "Write failing unit tests for robots crawl directives matrix in __tests__/seo/robots.test.ts"
Task T008: "Write failing unit tests for dynamic sitemap builder in __tests__/seo/sitemap.test.ts"

# Launch all test writing for User Story 2 together:
Task T013: "Write failing unit tests for Schema.org JSON-LD builders in __tests__/seo/schemaBuilders.test.ts"
Task T014: "Write failing unit tests for <JsonLd> Server Component in __tests__/seo/JsonLd.test.tsx"

# Launch static page metadata updates for User Story 4 together:
Task T027: "Configure canonical URL and page metadata in app/page.tsx"
Task T028: "Configure canonical URL and indexing metadata in app/how-it-works/page.tsx"
Task T029: "Configure canonical URL and track directory metadata in app/tracks/page.tsx"
Task T031: "Configure canonical URL in app/privacy/page.tsx"
Task T032: "Configure canonical URL in app/terms/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`T001`, `T002`).
2. Complete Phase 2: Foundational (`T003`–`T006`).
3. Complete Phase 3: User Story 1 (`T007`–`T012`).
4. **STOP and VALIDATE**: Verify `GET /robots.txt` and `GET /sitemap.xml` directly. Deploy/demo crawlability MVP!

### Incremental Delivery

1. Setup + Foundational → Solid types and canonical URL resolution established.
2. User Story 1 → Technical crawlability & XML sitemap live (MVP).
3. User Story 2 → Google Search rich snippets & JSON-LD active.
4. User Story 3 → Dynamic OpenGraph cards & social previews active.
5. User Story 4 → Canonical URL normalization across all public routes.
6. Phase 7 Polish → Zero-defect quality assurance and script validation.
