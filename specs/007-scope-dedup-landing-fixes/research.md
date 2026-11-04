# Phase 0 Research: Subject Scope Enrichment, Catalog Deduplication, and Landing Page Accuracy & UX Fixes

**Feature**: `007-scope-dedup-landing-fixes`  
**Date**: 2026-11-04  
**Status**: Completed  
**Branch**: `007-scope-dedup-landing-fixes`  

---

## 1. Executive Summary & Problem Analysis

TASK-030 addresses ten tightly coupled functional deficiencies across HighSchool Tutor's public curriculum catalog, subject scope presentation, landing page marketing fidelity, diagnostic tracking engine, and client-side rendering stability:

1. **Incomplete Curriculum Scope on `/subjects/[slug]`**:
   Subject scope pages currently render only high-level competencies, time allotment, and career pathways. There is no structured syllabus or breakdown of topics and lessons. Under DepEd DO 015, s. 2026 MATATAG standards, each curriculum subject is structured around **8 sequential lesson modules** and **24 practice drills** (3 drills per lesson). Visitors need to see this full 8-lesson syllabus breakdown on `/subjects/[slug]`. Furthermore, for the 8 Junior High School (JHS) Core subjects (which span Grades 7–10 and Quarters 1–4), visitors must be able to interactively switch grades and quarters directly on the scope page to inspect the specific competencies and syllabus for that quarter without having to manually manipulate the URL.

2. **Catalog Redundancy on `/subjects` (324 vs. 108 Distinct Subjects)**:
   The public catalog at `/subjects` currently displays 324 cards because it flattens the internal test/quiz runner structure:
   - 128 JHS Quarter offerings (4 grades × 4 quarters × 8 core subjects = 128)
   - 96 legacy JHS Trimester offerings (4 grades × 3 trimesters × 8 core subjects = 96)
   - 100 Senior High School (SHS) offerings across Core, Applied, and Specialized strands
   Displaying 28 duplicate entries per JHS subject (e.g. `G7-Q1-ENG`, `G7-T1-ENG`, `G7-Q2-ENG`, etc.) confuses users and clutters search results. The catalog must be deduplicated to show exactly **108 distinct subjects** (**8 JHS Core subjects** covering Grades 7–10 and Quarters 1–4, and **100 SHS subjects**). Legacy Trimester (`g*-t*-*`) slugs must be excluded from the catalog and sitemap while maintaining backwards-compatible URL resolution.

3. **Client-Side Hydration Mismatches**:
   Two distinct hydration issues trigger React 19 console warnings and development error badges:
   - **Root `<html>` Theme Attribute**: `next-themes` modifies `class` or `style` on `<html lang="en">` based on stored theme preferences before hydration completes. Without `suppressHydrationWarning`, React warns of an attribute mismatch.
   - **Referral Cookie State Divergence in `CheckoutModal.tsx`**: State variables `referralInput` and `showReferralInput` evaluate `typeof window !== "undefined"` inside `useState` initializers. During SSR, `window` is undefined (`""` and `false`), but during initial client hydration in browsers with an active referral cookie, `window` is defined, reading the cookie and diverging from the server DOM.

4. **Subscription Intercept Modal CTA Text Alignment**:
   In `features/billing/components/AuthInterceptDialog.tsx`, the primary CTA button (`Continue to Sign In / Sign Up`) contains `<ArrowRight className="size-4 ml-auto" />`. The `ml-auto` utility pushes the right arrow to the far right boundary of the button, leaving the leading `<LogIn />` icon and text label off-center and visually unbalanced.

5. **Unsupported Feature Claims on Landing Page**:
   The landing page contains copy claiming an "automated gradebook and parent reporting" (`AboutSection.tsx`) and "Comprehensive gradebook review across all subjects" (`HowToUseAppSection.tsx`), as well as a multi-student LRN table under a "Teacher & DepEd Gradebook" tab (`AcademicWorkflowDemo.tsx`). HighSchool Tutor is a student-first DepEd AI tutor platform offering per-subject mastery and diagnostic weak-point tracking, not a multi-tenant teacher LMS or parent portal. These claims must be replaced with authentic student mastery tracking and diagnostic weak-point highlights.

