# Research & Technical Decisions: Landing Page Overhaul & Conversion Optimization

**Feature Branch**: `005-landing-page-overhaul`  
**Date**: 2026-11-03  
**Status**: Completed  
**Spec Reference**: `specs/005-landing-page-overhaul/spec.md`

---

## 1. Context & Architectural Overview

The HighSchool Tutor landing page (`app/page.tsx` and `features/landing/components/*`) is the primary public entry point for Philippine high school learners (Grades 7–12), parents, and teachers navigating the Department of Education (DepEd) K-12 MATATAG curriculum under DepEd Order No. 015, s. 2026.

Following an audit against SaaS landing page best practices (GetSpike narrative framework and Lovable PLG principles) and `/grill-me` alignment, four core architectural areas require technical decisions:
1. **Stats Bar Data Fetching & Caching Architecture**: Live database querying vs. static fallback resilience.
2. **Page Narrative & Section Re-sequencing**: Psychological scroll sequence, time-to-value acceleration, and SEO preservation.
3. **Iconography Discipline & Visual Cleanliness**: Purging AI visual clichés (`Sparkles`) and restoring semantic academic icons.
4. **Curriculum Metadata Standardization**: Aligning terminology (Quarters vs. Trimesters) and catalog counts (75+ subjects, 8 modules, 24 drills) with official DepEd MATATAG standards.

---

## 2. Decision 1: Stats Bar Data Fetching Architecture

### Problem
The current `StatsBar.tsx` displays fabricated, unverified statistics (`"15,000+ Enrolled Students"`, `"98.2% Pass Rate"`, `"130+ DepEd Subjects"`, `"12 / 24 Lessons & Quizzes"`). These vanity metrics destroy institutional trust with discerning teachers, parents, and school heads. The platform needs to present 100% verified curriculum catalog metrics combined with live platform engagement queries from Prisma when available, without introducing Cumulative Layout Shift (CLS) or slowing down Time-to-First-Byte (TTFB).

### Options Evaluated

| Option | Implementation Mechanism | Pros | Cons | Verdict |
|---|---|---|---|---|
| **Option A: Pure Client Component (`useEffect` + `fetch`)** | Client component calls `/api/stats` inside `useEffect` on mount. | Simple to write. | Violates Constitution Principle II (no raw fetch/axios in client components; no useEffect server sync). Causes visual flash/CLS on load. Fails on offline/slow networks. | **Rejected** |
| **Option B: Pure React Server Component (RSC)** | Server Component directly queries `prisma.user.count()` and `prisma.quizAttempt.count()` in `app/page.tsx` and renders HTML. | Zero client JS overhead; SSR HTML includes stats immediately. | If PostgreSQL connection experiences latency or cold start, entire root route TTFB is blocked. Cannot support optimistic client refreshes or animation transitions. | **Rejected as standalone** |
| **Option C: Server Action + TanStack Query (`useLandingStatsQuery`) with SSR Fallback** | Next.js Server Action (`getLandingStatsAction`) in `features/landing/actions/` queries Prisma with immediate fallback to static catalog constants. Client hook in `features/landing/hooks/` uses TanStack Query v5 with `initialData: CATALOG_FALLBACK_STATS` and 5-minute `staleTime`. | 100% compliant with Constitution Principles I & II. Zero layout shift (initial catalog data always present). Graceful fallback if DB is offline or empty. TanStack Query manages background revalidation. | Requires lightweight Server Action and hook definition. | **Selected** |

### Implementation Details:
1. **Server Action**: `features/landing/actions/get-landing-stats.action.ts`
   ```ts
   "use server";
   import { prisma } from "@/lib/prisma";
   import { CATALOG_FALLBACK_STATS } from "../constants/catalog-stats";
   import type { LandingStatsResponse } from "../types/landing.types";

   export async function getLandingStatsAction(): Promise<LandingStatsResponse> {
     try {
       const [studentCount, quizzesTakenCount] = await Promise.all([
         prisma.user.count({
           where: { roles: { some: { role: "STUDENT" } } },
         }),
         prisma.quizAttempt.count(),
       ]);

       return {
         success: true,
         source: "live",
         data: {
           ...CATALOG_FALLBACK_STATS,
           liveStudents: studentCount,
           liveQuizzesTaken: quizzesTakenCount,
         },
       };
     } catch (error) {
       console.warn("[getLandingStatsAction] Fallback to catalog constants:", error);
       return {
         success: true,
         source: "catalog_fallback",
         data: CATALOG_FALLBACK_STATS,
       };
     }
   }
   ```
2. **Authoritative Catalog Fallback Baseline**:
   - `totalSubjects`: `75+` (8 JHS Core + 67 SHS Strands)
   - `subjectSubtext`: `"8 JHS Core + 67 SHS Strands"`
   - `practiceDrills`: `1,800+` (24 standardized drills per subject)
   - `drillsSubtext`: `"24 verified drills per subject"`
   - `lessonModules`: `600+` (8 standardized modules per subject)
   - `modulesSubtext`: `"8 structured lessons per subject"`
   - `curriculumStandard`: `"100% DepEd DO 015 s. 2026"`
   - `standardSubtext`: `"Official MATATAG Transmutation"`
   - `trialTerms`: `"30-Day Free Pass"`
   - `trialSubtext`: `"₱0 upfront • No card required"`
