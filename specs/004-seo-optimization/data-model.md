# Data Model: Technical SEO, Rich Structured Data (JSON-LD), and Social Preview Optimization

**Feature Branch**: `004-seo-optimization`  
**Feature Spec**: [`spec.md`](./spec.md)  
**Date**: 2026-10-27  
**Status**: Completed  

---

## Overview

This document specifies the TypeScript interfaces, data models, schema structures, and entity relationships governing the SEO and Social Sharing domain within HighSchool Tutor. 

All interfaces reside in the domain module under `features/seo/types/index.ts` conforming strictly to Feature-Driven Architecture (FDA).

---

## 1. Domain Entities & Interfaces

### 1.1 Canonical Site Configuration (`SiteConfig`)

The core authority model defining canonical domain resolution, default metadata fallbacks, and brand constants.

```typescript
export interface SiteConfig {
  /** Canonical production domain URL (e.g., "https://highschool-tutor.sgws.tech") */
  siteUrl: string;
  /** Full platform brand name */
  siteName: string;
  /** Primary platform headline description */
  defaultDescription: string;
  /** Default BCP-47 / OpenGraph locale */
  defaultLocale: "en_PH" | "fil_PH";
  /** Fallback OpenGraph social card image URL (relative or absolute) */
  defaultOgImage: string;
  /** Fallback image dimensions */
  ogImageDimensions: {
    width: number;
    height: number;
  };
  /** Official brand social profiles (for Schema.org sameAs) */
  socialLinks: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
  };
}
```

---

### 1.2 Robots Directives Model (`RobotsConfig`)

Represents the crawler permission policy and sitemap references emitted by `app/robots.ts`.

```typescript
export interface RobotsRule {
  /** User agent pattern (e.g., "*", "Googlebot", "GPTBot") */
  userAgent: string | string[];
  /** Relative path patterns explicitly allowed for crawling */
  allow?: string | string[];
  /** Relative path patterns strictly disallowed from crawling */
  disallow?: string | string[];
  /** Crawl delay in seconds (optional) */
  crawlDelay?: number;
}

export interface RobotsConfig {
  /** Array of user-agent rules */
  rules: RobotsRule[];
  /** Authoritative XML sitemap URL */
  sitemap: string;
  /** Preferred hostname */
  host?: string;
}
```

---

### 1.3 Sitemap Catalog Model (`SitemapEntry`)

Represents individual URL records within `app/sitemap.ts` adhering to the Sitemap 0.9 protocol and Next.js `MetadataRoute.Sitemap`.

```typescript
export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  /** Canonical absolute URL of the page */
  url: string;
  /** ISO 8601 string or Date object representing last modification */
  lastModified?: string | Date;
  /** Estimated frequency of content updates */
  changeFrequency?: ChangeFrequency;
  /** Priority relative to other pages on the site (0.0 to 1.0) */
  priority?: number;
  /** Alternate language URLs (hreflang mapping) */
  alternates?: {
    languages?: Record<string, string>;
  };
}
```

---

### 1.4 Schema.org Structured Data Suite (JSON-LD)

HighSchool Tutor implements strict Schema.org compliant data types formatted for direct consumption by Google Search Central and AI answer engines.

#### 1.4.1 EducationalOrganization Schema

Represents the institution and brand authority.

```typescript
export interface SchemaPostalAddress {
  "@type": "PostalAddress";
  addressCountry: "PH";
  addressRegion?: string;
  addressLocality?: string;
}

export interface SchemaEducationalOrganization {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  "@id": string; // Canonical URL + "#organization"
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  address?: SchemaPostalAddress;
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email: string;
    availableLanguage: string[];
  };
}
```

#### 1.4.2 WebSite Schema with SearchAction

Defines the search-enabled portal entity for Google site search integrations.

```typescript
export interface SchemaSearchAction {
  "@type": "SearchAction";
  target: {
    "@type": "EntryPoint";
    urlTemplate: string; // e.g., "https://highschool-tutor.sgws.tech/tracks?q={search_term_string}"
  };
  "query-input": "required name=search_term_string";
}

export interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string; // Canonical URL + "#website"
  name: string;
  url: string;
  publisher: {
    "@id": string;
  };
  potentialAction?: SchemaSearchAction;
  inLanguage: string[];
}
```

#### 1.4.3 FAQPage Schema

