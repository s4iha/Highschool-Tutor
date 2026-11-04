# Contract: Public DepEd MATATAG Subject Scope Pages

**Feature**: `006-filipino-hero-subscription-scope-catalog`  
**Contract ID**: `CTR-SUBJECT-SCOPE-002`  
**Status**: Approved  
**Consumers**: `app/subjects/page.tsx`, `app/subjects/[slug]/page.tsx`, `features/seo/utils/sitemapBuilder.ts`, `schemaBuilders.ts`

---

## 1. Route Contracts

### 1.1 Public Catalog Route: `/subjects`
- **File**: `app/subjects/page.tsx`
- **Render Mode**: Server Component with client interactive search/filter (`PublicSubjectCatalog.tsx`).
- **Metadata**:
  - Title: *"DepEd MATATAG Curriculum Subject Catalog | HighSchool Tutor"*
  - Description: *"Browse all official Philippine DepEd K-12 MATATAG subjects across Junior and Senior High School. Prescribed hours, prerequisites, and Socratic AI study drills."*
  - Canonical URL: `https://highschooltutor.ph/subjects`
- **Structured Data**:
  - Schema.org `BreadcrumbList` (`Home` > `Subjects`)

### 1.2 Dynamic Subject Scope Route: `/subjects/[slug]`
- **File**: `app/subjects/[slug]/page.tsx`
- **Props**:
  ```typescript
  interface SubjectScopePageProps {
    params: Promise<{
      slug: string;
    }>;
  }
  ```
- **Static Pre-Rendering**:
  - `generateStaticParams()` returns `{ slug: string }[]` for all canonical subjects in `SUBJECTS`.
- **Dynamic Metadata**:
  - `generateMetadata({ params })`:
    - Valid Slug:
      - Title: `"${subject.name} (${subject.grade}) - DepEd MATATAG Curriculum Scope | HighSchool Tutor"`
      - Description: `subject.description.slice(0, 155) + "..."`
      - Canonical URL: `https://highschooltutor.ph/subjects/${slug}`
    - Invalid Slug:
      - Title: `"Subject Not Found | HighSchool Tutor"`
      - `robots: { index: false, follow: false }`
- **404 Handling**:
  - If `slug` does not match any entry in `getSubjectScopeDefinition(slug)`, call Next.js `notFound()`.

---

## 2. Component Layout & Visual Structure

`features/curriculum/components/SubjectScopeView.tsx`:

```
+-----------------------------------------------------------------------------------+
| Breadcrumb: Home > Subjects > [Subject Name]                                      |
|                                                                                   |
| [Grade Level Badge] [Strand/Track Badge] [DepEd DO 015 s. 2026 Badge]             |
| H1: [Official Course Name] ([DepEd Subject Code])                                 |
| Subtitle: Prescribed DepEd MATATAG Curriculum Scope & Competency Guide             |
+-----------------------------------------------------------------------------------+
| 3-Column Info Cards:                                                              |
| [ Time Allotment: 80 Hours ]  [ Prerequisites: None / Pre-Calculus ]  [ 8 Modules]|
+-----------------------------------------------------------------------------------+
| Left Column (Content & Competencies):     | Right Column (Sticky Conversion CTA): |
| - Course Overview & DepEd Description     | - "Practice with Socratic AI Tutor"   |
| - Official Learning Competencies Table    | - 24 Verified Drills Available        |
| - Prerequisite & Corequisite Details      | - Instant Taglish / Multi-dialect     |
| - DepEd Order No. 015, s. 2026 Standards  | - Start 30-Day Free Trial CTA Button  |
+-----------------------------------------------------------------------------------+
```

---

## 3. SEO & Structured Data Contract

### 3.1 Schema.org `Course` JSON-LD
Injected into page `<head>` via `<JsonLd>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://highschooltutor.ph/subjects/g11-s1-genmath#course",
  "name": "General Mathematics",
  "courseCode": "GENMATH",
  "description": "This subject covers functions, business mathematics, and logic...",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "HighSchool Tutor",
    "url": "https://highschooltutor.ph"
  },
  "educationalLevel": "Senior High School (Grade 11)",
  "timeRequired": "PT80H",
  "educationalCredentialAwarded": "DepEd K-12 MATATAG General Mathematics Competency",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "inLanguage": ["en-PH", "fil-PH"]
  }
}
```

### 3.2 Schema.org `BreadcrumbList` JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://highschooltutor.ph"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Subjects",
      "item": "https://highschooltutor.ph/subjects"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "General Mathematics",
      "item": "https://highschooltutor.ph/subjects/g11-s1-genmath"
    }
  ]
}
```

---

## 4. Sitemap Generation Contract

`features/seo/utils/sitemapBuilder.ts`:
- Append `/subjects` with `changeFrequency: "daily"`, `priority: 0.9`.
- Append all canonical `/subjects/[slug]` entries with `changeFrequency: "weekly"`, `priority: 0.8`.
- Ensure all URLs resolve to valid 200 HTTP statuses upon build.
