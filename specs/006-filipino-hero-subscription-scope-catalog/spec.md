# Feature Specification: Authentic Filipino Hero Imagery, Frictionless Subscription Availment, DepEd MATATAG Scope Pages & Expanded Curriculum Catalog

**Feature Branch**: `006-filipino-hero-subscription-scope-catalog`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "TASK-029: Authentic Filipino Hero Imagery, Frictionless Subscription Availment via Auth Intercept with Return Intent, Public DepEd MATATAG Subject Scope Pages (/subjects/[slug] and /subjects), and Missing SHS Tracks/TVL Specializations Catalog Expansion based on docs/resources/shs-subjects.md and /grill-me alignment."

---

## Executive Summary

HighSchool Tutor serves Philippine secondary learners, parents, and educators under the Department of Education (DepEd) K-12 MATATAG standards. Following the landing page overhaul in TASK-028, four critical operational and pedagogical gaps were identified during user testing and `/grill-me` alignment:

1. **Cultural Disconnect in Hero Visuals**: The landing page hero portrait utilizes a foreign student rather than an authentic local Filipino high school learner in a Philippine school uniform, diluting the platform's hyper-localized DepEd positioning.
2. **Subscription Availment Barrier for Guests**: When unauthenticated visitors click to subscribe or checkout from marketing sections, the platform triggers an unauthorized API request resulting in a jarring 401 error toast ("Checkout Initialization Failed: Unauthorized..."), creating friction instead of guiding them to sign in.
3. **Absence of Public, SEO-Indexed DepEd MATATAG Scope Pages**: Prospective students, parents, and educators searching Google for official DepEd subject requirements (e.g., General Mathematics time allotment, Pre-Calculus competencies, Earth and Life Science prerequisites) cannot view detailed scope pages before signing up, forfeiting substantial organic educational search traffic.
4. **Incomplete SHS Track and TVL Specialization Catalog**: The platform's curriculum catalog omits the official DepEd Arts and Design Track, Sports Track, and core Technical-Vocational-Livelihood (TVL) specializations defined in `docs/resources/shs-subjects.md` (spanning Agri-Fishery Arts, Industrial Arts, Home Economics, and ICT).

This specification establishes the end-to-end user scenarios, testable functional requirements, data models, and success criteria to resolve all four pillars without technical regressions or mock code.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Frictionless Subscription Availment with Auth Intercept & Return Intent (Priority: P1)

An unauthenticated visitor (student, parent, or guardian) reviews HighSchool Tutor's subscription plans on the public homepage or pricing areas. Convinced by the 30-day trial and ₱299/month or ₱2,499/annual pass, they click "Start Monthly Subscription" or "Get Annual Unlimited Pass". Instead of firing an unauthenticated network request that produces a 401 "Checkout Initialization Failed" error toast, the system gracefully intercepts the action with an intuitive Auth Intercept dialog:
- It acknowledges their chosen plan (e.g., "Annual Unlimited Pass — ₱2,499/year") and preserves their plan selection along with any active affiliate/referral attribution.
- It prompts the visitor to either "Sign In with Google", "Sign In with Email", or "Create a Free Student Account" to continue.
- Once authentication succeeds, the system automatically retrieves the preserved intent, transitions seamlessly into the checkout pipeline, and redirects directly to the PayMongo gateway (QR Ph, GCash, Maya, Card) without requiring the user to re-select their plan or click checkout again.

**Why this priority**: The 401 unauthorized toast is an active conversion blocker. Unauthenticated visitors attempting to pay are high-intent users; blocking them with error messages loses paying customers immediately. Providing a seamless auth intercept with intent resumption guarantees zero error toasts and maximizes subscription conversion.

