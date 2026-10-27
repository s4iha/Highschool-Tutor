# Feature Specification: Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization

**Feature Branch**: `004-seo-optimization`

**Created**: 2026-10-27

**Status**: Draft

**Input**: User description: "TASK-027: Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization for HighSchool Tutor platform."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Technical Crawlability & Canonical Indexing (Priority: P1)

Search engine web crawlers (such as Googlebot, Bingbot) and AI search agents discover, navigate, and index all public landing, educational information, and academic track pages via a standards-compliant dynamic XML sitemap (`/sitemap.xml`) and a robust `robots.txt` configuration. At the same time, protected student learning areas, administrative management portals, and private curriculum drill routes (`/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`) are strictly excluded from search crawler indexation, safeguarding student data privacy and preventing thin/duplicate search results.

**Why this priority**: Crawlability and explicit indexation boundaries are the foundational prerequisites of all search discoverability. If crawlers cannot systematically discover curriculum tracks, or conversely index private student dashboards, the platform suffers from indexation fragmentation, poor search rankings, and privacy vulnerabilities.

**Independent Test**: Can be fully verified by requesting `/robots.txt` and `/sitemap.xml` directly, confirming that all 6 static public routes and all 7 dynamic academic tracks are listed with proper priorities, and asserting that all private student/admin paths are blocked via automated crawler testing.

**Acceptance Scenarios**:

1. **Given** a web crawler requesting `/robots.txt`, **When** the request is processed, **Then** the system returns a valid `robots.txt` file that allows all public marketing routes (`/`, `/tracks`, `/tracks/*`, `/how-it-works`, `/privacy`, `/terms`), strictly disallows authenticated and admin zones (`/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`), and advertises the canonical sitemap URL `https://highschool-tutor.sgws.tech/sitemap.xml`.
2. **Given** a search engine requesting `/sitemap.xml`, **When** the route is invoked, **Then** it generates valid XML containing all static public URLs (`/`, `/tracks`, `/how-it-works`, `/privacy`, `/terms`) with accurate `changeFrequency` and `priority` values (1.0 for homepage, 0.9 for `/tracks`, 0.8 for `/how-it-works`, 0.5 for legal pages).
3. **Given** the 7 academic tracks defined in the platform curriculum data (`junior-high-core`, `stem-strand`, `abm-strand`, `humss-strand`, `shs-core`, `gas-strand`, `tvl-track`), **When** `/sitemap.xml` is generated, **Then** all 7 track URLs (`/tracks/{id}`) are dynamically included with `priority: 0.8`, `changeFrequency: "weekly"`, and valid ISO `lastModified` timestamps.
4. **Given** any public route requested with tracking query parameters (e.g., `/?ref=SGWS-100` or `/tracks/stem-strand?utm_source=facebook`), **When** rendered, **Then** the HTML `<head>` contains a canonical `<link rel="canonical">` tag pointing strictly to the clean base URL without query parameters.

---

### User Story 2 - Rich Educational Structured Data & Search Enhancements (Priority: P2)

When search engines and AI answer engines crawl public HighSchool Tutor pages, they parse rich Schema.org JSON-LD structured data embedded directly in the server-rendered HTML. This empowers Google Search and answer engines to present enhanced Rich Snippets (Knowledge Graph entries, FAQ interactive accordions, Course listings for Senior High School strands, and breadcrumb trails), dramatically boosting organic click-through rates and highlighting DepEd MATATAG curriculum alignment.

**Why this priority**: Structured data provides machine-readable semantics that search engines and AI models (Google Gemini, Search Generative Experience, Perplexity) use to generate rich cards and featured answers. For an educational SaaS, rich Course and FAQ snippets convey instant credibility to parents and teachers.

**Independent Test**: Can be fully tested by parsing the `<script type="application/ld+json">` payloads across public routes and verifying 100% compliance against Google Search Central structured data specifications using automated schema validation scripts with zero syntax or required property errors.

**Acceptance Scenarios**:

