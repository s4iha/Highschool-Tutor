# Contract: Landing Page Accuracy, Hydration & Modal UX Fixes

**Contract ID**: `CTR-003-LANDING-AND-MODAL-FIXES`  
**Feature**: `007-scope-dedup-landing-fixes`  
**Target Modules**:
- `app/layout.tsx`
- `features/billing/components/CheckoutModal.tsx`
- `features/billing/components/AuthInterceptDialog.tsx`
- `features/landing/components/AboutSection.tsx`
- `features/landing/components/HowToUseAppSection.tsx`
- `features/landing/components/AcademicWorkflowDemo.tsx`
- `features/landing/components/CategorySection.tsx`
- `app/tracks/page.tsx`
- `features/landing/components/TrackDetail.tsx`

---

## 1. Functional Scope & Objectives

This contract governs the resolution of:
1. React 19 hydration mismatches in the root HTML layout and checkout dialog.
2. Centering alignment of the CTA button inside the unauthenticated subscription intercept dialog.
3. Removal of unsupported marketing claims regarding parent reporting and automated teacher gradebooks.
4. Transformation of the Interactive Workflow Demo step 3 panel into an authentic Student Mastery & Weak Points dashboard.
5. Removal of decorative track icons across landing category cards, `/tracks`, and `/tracks/[id]`.

---

## 2. Component & Layout Contracts

### 2.1 Root Layout Hydration (`app/layout.tsx`)
- The root `<html lang="en">` tag MUST include `suppressHydrationWarning`.
- Eliminates hydration mismatch warnings triggered by client-side class/style injection from `next-themes` (`ThemeProvider`).

```tsx
<html
  lang="en"
  suppressHydrationWarning
  className={cn(
    "h-full",
    "antialiased",
    geistSans.variable,
    geistMono.variable,
    "font-sans",
    inter.variable,
    sourceSans3Heading.variable
  )}
>
```

---

### 2.2 Client Cookie Synchronization (`features/billing/components/CheckoutModal.tsx`)
- `referralInput` and `showReferralInput` MUST be initialized statically as `""` and `false` during initial render.
- Synchronization with `getClientReferralCookie()` MUST occur exclusively inside a client-side `React.useEffect` hook after mount.
- Eliminates SSR/client DOM divergence when cookies are present.

```tsx
const [referralInput, setReferralInput] = React.useState<string>("");
const [showReferralInput, setShowReferralInput] = React.useState<boolean>(false);

React.useEffect(() => {
  const cookieCode = getClientReferralCookie();
  if (cookieCode) {
    setReferralInput(cookieCode);
    setShowReferralInput(true);
  }
}, []);
```

---

### 2.3 Modal CTA Alignment (`features/billing/components/AuthInterceptDialog.tsx`)
- In the primary action button (`Continue to Sign In / Sign Up`), the `<ArrowRight />` icon MUST NOT have `ml-auto`.
- The leading `<LogIn className="size-4" />`, label `<span>Continue to Sign In / Sign Up</span>`, and trailing `<ArrowRight className="size-4" />` MUST be horizontally grouped and centered together within the button container.

```tsx
<Button
  asChild
  size="lg"
  className="w-full rounded-2xl font-semibold text-sm gap-2 shadow-md hover:shadow-lg justify-center"
  onClick={handleContinueAuth}
>
  <Link href={loginUrl}>
    <LogIn className="size-4 shrink-0" />
    <span>Continue to Sign In / Sign Up</span>
    <ArrowRight className="size-4 shrink-0" />
  </Link>
</Button>
```

---

### 2.4 Marketing Copy Alignment (`AboutSection.tsx` & `HowToUseAppSection.tsx`)
- In `features/landing/components/AboutSection.tsx`:
  - MUST NOT contain `"parent reporting"` or `"automated gradebook"`.
  - Item 4 text MUST be: `"DepEd DO 015 s. 2026 score transmutation engine with per-subject mastery tracking and diagnostic weak-point analysis"`.
- In `features/landing/components/HowToUseAppSection.tsx`:
  - Step 04 highlights MUST NOT contain `"Comprehensive gradebook review across all subjects"`.
  - Highlight 3 text MUST be: `"Real-time DO 015 transmuted scores, subject mastery tracking, and diagnostic weak-point alerts"`.

---

### 2.5 Academic Workflow Demo Mastery Transformation (`AcademicWorkflowDemo.tsx`)
- Step 3 tab MUST be renamed from `"Teacher & DepEd Gradebook"` to `"Student Mastery & Weak Points"`.
- The panel MUST display:
  - Header: `"Student Mastery & Diagnostic Performance Dashboard"`.
  - Subtitle: `"Review your per-lesson DO 015 transmuted scores for {selectedSubject}, identify weak-point competencies, and launch targeted Socratic practice."`.
  - Overall DO 015 score badge for the active subject.
  - Table of per-lesson mastery rows:
    - Lesson Title
    - Prescribed DepEd Competency
    - Completed Practice Drills (e.g. `3 / 3`)
    - DO 015 Transmuted Score (e.g. `94.0%`)
    - Mastery Status Badge (`Mastered`, `Practice Passed`, or `Needs Review`)
    - Last Practiced indicator
  - AI Diagnostic Insight callout card detailing the diagnosed weak-point topics for the active demo subject.
- Preserves dynamic data binding with `activeSubjectData`.

---

### 2.6 Track Decorative Icons Removal (`CategorySection.tsx`, `app/tracks/page.tsx`, `TrackDetail.tsx`)
- Decorative track icon containers MUST be removed:
  - `CategorySection.tsx`: Remove `<IconComponent className="w-6 h-6" />` box. Header displays clean track title and count pill.
  - `app/tracks/page.tsx`: Remove `<Icon className="w-6 h-6" />` container.
  - `TrackDetail.tsx`: Remove `<IconComponent className="size-7" />` hero box.
- Preserves responsive layouts, hover elevation, and navigation links.

---

## 3. Verification & Invariants

- **Console Cleanliness**: Zero React hydration warnings on `/`, `/subjects`, `/tracks`, and open modals.
- **Visual Balance**: Subscription modal CTA is centered on 360px mobile viewports up to desktop.
- **Copy Verification**: Grep for `"parent reporting"`, `"parenting reporting"`, and `"comprehensive gradebook review"` returns 0 matches in `features/landing/`.
- **Test Integrity**: Unit tests `tests/unit/workflow-demo.test.ts` and `tests/unit/popular-and-category.test.ts` pass cleanly.