**Independent Test**: Can be tested independently in an incognito window without signing in. Click any checkout button, verify that no 401 toast appears, confirm the Auth Intercept modal renders displaying the selected plan, complete sign-in via Google or email/password, and verify that the user is immediately redirected to PayMongo checkout with the preserved plan and referral code.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor viewing pricing options, **When** they click "Proceed to Checkout" or select a subscription plan, **Then** the application MUST NOT trigger a raw unauthenticated `/api/v1/billing/checkout/create-session` call and MUST NOT display any error toast.
2. **Given** an unauthenticated visitor clicking checkout on the Annual Plan, **When** the intercept activates, **Then** an Auth Intercept Modal renders displaying:
   - Clear context: "Sign In or Create an Account to Complete Your Subscription".
   - The selected plan summary (e.g., "Annual Unlimited Pass • ₱2,499/yr • Save ₱1,089").
   - Frictionless authentication actions: "Continue with Google" and "Sign In with Email / Password" / "Create Account".
3. **Given** the Auth Intercept Modal is triggered, **When** the visitor chooses to authenticate, **Then** the application stores the user's return intent (plan ID, billing cycle, and referral code if present) in client storage (`sessionStorage`).
4. **Given** an unauthenticated user completes authentication or account creation after being intercepted, **When** redirected back into the application, **Then** the platform detects the preserved return intent, displays a loading state ("Resuming your subscription checkout..."), invokes the checkout session API, and immediately navigates to PayMongo's secure hosted payment page.
5. **Given** a user cancels or closes the Auth Intercept Modal, **When** returning to the landing page, **Then** no error state or broken UI is displayed, and their previous page state is fully preserved.

---

### User Story 2 - Public DepEd MATATAG Curriculum Scope Pages (`/subjects/[slug]`) & Catalog (`/subjects`) (Priority: P2)

A high school learner, parent, or teacher searching for "General Mathematics DepEd MATATAG curriculum guide Grade 11" or "Basic Calculus SHS prerequisites and time allotment" discovers HighSchool Tutor's public scope page at `/subjects/g11-s1-genmath`. Without needing to log in, the visitor views:
- Verified DepEd course title, code, grade level, and semester/quarter.
- Official prescribed time allotment (e.g. 80 hours per semester; 20 hours for PEH; 160/320/640 hours for TVL specializations).
- Required prerequisites and corequisites (e.g., Pre-Calculus for Basic Calculus).
- Comprehensive course description derived from official DepEd curriculum guides in `docs/resources/shs-subjects.md`.
- Structured learning competencies organized by quarter or topic.
- Structured Schema.org `Course` and `BreadcrumbList` JSON-LD metadata for search engine indexing.
- A prominent high-conversion Call-to-Action ("Practice with Socratic AI Tutor" / "Start Free Subject Drill") that leads directly into the platform with pre-selected subject context.
- A comprehensive public catalog at `/subjects` allowing learners to filter, search, and browse all DepEd subjects across Junior High School and Senior High School tracks.

**Why this priority**: Public scope pages create an authoritative educational inbound funnel. DepEd students and parents constantly search for subject requirements, competencies, and syllabi before quarterly exams. Ranking for these search terms brings high-intent organic users directly to the platform.

**Independent Test**: Can be tested independently by navigating directly to `/subjects` and `/subjects/g11-s1-genmath` in a browser. Verify full rendering of official scope metadata, prerequisites, hours, competencies, Schema.org JSON-LD scripts in page source, and clickable practice CTAs without authentication.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor navigating to `/subjects`, **When** the page loads, **Then** it renders a complete, searchable, and filterable catalog of all DepEd MATATAG subjects grouped by Track/Strand and Grade Level.
2. **Given** an unauthenticated visitor accessing `/subjects/[slug]`, **When** the slug matches a valid DepEd subject, **Then** the page renders:
   - Official Subject Name, Code, and Academic Level (JHS / SHS).
   - Track/Strand categorization (Core, Applied, STEM, ABM, HUMSS, GAS, TVL, Arts & Design, Sports).
   - Prescribed Time Allotment (e.g., "80 hours per semester" or "20 hours per semester").
   - Prerequisites (explicitly naming required subjects or stating "None").
   - Official DepEd Course Description from `docs/resources/shs-subjects.md`.
   - Key Learning Competencies aligned with DepEd DO 015, s. 2026.