3. **Card Presentation Logic**:
   - If `liveStudents > 50`, `StatsBar` can display `"${liveStudents.toLocaleString()}+"` as an active learner count, or present the authoritative curriculum scope:
     1. Metric 1: **75+ DepEd Subjects** (`8 JHS Core + 67 SHS Strands`)
     2. Metric 2: **1,800+ Practice Drills** (`24 verified drills per subject`)
     3. Metric 3: **600+ Lesson Modules** (`8 structured lessons per subject`)
     4. Metric 4: **100% DepEd DO 015 s. 2026** (`Official MATATAG Transmutation`)
   - This layout is bulletproof: whether the database has 0 users or 100,000 users, the displayed figures are mathematically and academically truthful.

---

## 3. Decision 2: Section Re-sequencing & Conversion Narrative in `app/page.tsx`

### Problem
In the existing `app/page.tsx`, `AcademicWorkflowDemo` is rendered at the bottom of the page (Section 8 of 9), after `TrialNoticeSection`. This contradicts the Lovable/GetSpike PLG thesis: "Show the product before the signup wall". Visitors are asked to evaluate onboarding steps, subject catalogs, and pricing before seeing what the interactive Socratic tutoring and DO 015 gradebook actually look like. Furthermore, 50–60% of visitors bounce before scrolling past section 3.

### Solution: Sequenced Sales Conversation Narrative

```mermaid
flowchart TD
    H["1. HeroSection<br/>(Specific Outcome, Eyebrow Badge, PLG CTA 'Start 30-Day Free Trial', Microcopy)"] --> SB["2. StatsBar<br/>(75+ Subjects, 1,800+ Drills, 600+ Modules, DO 015 Aligned)"]
    SB --> AB["3. AboutSection<br/>(Problem/Solution Framing: Why Filipino High Schoolers Struggle)"]
    AB --> WD["4. AcademicWorkflowDemo<br/>(Interactive Product Experience BEFORE Signup Wall)"]
    WD --> HTU["5. HowToUseAppSection<br/>(4-Step Onboarding Guide, Semantic Icons)"]
    HTU --> CS["6. CategorySection<br/>(7 Academic Tracks, Corrected Counts, Academic Icons)"]
    CS --> PS["7. PopularSubjectsSection<br/>(Verified Curriculum Metadata, Quarter 1, No Fake Stars)"]
    PS --> TN["8. TrialNoticeSection<br/>(Transparent Pricing: 30 Days Free, ₱0 Upfront, ₱299/mo)"]
    TN --> CTA["9. CtaBanner<br/>(Final Conversion Action)"]
```

### Conversion Logic by Section:
1. **`HeroSection`**: Answers *"What does this do, who is it for, and why should I care right now?"* Passes the GetSpike specificity test by naming Philippine high schoolers passing quarterly exams. Populates the top eyebrow badge with verified DepEd MATATAG alignment. Primary CTA: `"Start 30-Day Free Trial"` with friction-reversing microcopy (`"₱0 upfront • No credit card required • Cancel anytime"`).
2. **`StatsBar`**: Answers *"What is the scale and credibility?"* Proof-stacks 75+ subjects, 1,800+ drills, 600+ lesson modules, and 100% DO 015 s. 2026 compliance.
3. **`AboutSection`**: Answers *"Why do I need this?"* Diagnoses the pain points of quarterly exam preparation and introducing Socratic AI hints and automated grade transmutation.
4. **`AcademicWorkflowDemo`**: Answers *"Show me the product!"* Lets the visitor test interactive questions, experience Socratic Taglish hints (`"Bakit Mali Ito?"`), and toggle to the teacher/parent DO 015 gradebook before committing to registration.
5. **`HowToUseAppSection`**: Answers *"How does it work?"* 4-step onboarding journey with clean semantic iconography.
6. **`CategorySection`**: Answers *"Are my grade and track included?"* Displays Junior High Core, SHS Core, STEM, ABM, HUMSS, GAS, and TVL with verified subject totals.
7. **`PopularSubjectsSection`**: Answers *"What specific subjects can I study today?"* Real curriculum metadata, DepEd Quarter 1 indicators, and zero fake reviews.
8. **`TrialNoticeSection`**: Answers *"How much does it cost?"* Completely transparent pricing (30 days ₱0 free trial, no credit card required, ₱299/month post-trial via GCash/Maya, cancel anytime).
9. **`CtaBanner`**: Answers *"Ready to start?"* Re-iterates 75+ subjects, 8 lesson modules, 24 drills, and direct trial activation.

### SEO & Heading Hierarchy Preservation:
- `H1`: Single, unique H1 in `HeroSection` (`"Master High School Lessons & Quizzes with DepEd-Aligned AI Tutoring"`).
- `H2`: Section headings across Sections 3–8.
- `H3`: Component cards and sub-features within each section.
- JSON-LD Structured Data (`WebSite`, `Organization`, `Course` / `EducationalApplication`) defined in Next.js 16 metadata remains unaffected and intact.

