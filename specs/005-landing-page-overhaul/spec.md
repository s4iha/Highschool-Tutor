# Feature Specification: Landing Page Overhaul & Conversion Optimization

**Feature Branch**: `005-landing-page-overhaul`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "TASK-028: Landing Page Overhaul & Conversion Optimization based on SaaS landing page best practices (GetSpike & Lovable frameworks) and /grill-me alignment decisions."

## Executive Summary

HighSchool Tutor's public landing page serves as the front door for Philippine high school learners, parents, and educators navigating the Department of Education (DepEd) K-12 MATATAG curriculum. While the platform boasts rigorous Socratic AI tutoring and DepEd Order No. 015, s. 2026 grading compliance, the current landing page suffers from conversion-degrading anti-patterns:
1. **Vanity & Fabricated Social Proof**: Fabricated metrics ("15,000+ Enrolled Students", "98.2% Pass Rate", "130+ DepEd Subjects"), fake star ratings (4.9★, 4.8★), and artificial review counts (2.4K, 1.8K) that erode trust.
2. **Generic Hero Messaging & High-Friction CTAs**: Vague headline messaging lacking Philippine high school outcome specificity, an empty eyebrow badge div, and generic CTAs ("Explore Subjects") missing friction-reducing microcopy.
3. **Flawed Scroll Narrative**: The interactive product demonstration (`AcademicWorkflowDemo`) is positioned near the bottom of the page beneath pricing, violating the fundamental Product-Led Growth (PLG) principle of "Show the product before the signup wall".
4. **Curriculum Taxonomy & Iconography Inaccuracies**: Inappropriate `<Code>` icon for Senior High School Core subjects, inaccurate subject badge counts (e.g. "36+ Core Modules" vs. 15 DepEd Core subjects), and legacy non-DepEd terminology ("Trimester" instead of "Quarter").
5. **AI Visual Clichés ("Slop")**: Gratuitous `Sparkles` icons scattered across sections instead of clean, functional academic iconography.

This specification defines the complete overhaul of the landing page to establish an authentic, high-converting, outcome-driven experience adhering to SaaS landing page best practices (Spike AI and Lovable frameworks) and verified DepEd curriculum realities.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Outcome-Driven Hero Experience & Frictionless Free Trial Conversion (Priority: P1)

A prospective Filipino high school student, parent, or guardian visits the HighSchool Tutor homepage. In the first 5 seconds above the fold, they encounter an outcome-driven value proposition tailored specifically to Philippine high schoolers passing quarterly exams under DepEd Order No. 015, s. 2026. The visitor is presented with a clear Product-Led Growth (PLG) primary Call-to-Action ("Start 30-Day Free Trial") paired with explicit friction-reducing microcopy ("₱0 upfront • No credit card required • Cancel anytime"). The top eyebrow badge prominently displays verified DepEd MATATAG curriculum alignment with an academic icon, and floating preview cards demonstrate authentic student progress, Socratic Taglish tutoring, and upcoming quarterly assessment reminders.

**Why this priority**: The hero section dictates initial impression and bounce rate (50-60% of visitors drop off if the value proposition is unclear within 10 seconds). Leading with an outcome-driven message, zero-friction trial CTA, and explicit risk-reversal microcopy directly unlocks maximum top-of-funnel conversion.

**Independent Test**: Can be tested independently by loading the homepage on desktop and mobile viewports, verifying that the hero headline passes the specificity test, the eyebrow badge is populated with verified educational context, the primary CTA links directly to student onboarding/registration, and friction-reducing microcopy is prominently visible without requiring authentication.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor landing on the homepage above the fold, **When** the hero section renders, **Then** the headline communicates a specific, outcome-driven value proposition for Philippine high schoolers mastering DepEd quarterly exams rather than generic category claims.
2. **Given** a prospective student or parent inspecting the hero section, **When** examining the top eyebrow badge, **Then** it renders an official curriculum verification badge ("DepEd Order No. 015, s. 2026 Aligned" or "Philippine K-12 MATATAG Curriculum Companion") with a clean academic icon (eliminating empty container divs).
3. **Given** a prospective learner ready to begin studying, **When** clicking the primary CTA "Start 30-Day Free Trial", **Then** they are immediately directed to the registration flow without encountering a credit card or upfront payment wall.
4. **Given** a visitor evaluating commitment friction, **When** reviewing the hero CTA area, **Then** the micro-copy explicitly states "₱0 upfront • No credit card required • Cancel anytime" directly adjacent to the primary action button.
5. **Given** a visitor examining the floating interactive hero cards, **When** inspecting visual elements, **Then** all cards display authentic learning data (General Mathematics 75% complete, Socratic AI Taglish assistance, Earth & Life Science quarterly exam in 3 days, DO 015 88% transmuted quarter mastery) without decorative sparkles or placeholder slop.

