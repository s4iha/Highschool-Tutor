import {
  SGWS_COOKIE_NAME,
  SGWS_COOKIE_MAX_AGE_SECONDS,
} from "./constants";

export interface ReferralCookieOptions {
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
  secure: boolean;
}

export function getReferralCookieOptions(): ReferralCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SGWS_COOKIE_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}

/**
 * Extracts a referral code from a string, URL search parameters, or full URL.
 */
export function extractReferralCode(input?: string | null): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handle full URL or query string
  if (trimmed.includes("?") || trimmed.includes("=")) {
    try {
      const url = trimmed.startsWith("http")
        ? new URL(trimmed)
        : new URL(`https://dummy.ph/${trimmed.startsWith("?") ? trimmed : `?${trimmed}`}`);
      const code = url.searchParams.get("ref") || url.searchParams.get("referral");
      if (code && code.trim().length > 0) {
        return code.trim();
      }
    } catch {
      // Fallback if URL parsing fails
    }
  }

  // Pure referral code string
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Determines whether the stored cookie should be updated.
 * Invariant: Never overwrite an existing valid referral code with an empty value.
 */
export function shouldUpdateReferralCookie(
  existingCode?: string | null,
  incomingCode?: string | null
): boolean {
  const cleanIncoming = extractReferralCode(incomingCode);
  if (!cleanIncoming) {
    return false;
  }

  const cleanExisting = extractReferralCode(existingCode);
  if (!cleanExisting) {
    return true;
  }

  return cleanIncoming !== cleanExisting;
}

/**
 * Reads the referral code in browser context via document.cookie.
 */
export function getClientReferralCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === SGWS_COOKIE_NAME && value) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
