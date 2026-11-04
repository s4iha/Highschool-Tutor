# Contract: Subject Scope 8-Lesson Syllabus & JHS Grade/Quarter Switcher

**Contract ID**: `CTR-001-SUBJECT-SCOPE-SYLLABUS`  
**Feature**: `007-scope-dedup-landing-fixes`  
**Target Module**: `features/curriculum/components/SubjectScopeView.tsx` & `features/curriculum/utils/subject-scope-data.ts`  
**Consumer**: Public `/subjects/[slug]` Route (`app/subjects/[slug]/page.tsx`)  

---

## 1. Functional Scope & Objectives

This contract defines the public curriculum scope presentation and data resolution for all 108 DepEd MATATAG subjects, establishing:
1. Complete 8-lesson syllabus breakdowns for every subject.
2. Interactive Grade (7–10) and Quarter (1–4) switching for Junior High School Core subjects.
3. Synchronized primary practice CTA linking to `/curriculum/[slug]`.

---

## 2. API & Resolver Contracts

### 2.1 `getSubjectScopeDefinition(slug: string)`

```typescript
export function getSubjectScopeDefinition(slug: string): SubjectScopeDefinition | undefined;
```

#### Pre-conditions:
- `slug` is a non-empty string provided from route parameters or catalog links.

#### Post-conditions:
- If `slug` matches any canonical JHS quarter slug (`g{7..10}-q{1..4}-{abbr}`), base JHS slug (`jhs-{abbr}`), legacy JHS trimester slug (`g{7..10}-t{1..3}-{abbr}`), or SHS slug (`g{11..12}-s{1..2}-{abbr}`), returns a complete `SubjectScopeDefinition`.
- The returned definition satisfies:
  - `lessons`: Array of exactly 8 `SubjectScopeLesson` items.
  - Each lesson contains `lessonNumber` (1..8), `title` (non-empty string), `summary` (2–3 sentences), `keyConcepts` (array of 3–5 strings), and `practiceDrillsCount` (number, default 3).
  - `isJhsCore`: `true` for the 8 JHS Core subjects (`ENG`, `FIL`, `MATH`, `SCI`, `AP`, `ESP`, `MAPEH`, `TLE`), `false` or undefined for SHS.
  - `abbr`: Abbreviation string matching the subject.
- If `slug` cannot be matched, returns `undefined`.

---

### 2.2 `getJhsGradeQuarterScope(abbr: string, grade: string, quarter: string)`

```typescript
export function getJhsGradeQuarterScope(
  abbr: string,
  grade: "Grade 7" | "Grade 8" | "Grade 9" | "Grade 10",
  quarter: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Quarter 4"
): JhsGradeQuarterScope;
```

#### Inputs:
- `abbr`: One of `"ENG" | "FIL" | "MATH" | "SCI" | "AP" | "ESP" | "MAPEH" | "TLE"`.
- `grade`: Valid JHS Grade string.
- `quarter`: Valid JHS Quarter string.

#### Output:
- Returns `JhsGradeQuarterScope` containing grade- and quarter-specific `description`, `competencies` (4–6 items), and `lessons` (8 items).

---

## 3. UI Component Contract: `SubjectScopeView.tsx`

### 3.1 Component Props

```typescript
export interface SubjectScopeViewProps {
  subject: SubjectScopeDefinition;
}
```

### 3.2 Visual & Structural Sections

1. **Breadcrumb / Back Navigation**: Link to `/subjects` ("Back to All Curriculum Subjects").
2. **Hero Header**:
   - Subject name, track badge, academic level badge, DepEd subject code.
   - For JHS subjects: Interactive **Grade Switcher** (Pill buttons for Grades 7, 8, 9, 10) and **Quarter Switcher** (Pill buttons for Quarters 1, 2, 3, 4).
   - Time allotment, prerequisites, standard modules badge (`8 Lessons • 24 Drills`), and DepEd track.
   - Primary Practice CTA: Link to `/curriculum/${activeSlug}` with text "Start Practicing with Socratic AI".
3. **Prescribed Learning Competencies Section**:
   - Numbered list of DepEd Order No. 015, s. 2026 competencies.
   - Dynamically updates when switching grades/quarters on JHS subjects.
4. **Curriculum Syllabus & Topic Breakdown Section**:
   - Heading: `"Curriculum Syllabus & Topic Breakdown (8 Lessons)"`.
   - Subtitle: `"Comprehensive lesson progression aligned with DepEd DO 015 s. 2026 standards."`.
   - Grid or timeline of 8 lesson cards (Lesson 1 through Lesson 8).
   - Each lesson card displays:
     - Lesson badge: e.g. `Lesson 01`, `Lesson 02`, etc.
     - Title: Bold font heading.
     - Summary: 2–3 sentence description.
     - Key Concepts: Chip badges for the 3–5 concept tags.
     - Practice drills count indicator: `3 Practice Drills`.
5. **Higher Education & Career Pathways Section**:
   - Displayed if `careerPathways` is populated.
6. **Socratic AI Callout Banner**:
   - "Launch Subject Drills" CTA linking to `/curriculum/${activeSlug}`.

---

## 4. Acceptance Criteria & Invariants

- **AC-001**: Loading `/subjects/g7-q1-math` renders all 8 lessons with lesson numbers, titles, summaries, and key concepts.
- **AC-002**: On a JHS scope page, clicking "Grade 9" and "Quarter 3" updates the active slug to `g9-q3-math`, refreshes the competencies list and 8-lesson cards to Grade 9 Quarter 3 content, and points the CTA link to `/curriculum/g9-q3-math`.
- **AC-003**: Loading any SHS subject (e.g. `/subjects/g11-s1-genmath`) renders its specific 8-lesson syllabus without the JHS grade/quarter switcher.