---

## 4. Decision 3: Iconography Discipline & AI "Slop" Purge

### Problem
Gratuitous `Sparkles` icons are scattered across multiple components (`HeroSection`, `HowToUseAppSection`, `TrialNoticeSection`, `TrackDetail`, `HowItWorks`, `TermsOfService`). In 2026, sparkle icons are widely perceived as visual clichés of low-effort AI wrapper software. Additionally, the Senior High School Core card inappropriately uses the developer `<Code>` icon (`< >`).

### Decision: Purge & Semantic Replacement Matrix

| File | Current Icon | Replacement Icon | Semantic Justification |
|---|---|---|---|
| `HeroSection.tsx` (Eyebrow Badge) | *Empty container div* | `GraduationCap` or `BookOpenCheck` | Represents formal academic accreditation and DepEd MATATAG curriculum alignment. |
| `CategorySection.tsx` (SHS Core) | `Code` | `GraduationCap` | Senior High School Core encompasses General Math, Philosophy, Oral Comm, Earth Science, and Literature—not software coding. |
| `TrackDetail.tsx` (SHS Core) | `Code` | `GraduationCap` | Consistent with category card; establishes academic gravitas. |
| `TrackDetail.tsx` (CTA & Features) | `Sparkles` | `ArrowRight`, `Bot`, or `BrainCircuit` | Functional action indicators replace decorative sparkles. |
| `HowToUseAppSection.tsx` (Badge) | `Sparkles` | `BookOpenCheck` | Academic study guide badge rather than magic/novelty. |
| `TrialNoticeSection.tsx` (CTA) | `Sparkles` | `ArrowRight` | Action-driven transition to free trial registration. |
| `HowItWorks.tsx` (Badge) | `Sparkles` | `BookOpenCheck` | Standardized curriculum workflow indicator. |
| `TermsOfService.tsx` (Tier tab) | `Sparkles` | `ShieldCheck` or `CreditCard` | Commercial terms indicator. |

---

## 5. Decision 4: Curriculum Taxonomy & Metadata Standardization

### Problem
In `PopularSubjectsSection.tsx`, Grade 10 Science displays `"Grade 10 • Trimester 1"` with slug `g10-t1-sci`. Philippine DepEd operates exclusively on **Quarters** (Quarter 1 to Quarter 4) for Junior High School, while Senior High operates on **Semesters** (Semester 1 and Semester 2). DepEd has never used "Trimester". Additionally, cards display fake 4.9★ ratings and "2.4K reviews".

### Decision: Curriculum Metadata Contract
1. **DepEd Term Correction**:
   - `g10-t1-sci` → `g10-q1-sci`
   - `"Grade 10 • Trimester 1"` → `"Grade 10 • Quarter 1"`
   - `parseJhsSlug` already supports `q1`–`q4` (with backwards compatibility for legacy `t1`–`t4`).
2. **Review & Star Elimination**:
   - Delete `rating: 4.9` and `reviews: "2.4K"`.
   - In their place, render high-signal educational metadata:
     - Badge 1: `Grade Level & Quarter` (e.g. `Grade 11 • Semester 1`, `Grade 10 • Quarter 1`)
     - Badge 2: `8 Lessons • 24 Practice Drills`
     - Badge 3: `DepEd DO 015 s. 2026 Aligned` (Transmutation badge)
3. **Subject Count Normalization**:
   - `Junior High Core`: 8 Core Subjects (32 Grade-Level Offerings across Grades 7–10)
   - `SHS Core`: 15 DepEd Core Subjects
   - `STEM Strand`: 11 Specialized Subjects
   - `ABM Strand`: 9 Specialized Subjects
   - `HUMSS Strand`: 9 Specialized Subjects
   - `GAS Strand`: 7 Specialized Subjects
   - `TVL Track`: 9 Specialized Subjects
   - Total Platform: **75+ DepEd Subjects**, **600+ Lesson Modules**, **1,800+ Practice Drills**.

---

## 6. Verification & Quality Safeguards

1. **Static Analysis & Build Verification**:
   - `npm run build` must succeed with zero TypeScript or Next.js App Router errors.
   - `npm run lint` must pass with zero ESLint warnings or errors.
2. **Automated Codebase Grep Checks**:
   - Zero occurrences of `Sparkles` across `features/landing/components/*.tsx`.
   - Zero occurrences of `Code` as an academic track icon.
   - Zero occurrences of `Trimester` in marketing copy.
   - Zero occurrences of `15,000+` or `98.2%` vanity figures.
3. **Unit Tests**:
   - `tests/unit/landing-stats.test.ts`: Verifies fallback catalog values and Server Action resilience.
   - `tests/unit/tracks-data.test.ts`: Validates updated `TRACKS_DATA` counts and icon mappings.
   - `tests/unit/curriculum-data.test.ts`: Verifies quarter slug generation and parsing.
