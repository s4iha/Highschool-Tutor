# Task 028 - Landing Page Overhaul & Conversion Optimization

**Skills to be used**: `design-taste-frontend`, `frontend-ui-engineering`, `seo`, `test-driven-development`, `atomic-commit`, `speckit-plan`, `speckit-tasks`

## Description

Overhaul the HighSchool Tutor landing page (`app/page.tsx` and `features/landing/components/`) to eliminate fabricated vanity metrics, correct inaccurate subject counts and icons, remove decorative AI sparkles in favor of clean semantic iconography, and align the page narrative with SaaS best practices from GetSpike and Lovable.

Following the completed `/grill-me` alignment and specification in `specs/005-landing-page-overhaul/spec.md`:
1. Hero Section: Outcome-driven copy, populated eyebrow badge, and primary PLG "Start 30-Day Free Trial" CTA with friction-reducing micro-copy.
2. Stats Bar: Live DB engagement queries with 100% accurate catalog fallbacks (75+ DepEd subjects, 1,800+ practice drills, 600+ lesson modules, 100% DO 015 s. 2026 MATATAG compliance, 30-day free pass).
3. Product Preview: Interactive `AcademicWorkflowDemo` moved above the signup/pricing wall (Section 4).
4. Categories & Strands: SHS Core icon corrected from `<Code>` to `GraduationCap` / `BookOpenCheck`, track badge counts aligned with actual catalog counts.
5. Iconography Discipline: Complete purge of `Sparkles` icon from landing page components in favor of standard semantic UI icons.
6. Popular Subjects: Removal of fake reviews and star ratings in favor of verified curriculum metadata; legacy "Trimester" updated to DepEd "Quarter".
7. Trial & Pricing: Scannable 30-day free trial (₱0, no card required) with ₱299/month subscription details.

## Verification Checklist

- [x] Hero section features specific outcome-driven headline, populated eyebrow badge, and primary PLG "Start 30-Day Free Trial" CTA
- [x] Stats bar replaces fabricated numbers with dynamic DB queries and 100% accurate fallback catalog metrics (75+ subjects, 1,800+ drills, 600+ lessons, DO 015 s. 2026)
- [x] Section re-sequencing on `app/page.tsx` places `AcademicWorkflowDemo` at Section 4 before the signup and pricing sections
- [x] SHS Core icon changed from `<Code>` to academic icon, and all track card counts strictly match DepEd catalog definitions
- [x] `Sparkles` icon completely removed from landing page components in favor of clean semantic Lucide icons
- [x] Popular subjects section replaces fake ratings/reviews with genuine curriculum metadata, and replaces legacy "Trimester" with "Quarter"
- [x] `npm run build` and unit tests pass cleanly without errors
