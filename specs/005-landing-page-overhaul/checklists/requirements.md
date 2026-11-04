# Specification Quality Checklist: Landing Page Overhaul & Conversion Optimization

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-11-03
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs) in user requirements
- [x] Focused on user value, conversion psychology, and business needs
- [x] Written for non-technical stakeholders (educators, students, parents, founders)
- [x] All mandatory sections completed (User Scenarios, Requirements, Key Entities, Success Criteria, Assumptions)

## Requirement Completeness

- [x] No `[NEEDS CLARIFICATION]` markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable and technology-agnostic
- [x] All acceptance scenarios are defined using Given/When/Then format
- [x] Edge cases are identified (cold start fallback, auth redirects, mobile ergonomics, theme switching)
- [x] Scope is clearly bounded (marketing landing routes only; dashboards, admin, database schema out of scope)
- [x] Dependencies and assumptions identified (opt-in 30-day trial, DepEd DO 015 s. 2026 compliance)

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover all 5 prioritized conversion and curriculum journeys:
  - P1: Outcome-Driven Hero Experience & Frictionless Free Trial Conversion
  - P2: Verifiable Social Proof & Authoritative Curriculum Metrics (StatsBar)
  - P3: Immediate Product Experience Before the Signup Wall (`AcademicWorkflowDemo`)
  - P4: Accurate Academic Track Taxonomy, Semantic Iconography, and DepEd Quarter Standards
  - P5: Clean Design Discipline & Transparent Subscription Pricing
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Alignment Decisions Codified

1. **Stats Bar (`StatsBar.tsx`)**:
   - Fabricated metrics ("15,000+ Enrolled Students", "98.2% Pass Rate", "130+ DepEd Subjects", "12 / 24 Lessons") replaced with dynamic queries combined with 100% accurate curriculum catalog metrics:
     - 75+ DepEd Subjects (8 JHS Core + 67 SHS Strands)
     - 1,800+ Practice Drills (24 practice drills per subject * 75 subjects)
     - 600+ Lesson Modules (8 lessons per subject * 75 subjects)
     - 100% DepEd DO 015 s. 2026 MATATAG Aligned (official transmutation scale)
     - 30-Day Free All-Access Pass (₱0 upfront, no credit card required)

2. **Subject Categories & Track Cards (`CategorySection.tsx` & `TrackDetail.tsx`)**:
   - Retired `<Code>` (< >) icon on SHS Core, replaced with academic icon (`GraduationCap` or `BookOpenCheck`).
   - Retained semantic icons: TVL (`Wrench`), STEM (`FlaskConical`), ABM (`Briefcase`), HUMSS (`Compass`), GAS (`Layers`), Junior High Core (`BookOpenCheck`).
   - Fixed badge counts to strictly match real curriculum definitions:
     - Junior High Core: 8 Core Subjects (32 Grade-Level Offerings across Grades 7-10)
     - SHS Core: 15 DepEd Core Subjects
     - STEM Strand: 11 Specialized Subjects
     - ABM Strand: 9 Specialized Subjects
     - HUMSS Strand: 9 Specialized Subjects
     - GAS Strand: 7 Specialized Subjects
     - TVL Track: 9 Specialized Subjects

3. **Iconography & Sparkles Cleanup**:
   - Complete removal of `Sparkles` icon from all landing page components.
   - Replaced with standard semantic UI icons: `GraduationCap`, `BookOpen`, `Bot`, `ShieldCheck`, `ArrowRight`, `CheckCircle2`.
   - Fixed empty eyebrow badge div in `HeroSection.tsx`.

4. **Popular Subjects Section (`PopularSubjectsSection.tsx`)**:
   - Removed fake star ratings (4.9★, 4.8★) and fabricated review counts (2.4K, 1.8K).
   - Replaced with genuine curriculum metadata: Grade Level & Quarter, 8 Lessons & 24 Practice Drills, DO 015 s. 2026 Transmutation badge.
   - Updated outdated legacy "Trimester" terms (`g10-t1-sci`) to official DepEd "Quarter" (`g10-q1-sci`, Quarter 1).

5. **Landing Page Architecture & Conversion Narrative**:
   - Hero Section: Specific outcome for Philippine High School students/parents, PLG primary CTA "Start 30-Day Free Trial" with friction-reducing micro-copy ("₱0 upfront • No credit card required • Cancel anytime").
   - Re-sequenced landing page sections on `app/page.tsx`:
     1. `HeroSection` (Specific outcome, PLG primary CTA, trust signals)
     2. `StatsBar` (Live DB stats + accurate catalog fallbacks)
     3. `AboutSection` / Problem-Solution (Why DepEd students struggle with quarterly exams)
     4. `AcademicWorkflowDemo` (Surface interactive product preview BEFORE signup wall)
     5. `HowToUseAppSection` (4-step onboarding guide with clean semantic icons)
     6. `CategorySection` & `PopularSubjectsSection` (Corrected counts & academic icons)
     7. `TrialNoticeSection` (Transparent pricing: 30 days free, ₱299/mo, no card required)
     8. `CtaBanner` (Final conversion push)

---

## Validation Status

- **Checklist Passed**: 100% of quality items satisfied.
- **Specification Gate**: Approved for `/speckit-plan`.