6. **Arbitrary Decorative Track Icons**:
   In `CategorySection.tsx`, `app/tracks/page.tsx`, and `TrackDetail.tsx`, arbitrary decorative icons (e.g., `BookOpenCheck`, `FlaskConical`, `Briefcase`, `Compass`, `GraduationCap`, `Layers`, `Wrench`) are rendered on multi-subject track and strand cards. These icons do not represent the diverse individual subjects within each strand and confuse students. They must be removed to create clean typography-first headers.

7. **Bureaucratic Pass/Fail Terminology & Redundant DO 015 Badges (US6)**:
   The UI currently litters individual subject cards, quiz mode pills, and dashboard widgets with repetitive `"DepEd DO 015 s. 2026"` and `"DO 015 Graded"` badges, while relying on pass/fail labels (`"Practice Passed"`, `"DepEd DO 015 Passing Grade ≥ 75%"`). The user experience must be reframed to a **Mastery-First** paradigm (`"Mastered"`, `"Practice Proficient"`, `"Mastery Target ≥ 75%"`, `"All Mastered"`) while preserving the DO 015 60–100 transmutation algorithm under the hood.

8. **False "Mastery Achieved" Diagnostic Visibility on Zero-Attempt Subjects (US7)**:
   In `SubjectWeakPointsCard.tsx`, if a student has never attempted any quiz in that subject (`totalAttemptedLessons === 0`), `data.weakPoints.length === 0` evaluates to true, rendering a false `"Diagnostic Mastery Achieved"` message. For 0-attempt users, the card must return `null` and remain hidden. Additionally, the mastery header and `"Mastery Target ≥ 75%"` badge must wrap responsively on mobile screens down to 320px.

9. **Generic Quiz Sampling in Targeted Practice Drills (US8)**:
   `createTargetedPracticeAction` currently calls `sampleQuizQuestions()`, pulling random questions regardless of what the student previously missed. Targeted practice must prioritize:
   - **Tier 1**: Questions the student previously answered incorrectly or left unanswered in prior quiz sessions for that lesson.
   - **Tier 2**: Questions matching the lesson's diagnostic `keyConcepts` keywords in question text or explanation.
   - **Tier 3**: Remaining questions from the pool.
   Additionally, the `"Targeted Practice"` button in `SubjectWeakPointsCard.tsx` must remove the `<Sparkles />` icon and expand to full width on mobile viewports.

10. **Sentinel Infrastructure Log Warning in Better Auth (US9)**:
    `features/auth/lib/auth-client.ts` registers `sentinelClient()` from `@better-auth/infra/client`, emitting `[Sentinel] Default global identify ingestion is active but not recommended...` in browser console logs. Removing this unused plugin completely silences the log warning.

---

## 2. Technical Research & Root Cause Findings

### Research Item 1: 8-Lesson Syllabus & JHS Grade/Quarter Scoping

#### Codebase Analysis:
- `features/curriculum/types/subjectScope.types.ts`: Defines `SubjectScopeDefinition` containing general metadata (`timeAllotment`, `competencies`, `careerPathways`), but missing `lessons: SubjectScopeLesson[]`.
- `features/curriculum/utils/subject-scope-data.ts`: Contains `BASE_SCOPE_REGISTRY` mapping base codes (`MATH`, `SCI`, `ENG`, `GENMATH`, `PRECALC`, etc.) to descriptions and competencies.
- `features/curriculum/components/SubjectScopeView.tsx`: Displays hero, specs, competencies, and career pathways, but has no syllabus section and no grade/quarter switcher for JHS subjects.

#### Architecture Decision:
1. **Lesson Data Modeling**:
   Define `SubjectScopeLesson`:
   ```ts
   export interface SubjectScopeLesson {
     lessonNumber: number; // 1 to 8
     title: string;
     summary: string; // 2-3 sentences describing the topic
     keyConcepts: string[]; // 3-5 subtopic or concept tags
     practiceDrillsCount: number; // Default 3 (totaling 24 drills across 8 lessons)
   }
   ```
