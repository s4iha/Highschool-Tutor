# Research: Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization

**Feature Branch**: `004-seo-optimization`  
**Feature Spec**: [`spec.md`](./spec.md)  
**Date**: 2026-10-27  
**Status**: Completed  

---

## Executive Summary

This research document analyzes the technical requirements, architectural patterns, and engineering choices for implementing a comprehensive, production-grade Technical SEO and Social Sharing foundation for HighSchool Tutor. 

The research addresses the challenges of Next.js 16 App Router metadata resolution, crawler indexation security boundaries, dynamic sitemap generation from curriculum sources of truth, server-rendered Schema.org JSON-LD graph generation, dynamic OpenGraph card generation via `ImageResponse`, and automated verification tooling.

---

## 1. Canonical Domain & `metadataBase` Resolution

### Context & Problem
In Next.js 16 App Router, metadata properties that expect URLs (such as `openGraph.images`, `twitter.images`, `alternates.canonical`, and sitemaps) require absolute URLs. When relative paths are provided without a defined `metadataBase`, Next.js issues build-time warnings and falls back to `localhost:3000`, causing social scrapers (Facebook, X, LinkedIn) and search engine crawlers (Google, Bing) to fail asset resolution on staging, preview, and production environments.

Furthermore, duplicate indexation across staging URLs (`*.vercel.app`) and the primary production domain dilutes domain ranking authority.

### Technical Decision
1. **Root `metadataBase`**: Define `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://highschool-tutor.sgws.tech')` in `app/layout.tsx`.
2. **Canonical URL Builder**: Create a centralized utility `buildCanonicalUrl(pathname: string)` in `features/seo/utils/metadataBuilders.ts` that:
   - Strips query parameters (e.g., `?ref=...`, `?utm_source=...`, tracking hashes).
   - Normalizes trailing slashes (enforcing standard non-trailing slash URLs: `/tracks`, not `/tracks/`).
   - Prepends the canonical site URL base.
3. **Alternates Definition**: Configure `alternates: { canonical: buildCanonicalUrl(path) }` across root and sub-pages.
4. **Environment Fallback Guard**: If `process.env.NEXT_PUBLIC_SITE_URL` is undefined or contains whitespace, fall back strictly to `https://highschool-tutor.sgws.tech`.

### Alternatives Considered
- **Relative URLs without `metadataBase`**: Rejected. Violates OpenGraph specification (RFC 5874 / OpenGraph protocol requires absolute URIs for `og:image` and `og:url`) and triggers Next.js build warnings.
- **Middleware-based Canonical Header (`Link: <...>; rel="canonical"`)**: Considered as an addition, but HTML `<link rel="canonical">` rendered directly by Next.js Server Components is universally supported across all major crawlers (Googlebot, Bingbot, Baiduspider) and eliminates edge middleware execution overhead.

---

## 2. Crawl Directives & Security Policy (`app/robots.ts`)

### Context & Problem
HighSchool Tutor contains public marketing and curriculum index pages (`/`, `/tracks`, `/tracks/*`, `/how-it-works`, `/privacy`, `/terms`) alongside authenticated student learning zones (`/dashboard/*`), school administration portals (`/admin/*`), curriculum quiz runners (`/curriculum/*`), and API routes (`/api/*`).

Search crawlers must be given clear, strict boundaries:
- Public educational and marketing routes must be explicitly allowed for indexation.
- Private student data, quiz answer APIs, and admin consoles must be strictly disallowed to prevent data leakage and indexation of thin or private content.
- AI search crawlers (e.g., GPTBot, ClaudeBot, PerplexityBot) should be allowed to index public educational curriculum content to enhance citations in AI answer engines while being barred from internal endpoints.

### Technical Decision
Implement `app/robots.ts` using Next.js 16 `MetadataRoute.Robots`:
```typescript
import { MetadataRoute } from "next";
import { getRobotsConfig } from "@/features/seo/utils/metadataBuilders";

export default function robots(): MetadataRoute.Robots {
  return getRobotsConfig();
}
```
Directives:
- **User-Agent `*`**:
  - `Allow`: `['/', '/tracks', '/tracks/', '/how-it-works', '/privacy', '/terms']`
  - `Disallow`: `['/dashboard/', '/admin/', '/curriculum/', '/api/']`
- **User-Agent `GPTBot`, `ClaudeBot`, `PerplexityBot`**:
  - `Allow`: `['/', '/tracks', '/tracks/', '/how-it-works']`
  - `Disallow`: `['/dashboard/', '/admin/', '/curriculum/', '/api/', '/privacy', '/terms']`
- **Sitemap**: `https://highschool-tutor.sgws.tech/sitemap.xml`
- **Host**: `https://highschool-tutor.sgws.tech`

