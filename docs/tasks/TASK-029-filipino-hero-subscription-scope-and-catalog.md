# Task 029 - Authentic Filipino Hero Imagery, Frictionless Subscription Availment, DepEd MATATAG Scope Pages & Expanded Curriculum Catalog

**Skills to be used**: `frontend-ui-engineering`, `design-taste-frontend`, `high-end-visual-design`, `seo`, `security-and-hardening`, `test-driven-development`, `code-review-and-quality`, `atomic-commit`

## Description

Implement the four core pedagogical, operational, and visual enhancements identified during user testing and `/grill-me` alignment for HighSchool Tutor (detailed in `specs/006-filipino-hero-subscription-scope-catalog/spec.md` and designed in `specs/006-filipino-hero-subscription-scope-catalog/plan.md`):

1. **Authentic Filipino Hero Imagery**: Replace the foreign student stock photo in `HeroSection.tsx` with an authentic high-resolution photograph of a local Filipino high school student wearing a Philippine secondary school uniform (white school polo shirt / necktie / uniform) studying with textbook/laptop in a dedicated 4:5 vertical portrait aspect ratio (`aspect-[4/5]`), complete with responsive Next.js Image optimization (`priority`), descriptive alt text, and soft radial backlight integration.
2. **Frictionless Subscription Availment via Auth Intercept & Return Intent**: Eliminate the jarring 401 unauthorized error toast ("Checkout Initialization Failed") when unauthenticated visitors click to subscribe or checkout from marketing cards or dialogs. Implement an intuitive **Auth Intercept Modal** that acknowledges their plan selection (Monthly or Annual), preserves user intent and affiliate/referral attribution in `sessionStorage` (with URL query parameter fallback), and seamlessly initiates the PayMongo checkout redirect immediately upon sign-in or registration without manual re-selection.
3. **Public DepEd MATATAG Subject Scope Pages (`/subjects/[slug]` & `/subjects`)**: Create public, SEO-indexed routes displaying verified DepEd MATATAG curriculum metadata: official course title, subject code, academic level, track/strand, semester/quarter, time allotment (e.g. 80 hrs/semester), prerequisites, course description, and core competencies derived from `docs/resources/shs-subjects.md`. Integrate Schema.org `Course` and `BreadcrumbList` JSON-LD structured data, pre-render canonical pages with `generateStaticParams()`, enumerate routes in `app/sitemap.ts`, and provide prominent "Practice with Socratic AI" CTAs.
4. **Missing SHS Tracks & Core TVL Catalog Expansion**: Expand `features/curriculum/utils/curriculum-data.ts` and `features/landing/components/TrackDetail.tsx` (`TRACKS_DATA`) to include the complete Arts and Design Track (6 general subjects + specializations), complete Sports Track (9 subjects), and primary DepEd TVL specializations across Agri-Fishery Arts (AFA), Industrial Arts (IA), Home Economics (HE), and Information and Communications Technology (ICT) with accurate hours and prerequisites.

---

## Design Artifacts Reference

- **Feature Spec**: `specs/006-filipino-hero-subscription-scope-catalog/spec.md`
- **Architectural Plan**: `specs/006-filipino-hero-subscription-scope-catalog/plan.md`
- **Research & Decisions**: `specs/006-filipino-hero-subscription-scope-catalog/research.md`
- **Data Model**: `specs/006-filipino-hero-subscription-scope-catalog/data-model.md`
- **Contracts**:
  - `specs/006-filipino-hero-subscription-scope-catalog/contracts/auth-intercept-return-intent.contract.md`
  - `specs/006-filipino-hero-subscription-scope-catalog/contracts/subject-scope-page.contract.md`
  - `specs/006-filipino-hero-subscription-scope-catalog/contracts/curriculum-catalog-expansion.contract.md`
- **Verification Quickstart**: `specs/006-filipino-hero-subscription-scope-catalog/quickstart.md`
- **Actionable Task Breakdown**: `specs/006-filipino-hero-subscription-scope-catalog/tasks.md`

---

## Skills Allocation Matrix

