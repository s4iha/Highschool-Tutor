# Task 008 - Migrate Landing Navigation, Privacy Policy, Terms of Service, and How It Works Pages

**Skills to be used**: nextjs, react, tailwindcss, typescript, fda-architecture

## Description

Migrate and adapt the landing page components from College Tutor to Highschool Tutor following strict Feature-Driven Architecture (FDA) standards:
1. Rebrand and adapt `PrivacyPolicy.tsx`, `TermsOfService.tsx`, and `HowItWorks.tsx` with Philippine DepEd K-12 MATATAG standards, removing all College Tutor references.
2. Ensure components do not duplicate root `<Navbar />` and `<Footer />` layout wrappers and are cleanly exported in `features/landing/components/index.ts`.
3. Create App Router routes: `app/privacy/page.tsx`, `app/terms/page.tsx`, and `app/how-it-works/page.tsx` with proper SEO metadata.
4. Update `shared/components/layout/Navbar.tsx` and `shared/components/layout/Footer.tsx` to include navigation links to How It Works, Terms, and Privacy, with responsive mobile menu support.
5. Clean up redundant/duplicate component files in `features/landing/components/` to preserve FDA compliance.
6. Verify zero TypeScript errors, build passes, lint passes, and unit tests pass.

## Verification Checklist

- [x] `PrivacyPolicy.tsx` rebranded for DepEd K-12 and exported from `features/landing/components/index.ts`
- [x] `TermsOfService.tsx` rebranded with comprehensive academic integrity & DepEd terms and exported
- [x] `HowItWorks.tsx` rebranded for DepEd K-12 curriculum workflow (Grades 7-12) and exported
- [x] App Router routes created at `/privacy`, `/terms`, `/how-it-works` with proper SEO metadata
- [x] Global `Navbar.tsx` and `Footer.tsx` updated with links and mobile menu navigation
- [x] Build and unit tests pass cleanly without errors (`npm test`, `npm run lint`, `npm run build`)
