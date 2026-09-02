# Landing Page Screenshot Inventory & Specifications

This document outlines the required UI screenshots, dimension requirements, color profiles, and visual placement within the HighSchool Tutor marketing and landing page (`app/page.tsx`).

---

## 1. Hero Showcase Mockup
- **Asset Name**: `hero-platform-preview.png`
- **Recommended Dimensions**: 1920 × 1080 px (16:9 Aspect Ratio)
- **Visual Description**: Split desktop perspective view showcasing the HighSchool Tutor platform in dark/light mode with an open lesson on General Mathematics and the floating Socratic AI tutor drawer active on the right.
- **Key UI Elements**:
  - Top Navigation header with MATATAG badge and logo.
  - Active subject title, lesson progress bar (85% Mastered).
  - Floating AI Tutor Drawer showing multi-dialect explanation in Taglish/English with step-by-step math hints.
- **Placement**: Directly below the main Hero value proposition headline in `app/page.tsx`.

---

## 2. Categorized Subject Catalog Grid
- **Asset Name**: `subject-catalog-categorized.png`
- **Recommended Dimensions**: 1440 × 900 px (16:10 Aspect Ratio)
- **Visual Description**: High-resolution screenshot of the newly structured Subject Catalog showing the two primary category sections (**Junior High School Grades 7–10** and **Senior High School STEM Grades 11–12**) with grade level filter tabs and colorful curriculum cards.
- **Key UI Elements**:
  - Section headers with level icons (School & GraduationCap).
  - Search bar filtering by subject code (e.g. `GENMATH`, `EARTHSCI`).
  - Grade 11 STEM cards showing subject terms, DepEd lesson counts, and "Explore Subject" buttons.
- **Placement**: Under the "Comprehensive DepEd K-12 & MATATAG Curriculum" feature section.

---

## 3. Interactive Quiz Runner & Socratic AI Tutor
- **Asset Name**: `interactive-quiz-socratic-ai.png`
- **Recommended Dimensions**: 1280 × 800 px (16:10 Aspect Ratio)
- **Visual Description**: Quiz Runner in "Study Mode" displaying a multiple-choice question on General Chemistry with the Socratic AI hint card expanding below the choices.
- **Key UI Elements**:
  - Progress indicator (Question 3 of 10).
  - Study Mode badge with amber sparkle icon.
  - Floating Action Button (FAB) in the lower right corner with live AI chat bubble.
  - Multi-language dialect selector showing Filipino and Cebuano translation pills.
- **Placement**: Inside the "Real-Time AI Socratic Learning Engine" feature section.

---

## 4. Free vs. Premium Tier Comparison & Upgrade Modal
- **Asset Name**: `tier-guardrails-upgrade-modal.png`
- **Recommended Dimensions**: 1200 × 800 px (3:2 Aspect Ratio)
- **Visual Description**: Centered view of the glassmorphic Upgrade Modal displaying the Monthly Pass (₱199/mo) and Annual Pass (₱1,499/yr, Save 37%) with feature checkmarks.
- **Key UI Elements**:
  - Crown icon with OKLCH primary accent highlights.
  - GCash / Maya direct payment callout.
  - 3 Free Trial Subjects vs. Unlimited 130+ Subjects comparison checklist.
- **Placement**: Positioned next to the Pricing and Subscription Plans section.

---

## 5. Administrative Dashboard & Analytics Portal
- **Asset Name**: `admin-analytics-dashboard.png`
- **Recommended Dimensions**: 1600 × 1000 px (16:10 Aspect Ratio)
- **Visual Description**: The `/admin` portal displaying Overview KPI stat cards (Total Students: 1,240, Monthly Revenue: ₱284,500, Active Subscriptions: 382) and the live student management table.
- **Key UI Elements**:
  - Live metric stat cards with OKLCH status badges (Success, Warning).
  - Filterable students table with school affiliation and subscription actions.
  - Pricing & Guardrails configuration tab preview.
- **Placement**: Inside the "School Head & Administrative Control Plane" section.

---

## Export Guidelines & Image Assets Directory
- **Destination Directory**: `public/images/screenshots/`
- **Format**: High-DPI PNG or WebP with 2x retina density.
- **Theme Variations**: Capture in both Light Theme and Dark Theme (`next-themes` class `.dark`).
