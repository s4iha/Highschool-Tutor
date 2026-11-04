"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/features/auth/hooks/useUser";
import { useCheckoutSession } from "./useCheckoutSession";
import {
  getReturnIntent,
  clearReturnIntent,
  parseReturnIntentFromUrl,
} from "../utils/returnIntent";

/**
 * Reactive hook that monitors user authentication state and resumes
 * a pending checkout flow saved during an unauthenticated checkout attempt.
 */
export function useCheckoutReturnIntent() {
  const { user, isLoading: isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const hasResumedRef = useRef(false);

  const checkoutMutation = useCheckoutSession({
    autoRedirect: true,
  });

  useEffect(() => {
    // Wait until user query settles or if already resumed
    if (isUserLoading || !user || !user.id || hasResumedRef.current) {
      return;
    }

    // Check sessionStorage first, falling back to URL query parameters
    let intent = getReturnIntent();
    if (!intent && searchParams) {
      intent = parseReturnIntentFromUrl(searchParams);
    }

    if (!intent) {
      return;
    }

    // Mark resumed and immediately clear storage to prevent loops
    hasResumedRef.current = true;
    clearReturnIntent();

    toast.info("Resuming your subscription checkout...", {
      description: `Preparing your ${intent.planId === "ANNUAL" ? "Annual Unlimited" : "Monthly"} Pass checkout.`,
      duration: 3500,
    });

    checkoutMutation.mutate({
      planId: intent.planId,
      referralCode: intent.referralCode || undefined,
    });
  }, [user, isUserLoading, searchParams, checkoutMutation]);

  return {
    isResuming: checkoutMutation.isPending,
  };
}
