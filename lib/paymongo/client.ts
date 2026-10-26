/**
 * PayMongo v2 Hosted Checkout Sessions Client
 * Official API documentation: https://developers.paymongo.com/reference/create-a-checkout
 */

export interface PayMongoCheckoutParams {
  lineItems: Array<{
    name: string;
    amount: number; // in integer centavos (e.g. 29900 = ₱299.00)
    currency?: string; // defaults to 'PHP'
    quantity?: number; // defaults to 1
    description?: string;
  }>;
  referenceNumber: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
  billing?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, string>;
  paymentMethodTypes?: string[];
}

export interface PayMongoCheckoutResponse {
  id: string; // "cs_..."
  checkoutUrl: string;
  referenceNumber: string;
  status: string;
}

export const DEFAULT_PAYMENT_METHOD_TYPES = [
  "qrph",
  "card",
  "gcash",
  "paymaya",
  "grab_pay",
  "dob",
];

export function getPayMongoAuthHeader(secretKey?: string): string {
  const key = secretKey || process.env.PAYMONGO_SECRET_KEY;
  if (!key) {
    throw new Error("PAYMONGO_SECRET_KEY is not defined in environment variables");
  }
  const encoded = Buffer.from(`${key.trim()}:`).toString("base64");
  return `Basic ${encoded}`;
}

export function buildPayMongoCheckoutPayload(params: PayMongoCheckoutParams) {
  return {
    data: {
      attributes: {
        billing: params.billing
          ? {
              name: params.billing.name || undefined,
              email: params.billing.email || undefined,
              phone: params.billing.phone || undefined,
            }
          : undefined,
        line_items: params.lineItems.map((item) => ({
          name: item.name,
          amount: Math.round(item.amount), // ensure integer centavos
          currency: item.currency || "PHP",
          quantity: item.quantity || 1,
          description: item.description || undefined,
        })),
        payment_method_types: params.paymentMethodTypes || DEFAULT_PAYMENT_METHOD_TYPES,
        reference_number: params.referenceNumber,
        send_email_receipt: true,
        show_description: true,
        show_line_items: true,
        cancel_url: params.cancelUrl,
        success_url: params.successUrl,
        description: params.description || undefined,
        metadata: params.metadata || {},
      },
    },
  };
}

export async function createPayMongoCheckoutSession(
  params: PayMongoCheckoutParams,
  options?: { secretKey?: string; fetchFn?: typeof fetch }
): Promise<PayMongoCheckoutResponse> {
  const customFetch = options?.fetchFn || fetch;
  const authHeader = getPayMongoAuthHeader(options?.secretKey);
  const payload = buildPayMongoCheckoutPayload(params);

  const response = await customFetch("https://api.paymongo.com/v2/checkout_sessions", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorDetail =
      responseData?.errors?.[0]?.detail ||
      responseData?.message ||
      `PayMongo error (${response.status})`;
    throw new Error(`Failed to create PayMongo checkout session: ${errorDetail}`);
  }

  const session = responseData?.data;
  if (!session || !session.id || !session.attributes?.checkout_url) {
    throw new Error("PayMongo API returned invalid checkout session response structure");
  }

  return {
    id: session.id,
    checkoutUrl: session.attributes.checkout_url,
    referenceNumber: session.attributes.reference_number || params.referenceNumber,
    status: session.attributes.status || "active",
  };
}

export async function retrievePayMongoCheckoutSession(
  sessionId: string,
  options?: { secretKey?: string; fetchFn?: typeof fetch }
) {
  const customFetch = options?.fetchFn || fetch;
  const authHeader = getPayMongoAuthHeader(options?.secretKey);

  const response = await customFetch(
    `https://api.paymongo.com/v2/checkout_sessions/${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    const errorDetail =
      responseData?.errors?.[0]?.detail ||
      responseData?.message ||
      `PayMongo error (${response.status})`;
    throw new Error(`Failed to retrieve PayMongo checkout session: ${errorDetail}`);
  }

  return responseData?.data;
}
