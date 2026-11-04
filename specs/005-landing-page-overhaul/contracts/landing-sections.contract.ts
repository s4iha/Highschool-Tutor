/**
 * Contract: Landing Page Sections & Scroll Narrative
 * Feature: 005-landing-page-overhaul
 * Path: app/page.tsx & features/landing/components/
 */

import type React from "react";

/**
 * Expected order of sections in app/page.tsx:
 *
 * 1. HeroSection (PLG Primary CTA + DepEd Eyebrow + Microcopy)
 * 2. StatsBar (75+ Subjects, 1,800+ Drills, 600+ Modules, DO 015 s. 2026)
 * 3. AboutSection (Problem/Solution Framing)
 * 4. AcademicWorkflowDemo (Interactive Product Experience BEFORE Signup Wall)
 * 5. HowToUseAppSection (4-Step Onboarding Guide, Semantic Icons)
 * 6. CategorySection (7 Tracks, Corrected Counts, Semantic Icons)
 * 7. PopularSubjectsSection (Curriculum Metadata, Quarter 1, No Fake Stars)
 * 8. TrialNoticeSection (Transparent 30-Day Free Trial, ₱0 Upfront, ₱299/mo)
 * 9. CtaBanner (Final Conversion Action)
 */
export const LANDING_SECTION_ORDER = [
  "HeroSection",
  "StatsBar",
  "AboutSection",
  "AcademicWorkflowDemo",
  "HowToUseAppSection",
  "CategorySection",
  "PopularSubjectsSection",
  "TrialNoticeSection",
  "CtaBanner",
] as const;

export type LandingSectionName = (typeof LANDING_SECTION_ORDER)[number];

/**
 * Hero Section Contract
 */
export interface HeroSectionContract {
  eyebrowText: string;              // Must be non-empty (e.g., "DepEd Order No. 015, s. 2026 Aligned")
  eyebrowIcon: React.ComponentType; // Must be academic (e.g., GraduationCap or BookOpenCheck)
  headline: string;                 // Must pass specificity test for Philippine high schoolers
  primaryCtaLabel: string;          // "Start 30-Day Free Trial"
  primaryCtaHref: string;           // "/login" or registration flow
  microcopy: string;                // "₱0 upfront • No credit card required • Cancel anytime"
  hasSparkles: false;               // Zero sparkle icons allowed
}

/**
 * Stats Bar Section Contract
 */
export interface StatsBarContract {
  metrics: {
    totalSubjects: "75+";
    practiceDrills: "1,800+";
    lessonModules: "600+";
    curriculumCompliance: "100% DepEd DO 015 s. 2026";
  };
  liveMetricsSupported: true;
  layoutShiftZero: true;
}

/**
 * Academic Workflow Demo Contract
 */
export interface AcademicWorkflowDemoContract {
  positionIndex: 3; // Section index 4 (0-based index 3, rendered directly after AboutSection)
  interactiveTabs: ["student", "admin"];
  hasSocraticExplanation: true;
  hasTaglishSupport: true;
  hasDO015Gradebook: true;
  authRequired: false; // Completely accessible without login
}

/**
 * Categories Section Contract
 */
export interface CategorySectionContract {
  tracks: {
    slug: string;
    verifiedCountBadge: string;
    icon: React.ComponentType;
  }[];
  shsCoreIconRetiresCode: true; // Must NOT use <Code> icon
}

/**
 * Popular Subjects Contract
 */
export interface PopularSubjectsContract {
  hasStarRatings: false;        // No 4.9★ or similar fake ratings
  hasReviewCounts: false;       // No "2.4K reviews" or similar
  hasCurriculumMetadata: true;  // Grade level, Quarter (Q1–Q4), 8 Lessons & 24 Practice Drills
  hasLegacyTrimester: false;    // All slugs and terms must use Quarter (e.g. g10-q1-sci)
}

/**
 * Iconography Ban List
 */
export const BANNED_ICON_NAMES = ["Sparkles"] as const;
