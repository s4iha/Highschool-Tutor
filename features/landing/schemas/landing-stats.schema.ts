import { z } from "zod";

export const CatalogBaselineStatsSchema = z.object({
  totalSubjects: z.string().min(1),
  subjectSubtext: z.string().min(1),
  practiceDrills: z.string().min(1),
  drillsSubtext: z.string().min(1),
  lessonModules: z.string().min(1),
  modulesSubtext: z.string().min(1),
  curriculumStandard: z.string().min(1),
  standardSubtext: z.string().min(1),
  trialTerms: z.string().min(1),
  trialSubtext: z.string().min(1),
});

export const LiveEngagementMetricsSchema = z.object({
  liveStudents: z.number().int().nonnegative(),
  liveQuizzesTaken: z.number().int().nonnegative(),
});

export const LandingStatsDataSchema = CatalogBaselineStatsSchema.extend({
  liveStudents: z.number().int().nonnegative().optional(),
  liveQuizzesTaken: z.number().int().nonnegative().optional(),
});

export const LandingStatsResponseSchema = z.object({
  success: z.boolean(),
  source: z.enum(["live", "catalog_fallback"]),
  data: LandingStatsDataSchema,
  error: z.string().optional(),
});

export type LandingStatsDataValidated = z.infer<typeof LandingStatsDataSchema>;
export type LandingStatsResponseValidated = z.infer<typeof LandingStatsResponseSchema>;
