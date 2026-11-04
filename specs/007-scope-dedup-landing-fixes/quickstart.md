# Quickstart & Verification Guide: Subject Scope Enrichment, Catalog Deduplication & Landing Page Fixes

**Feature**: `007-scope-dedup-landing-fixes`  
**Date**: 2026-11-04  
**Target Branch**: `007-scope-dedup-landing-fixes`  

---

## 1. Prerequisites & Environment

Before testing, ensure your local development environment satisfies:
- Node.js 20+ installed
- PostgreSQL instance running (Docker or local instance)
- Project dependencies installed (`npm install`)
- Working directory: repository root (`c:\Users\Dell\Desktop\highschool-tutor`)

> [!IMPORTANT]
> Do NOT read or modify any secret `.env*` files. All curriculum metadata and landing page enhancements operate on static typed registries and client components.

---

## 2. Automated Test Execution

Run the complete test suite to verify curriculum deduplication, subject scope resolvers, SEO sitemap generation, academic workflow demo bindings, and targeted practice selection:

```powershell
# 1. Run unit test suite for curriculum deduplication (validates 8 JHS + 100 SHS = 108 catalog items)
npx jest tests/unit/curriculum-dedup.test.ts

# 2. Run unit test suite for DepEd MATATAG subject scope resolvers (8 lessons per subject)
npx jest tests/unit/subject-scope.test.ts

# 3. Run SEO dynamic sitemap builder test (validates 0 legacy trimester slug leaks)
npx jest __tests__/seo/sitemap.test.ts

# 4. Run Academic Workflow Demo unit tests (validates Student Mastery bindings)
npx jest tests/unit/workflow-demo.test.ts

# 5. Run Popular & Category Section audits (validates iconless track headers)
npx jest tests/unit/popular-and-category.test.ts

# 6. Run all tests together
npm test
```

---

## 3. Manual Verification Steps

### 3.1 Verify Deduplicated `/subjects` Catalog (FR-003 & FR-004)
1. Start the development server: `npm run dev`.
2. Navigate to `http://localhost:3000/subjects`.
3. Verify that the results counter displays **`Showing 108 DepEd MATATAG curriculum subjects`**.
4. Click the **"Junior High (7–10)"** filter button:
   - Confirm exactly **8 distinct cards** appear: English, Filipino, Mathematics, Science, Araling Panlipunan, EsP, MAPEH, and TLE.
   - Confirm each card displays `Grades 7–10 • Quarters 1–4` and `JHS-${ABBR}` with zero duplicate entries.
5. Click the **"Senior High (11–12)"** filter button:
   - Confirm exactly **100 distinct cards** appear.
6. Verify no legacy trimester (`T1–T3`) cards are visible in the grid.

---

### 3.2 Verify 8-Lesson Syllabus & JHS Grade/Quarter Switcher (FR-001 & FR-002)
1. Navigate to `http://localhost:3000/subjects/g7-q1-math`.
2. Verify the **"Curriculum Syllabus & Topic Breakdown (8 Lessons)"** section:
   - All 8 sequential lessons are rendered with their lesson numbers, descriptive titles, 2–3 sentence summaries, and 3–5 concept tags.
   - Practice drills indicator shows `3 Practice Drills` per lesson (24 drills total).
3. Test the interactive **Grade and Quarter Switcher**:
   - Click **Grade 8**, then **Quarter 2**:
     - Verify the page updates to Grade 8 Quarter 2 Mathematics competencies and 8-lesson syllabus.
     - Verify the primary CTA link updates to `/curriculum/g8-q2-math`.
4. Navigate to a Senior High School subject: `http://localhost:3000/subjects/g11-s1-genmath`.
   - Confirm all 8 lessons render with authentic General Mathematics topics.
   - Confirm no JHS grade/quarter switcher is rendered for SHS subjects.

---

### 3.3 Verify Zero Hydration Mismatches (FR-005 & FR-006)
1. Open browser Developer Tools (`F12`) on the Console tab.
2. In another tab or application, set a test referral cookie:
   ```javascript
   document.cookie = "affiliate_ref=EDUCORE2026; path=/; max-age=2592000";
   ```
3. Hard refresh `http://localhost:3000/` and `http://localhost:3000/subjects`.
4. Toggle theme between Light, Dark, and System using the Navbar theme toggle.
5. Verify in the console that:
   - Zero React hydration mismatch errors or warnings appear.
   - Zero `Warning: Extra attributes from the server` appear on `<html>`.

---

### 3.4 Verify Centered Subscription Modal CTA (FR-007)
1. On the landing page (`http://localhost:3000/`), ensure you are logged out.
2. Click **"Upgrade"** in the navigation bar or header pricing section.
3. Click to proceed to checkout to trigger the "Sign In to Avail Subscription" intercept modal.
4. Inspect the primary button: **`Continue to Sign In / Sign Up`**:
   - Verify that the leading `<LogIn />` icon, text label, and trailing `<ArrowRight />` icon are centered together as a cohesive group.
   - Test on responsive viewport (360px mobile width) to ensure the button remains centered and legible.

