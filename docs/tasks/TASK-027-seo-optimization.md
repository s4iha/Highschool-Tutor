# Task 027 - Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization

**Skills to be used**: 
- `seo` (`c:\Users\Dell\Desktop\highschool-tutor\.agents\skills\seo\SKILL.md`)
- `frontend-ui-engineering` (`C:\Users\Dell\.gemini\skills\frontend-ui-engineering\SKILL.md`)
- `design-taste-frontend` (`C:\Users\Dell\.gemini\skills\design-taste-frontend\SKILL.md`)
- `color-theory` (`C:\Users\Dell\.gemini\skills\color-theory\SKILL.md`)
- `dark-mode-generation` (`C:\Users\Dell\.gemini\skills\dark-mode-generation\SKILL.md`)
- `minimalist-ui` (`C:\Users\Dell\.gemini\skills\minimalist-ui\SKILL.md`)
- `high-end-visual-design` (`C:\Users\Dell\.gemini\skills\high-end-visual-design\SKILL.md`)
- `brandkit` (`C:\Users\Dell\.gemini\skills\brandkit\SKILL.md`)
- `senior-backend` (`C:\Users\Dell\.gemini\skills\senior-backend\SKILL.md`)
- `security-compliance` (`C:\Users\Dell\.gemini\skills\security-compliance\SKILL.md`)
- `test-driven-development` (`C:\Users\Dell\.gemini\skills\test-driven-development\SKILL.md`)
- `code-review-and-quality` (`C:\Users\Dell\.gemini\skills\code-review-and-quality\SKILL.md`)
- `atomic-commit` (`C:\Users\Dell\.gemini\skills\atomic-commit\SKILL.md`)

**Specification**: [`specs/004-seo-optimization/spec.md`](../../specs/004-seo-optimization/spec.md)  
**Implementation Plan**: [`specs/004-seo-optimization/plan.md`](../../specs/004-seo-optimization/plan.md)  
**Task Breakdown**: [`specs/004-seo-optimization/tasks.md`](../../specs/004-seo-optimization/tasks.md)  
**Research & Decisions**: [`specs/004-seo-optimization/research.md`](../../specs/004-seo-optimization/research.md)  
**Data Model**: [`specs/004-seo-optimization/data-model.md`](../../specs/004-seo-optimization/data-model.md)  
**Contracts**: [`specs/004-seo-optimization/contracts/`](../../specs/004-seo-optimization/contracts/)  
**Quickstart**: [`specs/004-seo-optimization/quickstart.md`](../../specs/004-seo-optimization/quickstart.md)  

---

## Skills Allocation Matrix

