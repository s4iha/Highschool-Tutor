export const SGWS_COOKIE_NAME = "sgws_ref";
export const SGWS_COOKIE_MAX_AGE_DAYS = 30;
export const SGWS_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 2,592,000 seconds
export const DEFAULT_PRODUCT_SLUG = process.env.NEXT_PUBLIC_PRODUCT_SLUG || "highschool-tutor";
export const SGWS_API_TIMEOUT_MS = 2500;
export const SGWS_AFFILIATES_API_URL =
  process.env.SGWS_AFFILIATES_API_URL || "https://sgws-affiliates.sgws.tech";
export const DIRECT_REFERENCE_PREFIX = "HST-DIRECT";
export const SGWS_REFERENCE_PREFIX = "SGWS";