1. **Given** a crawler indexing the root landing page (`/`), **When** the page HTML is parsed, **Then** it contains valid Schema.org JSON-LD specifying `@type: EducationalOrganization` and `@type: WebSite` with a `potentialAction: SearchAction` targeting curriculum search queries.
2. **Given** a crawler indexing the `/how-it-works` guide, **When** the page HTML is parsed, **Then** it contains valid Schema.org JSON-LD specifying `@type: FAQPage` with structured `Question` and `Answer` entities reflecting the official Socratic AI tutoring and DepEd DO 015 s. 2026 curriculum policies.
3. **Given** a crawler indexing any academic track page (`/tracks/[id]`), **When** the page HTML is parsed, **Then** it contains valid Schema.org JSON-LD specifying `@type: Course` (and `EducationalOccupationalCredential`) detailing the strand title, grade band, educational credential, competency description, and provider organization (`HighSchool Tutor`).
4. **Given** a crawler or visitor navigating to `/tracks` or any `/tracks/[id]` page, **When** the page HTML is parsed, **Then** it contains a structured `@type: BreadcrumbList` detailing the hierarchical navigation steps (`Home` > `Academic Tracks` > `[Track Title]`).

---

### User Story 3 - Social Graph Previews & Dynamic OpenGraph Card Generation (Priority: P3)

When students, teachers, parents, or affiliate partners share HighSchool Tutor links across social messaging platforms (Facebook, Messenger, X/Twitter, Viber, WhatsApp, LinkedIn, Discord), the platform serves rich, branded preview cards with high-contrast DepEd-inspired visual branding, subject badges, and accurate title/description metadata.

**Why this priority**: Word-of-mouth recommendations among teachers, parents, and high school student groups represent a vital organic acquisition channel in the Philippines. Eye-catching, informative social preview cards drive substantially higher click-through rates and reinforce trust.

**Independent Test**: Can be fully tested by fetching the dynamic OpenGraph endpoint (`/opengraph-image`) and verifying image dimensions (1200x630), content-type (`image/png`), and parsing OpenGraph/Twitter meta tags across all public routes with zero missing tags.

**Acceptance Scenarios**:

1. **Given** a link shared on Facebook, Messenger, Viber, or Discord, **When** the platform scraper requests the URL, **Then** the page returns complete OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:locale: "en_PH"`, `og:type: "website"`).
2. **Given** a link shared on X/Twitter, **When** the Twitterbot scraper requests the URL, **Then** the page returns complete Twitter tags (`twitter:card: "summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`).
3. **Given** a request for `/opengraph-image`, **When** the endpoint executes, **Then** Next.js dynamic `ImageResponse` dynamically generates a 1200x630 branded graphic featuring the HighSchool Tutor logo, DepEd MATATAG alignment badge, and headline typography.
4. **Given** an unexpected edge runtime or image generation failure, **When** metadata is assembled, **Then** the system provides a static fallback image path at `public/images/og-image.png` ensuring social scrapers always receive a valid visual preview.
5. **Given** a specific academic track page (`/tracks/[id]`), **When** shared on social media, **Then** the OpenGraph and Twitter title and description dynamically reflect the specific track name, grade band, and overview text.

---

### User Story 4 - Multi-Route Metadata Consistency & Canonical URL Resolution (Priority: P4)

All public routes maintain strict canonical metadata hygiene, consistent viewport configurations, localized language indicators (`en_PH` and `fil_PH`), and clean metadata inheritance via Next.js `metadataBase`, avoiding duplicate content penalties and multi-domain canonical fragmentation across preview, staging, and production environments.

**Why this priority**: Clean metadata inheritance prevents search engines from penalizing the site for duplicate content between staging deployments and the primary production domain (`https://highschool-tutor.sgws.tech`), ensuring 100% of domain authority consolidates into the canonical URL.

**Independent Test**: Can be fully tested by asserting that all metadata tags with URL properties (`og:url`, `og:image`, canonical `<link>`, and sitemap entries) resolve to absolute URLs rooted in `process.env.NEXT_PUBLIC_SITE_URL` (defaulting to `https://highschool-tutor.sgws.tech`).

**Acceptance Scenarios**:

1. **Given** the application deployed across varying environments (preview, staging, local), **When** metadata URLs are constructed, **Then** `metadataBase` resolves relative assets against the canonical domain specified in `NEXT_PUBLIC_SITE_URL` (fallback: `https://highschool-tutor.sgws.tech`).
2. **Given** public policy pages (`/privacy` and `/terms`), **When** inspected, **Then** they contain explicit indexing directives (`index: true, follow: true`), tailored descriptions, and proper canonical links.
3. **Given** the root HTML document delivered to clients and crawlers, **When** inspected, **Then** the root element specifies `lang="en"` with alternate language metadata tags reflecting Philippine English and Filipino educational contexts.