---

### User Story 2 - Verifiable Social Proof & Authoritative Curriculum Metrics (Priority: P2)

Prospective students and parents scrolling past the hero encounter the Stats Bar. Instead of inflated, fabricated vanity numbers ("15,000+ Enrolled Students", "98.2% Pass Rate", "130+ DepEd Subjects", "12 / 24 Lessons"), the platform presents proof-stacked, mathematically verifiable curriculum metrics combined with live platform engagement queries. Visitors see 100% accurate figures: 75+ DepEd Subjects (8 JHS Core + 67 SHS Strands), 1,800+ Practice Drills (24 per subject), 600+ Lesson Modules (8 per subject), 100% DepEd DO 015 s. 2026 MATATAG Aligned grading, and the 30-Day Free All-Access Pass (₱0 upfront).

**Why this priority**: Fabricated metrics destroy institutional credibility the moment a teacher or discerning parent scrutinizes them. Replacing vanity claims with authoritative curriculum catalog counts and live platform activity establishes authentic trust.

**Independent Test**: Can be verified independently by auditing the StatsBar component, asserting that dynamic queries (e.g., active student accounts, completed quiz attempts) provide live engagement data when available, and strictly fall back to authentic catalog totals (75+ subjects, 1,800+ drills, 600+ modules, 100% DO 015 alignment, 30-day pass) with zero fabricated numbers.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor viewing the Stats Bar, **When** inspecting curriculum scope, **Then** the first metric displays "75+ DepEd Subjects" with descriptive subtext ("8 JHS Core + 67 SHS Strands") rather than fabricated "130+" figures.
2. **Given** a visitor reviewing practice content scope, **When** inspecting drill metrics, **Then** the metric displays "1,800+ Practice Drills" based on 24 standardized practice drills across 75 subjects.
3. **Given** a visitor reviewing structured lesson materials, **When** inspecting lesson metrics, **Then** the metric displays "600+ Lesson Modules" based on 8 standardized lesson modules across 75 subjects.
4. **Given** a visitor reviewing grading compliance, **When** inspecting curriculum standards, **Then** the metric displays "100% DepEd DO 015 s. 2026 Aligned" referencing the official MATATAG transmutation scale.
5. **Given** a visitor reviewing access terms, **When** inspecting the trial metric, **Then** it highlights the "30-Day Free All-Access Pass" with subtext "₱0 upfront • No credit card required".
6. **Given** an active production environment, **When** dynamic platform engagement metrics are queried from the database, **Then** the StatsBar presents live student and quiz session counts seamlessly with zero layout shifting.

---

### User Story 3 - Immediate Product Experience Before the Signup Wall (Priority: P3)

Following the problem-solution framing in `AboutSection` (explaining why Filipino high schoolers struggle with quarterly exams), visitors immediately encounter the interactive `AcademicWorkflowDemo`. Visitors experience the product firsthand before encountering the onboarding guide, subject catalog, or pricing wall. Prospective learners interact with authentic Philippine high school quiz questions (e.g. General Mathematics rational functions, Earth & Life Science), trigger instant Socratic Taglish hints ("Bakit Mali Ito?"), and inspect automated DO 015 s. 2026 transmuted grade calculations without creating an account or paying.

**Why this priority**: NNG and Lovable PLG research confirms that showing the product before the signup wall dramatically reduces time-to-value and accelerates conversion. Experiencing Socratic Taglish tutoring interactively dissolves skepticism before asking for a signup commitment.

