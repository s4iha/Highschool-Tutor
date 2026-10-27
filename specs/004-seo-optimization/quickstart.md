# Quickstart: SEO Optimization & Structured Data Verification

**Feature Branch**: `004-seo-optimization`  
**Feature Spec**: [`spec.md`](./spec.md)  
**Implementation Plan**: [`plan.md`](./plan.md)  
**Date**: 2026-10-27  

---

## Overview

This guide provides end-to-end instructions for running, testing, and validating the Technical SEO, Schema.org JSON-LD structured data, dynamic XML sitemap, and social graph preview implementations for HighSchool Tutor.

---

## 1. Prerequisites & Environment Setup

Verify that local dependencies are installed and test environment variables:

```bash
# Check Node.js and dependencies
node -v   # v20+
pnpm -v   # or npm

# Ensure canonical site URL is set (optional, defaults to https://highschool-tutor.sgws.tech)
# In .env or shell:
# NEXT_PUBLIC_SITE_URL=https://highschool-tutor.sgws.tech
```

---

## 2. Running Local Development Server

Start the Next.js development server:

```bash
npm run dev
# Server ready on http://localhost:3000
```

---

## 3. Verifying Crawler Directives (`/robots.txt`)

### 3.1 HTTP Inspection
Request the dynamic `robots.txt` file:

```bash
curl -i http://localhost:3000/robots.txt
```

### Expected Output Assertions:
1. HTTP status code is `200 OK`.
2. Content-Type is `text/plain; charset=utf-8`.
3. Allowed rules include `/`, `/tracks`, `/tracks/*`, `/how-it-works`, `/privacy`, `/terms`.
4. Disallowed rules include `/dashboard/`, `/admin/`, `/curriculum/`, `/api/`.
5. Sitemap reference points to `https://highschool-tutor.sgws.tech/sitemap.xml`.

---

## 4. Verifying Dynamic XML Sitemap (`/sitemap.xml`)

### 4.1 HTTP Inspection
Request the dynamic sitemap:

```bash
curl -s http://localhost:3000/sitemap.xml
```

### Expected Output Assertions:
1. Valid XML starting with `<?xml version="1.0" encoding="UTF-8"?>`.
2. Total `<url>` count equals exactly 12:
   - 5 static pages (`/`, `/tracks`, `/how-it-works`, `/privacy`, `/terms`)
   - 7 dynamic tracks from `TRACKS_DATA` (`junior-high-core`, `stem-strand`, `abm-strand`, `humss-strand`, `shs-core`, `gas-strand`, `tvl-track`).
3. Correct priorities (`1.0` for home, `0.9` for tracks, `0.8` for tracks and how-it-works, `0.5` for legal).
4. Zero private routes (`/dashboard`, `/admin`, `/curriculum`, `/api`).

---

## 5. Verifying Social Previews & Dynamic OpenGraph Card

### 5.1 OpenGraph Image Endpoint Inspection
Fetch the dynamic image endpoint:

```bash
curl -i http://localhost:3000/opengraph-image
```

### Expected Output Assertions:
1. HTTP status is `200 OK`.
2. Content-Type is `image/png`.
3. In a web browser, navigating to `http://localhost:3000/opengraph-image` displays the 1200x630 branded graphic with DepEd MATATAG badges, platform logo, and typography.

### 5.2 Static Fallback Image Check
Verify the fallback asset exists on disk:

```bash
# Check file existence in public/images/
ls -lh public/images/og-image.png
```

---

## 6. Verifying Schema.org JSON-LD Structured Data

Inspect the initial server-rendered HTML for `<script type="application/ld+json">` tags across public pages:

### 6.1 Root Page (`/`)
```bash
curl -s http://localhost:3000/ | grep -A 25 'application/ld+json'
```
*Verify presence of `@type: "EducationalOrganization"` and `@type: "WebSite"` with `potentialAction: "SearchAction"`.*

### 6.2 How It Works (`/how-it-works`)
```bash
curl -s http://localhost:3000/how-it-works | grep -A 35 'application/ld+json'
```
*Verify presence of `@type: "FAQPage"` containing 6 structured questions and answers.*

### 6.3 Academic Track Detail (`/tracks/stem-strand`)
```bash
curl -s http://localhost:3000/tracks/stem-strand | grep -A 30 'application/ld+json'
```
*Verify presence of `@type: "Course"` and `@type: "BreadcrumbList"`.*

---

## 7. Running Automated SEO Diagnostic Tooling

Execute the bundled Python diagnostic scripts in `.agents/skills/seo/scripts/`:

```bash
# 1. Validate Schema.org JSON-LD syntax and required properties
python .agents/skills/seo/scripts/validate_schema.py http://localhost:3000/
python .agents/skills/seo/scripts/validate_schema.py http://localhost:3000/how-it-works
python .agents/skills/seo/scripts/validate_schema.py http://localhost:3000/tracks/stem-strand

# 2. Check robots.txt directives and security boundaries
python .agents/skills/seo/scripts/robots_checker.py http://localhost:3000/

# 3. Check XML sitemap formatting and URL availability
python .agents/skills/seo/scripts/sitemap_checker.py http://localhost:3000/sitemap.xml

# 4. Check OpenGraph and Twitter social metadata completeness
python .agents/skills/seo/scripts/social_meta.py http://localhost:3000/
python .agents/skills/seo/scripts/social_meta.py http://localhost:3000/tracks/stem-strand
```

---

## 8. Running Automated Unit & Contract Tests

Run Jest unit test suites covering SEO metadata, schema builders, and routes:

```bash
# Run SEO test suites
npm test -- tests/unit/seo-metadata.test.ts tests/unit/seo-schemas.test.ts tests/unit/seo-robots-sitemap.test.ts
```

---

## 9. Full Production Build Verification

Execute strict TypeScript compilation, linting, and Next.js production build:

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

Expected result: Zero TypeScript errors, zero lint warnings, and clean generation of `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` routes.
