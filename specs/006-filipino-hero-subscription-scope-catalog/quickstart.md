# Quickstart & Verification Guide: Authentic Filipino Hero Imagery, Frictionless Subscription Availment, DepEd MATATAG Scope Pages & Expanded Curriculum Catalog

**Feature**: `006-filipino-hero-subscription-scope-catalog`  
**Date**: 2026-11-03  
**Status**: Completed  
**Author**: Antigravity (Advanced Agentic Coding)

---

## 1. Prerequisites & Environment Setup

Verify working directory and local dependencies:

```bash
# Verify active branch
git status

# Ensure dependencies are installed
npm install
```

---

## 2. Pillar 1 Verification: Authentic Filipino Hero Imagery & 4:5 Framing

### Objective
Ensure the homepage hero section renders an authentic Filipino high school learner in uniform in a dedicated 4:5 portrait ratio without layout distortion.

### Test Steps
1. Start local dev server: `npm run dev`
2. Open `http://localhost:3000` in a desktop browser.
3. Inspect `#hero`:
   - Verify central portrait displays an authentic local Filipino student in a Philippine secondary school uniform (white school polo shirt) studying with textbooks and laptop.
   - Verify container has `aspect-[4/5]` class and does not stretch or warp on viewport resize.
   - Verify image tag has `priority` loading and `alt="Filipino high school student studying DepEd MATATAG curriculum with HighSchool Tutor"`.
   - Verify floating cards (General Mathematics 75%, Socratic AI Taglish tutor, Assessment alert) remain positioned around the student without covering their face.
4. Switch browser devtools to mobile viewport (iPhone SE / 375px & Galaxy S20 / 360px):
   - Confirm hero portrait scales smoothly and floating cards stack gracefully.

---

## 3. Pillar 2 Verification: Frictionless Auth Intercept & Return Intent Resumption

### Objective
Verify that unauthenticated visitors who click checkout are intercepted without 401 error toasts, and upon signing in, are immediately redirected to PayMongo checkout.

### Test Steps (Incognito Mode)
1. Open an incognito browser window (ensure user is not signed in).
2. Navigate to `http://localhost:3000/#pricing` or click the "Upgrade" crown button in the navbar.
3. In `CheckoutModal`, select the **Annual Unlimited Pass** (₱2,499/year).
4. Click **"Proceed to PayMongo Checkout"**.
5. **Expected Intercept Behavior**:
   - **NO** error toast appears (specifically no *"Checkout Initialization Failed: Unauthorized"*).
   - The **Auth Intercept Modal** renders smoothly, stating: *"Sign In or Create an Account to Complete Your Subscription"*.
   - The selected plan is clearly summarized: *"Annual Unlimited Pass • ₱2,499/year • Save ₱1,089"*.
   - Open browser DevTools > Application > Session Storage:
     - Verify key `hst_return_intent` exists with `{ "planId": "ANNUAL", ... }`.
6. Click **"Continue with Google"** or **"Sign In with Email"**:
   - Complete sign-in with test student credentials.
7. **Expected Resumption Behavior**:
   - Upon redirect into the app, Sonner displays: *"Resuming your subscription checkout..."*.
   - The application invokes `/api/v1/billing/checkout/create-session` with the saved `planId: "ANNUAL"`.
   - The browser automatically navigates to PayMongo's secure payment gateway.
   - Verify `sessionStorage` has cleared `hst_return_intent` (no repeat redirect loop).

---

## 4. Pillar 3 Verification: DepEd Scope Pages & SEO Indexing

### Objective
Verify the public subject catalog at `/subjects` and dynamic scope routes at `/subjects/[slug]`, including Schema.org structured data and dynamic sitemap.

### Test Steps
1. Navigate to `http://localhost:3000/subjects`:
   - Verify public catalog renders all DepEd MATATAG subjects.
   - Test filters:
     - Select "Senior High School" > "STEM": verify STEM subjects display (Pre-Calculus, Basic Calculus, Gen Biology, etc.).
     - Select "Arts & Design": verify Arts & Design subjects display (Creative Industries, Developing Filipino Identity).
     - Select "Sports": verify Sports subjects display (Safety & First Aid, Coaching, Movement).
     - Search "General Mathematics": verify instant filtering.
2. Navigate to `http://localhost:3000/subjects/g11-s1-genmath`:
   - Verify official title ("General Mathematics"), code ("GENMATH"), Grade 11, Semester 1.
   - Verify prescribed hours: "80 hours per semester".
   - Verify prerequisites: "None" (or relevant prerequisites for advanced courses like Basic Calculus).
   - Verify course description matches official DepEd text from `docs/resources/shs-subjects.md`.
   - Verify competencies table renders cleanly.
   - Inspect page source / `<head>`:
     - Verify Schema.org `Course` JSON-LD is present.
     - Verify Schema.org `BreadcrumbList` JSON-LD is present (`Home` > `Subjects` > `General Mathematics`).
   - Click CTA **"Practice with Socratic AI Tutor"**: verify it navigates to registration/login with subject intent preserved.
3. Test 404 handling:
   - Navigate to `http://localhost:3000/subjects/non-existent-subject`.
   - Verify clean 404 page renders with a link back to `/subjects`.
4. Check dynamic sitemap:
   - Navigate to `http://localhost:3000/sitemap.xml`.
   - Verify `/subjects` and all canonical `/subjects/[slug]` entries are listed with priority 0.8 and weekly frequency.

---

## 5. Pillar 4 Verification: Arts & Design, Sports & TVL Catalog Expansion

### Objective
Verify that the Arts & Design Track, Sports Track, and expanded TVL specializations are registered, render properly on track pages, and pass automated unit tests.

### Test Steps
1. Navigate to `http://localhost:3000/tracks/arts-design-track`:
   - Verify page renders with `Palette` icon, headline, overview, learning goals, career pathways, and 8-module featured subjects.
2. Navigate to `http://localhost:3000/tracks/sports-track`:
   - Verify page renders with `Trophy` icon, headline, overview, learning goals, career pathways, and 8-module featured subjects.
3. Run automated Jest test suite:
   ```bash
   npx jest tests/unit/tracks-data.test.ts
   ```
   - Verify all 9 tracks pass assertions cleanly.

---

## 6. End-to-End Build & Quality Verification

Execute full TypeScript compilation, linting, and production build:

```bash
# TypeScript strict type checking
npx tsc --noEmit

# ESLint validation
npm run lint

# Automated unit tests
npm test

# Next.js production build (verifies static pre-rendering of /subjects/[slug])
npm run build
```

Expected Outcome: Zero errors, 100% build pass.
