import type { SubPlan, PaymentStatus } from "@prisma/client";

export type { SubPlan, PaymentStatus };

export interface CheckoutLineItem {
  name: string;
  amount: number; // In integer centavos
  currency: string;
  quantity: number;
  description?: string;
}

export interface CreateCheckoutSessionRequest {
  planId: "MONTHLY" | "ANNUAL";
  referralCode?: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  checkoutUrl: string;
  sessionId: string;
  referenceNumber: string;
  amountCentavos: number;
  planId: "MONTHLY" | "ANNUAL";
  referralCode?: string | null;
}

export interface VerifySessionResponse {
  success: boolean;
  sessionId: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";
  referenceNumber?: string;
  plan?: SubPlan;
  amountPhp?: number;
  paidAt?: string | null;
  subscriptionActive?: boolean;
  subscriptionExpiresAt?: string | null;
}

export interface ValidateReferralRequest {
  referralCode: string;
  productSlug?: string;
}

export interface SgwsAffiliateData {
  code: string;
  name: string;
  type?: string;
}

export interface SgwsProductData {
  slug: string;
  name: string;
  priceMinor: number;
}

export interface ValidateReferralResponse {
  valid: boolean;
  affiliate: SgwsAffiliateData | null;
  product?: SgwsProductData | null;
  reason: string | null;
}

export interface PayMongoWebhookPayload {
  data: {
    id: string;
    type: string;
    attributes: {
      type: string;
      livemode: boolean;
      data: {
        id: string;
        type: string;
        attributes: {
          reference_number?: string;
          status: string;
          payment_intent?: {
            id: string;
            attributes: {
              status: string;
              payments?: Array<{
                id: string;
                attributes: {
                  status: string;
                  source?: {
                    type: string;
                  };
                  paid_at?: number;
                };
              }>;
            };
          };
          payments?: Array<{
            id: string;
            attributes: {
              status: string;
              source?: {
                type: string;
              };
              paid_at?: number;
            };
          }>;
          line_items?: Array<{
            name: string;
            amount: number;
            currency: string;
            quantity: number;
          }>;
          metadata?: Record<string, string>;
        };
      };
    };
  };
}

export interface FulfillmentResult {
  success: boolean;
  alreadyFulfilled?: boolean;
  transactionId?: string;
  subscriptionId?: string;
  status?: string;
  expiresAt?: Date | null;
  error?: string;
}