| Skill | Exact SKILL.md Path | Category | Assigned Responsibility & Scope | Phase / Deliverables | Tool / Verification |
|---|---|---|---|---|---|
| **`seo`** | `c:\Users\Dell\Desktop\highschool-tutor\.agents\skills\seo\SKILL.md` | Search & Discovery | Audit compliance with Google Search Central guidelines, Schema.org validation, sitemap/robots directives, and social preview meta tags | All Phases (1–7) | `.agents/skills/seo/scripts/` (`validate_schema.py`, `robots_checker.py`, `sitemap_checker.py`, `social_meta.py`) |
| **`frontend-ui-engineering`** | `C:\Users\Dell\.gemini\skills\frontend-ui-engineering\SKILL.md` | Next.js Architecture | Next.js 16 metadata API integration (`metadataBase`, `generateMetadata`, `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`), pure Server Component metadata and JSON-LD rendering | Phases 1–6 | `npm run build`, Next.js App Router metadata verification |
| **`design-taste-frontend`** | `C:\Users\Dell\.gemini\skills\design-taste-frontend\SKILL.md` | UI/UX & Aesthetics | High-contrast, polished visual design for dynamic OpenGraph cards (`ImageResponse`), color balance, and typography hierarchy avoiding AI slop | Phase 5 | Browser preview, image snapshot inspection |
| **`color-theory`** | `C:\Users\Dell\.gemini\skills\color-theory\SKILL.md` | Visual Harmony | 60-30-10 color distribution rule, harmonic contrast for DepEd badges, and accessible WCAG contrast across card previews | Phase 5 | Image rendering inspection, WCAG 2.2 AAA checks |
| **`dark-mode-generation`** | `C:\Users\Dell\.gemini\skills\dark-mode-generation\SKILL.md` | Theme Adaptation | OLED contrast depth, intelligent luminance balance, and theme consistency across social cards | Phase 5 | Visual preview inspection |
| **`minimalist-ui`** | `C:\Users\Dell\.gemini\skills\minimalist-ui\SKILL.md` | Visual Design | Clean, uncluttered layout for 1200x630 social preview card, badge typography, and crisp border styling | Phase 5 | OpenGraph preview rendering |
| **`high-end-visual-design`** | `C:\Users\Dell\.gemini\skills\high-end-visual-design\SKILL.md` | Visual Excellence | DepEd-inspired visual elevation, double-bezel styling, sophisticated gradients, branded badges, and high-DPI rendering | Phase 5 | Social card fidelity check |
| **`brandkit`** | `C:\Users\Dell\.gemini\skills\brandkit\SKILL.md` | Brand Identity | Platform logo placement, brand color token consistency (HSL tokens), and educational positioning | Phases 4–5 | Brand asset audit in `public/logo/` and OpenGraph template |
| **`senior-backend`** | `C:\Users\Dell\.gemini\skills\senior-backend\SKILL.md` | Server Architecture | Dynamic sitemap generation logic, streaming responses, error boundaries for invalid routes, canonical URL resolution, and performance | Phases 2–3 | Unit tests, HTTP endpoint verification |
| **`security-compliance`** | `C:\Users\Dell\.gemini\skills\security-compliance\SKILL.md` | Security & Privacy | Strict `robots.txt` disallow rules protecting private student data (`/dashboard/*`), admin panels (`/admin/*`), quiz APIs (`/api/*`), and curriculum drills (`/curriculum/*`); XSS character escaping in JSON-LD | Phases 3–4 | `robots_checker.py`, crawler security inspection, XSS test suite |
| **`test-driven-development`** | `C:\Users\Dell\.gemini\skills\test-driven-development\SKILL.md` | Quality Assurance | Strict Red-Green-Refactor cycles: automated test suites written and failing before implementation for sitemap XML, robots directives, JSON-LD schemas, and metadata builders | Phases 2–6 | Jest test suites in `__tests__/seo/` (`npm test`) |
| **`code-review-and-quality`** | `C:\Users\Dell\.gemini\skills\code-review-and-quality\SKILL.md` | Code Integrity | Five-axis code review (correctness, readability, architecture, security, performance), static typing, zero ESLint/TypeScript warnings, adherence to Feature-Driven Architecture (FDA) | Phases 2–7 | `npx tsc --noEmit`, `npm run lint` |
| **`atomic-commit`** | `C:\Users\Dell\.gemini\skills\atomic-commit\SKILL.md` | Version Control | Logical, atomic Git commits adhering to conventional commit specifications (`feat:`, `fix:`, `docs:`, `test:`) | Post-Implementation | Git commit history inspection |

---

## Description

Implement comprehensive Technical SEO, Rich Structured Data (JSON-LD), and Dynamic Social Sharing Previews for the HighSchool Tutor platform as defined in `specs/004-seo-optimization/spec.md`.

### Core Deliverables:

1. **Feature-Driven Architecture Domain Module (`features/seo/`)**:
   - `features/seo/types/index.ts`: TypeScript interfaces for `SiteConfig`, `RobotsConfig`, `SitemapEntry`, and Schema.org types.
   - `features/seo/components/JsonLd.tsx`: Pure Server Component for secure JSON-LD script injection with XSS escaping (`\u003c`, `\u003e`, `\u0026`).
   - `features/seo/utils/siteConfig.ts`: Canonical site URL, brand constants, default social images, and URL cleaning helpers.
   - `features/seo/utils/robotsBuilder.ts`: Robots directives builder with explicit allow and private disallow policies.
   - `features/seo/utils/sitemapBuilder.ts`: XML sitemap entries builder enumerating 5 static routes and 7 dynamic tracks.
   - `features/seo/utils/schemaBuilders.ts`: Pure builder functions for `EducationalOrganization`, `WebSite`, `FAQPage`, `Course`, and `BreadcrumbList`.
   - `features/seo/utils/metadataBuilders.ts`: OpenGraph & Twitter builder helpers with query parameter stripping.
   - `features/seo/index.ts`: Centralized barrel exports.

2. **Canonical Production Domain & Root Layout Metadata (`app/layout.tsx`)**:
   - Establish `metadataBase` using `process.env.NEXT_PUBLIC_SITE_URL || 'https://highschool-tutor.sgws.tech'`.
   - Guarantee all relative metadata assets and links resolve to absolute canonical URLs.
   - Configure global OpenGraph and Twitter card defaults (`og:site_name: "HighSchool Tutor"`, `og:locale: "en_PH"`, `twitter:card: "summary_large_image"`).
   - Inject root `EducationalOrganization` and `WebSite` (with `SearchAction`) JSON-LD schemas.

3. **Crawl Directives Policy (`app/robots.ts`)**:
   - Implement Next.js 16 dynamic `robots.ts` returning standard `MetadataRoute.Robots`.
   - Explicitly permit public marketing and informational routes: `/`, `/tracks`, `/tracks/*`, `/how-it-works`, `/privacy`, `/terms`.
   - Strictly disallow authenticated, administrative, and internal routes: `/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`.
   - Reference the authoritative canonical sitemap: `https://highschool-tutor.sgws.tech/sitemap.xml`.

4. **Dynamic XML Sitemap Architecture (`app/sitemap.ts`)**:
   - Implement Next.js 16 dynamic `sitemap.ts` returning `MetadataRoute.Sitemap`.
   - Map all static public routes with priority weights and change frequencies:
     - `/`: `priority: 1.0`, `changeFrequency: "daily"`
     - `/tracks`: `priority: 0.9`, `changeFrequency: "daily"`
     - `/how-it-works`: `priority: 0.8`, `changeFrequency: "weekly"`
     - `/privacy`: `priority: 0.5`, `changeFrequency: "monthly"`
     - `/terms`: `priority: 0.5`, `changeFrequency: "monthly"`
   - Dynamically enumerate all 7 academic track slugs from `TRACKS_DATA` (`junior-high-core`, `stem-strand`, `abm-strand`, `humss-strand`, `shs-core`, `gas-strand`, `tvl-track`) with `priority: 0.8`, `changeFrequency: "weekly"`, and current timestamps.

5. **Schema.org Rich Structured Data (JSON-LD)**:
   - Root (`app/layout.tsx`): `@type: EducationalOrganization` + `@type: WebSite` with `potentialAction: SearchAction`.
   - How It Works (`app/how-it-works/page.tsx`): `@type: FAQPage` structured with questions and answers on Socratic AI tutoring and DepEd DO 015 s. 2026 MATATAG curriculum.
   - Track Index (`app/tracks/page.tsx`): `@type: BreadcrumbList` detailing breadcrumb hierarchy.
   - Track Detail (`app/tracks/[id]/page.tsx`): `@type: Course` & `EducationalOccupationalCredential` with track competencies, grade bands, and `BreadcrumbList`.

6. **Dynamic OpenGraph Preview Image (`app/opengraph-image.tsx`) & Fallback**:
   - Next.js dynamic `ImageResponse` generating a 1200x630 branded card featuring the HighSchool Tutor brand mark, DepEd MATATAG badges, and modern typography.
   - Static fallback asset at `public/images/og-image.png` for resilience against image generator edge timeouts.

---

## Actionable Tasks Checklist (`specs/004-seo-optimization/tasks.md`)

