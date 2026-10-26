"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  SGWS_COOKIE_NAME,
  SGWS_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/affiliate/constants";
import {
  extractReferralCode,
  getClientReferralCookie,
  shouldUpdateReferralCookie,
} from "@/lib/affiliate/cookies";

function ReferralTrackerInner() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!searchParams) return;

    const refParam = searchParams.get("ref") || searchParams.get("referral");
    const code = extractReferralCode(refParam);
    if (!code) return;

    const existingCode = getClientReferralCookie();
    if (shouldUpdateReferralCookie(existingCode, code)) {
      const isProd = process.env.NODE_ENV === "production";
      const secureFlag = isProd ? "; Secure" : "";
      document.cookie = `${SGWS_COOKIE_NAME}=${encodeURIComponent(
        code
      )}; max-age=${SGWS_COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax${secureFlag}`;
    }
  }, [searchParams]);

  return null;
}

export function ReferralTracker() {
  return (
    <React.Suspense fallback={null}>
      <ReferralTrackerInner />
    </React.Suspense>
  );
}
