# Contract: Public Subjects Catalog Deduplication (108 Subjects)

**Contract ID**: `CTR-002-PUBLIC-CATALOG-DEDUP`  
**Feature**: `007-scope-dedup-landing-fixes`  
**Target Module**: `features/curriculum/utils/subject-scope-data.ts` & `features/curriculum/components/PublicSubjectCatalog.tsx`  
**Consumers**: `/subjects` Catalog Page (`app/subjects/page.tsx`), Sitemap Builder (`features/seo/utils/sitemapBuilder.ts`), Static Params (`app/subjects/[slug]/page.tsx`)  

---

## 1. Functional Scope & Objectives

This contract establishes the deduplication of the public DepEd MATATAG curriculum catalog from 324 redundant items down to **108 distinct subjects**, removing redundant grade/quarter duplicates and legacy trimester (`g*-t*-*`) slugs while maintaining seamless static site generation and backwards-compatible routing.

---

## 2. API & Resolver Contracts

### 2.1 `getAllSubjectScopeDefinitions()`

```typescript
export function getAllSubjectScopeDefinitions(): SubjectScopeDefinition[];
```

#### Invariants:
- Returns an array of exactly **108 distinct subjects**:
  - **8 JHS Core subjects**:
    - `ENG` (English): `slug: "g7-q1-eng"`, `code: "JHS-ENG"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `FIL` (Filipino): `slug: "g7-q1-fil"`, `code: "JHS-FIL"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `MATH` (Mathematics): `slug: "g7-q1-math"`, `code: "JHS-MATH"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `SCI` (Science): `slug: "g7-q1-sci"`, `code: "JHS-SCI"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `AP` (Araling Panlipunan): `slug: "g7-q1-ap"`, `code: "JHS-AP"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `ESP` (Edukasyon sa Pagpapakatao): `slug: "g7-q1-esp"`, `code: "JHS-ESP"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `MAPEH` (Music, Arts, PE, and Health): `slug: "g7-q1-mapeh"`, `code: "JHS-MAPEH"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
    - `TLE` (Technology & Livelihood Education): `slug: "g7-q1-tle"`, `code: "JHS-TLE"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `isJhsCore: true`
  - **100 Senior High School subjects**:
    - Sourced from `SHS_SUBJECT_CATALOG` / `getDistinctShsSubjects()` across Core, Applied, STEM, ABM, HUMSS, GAS, Arts & Design, Sports, and TVL.
- Zero duplicate card titles. Zero legacy trimester (`g*-t*-*`) entries.

---

### 2.2 `getAllSubjectScopeSlugs()`

```typescript
export function getAllSubjectScopeSlugs(): string[];
```

#### Invariants:
- Returns an array of **228 canonical slugs** used for static route generation (`generateStaticParams` in `app/subjects/[slug]/page.tsx`):
  - 128 canonical JHS quarter slugs: `g{7..10}-q{1..4}-{abbr}` (4 grades × 4 quarters × 8 subjects)
  - 100 canonical SHS semester slugs: `g{11..12}-s{1..2}-{abbr}`
- Legacy trimester slugs (`g*-t*-*`) are **excluded** (0 legacy slugs returned).

---

## 3. UI Component Contract: `PublicSubjectCatalog.tsx`

### 3.1 Initial Rendering & Filters

- Counter display: `"Showing 108 DepEd MATATAG curriculum subjects"`.
- When filtering by `"Junior High (7–10)"`:
  - Exactly **8** distinct cards are rendered.
  - Each JHS card displays badge `Grades 7–10 • Quarters 1–4` and code `JHS-${ABBR}`.
  - Clicking the card links to `/subjects/${subject.slug}` (defaulting to Grade 7 Quarter 1 canonical slug, where the user can switch grades/quarters).
- When filtering by `"Senior High (11–12)"`:
  - Exactly **100** distinct cards are rendered across all strands.
- Keyword search: Filters accurately across `name`, `code`, `description`, `competencies`, and lesson titles.

---

## 4. Test Invariant & Verification Contract

- `tests/unit/curriculum-dedup.test.ts`:
  - `getDistinctJhsSubjects()` length = 8.
  - `getDistinctShsSubjects()` length = 100.
  - Total catalog card volume (`jhsCount + shsCount`) = **108**.
- `tests/unit/subject-scope.test.ts`:
  - All 108 definitions resolve with `lessons.length === 8`.