**Independent Test**: Can be verified by auditing the root page (`app/page.tsx`) section sequence, confirming that `AcademicWorkflowDemo` is positioned at Section 4 (immediately following `AboutSection` and before `HowToUseAppSection`, `CategorySection`, `PopularSubjectsSection`, and `TrialNoticeSection`), and testing all interactive question choices, hints, and tab switches without authentication.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor scrolling through the landing page, **When** they complete reading the About/Problem-Solution section, **Then** the next section rendered is the interactive `AcademicWorkflowDemo`.
2. **Given** a visitor interacting with the demo quiz, **When** selecting an answer option and submitting, **Then** the interface displays immediate interactive feedback with step-by-step Socratic hints in English and Taglish.
3. **Given** a visitor toggling between demo perspectives, **When** switching from "Student Practice" to "Teacher / Parent Gradebook", **Then** the demo displays authentic DepEd DO 015 s. 2026 transmuted grades (60 to 100 scale) with passing threshold indicators (≥ 75%).
4. **Given** a visitor engaging with the demo on any device, **When** interacting with questions or explanations, **Then** the experience executes client-side with zero latency, zero login prompts, and zero network errors.

---

### User Story 4 - Accurate Academic Track Taxonomy, Semantic Iconography, and DepEd Quarter Standards (Priority: P4)

A student, teacher, or parent navigates through `CategorySection`, `PopularSubjectsSection`, and `TrackDetail`. All track categories, badges, subject counts, and icons strictly conform to the Department of Education K-12 MATATAG catalog. The Senior High School Core category (`shs-core`) displays an academic icon (`GraduationCap` or `BookOpenCheck`) instead of a developer coding icon (`<Code>`). Category counts reflect exact curriculum structures: Junior High Core has 8 Core Subjects (32 Grade-Level Offerings across Grades 7–10), SHS Core has 15 DepEd Core Subjects, STEM has 11 Specialized Subjects, ABM has 9, HUMSS has 9, GAS has 7, and TVL has 9. In `PopularSubjectsSection`, fake star ratings and fabricated review counts are replaced with genuine curriculum metadata (Grade Level, official DepEd Quarter, 8 Lessons & 24 Practice Drills, DO 015 Transmutation badge), and legacy non-DepEd "Trimester" terms are corrected to official "Quarter".

**Why this priority**: Educators, school heads, and DepEd students immediately spot non-standard terminology and incorrect subject totals. Displaying coding icons on core humanities/math subjects or using "Trimester" damages institutional credibility.

**Independent Test**: Can be verified by inspecting `CategorySection.tsx`, `PopularSubjectsSection.tsx`, and `TrackDetail.tsx`, ensuring all subject counts match curriculum definitions, no `<Code>` icon appears on `shs-core`, no star ratings or review counts appear in `PopularSubjectsSection`, and all academic terms adhere to DepEd Quarters.

**Acceptance Scenarios**:

1. **Given** a visitor browsing the category cards in `CategorySection`, **When** viewing the Senior High School Core card, **Then** it renders an academic icon (`GraduationCap` or `BookOpenCheck`) and displays the badge "15 DepEd Core Subjects".
2. **Given** a visitor inspecting all track cards across `CategorySection` and `TrackDetail`, **When** checking badge counts, **Then**:
   - Junior High Core displays "8 Core Subjects (32 Grade-Level Offerings)"
   - SHS Core displays "15 DepEd Core Subjects"
   - STEM Strand displays "11 Specialized Subjects"
   - ABM Strand displays "9 Specialized Subjects"
   - HUMSS Strand displays "9 Specialized Subjects"
   - GAS Strand displays "7 Specialized Subjects"
   - TVL Track displays "9 Specialized Subjects"
3. **Given** a visitor reviewing featured subjects in `PopularSubjectsSection`, **When** inspecting any subject card, **Then**:
   - Star ratings (4.9★, 4.8★) and review numbers (2.4K, 1.8K) are completely absent.
   - Genuine curriculum metadata is displayed: Grade Level, official DepEd Quarter (Q1–Q4), 8 Lessons & 24 Practice Drills, and DepEd DO 015 s. 2026 alignment.
4. **Given** a visitor viewing Grade 10 Science, **When** inspecting academic term labels, **Then** it explicitly displays "Grade 10 • Quarter 1" with slug `g10-q1-sci` instead of legacy "Trimester 1".

---