### Security Boundary Verification
The disallow directives ensure search engines will not crawl or cache student quiz session tokens, personal student scores, or admin user management panels. The robots configuration will be validated using `.agents/skills/seo/scripts/robots_checker.py`.

---

## 3. Dynamic XML Sitemap Generation (`app/sitemap.ts`)

### Context & Problem
Static sitemaps require manual updates whenever curriculum offerings change. HighSchool Tutor has 7 primary academic tracks defined in `TRACKS_DATA` within `features/landing/components/TrackDetail.tsx`:
- `junior-high-core` (Junior High School Core, Grades 7–10)
- `stem-strand` (STEM Strand, Grades 11–12)
- `abm-strand` (ABM Strand, Grades 11–12)
- `humss-strand` (HUMSS Strand, Grades 11–12)
- `shs-core` (Senior High School Core, Grades 11–12)
- `gas-strand` (General Academic Strand, Grades 11–12)
- `tvl-track` (Technical-Vocational-Livelihood Track, Grades 11–12)

If new tracks or subjects are added to `TRACKS_DATA`, the sitemap must automatically enumerate them without manual XML maintenance.

### Technical Decision
Implement `app/sitemap.ts` using Next.js 16 `MetadataRoute.Sitemap`:
- **Static Routes**:
  - `/` (Home): `priority: 1.0`, `changeFrequency: "daily"`
  - `/tracks` (Tracks Directory): `priority: 0.9`, `changeFrequency: "daily"`
  - `/how-it-works` (Product & DepEd Guide): `priority: 0.8`, `changeFrequency: "weekly"`
  - `/privacy` (Privacy Policy): `priority: 0.5`, `changeFrequency: "monthly"`
  - `/terms` (Terms of Service): `priority: 0.5`, `changeFrequency: "monthly"`
- **Dynamic Curriculum Track Routes**:
  - Query keys from `TRACKS_DATA` dynamically.
  - Map each `id` to `/tracks/${id}`: `priority: 0.8`, `changeFrequency: "weekly"`, `lastModified: new Date()`.
- Total initial URLs: 5 static + 7 dynamic tracks = 12 verified entries.

### Scalability Considerations
The Sitemap 0.9 protocol supports up to 50,000 URLs or 50MB per sitemap file. With 12 routes initially, the generated XML is lightweight (<5KB), ensuring instantaneous generation and negligible server CPU load.

---

## 4. Rich Structured Data (JSON-LD) Architecture

### Context & Problem
Search engines (Google Search Central) and AI discovery engines (Gemini, Perplexity, SGE) leverage Schema.org microdata to construct rich search results:
- **Knowledge Panels & Brand Recognition**: Requires `EducationalOrganization` and `WebSite` with `potentialAction: SearchAction`.
- **Search Accordion Snippets**: Requires `FAQPage` containing `Question` and `Answer` pairs.
- **Curriculum & Educational Course Rich Cards**: Requires `Course` and `EducationalOccupationalCredential` detailing grade level, competencies, and provider.
- **Search Navigation Paths**: Requires `BreadcrumbList` establishing page hierarchy (`Home > Academic Tracks > [Track Name]`).

All JSON-LD must be rendered into initial HTML on the server. If injected via client-side `useEffect`, crawlers with limited JavaScript execution budgets (or zero-JS crawlers) will miss the structured data entirely.

### Technical Decision
1. **Component**: Create `features/seo/components/JsonLd.tsx`:
   - Pure Server Component rendering `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />`.
   - `safeJsonLd()` helper prevents XSS by replacing `<` with `\u003c` and `>` with `\u003e`.
2. **Schema Builders**: Implement pure builder functions in `features/seo/utils/schemaBuilders.ts`:
   - `buildOrganizationSchema()`: `@type: "EducationalOrganization"`, name, URL, logo, description, social profiles.
   - `buildWebSiteSchema()`: `@type: "WebSite"`, name, URL, `SearchAction` with target URL template.
   - `buildFaqPageSchema(faqs)`: `@type: "FAQPage"`, array of `Question` and `acceptedAnswer.text`.
   - `buildCourseSchema(track)`: `@type: "Course"`, name, description, provider (`HighSchool Tutor`), educationalCredentialAwarded, educationalLevel (`Grades 7–10` or `Grades 11–12`).
   - `buildBreadcrumbSchema(items)`: `@type: "BreadcrumbList"`, ordered `itemListElement` array with position, name, item URL.
3. **Route Integration**:
   - `app/layout.tsx`: Root `EducationalOrganization` + `WebSite` JSON-LD (universal brand identity).
   - `app/how-it-works/page.tsx`: `FAQPage` JSON-LD from official platform FAQs.
   - `app/tracks/page.tsx`: `BreadcrumbList` JSON-LD (`Home > Academic Tracks`).
   - `app/tracks/[id]/page.tsx`: `Course` + `BreadcrumbList` JSON-LD.

