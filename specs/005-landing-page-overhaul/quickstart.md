# Quickstart Guide: Landing Page Overhaul & Conversion Optimization

**Feature Branch**: `005-landing-page-overhaul`  
**Date**: 2026-11-03  
**Target Platform**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4

---

## 1. Prerequisites

Ensure your development environment meets the platform standards:
- Node.js 20+
- PostgreSQL local Docker container running (or environment configured in `.env.local`)
- Dependencies installed (`npm install`)

---

## 2. Fast Verification Commands

### 2.1 Automated Codebase Integrity Audits (PowerShell)

Run these deterministic scans to verify that all anti-patterns and visual clichés are eliminated:

```powershell
# 1. Assert ZERO occurrences of 'Sparkles' across landing components
Select-String -Path "features/landing/components/*.tsx" -Pattern "Sparkles"
# Expected: Zero results

# 2. Assert ZERO occurrences of '<Code>' icon in CategorySection and TrackDetail
Select-String -Path "features/landing/components/CategorySection.tsx" -Pattern "Code"
Select-String -Path "features/landing/components/TrackDetail.tsx" -Pattern "icon: Code"
# Expected: Zero results

# 3. Assert ZERO occurrences of legacy non-DepEd 'Trimester'
Select-String -Path "features/landing/components/*.tsx" -Pattern "Trimester"
# Expected: Zero results

# 4. Assert ZERO occurrences of fabricated vanity numbers (15,000+ or 98.2%)
Select-String -Path "features/landing/components/*.tsx" -Pattern "15,000|98\.2%"
# Expected: Zero results
```

### 2.2 Automated Unit Test Execution

```powershell
# Run tracks data integrity and landing stats unit tests
npm test -- tests/unit/tracks-data.test.ts tests/unit/landing-stats.test.ts tests/unit/curriculum-data.test.ts
```

### 2.3 Compilation & Linting Verification

```powershell
# Run full Next.js production build and lint pass
npm run build
npm run lint
```

---

## 3. Manual Visual Acceptance Checkpoints

When running `npm run dev` and inspecting the landing page at `http://localhost:3000`:

### Checkpoint 1: Above-the-Fold Hero Section (`HeroSection.tsx`)
- [ ] Eyebrow badge is NOT empty and renders a verified curriculum badge (`"DepEd Order No. 015, s. 2026 Aligned"`) with an academic icon (`GraduationCap` or `BookOpenCheck`).
- [ ] Headline passes the specificity test, focusing directly on Philippine high schoolers passing quarterly exams.
- [ ] Primary CTA button reads `"Start 30-Day Free Trial"` and directs to the student registration flow (`/login` or `/register`).
- [ ] Friction-reducing microcopy is clearly visible adjacent to the CTA: `"₱0 upfront • No credit card required • Cancel anytime"`.
- [ ] Floating preview cards render authentic high school learning data without visual sparkles.

### Checkpoint 2: Stats Bar (`StatsBar.tsx`)
- [ ] Metric 1: `"75+ DepEd Subjects"` with subtext `"8 JHS Core + 67 SHS Strands"`.
- [ ] Metric 2: `"1,800+ Practice Drills"` with subtext `"24 verified drills per subject"`.
- [ ] Metric 3: `"600+ Lesson Modules"` with subtext `"8 structured lessons per subject"`.
- [ ] Metric 4: `"100% DepEd DO 015 s. 2026"` with subtext `"Official MATATAG Transmutation"`.
- [ ] Zero layout shifting during initial render or hydration.

### Checkpoint 3: Interactive Demo Position (`app/page.tsx` & `AcademicWorkflowDemo.tsx`)
- [ ] `AcademicWorkflowDemo` renders at **Section 4**, immediately following `AboutSection` and BEFORE `HowToUseAppSection`, `CategorySection`, and `TrialNoticeSection`.
- [ ] Visitor can select question options, receive immediate feedback, view Socratic Taglish hints, and inspect the teacher DO 015 gradebook without being prompted to log in.

### Checkpoint 4: Category Section (`CategorySection.tsx`) & Track Detail (`TrackDetail.tsx`)
- [ ] Senior High School Core card displays `GraduationCap` or `BookOpenCheck` (replaces developer `<Code>` icon).
- [ ] All 7 track cards display verified badge counts:
  - Junior High Core: `"8 Core Subjects (32 Grade-Level Offerings)"`
  - SHS Core: `"15 DepEd Core Subjects"`
  - STEM Strand: `"11 Specialized Subjects"`
  - ABM Strand: `"9 Specialized Subjects"`
  - HUMSS Strand: `"9 Specialized Subjects"`
  - GAS Strand: `"7 Specialized Subjects"`
  - TVL Track: `"9 Specialized Subjects"`

### Checkpoint 5: Popular Subjects (`PopularSubjectsSection.tsx`)
- [ ] Star ratings (4.9★, 4.8★) and review numbers (2.4K, 1.8K) are completely removed.
- [ ] Cards display genuine curriculum badges: Grade Level, DepEd Quarter, 8 Lessons & 24 Practice Drills, and DepEd DO 015 s. 2026 transmutation indicator.
- [ ] Grade 10 Science displays `"Grade 10 • Quarter 1"` with slug `g10-q1-sci` (no "Trimester").
- [ ] Top link reads `"View All 75+ DepEd Subjects"`.

### Checkpoint 6: Free Trial & Pricing (`TrialNoticeSection.tsx`)
- [ ] Free trial terms clearly state 30 full days of unrestricted access to all 75+ subjects and 600+ lesson modules.
- [ ] ₱0 upfront, no credit card required, ₱299/month post-trial with GCash and Maya options, cancel anytime.
- [ ] Primary CTA button contains zero sparkle icons.

### Checkpoint 7: Mobile Viewport & Ergonomics
- [ ] Inspect at 375px and 414px mobile viewports:
  - Zero horizontal overflow.
  - Primary CTA buttons expand smoothly to full width (`w-full sm:w-auto`) with minimum 48px touch targets.
  - Microcopy wraps cleanly beneath the buttons.
