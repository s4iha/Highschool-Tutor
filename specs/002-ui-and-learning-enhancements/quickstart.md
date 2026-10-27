# End-to-End Quickstart & Verification Guide: Feature 002

**Feature Branch**: `002-ui-and-learning-enhancements`  
**Date**: 2026-10-26  
**Status**: Ready for Verification  
**Spec Reference**: `specs/002-ui-and-learning-enhancements/spec.md`  

---

## Prerequisites & Test Environment Setup

1. **Start Development Database & Server**:
   ```powershell
   # Ensure local PostgreSQL Docker container is running
   docker ps

   # Run Prisma database migration sync
   npx prisma db push

   # Start Next.js 16 development server
   npm run dev
   ```
2. **Access URL**: Open `http://localhost:3000` in Google Chrome or any evergreen browser.

---

## Verification Protocols for All 9 Areas

---

### Area 1: Subject Cards UI Overhaul & Fluid Responsive Grid

#### Objective
Verify subject cards transition with smooth elevation without vertical movement, render job-card metadata (discipline icon, term pill, academic tags, lesson metrics), and adapt fluidly across screen widths.

#### Step-by-Step Procedure:
1. Navigate to `/curriculum`.
2. Hover mouse over any subject card (e.g., *Pre-Calculus*, *General Chemistry*, *Mathematics 7*):
   - **Expected Result**: Card elevates with a smooth, soft drop shadow (`shadow-md` / `shadow-xl`) and subtle border color shift. The card does **NOT** jump or translate vertically (`translate-y: 0px`).
3. Inspect card content:
   - **Expected Result**:
     - Top-left: Dedicated discipline monogram or subject icon.
     - Top-right: Status or term pill (e.g. `Quarter 1`, `Semester 1`).
     - Middle: Bold subject title with 2-line clamp and structured metadata tags (Grade Level, Track/Strand, DepEd MATATAG).
     - Bottom: Curriculum scope on left (`8 Lessons • DepEd DO 015 Aligned`) and `Explore Subject` action button on right.
4. Open Chrome DevTools (`F12`), toggle Device Toolbar (`Ctrl+Shift+M`), and test breakpoints:
   - Viewport 375px (Mobile): Grid displays **1 column**.
   - Viewport 768px (Tablet): Grid reflows into **2 columns**.
   - Viewport 1280px (Desktop): Grid reflows into **3 columns**.
   - Viewport 1920px (Ultra-Wide): Grid caps smoothly at **4 columns** without horizontal scrolling or distorted card aspect ratios.

---

### Area 2: Consolidated Single-Bar Filter & Integrated Search

#### Objective
Verify filtering controls are unified into a compact, single-row toolbar that reduces vertical screen height by >50%.

#### Step-by-Step Procedure:
1. Navigate to `/curriculum`.
2. Inspect the filter section below the hero header:
   - **Expected Result**: All controls (level toggle, contextual popovers, search) sit in a compact, unified toolbar (`sticky top-16`).
3. Toggle between `Junior High School` and `Senior High School`:
   - **Expected Result**:
     - Selecting `Junior High School` reveals the `Quarter` dropdown select, hiding SHS strands.
     - Selecting `Senior High School` displays `Semester` and `Track/Strand` dropdown selectors.
4. Type in the integrated search bar (e.g., `"chem"` or `"grade 11"`):
   - **Expected Result**: Matching cards filter instantaneously with zero page refresh.
5. Apply non-default filters (e.g. `Senior High` + `STEM`):
   - **Expected Result**: Active filter counter displays (e.g. `Filtered (2 active)`); clicking `Reset Filters` restores all defaults in 1 click.

---

### Area 3: Subject Detail Header Typography & Decluttering

#### Objective
Verify that on `/curriculum/[slug]`, academic metadata is displayed as a subtle typographic eyebrow line, leaving the badge container exclusively for access/trial status.

#### Step-by-Step Procedure:
1. Navigate to any subject page (e.g., `/curriculum/MATH-G7-Q1` or `/curriculum/pre-calculus`).
2. Examine the header section above the subject title:
   - **Expected Result**:
     - Subject code, grade, and term are formatted as a crisp typographic line (`MATH7 • Junior High School • Grade 7 — Quarter 1`).
     - Only **ONE** badge is present in the badge slot: the student's access status badge (e.g. `30-Day Free Trial (23d Left)` or `Subscription Active`).
     - The previous 4-badge clutter row is eliminated.

---

### Area 4: Annual Pass Brand Icon Upgrade

#### Objective
Verify that the Annual Pass card in the checkout modal displays the prestigious `Crown` icon instead of the generic `Sparkles` icon.

#### Step-by-Step Procedure:
1. From any subject page or trial banner, click **Upgrade Plan** to open `CheckoutModal.tsx`.
2. Inspect the **Annual Unlimited** pass card:
   - **Expected Result**: The card header renders a `Crown` icon with gold/primary styling (`text-amber-500 fill-amber-500/20`) alongside the `"Annual Unlimited"` title.
   - The Monthly Pass remains distinct with standard styling.

---

### Area 5: 30-Day Free Trial Hard Gate & 7-Day Expiration Cron

#### Objective
Verify that accounts with expired trials are strictly blocked from lessons, quizzes, and AI tutor, while accounts with 7 days remaining receive an advance reminder email idempotently.

#### Test Commands & Automated Simulation:
```powershell
# 1. Trigger the Trial Reminder Cron Endpoint using curl or pwsh
$CRON_SECRET = "test-cron-secret-2026"
$headers = @{ "Authorization" = "Bearer $CRON_SECRET" }
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/trial-reminders" -Method GET -Headers $headers
```

