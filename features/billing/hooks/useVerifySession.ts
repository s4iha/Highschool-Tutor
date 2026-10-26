"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { verifyCheckoutSessionApi } from "../api/checkoutApi";

export function useVerifySession(sessionId: string | null) {
  const queryClient = useQueryClient();
  const [pollCount, setPollCount] = React.useState(0);

  const query = useQuery({
    queryKey: ["verifyCheckoutSession", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("No session ID");
      setPollCount((prev) => prev + 1);
      return verifyCheckoutSessionApi(sessionId);
    },
    enabled: Boolean(sessionId),
    refetchInterval: (queryState) => {
      const data = queryState.state.data;
      // Stop polling once paid or failed, or when 5 attempts are exceeded
      if (data?.status === "PAID" || data?.status === "FAILED" || pollCount >= 5) {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
    retry: 2,
  });

  const isPaid = query.data?.status === "PAID";
  const isFailed = query.data?.status === "FAILED";

  // When payment confirmed, immediately invalidate user session state
  React.useEffect(() => {
    if (isPaid) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["studentDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    }
  }, [isPaid, queryClient]);

  return {
    ...query,
    isPaid,
    isFailed,
    isPending: query.data?.status === "PENDING",
    pollCount,
  };
}
