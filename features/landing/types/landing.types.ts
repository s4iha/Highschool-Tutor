import type React from "react";

/**
 * Authoritative static baseline statistics derived from the verified DepEd MATATAG curriculum.
 */
export interface CatalogBaselineStats {
  readonly totalSubjects: string;       // e.g. "75+"
  readonly subjectSubtext: string;      // e.g. "8 JHS Core + 67 SHS Strands"
  readonly practiceDrills: string;      // e.g. "1,800+"
  readonly drillsSubtext: string;       // e.g. "24 verified drills per subject"
  readonly lessonModules: string;       // e.g. "600+"
  readonly modulesSubtext: string;      // e.g. "8 structured lessons per subject"
  readonly curriculumStandard: string;  // e.g. "100% DepEd DO 015 s. 2026"
  readonly standardSubtext: string;     // e.g. "Official MATATAG Transmutation"
  readonly trialTerms: string;          // e.g. "30-Day Free Pass"
  readonly trialSubtext: string;        // e.g. "₱0 upfront • No card required"
}

/**
 * Live platform engagement metrics dynamically queried from PostgreSQL via Prisma.
 */
export interface LiveEngagementMetrics {
  liveStudents: number;
  liveQuizzesTaken: number;
}

/**
 * Combined landing statistics payload returned by Server Action and TanStack Query.
 */
export interface LandingStatsData extends CatalogBaselineStats {
  liveStudents?: number;
  liveQuizzesTaken?: number;
}

/**
 * Standard Server Action response wrapping landing statistics.
 */
export interface LandingStatsResponse {
  success: boolean;
  source: "live" | "catalog_fallback";
  data: LandingStatsData;
  error?: string;
}

/**
 * Presentation model for individual stat cards in StatsBar.tsx.
 */
export interface LandingStatCardItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  sub: string;
  color: string;
}

/**
 * Track category definition for CategorySection and TrackDetail.
 */
export interface TrackCategoryDefinition {
  id: number;
  slug:
    | "junior-high-core"
    | "stem-strand"
    | "abm-strand"
    | "humss-strand"
    | "shs-core"
    | "gas-strand"
    | "tvl-track";
  name: string;
  count: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accent: string;
  pill: string;
}

/**
 * Featured popular subject model for PopularSubjectsSection.
 */
export interface FeaturedPopularSubject {
  id: number;
  category: "SHS CORE" | "STEM STRAND" | "JUNIOR HIGH CORE" | "APPLIED ACADEMIC" | "ABM STRAND" | "HUMSS STRAND";
  title: string;
  image: string;
  lessons: string;             // Standardized: "8 Lessons • 24 Practice Drills"
  level: string;               // e.g. "Grade 11 • Semester 1" or "Grade 10 • Quarter 1" (No "Trimester")
  price: string;               // "FREE TRIAL"
  slug: string;                // e.g. "g11-s1-genmath", "g10-q1-sci"
  quarter: string;             // e.g. "Quarter 1", "Semester 1"
  do015Compliant: boolean;     // true
}