3. **Given** any public subject scope page, **When** inspected by search engine crawlers, **Then** the HTML contains valid Schema.org `Course` and `BreadcrumbList` JSON-LD schemas and canonical OpenGraph metadata.
4. **Given** a visitor on a subject scope page, **When** clicking "Start Practicing with Socratic AI", **Then** the user is directed to the registration/login flow with the subject pre-selected as their learning destination upon sign-in.
5. **Given** a search crawler requesting the XML sitemap at `/sitemap.xml`, **When** parsing entries, **Then** the catalog (`/subjects`) and all canonical subject scope URLs (`/subjects/[slug]`) are dynamically enumerated with appropriate priority (`0.8`) and weekly update frequency.
6. **Given** a visitor entering an invalid subject slug (e.g., `/subjects/unknown-subject`), **When** the route processes the request, **Then** it cleanly renders Next.js `notFound()` (404) with an informative message and a link back to `/subjects`.

---

### User Story 3 - Complete SHS Tracks & Specialized TVL Subjects Expansion (Priority: P3)

A Senior High School student enrolled in Arts and Design, Sports, or a Technical-Vocational-Livelihood (TVL) specialization visits HighSchool Tutor. Looking for their specific academic focus, they find their entire track fully supported:
- **Arts and Design Track**: All 6 general subjects (Creative Industries I & II, Physical & Personal Development in the Arts, Developing Filipino Identity in the Arts, Elements & Principles of Organization, Leadership and Management in Arts) and specialization streams (Media/Visual Arts, Literary Arts, Dance, Music, Theater) are cataloged with hours and competencies.
- **Sports Track**: All 9 official subjects (Safety & First Aid, Human Movement, Fundamentals of Coaching, Sports Officiating, Fitness & Recreation Leadership, Psychosocial Aspects, Fitness Testing, Practicum, Apprenticeship) are cataloged with certification details (e.g., Philippine Red Cross, NSA/TESDA).
- **Core DepEd TVL Specializations**: All primary specializations across Agri-Fishery Arts (AFA), Industrial Arts (IA), Home Economics (HE), and Information & Communications Technology (ICT) are enumerated with prescribed TESDA NC hours (160h, 320h, 640h) and prerequisites.
- All tracks are integrated into `TRACKS_DATA`, `SHS_SUBJECT_CATALOG`, and public track detail pages (`/tracks/[id]`).

**Why this priority**: Non-STEM/ABM students (Arts, Sports, TVL) represent a substantial portion of the Philippine Senior High School population. Leaving these tracks missing from the catalog marginalizes these learners and limits institutional adoption by comprehensive high schools.

**Independent Test**: Can be tested independently by querying `SHS_SUBJECT_CATALOG` and `TRACKS_DATA`, verifying that `arts-design-track` and `sports-track` are registered, TVL specializations across AFA, IA, HE, and ICT are cataloged with accurate hours and prerequisites, and corresponding `/tracks/arts-design-track` and `/tracks/sports-track` routes resolve with HTTP 200.

**Acceptance Scenarios**:

1. **Given** `features/curriculum/utils/curriculum-data.ts`, **When** querying the SHS subject catalog, **Then** it includes:
   - Arts and Design Track general subjects (6 subjects) and specialization pathways.
   - Sports Track specialized subjects (9 subjects).
   - Core TVL specializations across Agri-Fishery Arts (Agri Crops, Animal Production, Aquaculture, Food Processing, Organic Ag).
   - Core TVL specializations across Industrial Arts (Automotive, SMAW, EIM, EPAS, Carpentry, DOMRAC).
   - Core TVL specializations across Home Economics (Caregiving, Cookery, Bread & Pastry, Food & Beverage, Front Office, Housekeeping, Tourism Promotion).
   - Core TVL specializations across ICT (Animation, CSS, Computer Programming, Technical Drafting).
