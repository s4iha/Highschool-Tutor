"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicConfig, DEFAULT_PUBLIC_CONFIG } from "../types/config.types";

export function usePublicConfigQuery() {
  return useQuery<PublicConfig>({
    queryKey: ["public", "config"],
    queryFn: async () => {
      const res = await fetch("/api/v1/config");
      if (!res.ok) {
        throw new Error("Failed to fetch public configuration");
      }
      const json = await res.json();
      return json.data ?? DEFAULT_PUBLIC_CONFIG;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: DEFAULT_PUBLIC_CONFIG,
  });
}
