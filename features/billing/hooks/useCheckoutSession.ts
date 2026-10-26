"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckoutSessionApi } from "../api/checkoutApi";
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "../types/billingTypes";

export interface UseCheckoutSessionOptions {
  autoRedirect?: boolean;
  onSuccess?: (data: CreateCheckoutSessionResponse) => void;
  onError?: (error: Error) => void;
}

export function useCheckoutSession(options: UseCheckoutSessionOptions = {}) {
  const { autoRedirect = true, onSuccess, onError } = options;

  return useMutation({
    mutationFn: (payload: CreateCheckoutSessionRequest) =>
      createCheckoutSessionApi(payload),
    onSuccess: (data) => {
      toast.success("Redirecting to PayMongo Secure Checkout...", {
        description: "Please complete your payment using QR Ph, GCash, Maya, or Card.",
        duration: 4000,
      });

      if (onSuccess) {
        onSuccess(data);
      }

      if (autoRedirect && data.checkoutUrl && typeof window !== "undefined") {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error: Error) => {
      console.error("Checkout session initiation failed:", error);
      toast.error("Checkout Initialization Failed", {
        description: error.message || "Unable to reach the payment gateway. Please try again.",
      });

      if (onError) {
        onError(error);
      }
    },
  });
}