2. **Given** `features/landing/components/TrackDetail.tsx` (`TRACKS_DATA`), **When** listing all tracks, **Then**:
   - `arts-design-track` is defined with name "Arts and Design Track", appropriate Lucide icon (`Palette`), overview, learning goals, career pathways, and featured subjects.
   - `sports-track` is defined with name "Sports Track", appropriate Lucide icon (`Trophy` or `Activity`), overview, learning goals, career pathways, and featured subjects.
   - `tvl-track` is updated with comprehensive coverage across AFA, IA, HE, and ICT specializations.
3. **Given** an unauthenticated visitor visiting `/tracks/arts-design-track` or `/tracks/sports-track`, **When** the page renders, **Then** it loads the full track detail view, learning goals, career pathways, and course schema without errors.
4. **Given** `tests/unit/tracks-data.test.ts`, **When** test suites execute, **Then** all track assertions pass cleanly verifying the expanded tracks.

---

### User Story 4 - Authentic Local Filipino Student Hero Imagery & Cultural Grounding (Priority: P4)

A prospective student or parent lands on the HighSchool Tutor homepage. The central hero visual displays an authentic, high-resolution portrait of a local Filipino high school student wearing a Philippine school uniform (white school polo with collar, standard Philippine high school badge/tie) studying with textbooks and a laptop in a modern study environment. The portrait adheres to a dedicated 4:5 vertical portrait aspect ratio with soft backlight illumination, seamlessly anchoring the floating interactive cards (General Mathematics progress, Socratic Taglish tutor, upcoming exam reminders).

**Why this priority**: Visual authenticity establishes immediate cultural empathy and trust. A foreign stock model contradicts the platform's core identity as a dedicated Philippine DepEd companion. Showing a relatable Filipino high schooler reinforces that the platform was built by and for Philippine learners.

**Independent Test**: Can be tested independently by inspecting `HeroSection.tsx` and loading the homepage on mobile, tablet, and desktop viewports. Confirm that the hero image displays an authentic Filipino student in uniform, maintains a 4:5 aspect ratio without image distortion or stretching, has descriptive alt text, and loads with Next.js image optimization (`priority`).

**Acceptance Scenarios**:

1. **Given** the homepage hero section above the fold, **When** the central portrait loads, **Then** it renders an authentic Filipino high school student in a Philippine school uniform studying with textbooks/laptop, replacing the foreign student stock photo.
2. **Given** the image container in `HeroSection.tsx`, **When** displayed across viewports, **Then** it maintains a 4:5 vertical aspect ratio (`aspect-[4/5]`) with `object-cover` and `object-top` positioning, preventing distortion.
3. **Given** accessibility and SEO audits, **When** inspecting the image element, **Then** the `alt` attribute specifically describes the visual ("Filipino high school student studying DepEd MATATAG curriculum with HighSchool Tutor") and specifies `priority` loading for optimal Largest Contentful Paint (LCP).
4. **Given** the floating interactive cards adjacent to the hero portrait, **When** rendered on any screen size, **Then** they float over the authentic Filipino portrait without obscuring the student's face.

---

### Edge Cases

