# Implementation Plan: Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization

**Branch**: `004-seo-optimization` | **Date**: 2026-10-27 | **Spec**: [`spec.md`](./spec.md)

**Input**: Feature specification from [`spec.md`](./spec.md), confirmed user alignment decisions, and constitution rules.

---

## Summary

This plan specifies the technical architecture and implementation strategy for establishing an enterprise-grade Technical SEO, Schema.org Structured Data (JSON-LD), XML Sitemap, and Dynamic Social Sharing foundation for the HighSchool Tutor platform.

The implementation ensures 100% crawl discoverability and search visibility across all public informational pages (`/`, `/how-it-works`, `/privacy`, `/terms`) and curriculum tracks (`/tracks`, `/tracks/*`), while strictly enforcing crawler quarantine boundaries around protected student learning zones (`/dashboard/*`), school administration portals (`/admin/*`), quiz runner sessions (`/curriculum/*`), and API routes (`/api/*`). 

All metadata and structured data are server-rendered via Next.js 16 Server Components to guarantee zero-JavaScript crawler compatibility. OpenGraph preview cards are generated dynamically at 1200x630 via Next.js `ImageResponse` with a guaranteed static PNG fallback (`public/images/og-image.png`). The architecture adheres strictly to Feature-Driven Architecture (FDA) under `features/seo/`.

---

## Technical Context

- **Language/Version**: TypeScript 5.x (Strict mode), Node.js 20+ runtime
- **Primary Dependencies**: 
  - Next.js 16.3.3 (App Router, `MetadataRoute`, `ImageResponse`)
  - React 19.2.8 (Server Components)
  - Lucide React (visual icons)
  - Tailwind CSS v4 (styling tokens)
  - Python 3.x (execution of diagnostic scripts in `.agents/skills/seo/scripts/`)
- **Storage**: In-memory static constants and curriculum data records from `TRACKS_DATA` in `features/landing/components/TrackDetail.tsx`. No database persistence required.
- **Testing**: 
  - Jest 30.5.0 + `ts-jest` for unit and contract tests in `tests/unit/`.
  - SEO validation scripts in `.agents/skills/seo/scripts/` (`validate_schema.py`, `robots_checker.py`, `sitemap_checker.py`, `social_meta.py`).
- **Target Platform**: Desktop and Mobile responsive web browsers, search engine crawlers (Googlebot, Bingbot), AI search agents (GPTBot, ClaudeBot, PerplexityBot), and social scrapers (FacebookExternalHit, Twitterbot, LinkedInBot).
- **Project Type**: Full-Stack Web Application (Feature-Driven Architecture modular structure).
- **Performance Goals**: 
  - `/robots.txt` response time: < 50ms
  - `/sitemap.xml` generation time: < 100ms
  - `/opengraph-image` dynamic rendering & edge cache: < 300ms initial, < 50ms cached
  - JSON-LD HTML payload size: < 5KB per route
- **Constraints**: 
  - Zero relative URL leaks in metadata tags (`metadataBase` strictly defined).
  - 100% Server Component rendering for all metadata and JSON-LD (zero client hydration dependency).
  - Absolute crawl quarantine of private student/admin paths (`/dashboard/*`, `/admin/*`, `/curriculum/*`, `/api/*`).
  - Schema.org required properties 100% compliant with Google Search Central guidelines.
  - Safe serialization of JSON-LD scripts escaping `<` to `\u003c` and `>` to `\u003e` to prevent XSS.
