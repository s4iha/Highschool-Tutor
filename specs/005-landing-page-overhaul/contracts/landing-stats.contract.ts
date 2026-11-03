/**
 * Contract: Landing Page Stats Data Provider
 * Feature: 005-landing-page-overhaul
 * Path: features/landing/actions/get-landing-stats.action.ts & features/landing/hooks/use-landing-stats.ts
 */

import { z } from "zod";

/**
 * Zod schema for catalog baseline metrics
 */
export const CatalogBaselineStatsSchema = z.object({
  totalSubjects: z.string(),
  subjectSubtext: z.string(),
  practiceDrills: z.string(),
  drillsSubtext: z.string(),
  lessonModules: z.string(),
  modulesSubtext: z.string(),
  curriculumStandard: z.string(),
  standardSubtext: z.string(),
  trialTerms: z.string(),
  trialSubtext: z.string(),
});

export type CatalogBaselineStats = z.infer<typeof CatalogBaselineStatsSchema>;

/**
 * Zod schema for live platform engagement metrics
 */
export const LiveEngagementMetricsSchema = z.object({
  liveStudents: z.number().int().nonnegative().optional(),
  liveQuizzesTaken: z.number().int().nonnegative().optional(),
});

export type LiveEngagementMetrics = z.infer<typeof LiveEngagementMetricsSchema>;

/**
 * Combined landing stats schema
 */
export const LandingStatsDataSchema = CatalogBaselineStatsSchema.merge(
  LiveEngagementMetricsSchema
);

export type LandingStatsData = z.infer<typeof LandingStatsDataSchema>;

/**
 * Server Action response envelope
 */
export const LandingStatsResponseSchema = z.object({
  success: z.boolean(),
  source: z.enum(["live", "catalog_fallback"]),
  data: LandingStatsDataSchema,
  error: z.string().optional(),
});

export type LandingStatsResponse = z.infer<typeof LandingStatsResponseSchema>;

/**
 * Contract Interface: Server Action
 */
export interface IGetLandingStatsAction {
  (): Promise<LandingStatsResponse>;
}

/**
 * Contract Interface: TanStack Query Hook
 */
export interface IUseLandingStatsQuery {
  (initialData?: LandingStatsData): {
    data: LandingStatsData;
    isLoading: boolean;
    isError: boolean;
    source: "live" | "catalog_fallback";
  };
}