- **Guest Initiates Checkout via Direct URL or Bookmark**: If an unauthenticated visitor accesses a checkout initiation URL directly with query parameters (`/checkout?plan=ANNUAL&ref=AFFILIATE10`), the system MUST NOT trigger an unauthorized API call. It MUST redirect or open the Auth Intercept modal with the query parameters preserved in session intent.
- **Session Expiration During Auth Intercept**: If a visitor opens the Auth Intercept modal, leaves the browser idle until session token expiration, and then completes login, the return intent in `sessionStorage` MUST remain valid and execute checkout upon re-authentication.
- **Malformed or Deprecated Subject Slug**: If a visitor or crawler navigates to a slug that was renamed (e.g., legacy `g10-t1-sci`), the system MUST gracefully redirect to the canonical slug (`g10-q1-sci`) or render a friendly 404 page with a link to the `/subjects` catalog.
- **TVL Specializations with Extensive Prerequisites**: Certain TVL subjects require multiple prior certifications (e.g., Animal Health Care Management requires Animal Production NC II; Farm Machine Operations requires Agricultural Crops NC II). The subject scope page MUST explicitly list prerequisite chains in a clear, scannable format rather than crashing or showing blank values.
- **Mobile Viewport Overflow on Scope Pages**: Competency tables and prerequisite lists on `/subjects/[slug]` MUST be responsive on 360px mobile viewports with horizontal scroll wrappers or card-based responsive layouts.
- **Browser Disables Third-Party Storage**: If `sessionStorage` is disabled or throws a `QuotaExceededError`, the auth intercept MUST gracefully fall back to URL query parameters (`?returnToCheckout=1&plan=...`) to preserve user intent.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Pillar 1: Hero Imagery & Cultural Grounding
- **FR-001**: System MUST display an authentic Filipino high school student in a Philippine secondary school uniform studying with textbooks/laptop in the homepage hero section (`HeroSection.tsx`).
- **FR-002**: System MUST render the hero portrait in a 4:5 vertical portrait aspect ratio (`aspect-[4/5]`) utilizing Next.js `Image` with `priority`, responsive `sizes`, and descriptive Philippine-contextualized `alt` text.
- **FR-003**: System MUST maintain visual harmony with existing floating hero cards (General Mathematics 75% progress, Socratic AI Taglish assistant, quarterly assessment alert) without layout shifting.

#### Pillar 2: Auth Intercept & Frictionless Subscription Availment
- **FR-004**: System MUST intercept all unauthenticated subscription and checkout attempts prior to initiating backend payment mutation calls.
- **FR-005**: System MUST NOT trigger `/api/v1/billing/checkout/create-session` when the current session user is `null` or unauthenticated, and MUST NOT display any 401 unauthorized error toast.
- **FR-006**: System MUST render an Auth Intercept Modal when an unauthenticated guest clicks to subscribe or checkout, clearly summarizing the chosen plan (`MONTHLY` or `ANNUAL`), price, and offering "Continue with Google" or "Sign In with Email / Create Account" options.
- **FR-007**: System MUST persist the user's return intent (plan ID, billing frequency, and active referral code) in `sessionStorage` (with URL query parameter fallback) upon intercept activation.
- **FR-008**: System MUST automatically detect pending checkout return intent immediately following successful sign-in or account registration, display an affirmative resumption state ("Resuming your subscription checkout..."), and seamlessly initiate the PayMongo checkout redirect without requiring the user to re-select their plan.
- **FR-009**: System MUST allow users to dismiss the Auth Intercept Modal at any time, returning to their browsing state with zero errors.

#### Pillar 3: DepEd MATATAG Curriculum Scope Pages (`/subjects/[slug]` & `/subjects`)
- **FR-010**: System MUST provide a public, SEO-indexed catalog route at `/subjects` enumerating all DepEd MATATAG subjects across Junior High School (Grades 7–10) and Senior High School (Grades 11–12).
- **FR-011**: System MUST support client-side filtering and searching on `/subjects` by academic level (JHS vs. SHS), track/strand (Core, Applied, STEM, ABM, HUMSS, GAS, TVL, Arts & Design, Sports), and search keyword.
- **FR-012**: System MUST provide a public, SEO-indexed dynamic route at `/subjects/[slug]` displaying complete DepEd MATATAG curriculum scope metadata for each canonical subject slug.
- **FR-013**: System MUST display the following mandatory metadata on each subject scope page:
  - Official Subject Name and Subject Code
  - Academic Level and Grade Level
  - Strand / Track categorization
  - Semester / Quarter classification
  - Prescribed Time Allotment (hours per semester or quarter)
  - Explicit Prerequisites and Corequisites (or "None")
  - Official DepEd Course Description (based on `docs/resources/shs-subjects.md`)
  - Key Learning Competencies aligned with DepEd DO 015, s. 2026 standards
