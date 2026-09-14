"use client";

import { useQuery } from "@tanstack/react-query";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: "INFO" | "WARNING" | "PROMO" | "MAINTENANCE";
  targetAudience: "ALL" | "PREMIUM" | "TRIAL";
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useAnnouncementsQuery(audience?: "PREMIUM" | "TRIAL") {
  return useQuery<Announcement[]>({
    queryKey: ["announcements", audience ?? "all"],
    queryFn: async () => {
      const url = audience
        ? `/api/v1/announcements?audience=${audience}`
        : "/api/v1/announcements";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const json = await res.json();
      return json.data ?? [];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
