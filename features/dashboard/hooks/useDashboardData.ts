"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardDataAction, type DashboardRealtimeData } from "../actions/dashboard.actions";

export function useDashboardData(enabled: boolean = true) {
  return useQuery<DashboardRealtimeData | null>({
    queryKey: ["student", "dashboard-data"],
    queryFn: async () => {
      const res = await getDashboardDataAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load dashboard data");
      }
      return res.data;
    },
    enabled,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
