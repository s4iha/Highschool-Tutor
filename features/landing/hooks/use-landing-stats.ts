"use client";

import { useQuery } from "@tanstack/react-query";
import { getLandingStatsAction } from "../actions/get-landing-stats.action";
import { CATALOG_BASELINE_STATS } from "../constants/catalog-stats";
import type { LandingStatsData } from "../types/landing.types";

/**
 * Hook to retrieve landing page statistics with SSR initialData to ensure CLS = 0.
 */
export function useLandingStatsQuery(initialData?: LandingStatsData) {
  return useQuery({
    queryKey: ["landing", "stats"],
    queryFn: async (): Promise<LandingStatsData> => {
      const res = await getLandingStatsAction();
      if (res.success && res.data) {
        return res.data;
      }
      return CATALOG_BASELINE_STATS;
    },
    initialData: initialData ?? CATALOG_BASELINE_STATS,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