### Phase 1: Setup (Shared Infrastructure)
- [X] T001 Configure Jest test match to include `<rootDir>/__tests__/**/*.test.{ts,tsx}` in `jest.config.ts` and initialize directory structures for `features/seo/{components,types,utils}` and `__tests__/seo/`
- [X] T002 [P] Update environment configuration template with canonical site URL `NEXT_PUBLIC_SITE_URL` in `.env.example`

### Phase 2: Foundational (Blocking Prerequisites)
- [X] T003 [P] Implement domain TypeScript interfaces (`SiteConfig`, `RobotsConfig`, `RobotsRule`, `SitemapEntry`, `ChangeFrequency`, `SchemaPostalAddress`, `SchemaEducationalOrganization`, `SchemaSearchAction`, `SchemaWebSite`, `SchemaFaqQuestion`, `SchemaFAQPage`, `SchemaCourse`, `SchemaBreadcrumbItem`, `SchemaBreadcrumbList`, `OpenGraphCardConfig`, `TwitterCardConfig`) in `features/seo/types/index.ts`
- [X] T004 Write unit test suite for site configuration and canonical URL sanitization in `__tests__/seo/siteConfig.test.ts`
- [X] T005 Implement canonical site configuration constants (`SITE_CONFIG`), URL resolution helpers (`getSiteUrl`, `getCanonicalUrl` stripping query parameters and hash fragments) in `features/seo/utils/siteConfig.ts`
- [X] T006 Create centralized barrel export for types, utils, and components in `features/seo/index.ts`

### Phase 3: User Story 1 - Technical Crawlability & Canonical Indexing (Priority: P1) 🎯 MVP
- [X] T007 [P] [US1] Write failing unit tests for robots crawl directives matrix (asserting allow rules for public marketing/track routes, disallow rules for `/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`, and sitemap declaration) in `__tests__/seo/robots.test.ts`
- [X] T008 [P] [US1] Write failing unit tests for dynamic sitemap builder (asserting 12 canonical URLs, ISO timestamps, priorities, and change frequencies derived from `TRACKS_DATA`) in `__tests__/seo/sitemap.test.ts`
- [X] T009 [US1] Implement robots directives builder function `buildRobotsConfig()` with public allow rules, private disallows, and canonical sitemap link in `features/seo/utils/robotsBuilder.ts`
- [X] T010 [US1] Implement App Router `robots.txt` dynamic route handler delegating to `buildRobotsConfig()` in `app/robots.ts`
- [X] T011 [US1] Implement dynamic sitemap builder `buildSitemapEntries()` enumerating 5 static routes and 7 dynamic tracks from `TRACKS_DATA` in `features/seo/utils/sitemapBuilder.ts`
- [X] T012 [US1] Implement App Router dynamic `sitemap.xml` route handler delegating to `buildSitemapEntries()` in `app/sitemap.ts`

### Phase 4: User Story 2 - Rich Educational Structured Data & Search Enhancements (Priority: P2)
- [X] T013 [P] [US2] Write failing unit tests for Schema.org JSON-LD builders (`buildOrganizationSchema`, `buildWebSiteSchema`, `buildFAQPageSchema`, `buildCourseSchema`, `buildBreadcrumbSchema`) asserting compliance with contracts in `__tests__/seo/schemaBuilders.test.ts`
- [X] T014 [P] [US2] Write failing unit tests for `<JsonLd>` Server Component verifying XSS escaping of `<`, `>`, and `&` characters in `__tests__/seo/JsonLd.test.tsx`
- [X] T015 [US2] Implement Schema.org builders conforming to Google Search Central specifications in `features/seo/utils/schemaBuilders.ts`
- [X] T016 [US2] Implement pure Server Component `<JsonLd>` with secure serialization and XSS character replacement in `features/seo/components/JsonLd.tsx` and export from `features/seo/components/index.ts`
- [X] T017 [US2] Inject `EducationalOrganization` and `WebSite` with `SearchAction` JSON-LD schemas into root layout in `app/layout.tsx`
- [X] T018 [US2] Inject `FAQPage` JSON-LD schema with DepEd MATATAG and Socratic AI tutoring Q&A into `app/how-it-works/page.tsx`
- [X] T019 [US2] Inject `BreadcrumbList` JSON-LD schema into academic tracks catalog in `app/tracks/page.tsx`
- [X] T020 [US2] Inject dynamic `Course`, `EducationalOccupationalCredential`, and `BreadcrumbList` JSON-LD schemas into academic track detail route in `app/tracks/[id]/page.tsx`