---

### 3.5 Verify Landing Page Copy & Student Mastery Demo (FR-008, FR-009, FR-010)
1. Scroll to the **About Section** (`#about`):
   - Confirm that Item 4 states: *"DepEd DO 015 s. 2026 score transmutation engine with per-subject mastery tracking and diagnostic weak-point analysis"*.
   - Confirm 0 occurrences of "parent reporting" or "automated gradebook".
2. Scroll to the **Student Onboarding Guide** (`#how-to-use`):
   - Confirm that Step 04 Highlight 3 states: *"Real-time DO 015 transmuted scores, subject mastery tracking, and diagnostic weak-point alerts"*.
   - Confirm 0 occurrences of "Comprehensive gradebook review across all subjects".
3. Scroll to the **Academic Workflow Demo** (`#demo`):
   - Click the second tab: verify it is labeled **"Student Mastery & Weak Points"**.
   - Verify the panel displays authentic per-lesson mastery statuses (`Mastered`, `Practice Proficient`, `Needs Review`), DO 015 transmuted scores, and AI diagnostic weak points for the selected subject.
   - Toggle between the 4 demo subjects and verify the mastery table updates dynamically.

---

### 3.6 Verify Clean Track Cards Without Decorative Icons (FR-011 & FR-012)
1. Scroll to **"Explore Subjects by Academic Track & Strand"** (`#categories`) on `/`:
   - Verify cards feature clean headers with the track title and subject count pill badge, with zero decorative icons.
2. Navigate to `http://localhost:3000/tracks`:
   - Verify track cards render cleanly without decorative track icons.
3. Click into any track (e.g. `http://localhost:3000/tracks/stem-strand`):
   - Verify the hero header displays the title, DepEd MATATAG badge, and description with zero decorative icon containers.

---

### 3.7 Verify Mastery-First Framing & Label Cleanup (FR-019 & FR-020)
1. Navigate to `/curriculum/g11-s1-genmath`:
   - In `LessonList.tsx`, verify lesson cards with score ≥ 75% render `"Mastered"` or `"Practice Proficient ({score}%)"` instead of `"Practice Passed"`.
   - Verify summary states `"All Mastered"` when all attempted lessons are proficient.
   - Verify exam mode pill states `"Exam Mode (Graded)"` instead of `"DO 015 Graded"`.
2. In `PopularSubjectsSection.tsx` on `/`:
   - Confirm that the repetitive `<Badge variant="outline">DepEd DO 015 s. 2026</Badge>` is removed from each popular subject card.
3. In `StudentDashboardView.tsx` (`/dashboard`):
   - Confirm the metric card states `"Mastery Avg"` instead of `"DO 015 Transmuted Avg"`.

---

### 3.8 Verify Diagnostic Visibility & Mobile Responsiveness (FR-021 through FR-025)
1. Log in as a student with **0 quiz attempts** in a subject (e.g. `/curriculum/g11-s1-genmath`):
   - Verify `SubjectWeakPointsCard` is **completely hidden** (`null` rendered). Zero false "Diagnostic Mastery Achieved" banners appear.
2. Complete 1 lesson with score ≥ 75%:
   - Verify that the card appears with `"Diagnostic Mastery Achieved"` and `"Mastery Target ≥ 75%"`.
3. Open Chrome DevTools and resize viewport to **320px**:
   - Verify the card heading and `"Mastery Target ≥ 75%"` badge wrap cleanly with `flex-wrap` without badge truncation or squishing.
   - Verify the `"Curriculum Lessons (X)"` header row in `LessonList.tsx` wraps responsively without overflowing buttons.

---

### 3.9 Verify Targeted Practice Question Prioritization (FR-026 & FR-027)
1. In a lesson quiz (e.g. Lesson 2: Rational Functions), deliberately answer Questions 1 and 3 incorrectly to register score < 75%.
2. Return to the subject curriculum view and locate the Weak Points card.
3. Inspect the `"Targeted Practice"` button:
   - Verify that it has **no `<Sparkles />` icon** and displays clean text with trailing `<ArrowRight />`.
   - On mobile screens (< 640px), verify the button stretches to full width (`w-full`).
4. Click `"Targeted Practice"`:
   - Inspect the launched quiz session: verify that previously missed Questions 1 and 3 are served in Priority 1, followed by questions matching Lesson 2's diagnostic `keyConcepts`.

---

### 3.10 Verify Clean Auth Client Logs (FR-028)
1. Open DevTools Console on `http://localhost:3000/`.
2. Perform a sign-in or page reload.
3. Verify that zero `[Sentinel]` warnings appear in the console.

---

## 4. Production Quality Gates

Before finalizing code changes or creating a pull request:

```powershell
# 1. TypeScript Strict Typecheck
npx tsc --noEmit

# 2. Next.js & ESLint Linting
npm run lint

# 3. Full Test Suite
npm test
```
All commands must exit with status code `0` and zero errors.