### User Story 5 - Clean Design Discipline & Transparent Subscription Pricing (Priority: P5)

A visitor scrolling through the complete landing page experiences a calm, premium educational interface completely devoid of AI visual clichés. The `Sparkles` icon is purged from every landing page component (`HeroSection`, `HowToUseAppSection`, `TrialNoticeSection`, `TrackDetail`, `HowItWorks`), replaced with clean, purposeful UI icons (`GraduationCap`, `BookOpen`, `Bot`, `ShieldCheck`, `ArrowRight`, `CheckCircle2`). In the `TrialNoticeSection`, visitors receive 100% transparent pricing and trial conditions: 30 days of full, unrestricted access to all 75+ subjects and modules for ₱0 upfront, no credit card required, followed by an affordable ₱299/month subscription via GCash or Maya with cancel-anytime freedom.

**Why this priority**: Gratuitous sparkle icons signal generic AI wrapper software rather than an authoritative educational tool. High-converting SaaS landing pages pair restrained visual design with complete pricing transparency to build long-term subscriber trust.

**Independent Test**: Can be verified by executing an automated codebase scan confirming zero occurrences of `Sparkles` across `features/landing/components/`, asserting all replacement icons are semantically appropriate, and verifying that all pricing notices consistently state the 30-day ₱0 pass and ₱299/month terms.

**Acceptance Scenarios**:

1. **Given** any rendered landing page component, **When** inspected for decorative icons, **Then** zero instances of the `Sparkles` icon exist.
2. **Given** the onboarding guide in `HowToUseAppSection`, **When** viewing the section badge and step cards, **Then** they utilize clean semantic icons (`GraduationCap`, `BookOpen`, `Bot`, `Award`, `Compass`).
3. **Given** a visitor reviewing the `TrialNoticeSection`, **When** inspecting trial terms, **Then** it clearly specifies 30-day full access to all 75+ subjects, all 600+ lesson modules, and all 1,800+ drills with zero credit card required.
4. **Given** a visitor inspecting post-trial pricing, **When** reading the terms, **Then** it transparently specifies ₱299/month payable via GCash, Maya, or card with immediate cancel-anytime functionality.
5. **Given** the final `CtaBanner` at the foot of the page, **When** rendered, **Then** the copy reflects 75+ DepEd subjects, 8 structured lessons, 24 practice drills, and features primary and secondary CTAs aligning with the PLG trial offer.

---

### Edge Cases

