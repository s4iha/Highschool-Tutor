import {
  DIRECT_REFERENCE_PREFIX,
  SGWS_REFERENCE_PREFIX,
  DEFAULT_PRODUCT_SLUG,
} from "./constants";

export interface BuildReferenceNumberParams {
  referralCode?: string | null;
  productSlug?: string;
  timestamp?: number;
}

export interface ParsedReferenceNumber {
  isAffiliate: boolean;
  prefix: string;
  productSlug: string | null;
  referralCode: string | null;
  timestamp: number | null;
  raw: string;
}

/**
 * Builds a standardized, collision-free transaction reference number.
 * - Affiliate purchases: SGWS-{productSlug}-{referralCode}-{timestamp}
 * - Direct purchases: HST-DIRECT-{timestamp}
 */
export function buildReferenceNumber({
  referralCode,
  productSlug = DEFAULT_PRODUCT_SLUG,
  timestamp = Date.now(),
}: BuildReferenceNumberParams = {}): string {
  const cleanCode = referralCode ? referralCode.trim() : "";
  const cleanSlug = productSlug.trim() || DEFAULT_PRODUCT_SLUG;

  if (cleanCode.length > 0) {
    return `${SGWS_REFERENCE_PREFIX}-${cleanSlug}-${cleanCode}-${timestamp}`;
  }

  return `${DIRECT_REFERENCE_PREFIX}-${timestamp}`;
}

/**
 * Decomposes a reference number into constituent marketing and timing metadata.
 */
export function parseReferenceNumber(referenceNumber: string): ParsedReferenceNumber {
  if (!referenceNumber || typeof referenceNumber !== "string") {
    return {
      isAffiliate: false,
      prefix: "",
      productSlug: null,
      referralCode: null,
      timestamp: null,
      raw: referenceNumber,
    };
  }

  // Format: SGWS-{productSlug}-{referralCode}-{timestamp}
  if (referenceNumber.startsWith(`${SGWS_REFERENCE_PREFIX}-`)) {
    const withoutPrefix = referenceNumber.slice(SGWS_REFERENCE_PREFIX.length + 1);
    const lastHyphenIndex = withoutPrefix.lastIndexOf("-");

    if (lastHyphenIndex !== -1) {
      const timestampStr = withoutPrefix.slice(lastHyphenIndex + 1);
      const timestamp = parseInt(timestampStr, 10);
      const middle = withoutPrefix.slice(0, lastHyphenIndex);

      let productSlug = DEFAULT_PRODUCT_SLUG;
      let referralCode = middle;

      if (middle.startsWith(`${DEFAULT_PRODUCT_SLUG}-`)) {
        productSlug = DEFAULT_PRODUCT_SLUG;
        referralCode = middle.slice(DEFAULT_PRODUCT_SLUG.length + 1);
      } else {
        const firstHyphen = middle.indexOf("-");
        if (firstHyphen !== -1) {
          productSlug = middle.slice(0, firstHyphen);
          referralCode = middle.slice(firstHyphen + 1);
        }
      }

      return {
        isAffiliate: true,
        prefix: SGWS_REFERENCE_PREFIX,
        productSlug,
        referralCode: referralCode || null,
        timestamp: isNaN(timestamp) ? null : timestamp,
        raw: referenceNumber,
      };
    }
  }

  // Format: HST-DIRECT-{timestamp}
  if (referenceNumber.startsWith(`${DIRECT_REFERENCE_PREFIX}-`)) {
    const timestampStr = referenceNumber.slice(DIRECT_REFERENCE_PREFIX.length + 1);
    const timestamp = parseInt(timestampStr, 10);

    return {
      isAffiliate: false,
      prefix: DIRECT_REFERENCE_PREFIX,
      productSlug: null,
      referralCode: null,
      timestamp: isNaN(timestamp) ? null : timestamp,
      raw: referenceNumber,
    };
  }

  return {
    isAffiliate: false,
    prefix: referenceNumber.split("-")[0] || "",
    productSlug: null,
    referralCode: null,
    timestamp: null,
    raw: referenceNumber,
  };
}
