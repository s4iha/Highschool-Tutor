import {
  ReturnIntent,
  RETURN_INTENT_STORAGE_KEY,
  RETURN_INTENT_TTL_MS,
} from "../types/billingTypes";

/**
 * Persists user's subscription checkout intent prior to authentication redirect.
 */
export function saveReturnIntent(intent: Omit<ReturnIntent, "timestamp"> & { timestamp?: number }): void {
  if (typeof window === "undefined") return;

  const payload: ReturnIntent = {
    planId: intent.planId,
    referralCode: intent.referralCode || null,
    targetSubjectSlug: intent.targetSubjectSlug || null,
    sourceUrl: intent.sourceUrl || (typeof window !== "undefined" ? window.location.pathname : "/"),
    timestamp: intent.timestamp || Date.now(),
  };

  try {
    sessionStorage.setItem(RETURN_INTENT_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("[ReturnIntent] sessionStorage unavailable or exceeded quota:", error);
  }
}

/**
 * Checks if a ReturnIntent has expired beyond the 2-hour TTL.
 */
export function isReturnIntentValid(intent: ReturnIntent | null): boolean {
  if (!intent) return false;
  if (!intent.planId || (intent.planId !== "MONTHLY" && intent.planId !== "ANNUAL")) return false;
  const elapsed = Date.now() - (intent.timestamp || 0);
  return elapsed >= 0 && elapsed <= RETURN_INTENT_TTL_MS;
}

/**
 * Retrieves valid return intent from sessionStorage, returning null if expired or missing.
 */
export function getReturnIntent(): ReturnIntent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(RETURN_INTENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed: ReturnIntent = JSON.parse(raw);
    if (!isReturnIntentValid(parsed)) {
      clearReturnIntent();
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn("[ReturnIntent] Failed to read from sessionStorage:", error);
    return null;
  }
}

/**
 * Clears preserved return intent to guarantee one-time consumption idempotency.
 */
export function clearReturnIntent(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(RETURN_INTENT_STORAGE_KEY);
  } catch (error) {
    console.warn("[ReturnIntent] Failed to clear sessionStorage:", error);
  }
}

/**
 * Fallback parser for URL query parameters (e.g. ?resumeCheckout=1&plan=ANNUAL&ref=AFF10).
 */
export function parseReturnIntentFromUrl(params: URLSearchParams): ReturnIntent | null {
  const shouldResume = params.get("resumeCheckout") === "1" || params.get("plan");
  const plan = params.get("plan");

  if (!shouldResume || (plan !== "MONTHLY" && plan !== "ANNUAL")) {
    return null;
  }

  return {
    planId: plan,
    referralCode: params.get("ref") || params.get("referralCode") || null,
    targetSubjectSlug: params.get("subject") || null,
    timestamp: Date.now(),
    sourceUrl: params.get("source") || "/",
  };
}