2. **Dedicated Curriculum Syllabus Module**:
   Create `features/curriculum/utils/subject-lessons-data.ts` to house authentic, domain-specific 8-lesson syllabi for:
   - All 8 JHS Core Subjects across each Grade (Grades 7–10) and Quarter (Quarters 1–4) — providing 16 variations for each JHS subject (`MATH`, `SCI`, `ENG`, `FIL`, `AP`, `ESP`, `MAPEH`, `TLE`).
   - All 100 SHS Subjects spanning Core, Applied, STEM, ABM, HUMSS, GAS, Arts & Design, Sports, and TVL specializations.
   Every lesson includes authentic DepEd MATATAG competencies, titles, 2–3 sentence pedagogical summaries, and 3–5 concept tags.
3. **Interactive Grade & Quarter Switcher on JHS Scope Pages**:
   - For JHS subjects (`isJhsCore: true`), `SubjectScopeView.tsx` will render an interactive Grade (Grades 7–10) and Quarter (Quarters 1–4) selector.
   - When a user selects a different grade or quarter, `SubjectScopeView` dynamically loads that grade and quarter's specific competencies, description, and 8-lesson syllabus, and updates the practice CTA link (`/curriculum/g{grade}-q{quarter}-{abbr}`).
   - Initial selection defaults to the grade and quarter parsed from the canonical URL (e.g. `/subjects/g9-q2-sci` initializes to Grade 9, Quarter 2).

---

### Research Item 2: Catalog Deduplication & Slug Canonicalization

#### Codebase Analysis:
- In `features/curriculum/utils/subject-scope-data.ts`:
  ```ts
  export function getAllSubjectScopeDefinitions(): SubjectScopeDefinition[] {
    return SUBJECTS.map((s) => getSubjectScopeDefinition(s.slug)!).filter(Boolean);
  }
  ```
  `SUBJECTS` has 324 entries (128 JHS Q + 96 JHS T + 100 SHS).
- In `features/curriculum/utils/curriculum-data.ts`:
  - `getDistinctJhsSubjects()` already generates 8 distinct JHS subjects with `code: JHS-${abbr}`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, and `defaultSlug: g7-q1-${abbr}`.
  - `getDistinctShsSubjects()` returns the 100 distinct SHS subjects from `SHS_SUBJECT_CATALOG`.

#### Architecture Decision:
1. **Catalog Definition (`getAllSubjectScopeDefinitions`)**:
   Update `getAllSubjectScopeDefinitions()` to combine:
   - 8 JHS Core subject definitions: resolved with `level: "Junior High School"`, `grade: "Grades 7–10"`, `term: "Quarters 1–4"`, `code: "JHS-${abbr}"`, `slug: "g7-q1-${abbr.toLowerCase()}"`, `isJhsCore: true`, and `abbr`.
   - 100 SHS subject definitions: resolved from `getDistinctShsSubjects()`.
   **Total: 108 subjects**.
2. **Slug Enumeration for Static Generation (`getAllSubjectScopeSlugs`)**:
   `getAllSubjectScopeSlugs()` will return only canonical slugs:
   - 128 JHS quarter slugs: `g{7..10}-q{1..4}-{eng|fil|math|sci|ap|esp|mapeh|tle}`
   - 100 SHS semester slugs: `g{11..12}-s{1..2}-{abbr}`
   - Total canonical slugs = **228**.
   Zero legacy trimester (`g*-t*-*`) slugs are emitted.
3. **Backwards Compatibility**:
   In `getSubjectScopeDefinition(slug)`:
   - Accept canonical quarter slugs: `g8-q2-math`.
   - Accept base JHS slugs: `jhs-math` (resolving to Grade 7 Quarter 1 default).
   - Accept legacy trimester slugs: `g8-t2-math` (parsed via `parseJhsSlug`, mapping `t2` -> `q2` so existing bookmarks never 404).
4. **Unit Test Alignment**:
   In `tests/unit/curriculum-dedup.test.ts`:
   - Update `expect(shs).toHaveLength(70)` to `expect(shs).toHaveLength(100)`.
   - Update `expect(totalCatalogCards).toBe(78)` to `expect(totalCatalogCards).toBe(108)`.

---