Empowers rich interactive accordion dropdowns on Google Search for `/how-it-works`.

```typescript
export interface SchemaFaqQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface SchemaFAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  "@id": string; // Canonical URL + "#faq"
  mainEntity: SchemaFaqQuestion[];
}
```

#### 1.4.4 Course & EducationalOccupationalCredential Schema

Represents individual academic strands and tracks on `/tracks/[id]` aligned with DepEd DO 015 s. 2026.

```typescript
export interface SchemaCourse {
  "@context": "https://schema.org";
  "@type": "Course";
  "@id": string; // Track URL + "#course"
  name: string;
  description: string;
  provider: {
    "@type": "EducationalOrganization";
    name: string;
    url: string;
  };
  educationalLevel: string; // e.g., "Junior High School (Grades 7-10)" or "Senior High School (Grades 11-12)"
  educationalCredentialAwarded?: string; // e.g., "DepEd MATATAG Junior High School Certificate of Completion"
  hasCourseInstance?: {
    "@type": "CourseInstance";
    courseMode: "online";
    inLanguage: string[];
  };
  about?: string[]; // Core competency tags
}
```

#### 1.4.5 BreadcrumbList Schema

Specifies hierarchical navigation trails for `/tracks` and `/tracks/[id]`.

```typescript
export interface SchemaBreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string; // Canonical URL
}

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: SchemaBreadcrumbItem[];
}
```

---

### 1.5 Social Preview Configuration (`OpenGraphCardConfig` & `TwitterCardConfig`)

Data structures consumed by metadata builders and dynamic `ImageResponse` generators.

```typescript
export interface OpenGraphCardConfig {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale: "en_PH" | "fil_PH";
  type: "website" | "article";
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
    type?: string;
  }>;
}

export interface TwitterCardConfig {
  card: "summary_large_image" | "summary";
  title: string;
  description: string;
  images: string[];
  creator?: string;
  site?: string;
}
```

---

## 2. Entity Relationships & Domain Mapping

```
                                +-------------------+
                                |    SiteConfig     |
                                |  (Base Authority) |
                                +---------+---------+
                                          |
             +----------------------------+----------------------------+
             |                            |                            |
             v                            v                            v
   +-------------------+        +-------------------+        +-------------------+
   |   RobotsConfig    |        |   SitemapEntry    |        |   OpenGraphCard   |
   | (app/robots.ts)   |        | (app/sitemap.ts)  |        | (Meta & Image)    |
   +-------------------+        +---------+---------+        +-------------------+
                                          |
                                          | references
                                          v
                               +---------------------+
                               |     TRACKS_DATA     |
                               | (Curriculum Source) |
                               +----------+----------+
                                          |
                                          | transforms into
                                          v
                           +------------------------------+
                           |     Schema.org JSON-LD       |
                           |  - EducationalOrganization   |
                           |  - WebSite & SearchAction    |
                           |  - FAQPage                   |
                           |  - Course & Credential       |
                           |  - BreadcrumbList            |
                           +------------------------------+
```

---

## 3. Data Flow & Transformation Lifecycle

1. **Resolution Phase**:
   - `SITE_CONFIG` evaluates `process.env.NEXT_PUBLIC_SITE_URL`.
   - If falsy, it defaults to `"https://highschool-tutor.sgws.tech"`.
2. **Metadata Construction**:
   - Routes request metadata from `buildPageMetadata({ title, description, path })`.
   - `buildCanonicalUrl(path)` sanitizes paths by stripping queries, hashes, and double-slashes.
   - Alternates and canonical links are populated.
3. **Crawl Directive Execution**:
   - `app/robots.ts` invokes `getRobotsConfig()`, outputting standard allow/disallow matrices.
4. **Sitemap Enumeration**:
   - `app/sitemap.ts` queries `getSitemapEntries()`, mapping static pages + `Object.keys(TRACKS_DATA)`.
5. **Schema Injection**:
   - Server Components call `buildOrganizationSchema()`, `buildWebSiteSchema()`, `buildFaqPageSchema()`, or `buildCourseSchema()`.
   - Payloads are passed to `<JsonLd schema={...} />` for safe rendering in initial HTML.
6. **OpenGraph Image Rendering**:
   - Social scrapers requesting `/opengraph-image` trigger `app/opengraph-image.tsx`.
   - `ImageResponse` composites JSX elements into a 1200x630 PNG stream cached with HTTP `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