---

### Edge Cases

- **Missing Environment Variable**: What happens if `NEXT_PUBLIC_SITE_URL` is undefined or empty in a deployment environment? The system defaults safely and authoritatively to `https://highschool-tutor.sgws.tech` with zero runtime crashes or relative URL leaks.
- **Invalid Track Identifier**: What happens when a crawler or visitor navigates to `/tracks/non-existent-strand`? The route invokes `notFound()`, returning an HTTP 404 status code with explicit `noindex, nofollow` metadata so crawlers do not index broken routes.
- **Authenticated User Landing on Home**: What happens when an authenticated student visits the root URL (`/`)? The server redirects logged-in students to `/dashboard` and admins to `/admin`, but unauthenticated search engine crawlers always receive the full public landing page HTML with complete JSON-LD and OpenGraph metadata.
- **Zero-JavaScript Crawler Compatibility**: How does the system handle crawlers that do not execute client-side JavaScript? All JSON-LD structured data and meta tags are rendered directly into the initial HTML response via Next.js Server Components, ensuring 100% discoverability without requiring client hydration.
- **Query Parameter Stripping**: What happens when visitors or crawlers access URLs with affiliate parameters (`?ref=CODE`), marketing tags (`?utm_*`), or search queries? The canonical `<link rel="canonical">` tag and `og:url` strictly strip all query parameters, pointing only to the normalized canonical pathname.
- **Dynamic Image Generation Latency**: What happens if social scrapers encounter network latency during dynamic `ImageResponse` generation? Next.js edge caching caches generated preview images, and the metadata configures `public/images/og-image.png` as a guaranteed static asset.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST configure `metadataBase` in the root layout (`app/layout.tsx`) utilizing `process.env.NEXT_PUBLIC_SITE_URL` with a reliable fallback to `https://highschool-tutor.sgws.tech` to guarantee that all relative metadata URLs resolve to absolute canonical URLs.
- **FR-002**: System MUST generate a standard, compliant `robots.txt` via Next.js App Router dynamic route (`app/robots.ts`) that allows all public marketing and track pages (`/`, `/tracks`, `/tracks/*`, `/how-it-works`, `/privacy`, `/terms`) and strictly disallows authenticated and administrative zones (`/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`).
- **FR-003**: System MUST link the canonical sitemap (`https://highschool-tutor.sgws.tech/sitemap.xml`) in `app/robots.ts`.
- **FR-004**: System MUST generate an XML sitemap via Next.js App Router dynamic route (`app/sitemap.ts`) containing all static public URLs (`/`, `/tracks`, `/how-it-works`, `/privacy`, `/terms`) with designated `changeFrequency` (`daily` for home/tracks, `weekly` for how-it-works, `monthly` for legal) and search `priority` scores (1.0 for `/`, 0.9 for `/tracks`, 0.8 for `/how-it-works`, 0.5 for legal).
- **FR-005**: System MUST dynamically enumerate all academic track slugs from `TRACKS_DATA` (`junior-high-core`, `stem-strand`, `abm-strand`, `humss-strand`, `shs-core`, `gas-strand`, `tvl-track`) into `app/sitemap.ts` with `changeFrequency: "weekly"`, `priority: 0.8`, and current ISO timestamps.
- **FR-006**: System MUST inject valid Schema.org JSON-LD into the root page/layout containing `@type: EducationalOrganization` and `@type: WebSite` with `potentialAction: SearchAction` targeting the curriculum search query format.
- **FR-007**: System MUST inject Schema.org JSON-LD into `/how-it-works` containing `@type: FAQPage` with questions and answers reflecting the verified DepEd MATATAG curriculum and Socratic AI tutoring policies.
- **FR-008**: System MUST inject Schema.org JSON-LD into `/tracks/[id]` containing `@type: Course` and `@type: EducationalOccupationalCredential` detailing strand name, educational level, description, provider (`HighSchool Tutor`), and competencies.
- **FR-009**: System MUST inject Schema.org JSON-LD into `/tracks` and `/tracks/[id]` containing `@type: BreadcrumbList` mapping hierarchical navigation steps (`Home` > `Academic Tracks` > `[Track Name]`).
- **FR-010**: System MUST dynamically render a branded 1200x630 OpenGraph social preview image via Next.js App Router `app/opengraph-image.tsx` using `ImageResponse` with DepEd-inspired design elements, platform title, and logo.
- **FR-011**: System MUST provide a static fallback OpenGraph image at `public/images/og-image.png` (1200x630 PNG) to serve as a high-reliability fallback.
- **FR-012**: System MUST define complete OpenGraph metadata across all public routes including `og:title`, `og:description`, `og:url`, `og:siteName`, `og:locale: "en_PH"`, and `og:type`.
- **FR-013**: System MUST define complete Twitter card metadata across all public routes specifying `twitter:card: "summary_large_image"`, `twitter:title`, `twitter:description`, and `twitter:image`.
- **FR-014**: System MUST generate canonical `<link rel="canonical" href="...">` tags for every public route, stripping all tracking and query parameters.
- **FR-015**: System MUST serve all metadata and JSON-LD structured data via server-rendered HTML payloads without requiring client-side JavaScript execution or hydration.
- **FR-016**: System MUST pass all SEO validation checks defined in `.agents/skills/seo/scripts/` (`validate_schema.py`, `robots_checker.py`, `sitemap_checker.py`, `social_meta.py`) and adhere to Google Search Central structured data specifications.

