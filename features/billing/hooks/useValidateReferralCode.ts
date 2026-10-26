"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { validateReferralApi } from "../api/checkoutApi";

export function useValidateReferralCode(referralCode: string) {
  const [debouncedCode, setDebouncedCode] = React.useState(referralCode.trim());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(referralCode.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [referralCode]);

  const query = useQuery({
    queryKey: ["validateReferral", debouncedCode],
    queryFn: () => validateReferralApi({ referralCode: debouncedCode }),
    enabled: debouncedCode.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache validation result for 5 minutes
    retry: 1,
  });

  const isChecking = query.isLoading || (referralCode.trim() !== debouncedCode && referralCode.trim().length >= 2);
  const isValid = query.data?.valid === true;
  const affiliate = query.data?.affiliate || null;
  const affiliateName = affiliate?.name || null;
  const affiliateCode = affiliate?.code || null;
  const reason = query.data?.reason || null;

  let errorMessage: string | null = null;
  if (!isChecking && debouncedCode.length >= 2 && !isValid) {
    if (reason === "INVALID_CODE" || reason === "INVALID_REFERRAL_CODE") {
      errorMessage = "Invalid or expired partner referral code.";
    } else if (reason === "TIMEOUT" || reason === "SERVICE_UNAVAILABLE") {
      errorMessage = "Partner validation service temporarily unavailable.";
    } else {
      errorMessage = "Unrecognized referral code.";
    }
  }

  return {
    isChecking,
    isValid,
    affiliate,
    affiliateName,
    affiliateCode,
    errorMessage,
    data: query.data,
  };
}