| Phase / Component | Required Skills | Assigned Capabilities & Objectives |
| :--- | :--- | :--- |
| **Phase 1: Setup & Types** | `frontend-ui-engineering`<br>`senior-backend` | - Define `ReturnIntent` in `features/billing/types/billingTypes.ts`.<br>- Define `SubjectScopeDefinition` & `SubjectFilterState` in `features/curriculum/types/subjectScope.types.ts`.<br>- Update strand unions in `features/curriculum/types/curriculum.types.ts`.<br>- Align SEO schema types in `features/seo/types/index.ts`. |
| **Phase 2: Foundational Resolvers** | `frontend-ui-engineering`<br>`test-driven-development` | - Implement `getSubjectScopeDefinition` & `getAllSubjectScopeSlugs` in `features/curriculum/utils/subject-scope-data.ts`.<br>- Build unit test suite `tests/unit/subject-scope.test.ts`.<br>- Implement Schema.org Course & Breadcrumb builders in `features/seo/utils/schemaBuilders.ts`. |
| **Phase 3: US1 - Auth Intercept & Return Intent** | `frontend-ui-engineering`<br>`security-and-hardening` | - Write unit test suite `tests/unit/auth-intercept.test.ts`.<br>- Implement `useCheckoutReturnIntent.ts` with 2-hour TTL & idempotency.<br>- Build `AuthInterceptDialog.tsx` with clear plan badge & auth CTAs.<br>- Update `CheckoutModal.tsx` with client pre-flight check and intent storage.<br>- Mount resumption hook in global application shell. |
| **Phase 4: US2 - DepEd Scope Pages & Sitemap** | `seo`<br>`frontend-ui-engineering`<br>`design-taste-frontend` | - Build `PublicSubjectCatalog.tsx` with instant multi-facet filtering.<br>- Create public catalog route `app/subjects/page.tsx`.<br>- Build `SubjectScopeView.tsx` with official time allotment, prerequisites, and Socratic CTA.<br>- Create dynamic route `app/subjects/[slug]/page.tsx` with `generateStaticParams()` pre-rendering.<br>- Update `features/seo/utils/sitemapBuilder.ts` and `app/sitemap.ts` (85+ indexed URLs). |
| **Phase 5: US3 - Missing SHS Tracks & TVL Catalog** | `frontend-ui-engineering`<br>`test-driven-development`<br>`code-review-and-quality` | - Add Arts & Design subjects (6 general + streams) to `curriculum-data.ts`.<br>- Add Sports Track subjects (9 specialized) to `curriculum-data.ts`.<br>- Add core TVL specializations (AFA, IA, HE, ICT) with TESDA NC hours.<br>- Register `arts-design-track` & `sports-track` in `TRACKS_DATA` (`TrackDetail.tsx`).<br>- Update `tests/unit/tracks-data.test.ts` to assert all 9 tracks. |
| **Phase 6: US4 - Authentic Filipino Hero Visual** | `design-taste-frontend`<br>`high-end-visual-design`<br>`frontend-ui-engineering` | - Reference authentic Filipino student in uniform portrait in `HeroSection.tsx`.<br>- Enforce 4:5 vertical portrait aspect ratio (`aspect-[4/5]`) with `object-cover` and `object-top`.<br>- Configure Next.js `Image` with `priority`, responsive `sizes`, and descriptive alt text.<br>- Refine floating preview cards ensuring zero facial occlusion on mobile & desktop. |
| **Phase 7: Quality Verification & QA** | `test-driven-development`<br>`code-review-and-quality`<br>`atomic-commit` | - Strict TypeScript compilation (`npx tsc --noEmit`).<br>- Full automated test suite pass (`npx jest`).<br>- Next.js production build (`npm run build`).<br>- Task synchronization in `docs/tasks/` and backlog entry in `docs/backlog.md`. |

---

## Detailed Implementation Checkpoints

### Phase 1: Setup (Types & Shared Infrastructure)
- [x] [TSK-001] Define `ReturnIntent` interface and payload contracts in `features/billing/types/billingTypes.ts`
- [x] [TSK-002] Create `SubjectScopeDefinition` and `SubjectFilterState` types in `features/curriculum/types/subjectScope.types.ts`
- [x] [TSK-003] Update `CatalogShsStrand` and `ShsStrand` unions in `features/curriculum/types/curriculum.types.ts` to include `"Arts & Design"` and `"Sports"`
- [x] [TSK-004] Verify and expand SEO structured data interfaces for `SchemaCourse` and `SchemaBreadcrumbList` in `features/seo/types/index.ts`

### Phase 2: Foundational (Blocking Prerequisites)
- [x] [TSK-005] Implement `getSubjectScopeDefinition(slug)` and `getAllSubjectScopeSlugs()` resolver mapping canonical slugs to official DepEd descriptions, hours, prerequisites, and competencies in `features/curriculum/utils/subject-scope-data.ts`
- [x] [TSK-006] Create unit test suite `tests/unit/subject-scope.test.ts` verifying `getSubjectScopeDefinition` resolves accurate metadata, hours (80h/20h/TVL), and prerequisite chains for all tracks
- [x] [TSK-007] Implement `buildSubjectCourseSchema(subject)` and `buildSubjectBreadcrumbSchema(subject)` helper functions in `features/seo/utils/schemaBuilders.ts`