- **Scale/Scope**: 12 discoverable canonical URLs (5 static + 7 academic tracks), architected to automatically scale with future curriculum additions.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle / Gate | Assessment | Status |
|:---|:---|:---|
| **I. Feature-Driven Architecture (FDA) Modularity** | All SEO domain logic, schemas, builders, and types are organized within `features/seo/` (`components/`, `types/`, `utils/`). The `app/` directory handles routing exclusively (`app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `app/layout.tsx`), delegating all logic to `features/seo/`. No business logic resides directly in App Router endpoints. | **PASS** |
| **II. Strict State Management & Unidirectional Flow** | Metadata and JSON-LD structured data are pure server-rendered entities. No TanStack Query state is synced into Zustand stores, and no raw client fetch calls exist. | **PASS** |
| **III. DepEd MATATAG Curriculum Compliance (DepEd DO 015, s. 2026)** | All Course schemas, EducationalCredential descriptors, and FAQPage schemas cite DepEd Order No. 015, s. 2026 and MATATAG competencies. Legacy DepEd Order No. 8, s. 2015 is not referenced. | **PASS** |
| **IV. Socratic AI Tutoring Integrity & Multi-Dialect Accessibility** | Schema.org FAQPage structured data details the Socratic AI tutoring engine ('Bakit Mali Ito?' hints) and multi-dialect support (English, Filipino, Taglish, Cebuano, Ilocano) without exposing sensitive prompts. | **PASS** |
| **V. Zero-Mock Quality Assurance & Production Verification** | Schemas are built from canonical data (`TRACKS_DATA`). Verified using `.agents/skills/seo/scripts/`, automated Jest tests, strict TypeScript checks (`tsc --noEmit`), and production build verification (`npm run build`). No dummy fallbacks or swallowed exceptions. | **PASS** |

*All architectural gates passed cleanly.*

---

## Project Structure

### Documentation (this feature)

```text
specs/004-seo-optimization/
├── spec.md              # Feature specification & requirements
├── plan.md              # This implementation plan
├── research.md          # Phase 0 technical research & design decisions
├── data-model.md        # Phase 1 data entities & TypeScript models
├── quickstart.md        # Phase 1 verification & execution walkthrough
├── contracts/           # Phase 1 specification contracts
│   ├── robots-contract.md
│   ├── sitemap-contract.md
│   ├── jsonld-schemas-contract.md
│   └── opengraph-metadata-contract.md
└── checklists/          # Verification checklists
```

### Source Code Organization (FDA Pattern)

```text
features/seo/
├── components/
│   ├── index.ts                                      # Component exports
│   └── JsonLd.tsx                                    # Pure Server Component for safe JSON-LD embedding
├── types/
│   └── index.ts                                      # TypeScript interfaces (SiteConfig, Robots, Sitemap, Schema.org)
└── utils/
    ├── index.ts                                      # Utility exports
    ├── constants.ts                                  # Canonical domain, brand defaults, route priorities
    ├── schemaBuilders.ts                             # Pure Schema.org builders (Org, WebSite, FAQ, Course, Breadcrumbs)
    └── metadataBuilders.ts                           # MetadataBase, canonical URL builders, OpenGraph/Twitter helpers

app/
├── layout.tsx                                        # Root layout with metadataBase, global OG/Twitter, Org/WebSite JSON-LD
├── robots.ts                                         # App Router route handler delegating to features/seo
├── sitemap.ts                                        # App Router route handler dynamically enumerating TRACKS_DATA
├── opengraph-image.tsx                               # App Router dynamic 1200x630 ImageResponse generator
├── how-it-works/
│   └── page.tsx                                      # Injects FAQPage JSON-LD schema
└── tracks/
    ├── page.tsx                                      # Injects BreadcrumbList JSON-LD schema
    └── [id]/
        └── page.tsx                                  # Injects Course & BreadcrumbList JSON-LD schemas + dynamic metadata

public/
└── images/
    └── og-image.png                                  # Static 1200x630 fallback social preview image

tests/unit/
├── seo-metadata.test.ts                              # Canonical URL resolution, parameter stripping, metadata builders
├── seo-schemas.test.ts                               # Schema.org builders output validation
└── seo-robots-sitemap.test.ts                        # Route configuration assertions & private path protection
```

**Structure Decision**: 
The implementation strictly adopts **Feature-Driven Architecture (FDA)**. All domain types, pure schema generator functions, metadata helpers, and the `<JsonLd>` Server Component are localized within `features/seo/`. Next.js App Router files (`app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`) act as lightweight routing adapters that import and invoke pure functions from `features/seo/utils/`. This decouples domain business logic from the Next.js runtime, enables high-speed unit testing via Jest without mocking HTTP requests, and ensures zero circular dependencies.

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. All architectural patterns conform directly to the HighSchool Tutor Constitution and FDA guidelines.*
