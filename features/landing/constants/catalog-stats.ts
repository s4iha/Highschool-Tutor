import type { CatalogBaselineStats } from "../types/landing.types";

/**
 * Authoritative baseline catalog statistics reflecting verified DepEd MATATAG curriculum structures:
 * - 75+ DepEd Subjects (8 JHS Core + 67 SHS Strands across Grades 7–12)
 * - 1,800+ Practice Drills (24 practice drills per subject * 75 subjects)
 * - 600+ Lesson Modules (8 structured lessons per subject * 75 subjects)
 * - 100% DepEd DO 015 s. 2026 MATATAG Aligned (official transmutation scale)
 * - 30-Day Free All-Access Pass (₱0 upfront, no credit card required)
 */
export const CATALOG_BASELINE_STATS: CatalogBaselineStats = {
  totalSubjects: "75+",
  subjectSubtext: "8 JHS Core + 67 SHS Strands",
  practiceDrills: "1,800+",
  drillsSubtext: "24 verified drills per subject",
  lessonModules: "600+",
  modulesSubtext: "8 structured lessons per subject",
  curriculumStandard: "30 Days",
  standardSubtext: "₱0 upfront • Full curriculum access",
  trialTerms: "30-Day Free Pass",
  trialSubtext: "₱0 upfront • No card required",
};

/**
 * Platform trial and pricing policy constants.
 */
export const TRIAL_AND_PRICING_POLICY = {
  trialDays: 30,
  trialPricePhp: 0,
  isCreditCardRequired: false,
  postTrialMonthlyPhp: 299,
  paymentMethods: ["GCash", "Maya", "Card"],
  cancelPolicy: "Cancel anytime with zero fees",
  microcopy: "₱0 upfront • No credit card required • Cancel anytime",
  primaryCtaLabel: "Start 30-Day Free Trial",
  primaryCtaHref: "/login",
} as const;