- **FR-014**: System MUST inject Schema.org `Course` and `BreadcrumbList` JSON-LD structured data into the `<head>` of `/subjects/[slug]` and `/subjects`.
- **FR-015**: System MUST provide a prominent Call-to-Action ("Practice with Socratic AI Tutor" / "Start Free Subject Drill") on every subject scope page that directs learners into the platform with the subject pre-selected.
- **FR-016**: System MUST pre-render all canonical subject scope pages at build time using `generateStaticParams()` to ensure instant delivery and complete search engine indexability.
- **FR-017**: System MUST render a standard Next.js 404 (`notFound()`) page with a direct link to the subject catalog if an invalid or unrecognized subject slug is requested.
- **FR-018**: System MUST dynamically enumerate `/subjects` and all canonical `/subjects/[slug]` URLs into `app/sitemap.ts` via `features/seo/utils/sitemapBuilder.ts` with `priority: 0.8` and `changeFrequency: "weekly"`.

#### Pillar 4: Missing Subjects & Tracks Catalog Expansion
- **FR-019**: System MUST expand `features/curriculum/utils/curriculum-data.ts` to include the complete Arts and Design Track:
  - 6 general subjects: Creative Industries I, Creative Industries II, Physical and Personal Development in the Arts, Developing Filipino Identity in the Arts, Integrating the Elements and Principles of Organization in the Arts, and Leadership and Management in Different Arts Fields.
  - Specialization streams covering Media Arts, Visual Arts, Literary Arts, Dance, Music, and Theater.
- **FR-020**: System MUST expand `features/curriculum/utils/curriculum-data.ts` to include the complete Sports Track (9 subjects):
  - Safety and First Aid, Human Movement, Fundamentals of Coaching, Sports Officiating and Activity Management, Fitness Sports and Recreation Leadership, Psychosocial Aspects of Sports and Exercise, Fitness Testing and Exercise Programming, Practicum (in-campus), and Apprenticeship (off-campus).
- **FR-021**: System MUST expand `features/curriculum/utils/curriculum-data.ts` to include core DepEd TVL specializations across all 4 sectors:
  - Agri-Fishery Arts (Agricultural Crops, Animal Production, Aquaculture, Food Processing, Organic Agriculture).
  - Industrial Arts (Automotive Servicing, SMAW, EIM, EPAS, Carpentry, DOMRAC).
  - Home Economics (Caregiving, Cookery, Bread and Pastry, Food and Beverage Services, Front Office, Housekeeping, Tourism Promotion).
  - ICT (Animation, Computer Systems Servicing, Computer Programming, Technical Drafting).
- **FR-022**: System MUST register `arts-design-track` and `sports-track` into `TRACKS_DATA` (`features/landing/components/TrackDetail.tsx`) with verified headlines, overviews, learning goals, career pathways, and featured subjects.
- **FR-023**: System MUST render public track detail pages for `/tracks/arts-design-track` and `/tracks/sports-track` without errors, conforming to existing track detail layouts and JSON-LD course schemas.

---

### Key Entities & Data Models

#### 1. ReturnIntent (Client Ephemeral State)
Represents the preserved intent when an unauthenticated guest clicks to subscribe or checkout:
- `planId`: `"MONTHLY" | "ANNUAL"` (the selected subscription tier)
- `referralCode`: `string | null` (optional affiliate/partner tracking code)
- `targetSubjectSlug`: `string | null` (optional subject the user was viewing or intending to practice)
- `timestamp`: `number` (epoch milliseconds to enforce intent expiration, e.g., 2 hours max)
- `sourceUrl`: `string` (page URL where the user initiated checkout)