### Research Item 3: Hydration Warnings in Root Layout & Modals

#### Root Cause Analysis:
1. **`app/layout.tsx`**:
   The `<html lang="en">` tag is processed by `next-themes` `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`, which dynamically sets `class="dark"` or `class="light"` on the client based on `localStorage` or `prefers-color-scheme`. During SSR, the server renders `<html lang="en" class="...">`. Next.js and React require `suppressHydrationWarning` on `<html />` when theme providers mutate root attributes.
2. **`features/billing/components/CheckoutModal.tsx`**:
   Lines 70–75 evaluate `typeof window !== "undefined"` inside lazy `useState` initializers. During SSR, `window` is `undefined` (`""` and `false`). On client hydration, if a referral cookie exists, it evaluates to the cookie string, producing an accordion state mismatch.

#### Resolution Strategy:
1. Add `suppressHydrationWarning` to `<html lang="en">` in `app/layout.tsx`.
2. In `CheckoutModal.tsx`, initialize state statically (`""` and `false`) and synchronize with `getClientReferralCookie()` inside a client-side `useEffect` hook.

---

### Research Item 4: Auth Intercept Dialog CTA Centering

#### Root Cause Analysis:
In `features/billing/components/AuthInterceptDialog.tsx`, line 141 contains `<ArrowRight className="size-4 ml-auto" />`. The `ml-auto` utility consumes horizontal space and pins the arrow to the right edge, throwing the leading `<LogIn />` icon and label off-center.

#### Resolution:
Remove `ml-auto` from `<ArrowRight className="size-4" />`. In a flex container with `justify-center items-center gap-2`, all elements center naturally as a unified visual unit.

---

### Research Item 5: Marketing Copy & Interactive Workflow Demo

#### Copy Audits:
- `features/landing/components/AboutSection.tsx` (line 19):
  - Current: `"DepEd DO 015 s. 2026 transmutation engine with automated gradebook and parent reporting"`
  - Updated: `"DepEd DO 015 s. 2026 score transmutation engine with per-subject mastery tracking and diagnostic weak-point analysis"`
- `features/landing/components/HowToUseAppSection.tsx` (line 76):
  - Current: `"Comprehensive gradebook review across all subjects"`
  - Updated: `"Real-time DO 015 transmuted scores, subject mastery tracking, and diagnostic weak-point alerts"`

#### Workflow Demo Transformation (`AcademicWorkflowDemo.tsx`):
- Replace tab 2 with **"Student Mastery & Weak Points"** (`id: "mastery"`).
- Title: *"Student Mastery & Diagnostic Performance Dashboard"*
- Subtitle: *"Review your per-lesson DO 015 transmuted scores for {selectedSubject}, identify weak-point competencies, and launch targeted Socratic practice."*
- Replace multi-student LRN table with Student Mastery Breakdown rows (`Mastered`, `Practice Proficient`, `Needs Review`), overall transmuted average badge, and AI diagnostic weak points.

---

### Research Item 6: Decorative Track Icons Removal

#### Codebase Analysis:
- In `CategorySection.tsx`, `app/tracks/page.tsx`, and `TrackDetail.tsx`, arbitrary icons are rendered on multi-subject track cards.
- Remove decorative icon imports and container elements. Keep typography-led card headers with track name, subject count badge, and grade badges.
- Update `tests/unit/popular-and-category.test.ts`.

---

### Research Item 7: Mastery-First Framing & Removal of Redundant DO 015 / Passing Labels (US6)

#### Codebase Analysis:
- `features/curriculum/types/curriculum.types.ts`:
  `LessonProgressStatus = "Not Started" | "In Progress" | "Needs Review" | "Practice Passed" | "Mastered"`.
  Add `"Practice Proficient"` to support mastery-first framing cleanly while preserving backward compatibility with stored `"Practice Passed"` records.
