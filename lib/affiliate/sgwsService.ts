import {
  DEFAULT_PRODUCT_SLUG,
  SGWS_AFFILIATES_API_URL,
  SGWS_API_TIMEOUT_MS,
} from "./constants";
import {
  SgwsValidationUpstreamSchema,
  type SgwsValidationUpstream,
} from "@/features/billing/schemas/checkoutSchemas";

export interface ValidateReferralResult {
  valid: boolean;
  affiliate: {
    code: string;
    name: string;
    type?: string;
  } | null;
  product?: {
    slug: string;
    name: string;
    priceMinor: number;
  } | null;
  reason: string | null;
}

export async function validateReferralCode(
  referralCode: string,
  productSlug: string = DEFAULT_PRODUCT_SLUG,
  options?: {
    apiUrl?: string;
    timeoutMs?: number;
    fetchFn?: typeof fetch;
  }
): Promise<ValidateReferralResult> {
  const cleanCode = referralCode.trim();
  if (!cleanCode) {
    return {
      valid: false,
      affiliate: null,
      product: null,
      reason: "REFERRAL_CODE_EMPTY",
    };
  }

  const baseUrl = options?.apiUrl || SGWS_AFFILIATES_API_URL;
  const timeoutMs = options?.timeoutMs || SGWS_API_TIMEOUT_MS;
  const customFetch = options?.fetchFn || fetch;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/api/integrations/validate-referral`;
    const response = await customFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        referralCode: cleanCode,
        productSlug: productSlug.trim() || DEFAULT_PRODUCT_SLUG,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        valid: false,
        affiliate: null,
        product: null,
        reason: `HTTP_${response.status}`,
      };
    }

    const json = await response.json();
    const parsed = SgwsValidationUpstreamSchema.safeParse(json);

    if (!parsed.success) {
      // Even if schema format differs slightly, try to extract affiliate if valid is true
      if (json?.valid === true && json?.affiliate?.code) {
        return {
          valid: true,
          affiliate: {
            code: String(json.affiliate.code),
            name: String(json.affiliate.name || json.affiliate.code),
            type: json.affiliate.type ? String(json.affiliate.type) : undefined,
          },
          product: json.product || null,
          reason: null,
        };
      }

      return {
        valid: false,
        affiliate: null,
        product: null,
        reason: json?.reason || "INVALID_RESPONSE_FORMAT",
      };
    }

    const data: SgwsValidationUpstream = parsed.data;
    if (data.valid) {
      return {
        valid: true,
        affiliate: data.affiliate,
        product: data.product || null,
        reason: null,
      };
    }

    return {
      valid: false,
      affiliate: null,
      product: null,
      reason: data.reason || "INVALID_CODE",
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    const isAbortError =
      (error instanceof Error && error.name === "AbortError") ||
      controller.signal.aborted;

    return {
      valid: false,
      affiliate: null,
      product: null,
      reason: isAbortError ? "TIMEOUT" : "SERVICE_UNAVAILABLE",
    };
  }
}
