# Contract: OpenGraph & Social Preview Metadata

**Consumers**: Facebook Scraper, Twitterbot, LinkedInBot, Discord, Viber, Slack  
**Generators**: Next.js App Router metadata API (`features/seo/utils/metadataBuilders.ts`) and dynamic `ImageResponse` (`app/opengraph-image.tsx`)  
**Static Fallback**: `public/images/og-image.png` (1200x630 PNG)  

---

## 1. Dynamic OpenGraph Image (`GET /opengraph-image`)

### Endpoint Specifications
- **URL**: `https://highschool-tutor.sgws.tech/opengraph-image`
- **Dimensions**: `1200 x 630` px
- **Aspect Ratio**: `1.91:1`
- **Format**: `image/png`
- **Cache-Control**: `public, max-age=86400, stale-while-revalidate=604800`

### Visual Composition Contract
```
+-------------------------------------------------------------------------+
| [Logo: HighSchool Tutor]                      [Badge: DepEd MATATAG]   |
|                                               [Badge: DO 015 s. 2026]  |
|                                                                         |
|  HIGHSCHOOL TUTOR                                                       |
|  DepEd K-12 AI Learning Platform                                        |
|                                                                         |
|  Master Junior & Senior High School subjects with 130+ DepEd-aligned    |
|  modules, 24 quizzes per lesson, and real-time Socratic AI hints.       |
|                                                                         |
|  [Pill: Grades 7-12]  [Pill: 130+ Subjects]  [Pill: Multi-Dialect AI]   |
|                                                                         |
|  highschool-tutor.sgws.tech                                             |
+-------------------------------------------------------------------------+
```

### Static Asset Fallback
- File path: `public/images/og-image.png`
- Dimensions: 1200x630 PNG
- Serves as the immutable fallback if edge `ImageResponse` times out.

---

## 2. Meta Tags Specification by Route

### 2.1 Root Landing Page (`/`)

```html
<!-- Canonical & Alternate -->
<link rel="canonical" href="https://highschool-tutor.sgws.tech" />

<!-- OpenGraph (Facebook, LinkedIn, Discord) -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="HighSchool Tutor" />
<meta property="og:locale" content="en_PH" />
<meta property="og:url" content="https://highschool-tutor.sgws.tech" />
<meta property="og:title" content="HighSchool Tutor - DepEd K-12 AI Learning Platform" />
<meta property="og:description" content="Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring." />
<meta property="og:image" content="https://highschool-tutor.sgws.tech/opengraph-image" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="HighSchool Tutor DepEd K-12 AI Learning Platform" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="HighSchool Tutor - DepEd K-12 AI Learning Platform" />
<meta name="twitter:description" content="Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring." />
<meta name="twitter:image" content="https://highschool-tutor.sgws.tech/opengraph-image" />
<meta name="twitter:image:alt" content="HighSchool Tutor DepEd K-12 AI Learning Platform" />
```

---

### 2.2 Academic Track Detail (`/tracks/[id]`, e.g., `stem-strand`)

```html
<!-- Canonical & Alternate -->
<link rel="canonical" href="https://highschool-tutor.sgws.tech/tracks/stem-strand" />

<!-- OpenGraph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="HighSchool Tutor" />
<meta property="og:locale" content="en_PH" />
<meta property="og:url" content="https://highschool-tutor.sgws.tech/tracks/stem-strand" />
<meta property="og:title" content="STEM Strand (Grades 11-12) • HighSchool Tutor" />
<meta property="og:description" content="Prepares Senior High School students for college science, engineering, and mathematics programs with rigorous modules in Pre-Calculus, Basic Calculus, General Biology, General Chemistry, and General Physics." />
<meta property="og:image" content="https://highschool-tutor.sgws.tech/opengraph-image" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="STEM Strand (Grades 11-12) • HighSchool Tutor" />
<meta name="twitter:description" content="Prepares Senior High School students for college science, engineering, and mathematics programs with rigorous modules in Pre-Calculus, Basic Calculus, General Biology, General Chemistry, and General Physics." />
<meta name="twitter:image" content="https://highschool-tutor.sgws.tech/opengraph-image" />
```

---

### 2.3 How It Works Guide (`/how-it-works`)

```html
<!-- Canonical & Alternate -->
<link rel="canonical" href="https://highschool-tutor.sgws.tech/how-it-works" />

<!-- OpenGraph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="HighSchool Tutor" />
<meta property="og:locale" content="en_PH" />
<meta property="og:url" content="https://highschool-tutor.sgws.tech/how-it-works" />
<meta property="og:title" content="How It Works — HighSchool Tutor" />
<meta property="og:description" content="Discover how HighSchool Tutor provides structured DepEd MATATAG modules, practice quizzes, real-time Socratic AI hints, and comprehensive study tools." />
<meta property="og:image" content="https://highschool-tutor.sgws.tech/opengraph-image" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="How It Works — HighSchool Tutor" />
<meta name="twitter:description" content="Discover how HighSchool Tutor provides structured DepEd MATATAG modules, practice quizzes, real-time Socratic AI hints, and comprehensive study tools." />
<meta name="twitter:image" content="https://highschool-tutor.sgws.tech/opengraph-image" />
```

---

## 3. Query Parameter Stripping & Canonical Rule

Whenever a user shares or accesses a URL containing query parameters:
- `https://highschool-tutor.sgws.tech/?ref=SGWS-100`
- `https://highschool-tutor.sgws.tech/tracks/stem-strand?utm_source=fb&utm_medium=cpc`

The HTML output must strictly normalize:
- `<link rel="canonical" href="https://highschool-tutor.sgws.tech" />`
- `<meta property="og:url" content="https://highschool-tutor.sgws.tech" />`
- `<link rel="canonical" href="https://highschool-tutor.sgws.tech/tracks/stem-strand" />`
- `<meta property="og:url" content="https://highschool-tutor.sgws.tech/tracks/stem-strand" />`

---

## 4. Verification & Audit Acceptance Criteria

1. Automated inspection via `.agents/skills/seo/scripts/social_meta.py` reports 100% complete tags across all public routes.
2. Requesting `GET /opengraph-image` returns HTTP 200, Content-Type `image/png`, with exact dimensions 1200x630.
3. Static fallback image `public/images/og-image.png` exists and is a readable PNG with dimensions 1200x630.