- `features/curriculum/components/SubjectWeakPointsCard.tsx`:
  - Replace `"DepEd DO 015 Passing Grade ≥ 75%"` with `"Mastery Target ≥ 75%"`.
  - Replace `"All attempted competencies for this subject currently meet or exceed the official passing threshold. Keep up the great work!"` with `"All attempted competencies for this subject currently meet or exceed the 75% mastery benchmark. Keep up the great work!"`.
  - Replace `"Based on your latest attempt per lesson, these topics fall below the DepEd DO 015 s. 2026 passing threshold (< 75%)..."` with `"Based on your latest attempt per lesson, these topics scored below the 75% mastery benchmark..."`.
- `features/curriculum/components/LessonList.tsx`:
  - `"All Passed"` -> `"All Mastered"`.
  - `"Practice Passed ({stat.transmutedGrade}%)"` -> `"Practice Proficient ({stat.transmutedGrade}%)"`.
  - `"DO 015 Graded"` -> `"Exam Mode (Graded)"`.
- `features/curriculum/components/QuizRunner.tsx`:
  - `"Practice Passed ({transmuted}%)"` -> `"Practice Proficient ({transmuted}%)"`.
  - `"Exam Mode (DO 015 Graded)"` -> `"Exam Mode (Graded)"`.
- `features/curriculum/actions/curriculum.actions.ts` (`getUserQuizAttemptsAction`):
  Update score remark descriptors to: `"Mastered (Outstanding)"`, `"Mastered (Very Satisfactory)"`, `"Proficient (Satisfactory)"`, `"Competency Met"`, `"Needs Review (<75%)"`.
- `features/dashboard/actions/dashboard.actions.ts` (`getTransmutedRemarks`):
  Update remarks to: `"Mastered (Outstanding)"`, `"Very Satisfactory"`, `"Satisfactory"`, `"Competency Met"`, `"Needs Review"`.
- `features/dashboard/components/StudentDashboardView.tsx`:
  Replace `"DO 015 Transmuted Avg"` with `"Mastery Avg"`.
- `features/landing/components/PopularSubjectsSection.tsx`:
  Remove the repetitive `<Badge variant="outline">DepEd DO 015 s. 2026</Badge>` on each popular subject card.
- `features/landing/components/HowToUseAppSection.tsx`:
  Reframe `"Passing grade ≥ 75%"` to `"Mastery target ≥ 75%"`.

---

### Research Item 8: Accurate Diagnostic Mastery Visibility & Mobile Badge Alignment (US7)

#### Root Cause Analysis:
In `SubjectWeakPointsCard.tsx`:
```tsx
// If no weak points exist or no attempts yet
if (!data || data.weakPoints.length === 0) {
  return (
    <Card ...>
      <h4>Diagnostic Mastery Achieved</h4>
      ...
    </Card>
  );
}
```
If a student has 0 quiz attempts, `data.weakPoints` is `[]`, triggering a false `"Diagnostic Mastery Achieved"` message before the student has taken any quizzes.

#### Resolution Strategy:
1. Update `getSubjectWeakPointsAction(subjectSlug)` return type to include `totalAttemptedLessons: number`:
   ```ts
   totalAttemptedLessons: latestAttemptByLesson.size
   ```
2. In `SubjectWeakPointsCard.tsx`:
   ```tsx
   if (!data || data.totalAttemptedLessons === 0) {
     return null; // completely hidden for zero attempts
   }

   if (data.totalAttemptedLessons > 0 && data.weakPoints.length === 0) {
     return (
       <Card ...>
         <h4 className="text-sm font-bold text-foreground flex flex-wrap items-center gap-2">
           <span>Diagnostic Mastery Achieved</span>
           <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0 whitespace-nowrap">
             Mastery Target ≥ 75%
           </Badge>
         </h4>
         ...
       </Card>
     );
   }
   ```
3. In `LessonList.tsx`:
   Ensure the `"Curriculum Lessons (X)"` header row uses `flex flex-wrap items-center justify-between gap-2` so badges and action buttons wrap naturally on mobile screens down to 320px.

---

### Research Item 9: Diagnostic-Driven Targeted Practice Question Prioritization & Weak-Point Card UI (US8)

#### Architecture Analysis:
Currently, `createTargetedPracticeAction` calls `sampleQuizQuestions(quizResult.questions, 10)`, which performs random sampling.