### Phase 3: User Story 1 (P1 - Auth Intercept & Return Intent Resumption in `features/billing/`)
- [x] [TSK-008] Create unit test suite `tests/unit/auth-intercept.test.ts` verifying return intent persistence, 2-hour TTL expiration, one-time consumption idempotency, and URL fallback parsing
- [x] [TSK-009] Create reactive intent resumption hook `features/billing/hooks/useCheckoutReturnIntent.ts` to detect `hst_return_intent` upon session activation, purge storage, and initiate PayMongo session redirect
- [x] [TSK-010] Create modular Auth Intercept component or view state `features/billing/components/AuthInterceptDialog.tsx` displaying plan badge, pricing, domestic payment rails, and Google/Email auth buttons
- [x] [TSK-011] Update `features/billing/components/CheckoutModal.tsx` to add client session preflight check (`!user`), suppress raw API mutation, store `ReturnIntent` to `sessionStorage`, and render the Auth Intercept view with zero error toasts
- [x] [TSK-012] Mount `useCheckoutReturnIntent` in the global application shell `app/layout.tsx` (or `providers/`) to handle automatic checkout resumption across any page entry point

### Phase 4: User Story 2 (P2 - Public DepEd MATATAG Scope Pages & Sitemap in `app/subjects/` and `features/seo/`)
- [x] [TSK-013] Create client-side interactive catalog component `features/curriculum/components/PublicSubjectCatalog.tsx` with search filter, academic level toggle, strand dropdown, and subject cards
- [x] [TSK-014] Create public catalog route `app/subjects/page.tsx` rendering SEO metadata, Schema.org `BreadcrumbList`, and embedding `PublicSubjectCatalog.tsx`
- [x] [TSK-015] Create subject scope visual component `features/curriculum/components/SubjectScopeView.tsx` rendering official subject title, code, hours, prerequisites, DepEd description, competencies table, and high-conversion Socratic AI practice CTA
- [x] [TSK-016] Create dynamic scope route `app/subjects/[slug]/page.tsx` with `generateStaticParams()` pre-rendering, `generateMetadata({ params })` with OpenGraph tags, Next.js `notFound()` handling, and Schema.org `Course` + `BreadcrumbList` JSON-LD injection
- [x] [TSK-017] Update `features/seo/utils/sitemapBuilder.ts` and `app/sitemap.ts` to dynamically enumerate `/subjects` (priority 0.9, daily) and all canonical `/subjects/[slug]` routes (priority 0.8, weekly)

### Phase 5: User Story 3 (P3 - Complete Missing SHS Tracks & TVL Specializations in `features/curriculum/utils/curriculum-data.ts`, `TrackDetail.tsx`, and `tests/unit/tracks-data.test.ts`)
- [x] [TSK-018] Add 6 Arts and Design general subjects (`AD-CI1`, `AD-CI2`, `AD-PPD`, `AD-DFI`, `AD-IEP`, `AD-LM`) and 5 specialization streams to `SHS_SUBJECT_CATALOG` in `features/curriculum/utils/curriculum-data.ts`
- [x] [TSK-019] Add 9 Sports Track specialized subjects (`SP-SFA`, `SP-HM`, `SP-FC`, `SP-SOAM`, `SP-FSRL`, `SP-PASE`, `SP-FTEP`, `SP-PRAC`, `SP-APPR`) to `SHS_SUBJECT_CATALOG` in `features/curriculum/utils/curriculum-data.ts`
- [x] [TSK-020] Add core DepEd TVL specializations across Agri-Fishery Arts, Industrial Arts, Home Economics, and ICT with official TESDA NC hours and prerequisites to `SHS_SUBJECT_CATALOG` in `features/curriculum/utils/curriculum-data.ts`
- [x] [TSK-021] Register `arts-design-track` into `TRACKS_DATA` in `features/landing/components/TrackDetail.tsx` with `Palette` icon, learning goals, career pathways, and 8-module featured subjects
- [x] [TSK-022] Register `sports-track` into `TRACKS_DATA` in `features/landing/components/TrackDetail.tsx` with `Trophy` icon, learning goals, career pathways, and 8-module featured subjects
- [x] [TSK-023] Update `tvl-track` in `features/landing/components/TrackDetail.tsx` to detail all 4 core sectors (AFA, IA, HE, ICT) with expanded career pathways and learning goals
- [x] [TSK-024] Update test suite `tests/unit/tracks-data.test.ts` to assert all 9 tracks (`arts-design-track`, `sports-track`, `tvl-track`, etc.), verifying required metadata, learning goals, and 8-module standardized subjects

