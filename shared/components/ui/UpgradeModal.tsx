"use client";

import * as React from "react";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { CheckoutModal } from "@/features/billing/components/CheckoutModal";

/**
 * Global Upgrade & Subscription Modal
 * Replaced legacy manual transfer instructions with automated PayMongo Hosted Checkout.
 */
export function UpgradeModal() {
  const { isOpen, featureName, reason, closeUpgradeModal } =
    useUpgradeModalStore();

  return (
    <CheckoutModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeUpgradeModal();
        }
      }}
      featureName={featureName}
      reason={reason}
    />
  );
}