#### 2. SubjectScopeDefinition (Curriculum Catalog Metadata)
Represents the authoritative educational scope and curriculum metadata for each DepEd subject:
- `slug`: `string` (unique kebab-case identifier, e.g., `g11-s1-genmath`)
- `code`: `string` (standard DepEd subject code, e.g., `GENMATH`, `TVL-CSS1`)
- `name`: `string` (official course name)
- `level`: `"Junior High School" | "Senior High School"`
- `grade`: `string` (e.g., `"Grade 11"`)
- `term`: `string` (e.g., `"Semester 1"` or `"Quarter 1"`)
- `track`: `string` (e.g., `"Core"`, `"Academic"`, `"TVL"`, `"Arts & Design"`, `"Sports"`)
- `strand`: `string` (e.g., `"STEM"`, `"ABM"`, `"HUMSS"`, `"GAS"`, `"Agri-Fishery Arts"`, `"ICT"`, etc.)
- `timeAllotment`: `string` (e.g., `"80 hours per semester"`, `"20 hours per semester"`, `"640 hours"`)
- `prerequisites`: `string[]` (list of required prerequisite subject names or codes)
- `corequisites`: `string[]` (optional list of concurrent subjects)
- `description`: `string` (official DepEd MATATAG course description)
- `competencies`: `string[]` (list of key learning competencies)
- `tesdaNcLevel`: `string | null` (optional TESDA qualification level for TVL, e.g., `"NC II"`, `"NC III"`)

#### 3. Expanded TrackData
Extension of `TRACKS_DATA` in `TrackDetail.tsx` to accommodate the 2 new tracks:
- `id`: `"arts-design-track" | "sports-track"`
- `name`: `string`
- `badge`: `string`
- `headline`: `string`
- `overview`: `string`
- `grades`: `string` (e.g., `"Grades 11 and 12"`)
- `icon`: `LucideIcon` (`Palette` for Arts & Design; `Trophy` for Sports)
- `color`, `accent`, `pill`: `string` (Tailwind color token classes)
- `subjectsCount`: `string` (e.g., `"6 General + 5 Specializations"` or `"9 Specialized Subjects"`)
- `learningGoals`: `string[]`
- `featuredSubjects`: `Array<{ code: string; title: string; description: string; modules: number }>`
- `careerPathways`: `string[]`
- `aiTutorCapabilities`: `string[]`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unauthenticated checkout attempts on marketing pages open the Auth Intercept Modal with zero 401 error toasts.
- **SC-002**: 100% of intercepted users who subsequently authenticate are seamlessly redirected to PayMongo checkout with their selected plan and referral code intact without manual re-selection.
- **SC-003**: 100% of canonical DepEd subjects have dedicated, pre-rendered public scope pages at `/subjects/[slug]` with valid Schema.org `Course` and `BreadcrumbList` JSON-LD structured data.
- **SC-004**: Dynamic sitemap (`app/sitemap.ts`) automatically indexes `/subjects` and all canonical `/subjects/[slug]` routes, boosting platform indexable URLs from 12 to 85+.
- **SC-005**: Arts and Design Track (`arts-design-track`), Sports Track (`sports-track`), and all 4 core TVL sector specializations are fully cataloged in `curriculum-data.ts` and `TRACKS_DATA`.
- **SC-006**: Homepage hero section displays an authentic Filipino student in uniform with a dedicated 4:5 portrait ratio, achieving an LCP under 2.0 seconds on standard 4G connections.
- **SC-007**: Unit tests, TypeScript compilation (`tsc --noEmit`), and production build (`npm run build`) pass cleanly with zero linting or type errors.

---

## Assumptions

- **Authentication Provider**: Authentication is handled via Better Auth with existing Google OAuth and email/password sessions.
- **PayMongo Integration**: Backend payment processing via `/api/v1/billing/checkout/create-session` and PayMongo client is fully functional; no modification to PayMongo webhook signatures or secret keys is required.
- **Client Storage Availability**: Modern browsers support `sessionStorage`. For privacy-restricted modes where `sessionStorage` throws, safe fallback to URL query parameters is utilized.
- **Static Pre-rendering**: Subject scope pages are pre-rendered at build time via `generateStaticParams()` using the in-memory curriculum catalog, requiring zero database calls during public page visits.
- **DepEd Standards Source**: Curriculum descriptions, time allotments, and prerequisites are strictly derived from official DepEd curriculum guides preserved in `docs/resources/shs-subjects.md`.