### Phase 6: User Story 4 (P4 - Authentic Filipino Hero Visual & 4:5 Aspect Ratio in `features/landing/components/HeroSection.tsx`)
- [x] [TSK-025] Update central hero image source in `features/landing/components/HeroSection.tsx` to reference authentic Filipino student in uniform (`/images/filipino-student-writing.jpg` or updated `/images/hero-student.jpg`)
- [x] [TSK-026] Apply strict 4:5 vertical portrait aspect ratio container classes (`aspect-[4/5]`) with `object-cover` and `object-top` positioning in `features/landing/components/HeroSection.tsx`
- [x] [TSK-027] Configure Next.js `Image` component attributes in `features/landing/components/HeroSection.tsx`: set descriptive `alt="Filipino high school student studying DepEd MATATAG curriculum with HighSchool Tutor"`, `priority`, and responsive `sizes`
- [x] [TSK-028] Verify and fine-tune layout coordinates for floating preview cards (General Mathematics 75%, AI Socratic Taglish tutor, Assessment alert) in `features/landing/components/HeroSection.tsx` ensuring zero facial occlusion on mobile (360px-375px) and desktop viewports

### Phase 7: Polish, Quality Assurance & Verification
- [x] [TSK-029] Run TypeScript strict type verification (`npx tsc --noEmit`) and resolve any type discrepancies across curriculum, billing, and SEO modules
- [x] [TSK-030] Execute full automated unit test suite (`npx jest tests/unit/tracks-data.test.ts tests/unit/subject-scope.test.ts tests/unit/auth-intercept.test.ts`) ensuring 100% passing tests
- [x] [TSK-031] Execute Next.js production build (`npm run build`) to verify zero hydration mismatches, zero SSR build warnings, and successful static pre-rendering of `/subjects` and all `/subjects/[slug]` pages
- [x] [TSK-032] Synchronize verification checklist in `docs/tasks/TASK-029-filipino-hero-subscription-scope-and-catalog.md` and append entry to `docs/backlog.md`

---

## Verification Checklist

- [x] **Pillar 1 (Hero Visual)**: Central hero visual in `HeroSection.tsx` renders an authentic Filipino high school student in a Philippine school uniform in a 4:5 vertical portrait ratio with Next.js image optimization (`priority`).
- [x] **Pillar 1 (Hero Visual)**: Floating preview cards (General Mathematics 75%, Socratic Taglish tutor, assessment alert) remain harmoniously positioned without covering facial features.
- [x] **Pillar 2 (Auth Intercept)**: Unauthenticated visitor clicking checkout/subscribe on Monthly or Annual plan opens the Auth Intercept view with zero 401 error toasts.
- [x] **Pillar 2 (Return Intent)**: Selecting an auth action stores return intent in `sessionStorage`, and completing login immediately executes PayMongo checkout with the preserved plan and referral code.
- [x] **Pillar 2 (Modal Dismissal)**: Dismissing or canceling the Auth Intercept view cleanly returns user to the page with zero broken state.
- [x] **Pillar 3 (Scope Pages)**: Public catalog at `/subjects` renders a filterable, searchable list of all DepEd MATATAG subjects across JHS and SHS tracks.
- [x] **Pillar 3 (Scope Pages)**: Dynamic route `/subjects/[slug]` renders official DepEd course title, code, hours, prerequisites, description, and competencies from `docs/resources/shs-subjects.md`.
- [x] **Pillar 3 (SEO Structured Data)**: `/subjects/[slug]` embeds valid Schema.org `Course` and `BreadcrumbList` JSON-LD structured data and canonical metadata.
- [x] **Pillar 3 (Sitemap)**: `app/sitemap.ts` dynamically enumerates `/subjects` and all canonical `/subjects/[slug]` URLs with weekly change frequency (85+ total URLs).
- [x] **Pillar 3 (Edge Cases)**: Accessing an invalid subject slug renders a clean 404 page with a link back to `/subjects`.
- [x] **Pillar 4 (Arts & Design Track)**: `arts-design-track` is registered in `TRACKS_DATA` with `Palette` icon, overview, competencies, and 6 general subjects in `curriculum-data.ts`.
- [x] **Pillar 4 (Sports Track)**: `sports-track` is registered in `TRACKS_DATA` with `Trophy` icon, overview, competencies, and 9 specialized subjects in `curriculum-data.ts`.
- [x] **Pillar 4 (TVL Specializations)**: Core specializations across Agri-Fishery Arts, Industrial Arts, Home Economics, and ICT are added with official TESDA NC hours and prerequisites.
- [x] **Pillar 4 (Track Pages)**: `/tracks/arts-design-track` and `/tracks/sports-track` render cleanly without errors.
- [x] **Quality Assurance**: Unit tests pass (`npm test`), TypeScript compiles cleanly (`tsc --noEmit`), and production build completes successfully (`npm run build`).