- **Database Cold Start / Connection Offline**: What happens if the database query for live student counts fails or times out during page rendering? The system gracefully falls back to static verified catalog counts (75+ Subjects, 1,800+ Drills, 600+ Modules, 100% DO 015 Aligned) with zero UI breakage, zero layout shifts, and zero console errors.
- **New Deployment with Zero Users**: What happens on a fresh database instance where user and quiz counts are 0? The StatsBar displays verified curriculum catalog figures instead of showing "0 Students" or empty stats.
- **Authenticated Student or Teacher Accessing `/`**: What happens when an authenticated user visits the root page? The server session guard immediately redirects students to `/dashboard` and admins to `/admin`, ensuring only prospective/unauthenticated visitors see the marketing landing page.
- **Mobile Viewport & Thumb-Zone Ergonomics**: How do the updated CTAs and microcopy behave on narrow mobile screens (375px–414px)? Primary CTAs expand to full width (`w-full sm:w-auto`), maintaining minimum 48px touch targets, with microcopy neatly stacked below to prevent line clipping.
- **Slow Network Connection**: How do interactive components (`AcademicWorkflowDemo`) behave on slow 3G mobile connections? All demo questions and Socratic hints are bundled directly in the component, requiring zero async fetches and rendering instantaneously without loading spinners.
- **Theme Switching (Light / Dark Mode)**: How do the updated badges, stats containers, and category cards render across themes? All updated components use HSL color tokens (`bg-card`, `text-card-foreground`, `border-border`, `text-primary`) ensuring high contrast and seamless dark mode transitions.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hero Section MUST display an outcome-driven headline specifically addressing Philippine High School students and parents preparing for DepEd quarterly examinations.
- **FR-002**: Hero Section MUST feature a primary product-led growth (PLG) CTA button labeled "Start 30-Day Free Trial" linking directly to student registration.
- **FR-003**: Primary CTAs in the Hero Section, Trial Section, and CTA Banner MUST display friction-reducing micro-copy ("₱0 upfront • No credit card required • Cancel anytime").
- **FR-004**: Hero Section top eyebrow badge MUST NOT be empty and MUST display verified DepEd curriculum alignment text accompanied by a semantic academic icon (`GraduationCap` or `BookOpenCheck`).
- **FR-005**: Stats Bar MUST present genuine, verified platform and curriculum statistics, eliminating all fabricated vanity figures ("15,000+ Enrolled Students", "98.2% Pass Rate", "130+ DepEd Subjects", "12 / 24 Lessons").
- **FR-006**: Stats Bar MUST support dynamic querying of live platform metrics (active student accounts, completed quiz attempts) with immediate graceful fallback to authoritative catalog definitions: 75+ DepEd Subjects, 1,800+ Practice Drills, 600+ Lesson Modules, and 100% DepEd DO 015 s. 2026 Aligned.
- **FR-007**: Landing page sections in `app/page.tsx` MUST be strictly sequenced to optimize the conversion narrative:
  1. `HeroSection` (Specific outcome, PLG primary CTA, trust signals)
  2. `StatsBar` (Live DB stats + accurate catalog fallbacks)
  3. `AboutSection` / Problem-Solution (Why DepEd students struggle with quarterly exams)
  4. `AcademicWorkflowDemo` (Interactive product preview before signup wall)
  5. `HowToUseAppSection` (4-step onboarding guide with clean semantic icons)
  6. `CategorySection` (7 DepEd tracks with corrected counts & academic icons)
  7. `PopularSubjectsSection` (Featured subjects with genuine curriculum metadata)
  8. `TrialNoticeSection` (Transparent pricing: 30 days free, ₱299/mo, no card required)
  9. `CtaBanner` (Final conversion push)
- **FR-008**: System MUST position the interactive `AcademicWorkflowDemo` before the onboarding steps, subject categories, and pricing wall, allowing visitors to test interactive Socratic hints and DO 015 grading without registering.
- **FR-009**: Category card and track detail headers for Senior High School Core (`shs-core`) MUST use an academic icon (`GraduationCap` or `BookOpenCheck`), retiring the `<Code>` (`< >`) icon.
- **FR-010**: Category cards in `CategorySection` and track detail headers in `TrackDetail` MUST display accurate subject counts:
  - Junior High Core: 8 Core Subjects (32 Grade-Level Offerings across Grades 7–10)
  - SHS Core: 15 DepEd Core Subjects
  - STEM Strand: 11 Specialized Subjects
  - ABM Strand: 9 Specialized Subjects
  - HUMSS Strand: 9 Specialized Subjects
  - GAS Strand: 7 Specialized Subjects
  - TVL Track: 9 Specialized Subjects
- **FR-011**: System MUST completely remove the `Sparkles` icon across all landing page components (`HeroSection`, `HowToUseAppSection`, `TrialNoticeSection`, `TrackDetail`, `HowItWorks`), replacing it with standard semantic UI icons (`GraduationCap`, `BookOpen`, `Bot`, `ShieldCheck`, `ArrowRight`, `CheckCircle2`).
- **FR-012**: `PopularSubjectsSection` MUST NOT display fabricated star ratings (e.g., 4.9★, 4.8★) or fabricated review counts (e.g., 2.4K reviews).
- **FR-013**: `PopularSubjectsSection` cards MUST display genuine curriculum metadata: Grade Level, DepEd Quarter (Q1–Q4), 8 Lessons, 24 Practice Drills, and DepEd DO 015 s. 2026 alignment badge.
- **FR-014**: Popular subject slugs and labels MUST replace any non-DepEd legacy terms (such as "Trimester" and `g10-t1-sci`) with official DepEd terms ("Quarter", `g10-q1-sci`, Quarter 1).
- **FR-015**: `TrialNoticeSection` and related marketing copy MUST state transparent pricing: 30 days free, ₱0 upfront, no credit card required, ₱299/month post-trial with GCash and Maya options, cancel anytime.
- **FR-016**: `CtaBanner` copy MUST be updated to reference 75+ DepEd subjects, 8 structured lessons, 24 practice drills, with primary CTA "Start 30-Day Free Trial".
- **FR-017**: All updated landing page components MUST maintain strict mobile responsiveness, touch target standards (minimum 48px), and zero horizontal overflow across 375px to 1920px viewports.
- **FR-018**: Landing page modifications MUST preserve existing SEO structured data (JSON-LD), OpenGraph metadata, and canonical URL resolution without regression.