#### Resolution Strategy:
1. Create `selectTargetedPracticeQuestions` in `features/curriculum/utils/quiz-sampler.ts`:
   ```ts
   export function selectTargetedPracticeQuestions(params: {
     pool: QuizQuestion[];
     count: number;
     previousSessions?: Array<{
       questions: QuizQuestion[];
       userAnswers?: Record<string, string> | null;
     }>;
     keyConcepts?: string[];
   }): QuizQuestion[]
   ```
   - **Tier 1 (Previously Missed / Unanswered Questions)**:
     Scan `previousSessions` (ordered newest to oldest). If a student answered a question incorrectly or left it unanswered (`userAnswers?.[idx] !== q.answer`), and that question matches an item in `pool` (matched by prompt text), place the question in Tier 1. Deduplicate by prompt.
   - **Tier 2 (Concept-Matched Questions)**:
     For questions remaining in `pool` (not in Tier 1), score them based on matching keywords from `keyConcepts` (case-insensitive substring and significant words ≥ 4 characters) found in `q.question` and `q.explanation`. Sort descending by match score and place questions with score > 0 in Tier 2.
   - **Tier 3 (Remaining Pool Fallback)**:
     Shuffle remaining pool items via Fisher-Yates and fill up to `count` (default 10).
2. In `createTargetedPracticeAction`:
   - Query the user's prior `QuizSession` records for that lesson (`take: 5`, ordered by `createdAt: "desc"`).
   - Fetch the lesson's `keyConcepts` via `getLessonsAction`.
   - Pass `pool`, `count`, `previousSessions`, and `keyConcepts` to `selectTargetedPracticeQuestions`.
3. In `SubjectWeakPointsCard.tsx`:
   - Remove `<Sparkles className="size-3 text-amber-300" />` from the `"Targeted Practice"` button (and remove `Sparkles` from imports).
   - Add `w-full sm:w-auto justify-center` to the `"Targeted Practice"` button for effortless touch interaction on mobile.
   - Add `flex flex-wrap items-start sm:items-center justify-between gap-2` to the CardHeader and `shrink-0 whitespace-nowrap` to the `{data.totalWeakPoints} ... Under 75%` badge.

---

### Research Item 10: Eliminating `[Sentinel]` Better Auth Client Log Warning (US9)

#### Codebase Analysis:
In `features/auth/lib/auth-client.ts`:
```ts
import { createAuthClient } from "better-auth/react";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  plugins: [sentinelClient()],
});
```
The `@better-auth/infra/client` plugin `sentinelClient()` emits:
`[Sentinel] Default global identify ingestion is active but not recommended for production environments. Please configure your Sentinel ingest endpoint.`

#### Resolution Strategy:
Remove `sentinelClient` import and plugin registration:
```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

export const { signIn, signOut, signUp, useSession } = authClient;
```
Standard Better Auth email/password and Google OAuth operations remain 100% functional, and the console log warning is completely eliminated.

---

## 3. Technology & Architectural Invariants

| Layer | Choice / Constraint | Verification |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19 | Zero hydration warnings on root `<html>` and client dialogs |
| Architecture | Feature-Driven Architecture (FDA) | All curriculum code in `features/curriculum/`, landing code in `features/landing/`, billing code in `features/billing/`, auth code in `features/auth/` |
| State Management | TanStack Query v5 + Zustand v5 | No cross-pollution; local ephemeral state used for grade/quarter tabs |
| Curriculum Standard | DepEd DO 015, s. 2026 MATATAG | 8 lessons and 24 practice tests per subject; strict passing threshold ≥ 75% |
| Diagnostic Engine | Tiered question selection (Missed -> Concept-matched -> Pool) | 100% of targeted practice sessions prioritize student deficits |
| Terminology | Mastery-First Framing | Zero remaining "Passing Grade ≥ 75%" or "Practice Passed" labels in UI |
| Quality Gates | Jest (`npm test`), strict TypeScript (`tsc --noEmit`), ESLint | Zero errors; complete test suite passes cleanly |

---

## 4. Conclusion & Readiness

All 10 research items are comprehensively analyzed and resolved with concrete implementation specifications. Proceed to updating `data-model.md`, `contracts/`, `quickstart.md`, and `plan.md`.
