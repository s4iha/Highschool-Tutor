import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  VerifySessionResponse,
  ValidateReferralRequest,
  ValidateReferralResponse,
} from "../types/billingTypes";

export async function createCheckoutSessionApi(
  payload: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> {
  const response = await fetch("/api/v1/billing/checkout/create-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to initialize payment checkout session");
  }

  return data;
}

export async function verifyCheckoutSessionApi(
  sessionId: string
): Promise<VerifySessionResponse> {
  const response = await fetch(
    `/api/v1/billing/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to verify session status");
  }

  return data;
}

export async function validateReferralApi(
  payload: ValidateReferralRequest
): Promise<ValidateReferralResponse> {
  const response = await fetch("/api/v1/referrals/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to validate referral code");
  }

  return data;
}