### Phase 5: User Story 3 - Social Graph Previews & Dynamic OpenGraph Card Generation (Priority: P3)
- [X] T021 [P] [US3] Write failing unit tests for OpenGraph and Twitter metadata builders in `__tests__/seo/metadataBuilders.test.ts`
- [X] T022 [P] [US3] Create static fallback OpenGraph preview graphic (1200x630 PNG) at `public/images/og-image.png`
- [X] T023 [US3] Implement OpenGraph and Twitter metadata helper functions `buildPageMetadata()` and `buildSocialCards()` in `features/seo/utils/metadataBuilders.ts`
- [X] T024 [US3] Implement dynamic 1200x630 OpenGraph card route with `ImageResponse`, brand marks, DepEd MATATAG badges, and subject pills in `app/opengraph-image.tsx`
- [X] T025 [US3] Integrate dynamic OpenGraph and Twitter card metadata for public marketing and track pages in `app/page.tsx`, `app/how-it-works/page.tsx`, `app/tracks/page.tsx`, and `app/tracks/[id]/page.tsx`

### Phase 6: User Story 4 - Multi-Route Metadata Consistency & Canonical URL Resolution (Priority: P4)
- [X] T026 [US4] Configure authoritative `metadataBase` in root layout `app/layout.tsx` using `getSiteUrl()` to guarantee absolute URL resolution across all metadata tags
- [X] T027 [P] [US4] Configure canonical URL, localized language tags (`en_PH`, `fil_PH`), and page metadata in `app/page.tsx`
- [X] T028 [P] [US4] Configure canonical URL and explicit indexing metadata in `app/how-it-works/page.tsx`
- [X] T029 [P] [US4] Configure canonical URL and track directory metadata in `app/tracks/page.tsx`
- [X] T030 [US4] Implement `generateMetadata` for dynamic track details with fallback handling and `noindex, nofollow` metadata on invalid track slugs in `app/tracks/[id]/page.tsx`
- [X] T031 [P] [US4] Configure canonical URL and explicit index directives (`index: true, follow: true`) in `app/privacy/page.tsx`
- [X] T032 [P] [US4] Configure canonical URL and explicit index directives (`index: true, follow: true`) in `app/terms/page.tsx`

### Phase 7: Polish & Cross-Cutting Concerns
- [X] T033 [P] Execute diagnostic script `.agents/skills/seo/scripts/validate_schema.py` across rendered JSON-LD structures to verify zero schema or formatting errors
- [X] T034 [P] Execute crawler verification script `.agents/skills/seo/scripts/robots_checker.py` and sitemap verification script `.agents/skills/seo/scripts/sitemap_checker.py` to assert crawl boundary enforcement
- [X] T035 [P] Execute social metadata diagnostic script `.agents/skills/seo/scripts/social_meta.py` verifying complete OpenGraph and Twitter card tags
- [X] T036 Run full test suite `npm test` verifying 100% pass across all unit and contract tests in `__tests__/seo/` and `tests/unit/`
- [X] T037 Run strict TypeScript compilation check `npx tsc --noEmit` to verify zero type errors
- [X] T038 Run ESLint verification `npm run lint` to ensure zero linting warnings or errors
- [X] T039 Run production Next.js build verification `npm run build` ensuring successful static generation and route compilation
- [X] T040 Update task documentation in `docs/tasks/TASK-027-seo-optimization.md` and log feature delivery in `docs/backlog.md`
