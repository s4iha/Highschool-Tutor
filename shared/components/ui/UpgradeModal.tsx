"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { CheckoutModal } from "@/features/billing/components/CheckoutModal";

/**
 * Global Upgrade & Subscription Modal
 * Replaced legacy manual transfer instructions with automated PayMongo Hosted Checkout.
 */
export function UpgradeModal() {
  const pathname = usePathname();
  const { isOpen, featureName, reason, closeUpgradeModal } =
    useUpgradeModalStore();

  // Automatically close and suppress UpgradeModal if on authentication routes
  React.useEffect(() => {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      if (isOpen) {
        closeUpgradeModal();
      }
    }
  }, [pathname, isOpen, closeUpgradeModal]);

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

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
