import {
  CatalogBaselineStatsSchema,
  LandingStatsResponseSchema,
} from "@/features/landing/schemas/landing-stats.schema";
import { CATALOG_BASELINE_STATS, TRIAL_AND_PRICING_POLICY } from "@/features/landing/constants/catalog-stats";
import { FEATURED_POPULAR_SUBJECTS } from "@/features/landing/constants/popular-subjects";

describe("Landing Stats Schemas & Catalog Constants Validation", () => {
  describe("CATALOG_BASELINE_STATS & Schema Validation", () => {
    it("should strictly validate CATALOG_BASELINE_STATS against CatalogBaselineStatsSchema", () => {
      const result = CatalogBaselineStatsSchema.safeParse(CATALOG_BASELINE_STATS);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalSubjects).toBe("75+");
        expect(result.data.practiceDrills).toBe("1,800+");
        expect(result.data.lessonModules).toBe("600+");
        expect(result.data.curriculumStandard).toBe("30 Days");
        expect(result.data.standardSubtext).toBe("₱0 upfront • Full curriculum access");
      }
    });

    it("should never contain fabricated vanity metrics", () => {
      const serialized = JSON.stringify(CATALOG_BASELINE_STATS);
      expect(serialized).not.toContain("15,000+");
      expect(serialized).not.toContain("98.2%");
      expect(serialized).not.toContain("130+");
      expect(serialized).not.toContain("12 / 24");
    });

    it("should validate a fallback LandingStatsResponse payload", () => {
      const fallbackPayload = {
        success: true,
        source: "catalog_fallback" as const,
        data: CATALOG_BASELINE_STATS,
      };

      const result = LandingStatsResponseSchema.safeParse(fallbackPayload);
      expect(result.success).toBe(true);
    });

    it("should validate a live LandingStatsResponse payload with engagement metrics", () => {
      const livePayload = {
        success: true,
        source: "live" as const,
        data: {
          ...CATALOG_BASELINE_STATS,
          liveStudents: 42,
          liveQuizzesTaken: 128,
        },
      };

      const result = LandingStatsResponseSchema.safeParse(livePayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data.liveStudents).toBe(42);
        expect(result.data.data.liveQuizzesTaken).toBe(128);
      }
    });

    it("should reject negative student or quiz counts", () => {
      const invalidPayload = {
        success: true,
        source: "live" as const,
        data: {
          ...CATALOG_BASELINE_STATS,
          liveStudents: -5,
          liveQuizzesTaken: -10,
        },
      };

      const result = LandingStatsResponseSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("FEATURED_POPULAR_SUBJECTS Metadata Integrity", () => {
    it("should contain exactly 5 verified DepEd subjects with 8 lessons and 24 practice drills", () => {
      expect(FEATURED_POPULAR_SUBJECTS.length).toBe(5);

      for (const subject of FEATURED_POPULAR_SUBJECTS) {
        expect(subject.lessons).toBe("8 Lessons • 24 Practice Drills");
        expect(subject.do015Compliant).toBe(true);
        expect(subject.level).not.toMatch(/trimester/i);
        expect(subject.slug).not.toMatch(/-t\d-/);
      }
    });

    it("should standardize Grade 10 Science to DepEd Quarter 1 (g10-q1-sci)", () => {
      const g10Sci = FEATURED_POPULAR_SUBJECTS.find((s) => s.id === 4);
      expect(g10Sci).toBeDefined();
      expect(g10Sci?.slug).toBe("g10-q1-sci");
      expect(g10Sci?.level).toBe("Grade 10 • Quarter 1");
      expect(g10Sci?.quarter).toBe("Quarter 1");
    });
  });

  describe("TRIAL_AND_PRICING_POLICY", () => {
    it("should verify 30 days trial, ₱0 upfront, no credit card required, and ₱299 post-trial", () => {
      expect(TRIAL_AND_PRICING_POLICY.trialDays).toBe(30);
      expect(TRIAL_AND_PRICING_POLICY.trialPricePhp).toBe(0);
      expect(TRIAL_AND_PRICING_POLICY.isCreditCardRequired).toBe(false);
      expect(TRIAL_AND_PRICING_POLICY.postTrialMonthlyPhp).toBe(299);
      expect(TRIAL_AND_PRICING_POLICY.microcopy).toContain("₱0 upfront");
      expect(TRIAL_AND_PRICING_POLICY.microcopy).toContain("No credit card required");
    });
  });
});