### Validation & Standards Compliance
All schemas will be validated using `.agents/skills/seo/scripts/validate_schema.py` and Google Rich Results testing parameters, ensuring zero missing required fields (`name`, `provider`, `questionName`, `acceptedAnswer`).

---

## 5. Dynamic OpenGraph Image Generation & Social Preview Resilience

### Context & Problem
When students, parents, or teachers share HighSchool Tutor links across social messaging platforms (Facebook, Messenger, Viber, WhatsApp, X/Twitter, LinkedIn, Discord), preview scrapers request `og:image`.
A generic fallback image fails to convey the dynamic context of specific tracks (e.g., STEM vs. ABM vs. Junior High). However, relying *only* on dynamic generation introduces risks: if the edge image generation runtime encounters memory limits or times out, the social scraper displays an empty or broken card.

### Technical Decision
1. **Next.js Dynamic `ImageResponse` (`app/opengraph-image.tsx`)**:
   - Dimensions: 1200 x 630 px, content-type `image/png`.
   - Visual Layout:
     - High-contrast, DepEd-inspired deep navy gradient background (`#0B132B` to `#1C2541`).
     - Golden yellow and emerald accent badges ("DepEd MATATAG Aligned", "DO 015 s. 2026").
     - Crisp platform title ("HighSchool Tutor") and tagline ("K-12 Socratic AI Learning Platform").
     - Subject stats pill ("130+ Subjects • 8 Core Modules • 24 Quizzes per Lesson").
   - Edge cache duration: Static generation at build time or ISR cache with `revalidate = 86400` (24 hours).
2. **Static Fallback Image (`public/images/og-image.png`)**:
   - Provide a guaranteed static 1200x630 PNG in `public/images/og-image.png`.
   - In `features/seo/utils/metadataBuilders.ts`, configure OpenGraph images to specify the dynamic endpoint as primary with the static PNG as secondary fallback.
3. **OpenGraph & Twitter Card Metadata**:
   - Standardize `og:type: "website"`, `og:locale: "en_PH"`, `og:site_name: "HighSchool Tutor"`.
   - Standardize `twitter:card: "summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`.

---

## 6. Zero-JavaScript Crawler Compatibility

### Context & Problem
Modern search engines like Googlebot execute JavaScript, but they allocate a strict render queue and execution budget. Secondary search engines (Bingbot, DuckDuckGo, Baiduspider) and social scrapers (FacebookExternalHit, Twitterbot, LinkedInBot) execute minimal or zero client JavaScript. If meta tags or JSON-LD depend on React client hydration (`useEffect`), crawlers parse empty tags.

### Technical Decision
- All metadata is generated via Next.js 16 static `metadata` export or dynamic `generateMetadata()` Server Component functions.
- All JSON-LD `<script>` tags are embedded directly in Server Component JSX (`app/layout.tsx`, `app/how-it-works/page.tsx`, `app/tracks/[id]/page.tsx`).
- Zero client-side JavaScript execution is required to inspect full metadata and structured data.

---

## 7. Automated Verification Tooling Strategy

### Audit Scripts (`.agents/skills/seo/scripts/`)
The project contains pre-installed Python SEO diagnostic tools in `.agents/skills/seo/scripts/`:
- `validate_schema.py`: Validates JSON-LD schema syntax, Schema.org type compliance, and required properties.
- `robots_checker.py`: Verifies `robots.txt` syntax, crawl directives, allowed/disallowed routes, and sitemap reference.
- `sitemap_checker.py`: Validates `sitemap.xml` XML formatting, URL accessibility, status codes, and priority distributions.
- `social_meta.py`: Inspects OpenGraph and Twitter card completeness and preview image availability.

### Automated Jest Test Suites (`tests/unit/`)
Unit tests will be implemented to run in CI/CD without requiring external network access:
- `tests/unit/seo-metadata.test.ts`: Verifies canonical URL generation, query parameter stripping, fallback domain resolution, and metadata builder integrity.
- `tests/unit/seo-schemas.test.ts`: Verifies Schema.org builder output structures for `EducationalOrganization`, `WebSite`, `FAQPage`, `Course`, and `BreadcrumbList`.
- `tests/unit/seo-robots-sitemap.test.ts`: Asserts that `app/robots.ts` and `app/sitemap.ts` export correct configuration objects with zero forbidden path leaks.

---

## Research Conclusion

All research questions and architectural decisions are conclusively resolved. The implementation adheres strictly to Feature-Driven Architecture (FDA), Next.js 16 App Router best practices, and the HighSchool Tutor Constitution. No residual ambiguities remain. Phase 1 design artifacts (`data-model.md`, `contracts/`, `quickstart.md`, and updated `plan.md`) may proceed immediately.