#### Step-by-Step Procedure:
1. **Hard Gate Verification**:
   - Log in with a student account whose registration date is >30 days ago and has no active subscription.
   - Browse `/curriculum` and `/dashboard`: Catalog and dashboard load normally with visual lock badges.
   - Click "Read Lesson", start a quiz (Study or Exam Mode), or open the AI Tutor Drawer:
     - **Expected Result**: Access is immediately blocked and the `UpgradeModal` appears with the paywall message.
2. **7-Day Expiration Cron Verification**:
   - Create or simulate an account with registration date 23 days ago.
   - Trigger the cron endpoint:
     - **Expected Result**: Cron outputs HTTP 200 with `dispatched: 1`. An email payload is logged (or sent via Resend), and a `ReminderNotice` record is created in PostgreSQL.
   - Re-run the cron endpoint immediately:
     - **Expected Result**: `dispatched: 0`, `alreadyNotified: 1`. Zero duplicate emails are sent.

---

### Area 6: Multilingual Translation Integrity

#### Objective
Verify that switching quiz language translates the question stem and explanation while keeping options A, B, C, D strictly in original English.

#### Step-by-Step Procedure:
1. Navigate to `/curriculum/pre-calculus/quiz/1` in Study Mode.
2. Observe Question 1 with mathematical options (e.g. `A) x^2 + y^2 = 25`, `B) y = 2x + 1`).
3. In the translation selector, choose `Taglish` or `Cebuano`:
   - **Expected Result**:
     - The question stem (scenario) and explanation are translated into natural Philippine dialect phrasing.
     - Options A, B, C, and D remain **100% identical to the original English text and mathematical formulas**.
     - All LaTeX formulas render without parse errors via KaTeX.
4. Switch language back to `English`:
   - **Expected Result**: English stem and explanation are restored immediately.

---

### Area 7: Question-Level Socratic Context in AI Tutor

#### Objective
Verify the AI Tutor focuses guidance specifically on the active question on screen rather than giving broad subject-wide lectures.

#### Step-by-Step Procedure:
1. In Study Mode on Question 3 of any quiz, click **AI Tutor** (or "Give me a hint"):
   - **Expected Result**: The AI Tutor Drawer displays an active anchor badge: `"Anchored to Question #3"`.
2. Click the quick prompt `"Give me a hint"`:
   - **Expected Result**: The AI's response addresses the specific variables, numbers, and concept of Question 3. It asks a guiding diagnostic question without disclosing the answer.
3. Advance to Question 4:
   - **Expected Result**: The AI Tutor drawer anchor updates to `"Anchored to Question #4"`, and subsequent hints shift focus to Question 4.

---

### Area 8: Quiz Auto-Persistence & Resumption ('Continue Quiz')

#### Objective
Verify answers are saved incrementally and an incomplete quiz can be resumed from both the Dashboard and Subject page.

#### Step-by-Step Procedure:
1. Start a 15-question Exam Mode quiz on `/curriculum/general-chemistry-1/quiz/2`.
2. Answer questions 1 through 6. Notice the subtle `"Saved"` indicator.
3. Refresh the page or navigate away to `/dashboard`.
   - **Expected Result**: A prominent resumption card appears at the top of `/dashboard`:
     `"You have an unfinished Exam Quiz in General Chemistry 1: 6 of 15 answered"` with `Resume Quiz` and `Discard` buttons.
4. Navigate to `/curriculum/general-chemistry-1`:
   - **Expected Result**: The same resumption card appears above the lesson list.
5. Click **Resume Quiz**:
   - **Expected Result**: Navigates back into the quiz runner. Questions 1 through 6 have the student's selected answers pre-filled, and the cursor restores to Question 7.
6. Click **Discard**:
   - **Expected Result**: Incomplete session is cleared, resumption banner disappears, and student can start a fresh session.

---

### Area 9: Diagnostic 'Weak Points' by Topic & Targeted Practice

#### Objective
Verify that lesson topics with latest transmuted score < 75% are flagged as Weak Points with sub-topic Key Concept tags and a 1-click practice launch.

#### Step-by-Step Procedure:
1. Complete a quiz for Lesson 3 in any subject with a failing score (e.g. 5/15 correct, raw 33%, transmuted < 75%).
2. Return to that subject's curriculum page (`/curriculum/[slug]`):
   - **Expected Result**: A dedicated **Weak Points / Focus Areas** card appears above the lesson list displaying:
     - Lesson topic title (`Lesson 3: Chemical Reactions`)
     - Latest score (`Score: 60% • Needs Review`)
     - Sub-topic Key Concept tags (`["Balancing Equations", "Stoichiometry", "Conservation of Mass"]`)
     - CTA button: `Practice This Topic`.
3. Click **Practice This Topic**:
   - **Expected Result**: Launches a targeted 10-question Study Mode quiz focused on Lesson 3.
4. Complete the retake with a passing score (≥10/10 correct, transmuted 100% ≥ 75%):
   - **Expected Result**: Upon returning to the subject page, Lesson 3 is **immediately cleared** from Weak Points.
   - When all topics have passing scores, the card displays: `"All caught up! Zero weak points detected in this subject."`

---

## Automated Verification Suite

Run following command to ensure zero compilation, lint, or type check regressions:
```powershell
# TypeScript Typecheck
npx tsc --noEmit

# ESLint Linting Pass
npm run lint

# Test Suite Execution
npm test
```
All commands must exit with code 0.