---

### Key Entities

- **Landing Page Conversion Hierarchy**: The structured sequence of sections on the root route (`app/page.tsx`), engineered to answer visitor objections in psychological sequence:
  1. *Who is this for & what is the outcome?* -> `HeroSection`
  2. *What is the proof & scale?* -> `StatsBar`
  3. *Why do high schoolers need this?* -> `AboutSection`
  4. *What does the product actually look like?* -> `AcademicWorkflowDemo`
  5. *How does onboarding work?* -> `HowToUseAppSection`
  6. *What subjects are covered?* -> `CategorySection` & `PopularSubjectsSection`
  7. *How much does it cost?* -> `TrialNoticeSection`
  8. *Ready to start?* -> `CtaBanner`
- **Curriculum Catalog Definition**: Authoritative baseline definitions representing the platform's academic scope:
  - Total Subjects: 75+ (8 JHS Core + 67 SHS Strands)
  - Lessons: 8 standardized modules per subject (600+ total)
  - Practice Drills: 24 verified quizzes per subject (1,800+ total)
  - Grading Standard: DepEd Order No. 015, s. 2026 (Transmutation scale 60–100, passing threshold ≥ 75%)
- **Dynamic Platform Stats Query**: Data access abstraction extracting live student registration counts and completed quiz attempts from the database, equipped with fail-safe fallback to authoritative catalog constants.
- **Trial & Pricing Policy**: The transparent commercial model:
  - Trial Period: 30 days all-access pass, ₱0 upfront, no credit card required
  - Post-Trial Subscription: ₱299/month, payable via GCash, Maya, or Card
  - Policy: Cancel anytime, zero commitment
- **Academic Track Presentation Schema**: Configuration mapping each of the 7 academic tracks (`junior-high-core`, `stem-strand`, `abm-strand`, `humss-strand`, `shs-core`, `gas-strand`, `tvl-track`) to its verified badge count, academic icon, theme color tokens, and curriculum description.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% elimination of fabricated vanity numbers (15K students, 98.2% pass rate), fake star ratings, and artificial review counts from all landing page sections.
- **SC-002**: Zero occurrences of `Sparkles` icon across `features/landing/components/` and public marketing routes.
- **SC-003**: 100% accuracy of all 7 academic track badge counts and subject counts matching real DepEd curriculum structures.
- **SC-004**: Interactive product preview (`AcademicWorkflowDemo`) positioned at section 4 in the scroll sequence, rendering before the onboarding guide, subject catalog, and pricing wall.
- **SC-005**: Conversion CTA alignment: Primary CTA copy "Start 30-Day Free Trial" with friction-reducing microcopy ("₱0 upfront • No credit card required • Cancel anytime") present in Hero, Trial, and CTA sections.
- **SC-006**: Clean Next.js production build (`npm run build`) and lint verification (`npm run lint`) with zero TypeScript errors and zero SEO regressions.

---

## Assumptions

- **Target Audience**: Filipino high school learners (Grades 7–12), parents/guardians, and educators seeking authentic alignment with Department of Education standards.
- **Free Trial Architecture**: The free trial is strictly opt-in (no credit card or billing information is collected prior to trial expiration).
- **Curriculum Standard**: Department of Education Order No. 015, s. 2026 (MATATAG) remains the sole active grading and competency policy for Philippine high school education; legacy DepEd Order No. 8, s. 2015 is repealed.
- **Database Fallback Resilience**: If database counts are unavailable or in development environments with zero records, the platform seamlessly displays verified static catalog constants.
- **Scope Boundaries**: Changes are strictly confined to public marketing routes (`app/page.tsx`, `features/landing/components/*`). Authenticated dashboards (`/dashboard/*`), administrative panels (`/admin/*`), PayMongo payment processing, and database schemas are untouched.