---

### Key Entities

- **Canonical Site Configuration**: The authoritative domain resolution entity (`NEXT_PUBLIC_SITE_URL` / `https://highschool-tutor.sgws.tech`) establishing base URLs for all canonical links, sitemaps, OpenGraph tags, and schema IDs.
- **Crawl Directives Policy**: The indexation and robot rule entity governing user agents (`*`, AI bots), allowed public paths, and disallowed private paths (`/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`).
- **Sitemap Catalog**: The prioritized index of discoverable application URLs, change frequencies, priority weights, and modification timestamps for static and dynamic academic track routes.
- **Structured Data (JSON-LD)**: Schema.org semantic specifications for `EducationalOrganization`, `WebSite`, `FAQPage`, `Course`, `EducationalOccupationalCredential`, and `BreadcrumbList`.
- **Social Graph Card**: Visual and metadata preview entity defining 1200x630 OpenGraph image response, title, description, and Twitter card attributes across social sharing channels.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of public marketing and track routes (`/`, `/tracks`, `/tracks/*`, `/how-it-works`, `/privacy`, `/terms`) are indexable and exposed in `/sitemap.xml` with zero XML syntax or schema errors.
- **SC-002**: 100% of private student and administrative routes (`/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`) are strictly disallowed in `robots.txt` and excluded from `sitemap.xml`.
- **SC-003**: 100% of JSON-LD structured data blocks pass Google Search Central Rich Results validation and `validate_schema.py` checks with zero critical schema errors or missing required properties.
- **SC-004**: 100% of public routes deliver complete OpenGraph and Twitter card metadata tags with valid 1200x630 preview image URLs resolving to HTTP 200.
- **SC-005**: 100% of canonical URL tags resolve to absolute URLs rooted in the canonical production domain (`https://highschool-tutor.sgws.tech`).
- **SC-006**: Initial HTML page responses contain all structured data and social metadata statically rendered on the server with zero client-side JavaScript execution required.

---

## Assumptions

- **Canonical Domain**: `https://highschool-tutor.sgws.tech` is the primary canonical production domain hosted via Vercel/Node.js infrastructure.
- **Curriculum Source of Truth**: Academic tracks enumerated in `TRACKS_DATA` within `features/landing/components/TrackDetail.tsx` represent the canonical public curriculum tracks.
- **Public Accessibility**: Public marketing content (FAQs, track overviews, legal text) is publicly viewable without student authentication.
- **Crawler Standards Compliance**: Search crawlers and social bot user agents (Googlebot, Bingbot, FacebookExternalHit, Twitterbot, LinkedInBot) support modern HTML5 OpenGraph and JSON-LD standards.
- **No Residual Ambiguities**: All architectural decisions (canonical domain, OpenGraph strategy, schema types, crawl directives, and validation tools) were fully resolved during the user alignment interview. Zero `[NEEDS CLARIFICATION]` markers exist.
