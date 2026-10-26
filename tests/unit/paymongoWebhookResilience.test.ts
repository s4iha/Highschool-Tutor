import { POST } from "@/app/api/v1/webhooks/paymongo/route";
import { NextRequest } from "next/server";
import crypto from "crypto";

// Mock payment fulfillment service
jest.mock("@/lib/services/paymentFulfillmentService", () => ({
  fulfillPayMongoCheckoutPayment: jest.fn(),
}));

import { fulfillPayMongoCheckoutPayment } from "@/lib/services/paymentFulfillmentService";

describe("PayMongo Webhook Resilience & Non-Disabling Acknowledgment Tests", () => {
  const secret = "whsec_test_resilience_secret_98765";
  const originalEnv = process.env.PAYMONGO_WEBHOOK_SECRET;
  const originalLivemode = process.env.PAYMONGO_LIVEMODE;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PAYMONGO_WEBHOOK_SECRET = secret;
    delete process.env.PAYMONGO_LIVEMODE;
  });

  afterAll(() => {
    process.env.PAYMONGO_WEBHOOK_SECRET = originalEnv;
    if (originalLivemode !== undefined) {
      process.env.PAYMONGO_LIVEMODE = originalLivemode;
    } else {
      delete process.env.PAYMONGO_LIVEMODE;
    }
  });

  function createSignedRequest(bodyObj: unknown, customTimestamp?: number, customSecret = secret) {
    const rawBody = typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj);
    const timestamp = customTimestamp || Math.floor(Date.now() / 1000);
    const signaturePayload = `${timestamp}.${rawBody}`;
    const hash = crypto
      .createHmac("sha256", customSecret)
      .update(signaturePayload)
      .digest("hex");

    return new NextRequest("http://localhost:3000/api/v1/webhooks/paymongo", {
      method: "POST",
      headers: {
        "paymongo-signature": `t=${timestamp},te=${hash}`,
        "content-type": "application/json",
      },
      body: rawBody,
    });
  }

  it("should return HTTP 200 and fulfill payment for valid checkout session", async () => {
    (fulfillPayMongoCheckoutPayment as jest.Mock).mockResolvedValue({
      success: true,
      alreadyFulfilled: false,
      transactionId: "tx_123",
    });

    const payload = {
      data: {
        id: "evt_valid_payment_01",
        type: "event",
        attributes: {
          type: "checkout_session.payment.paid",
          livemode: false,
          data: {
            id: "cs_valid_123",
            type: "checkout_session",
            attributes: {
              reference_number: "SGWS-highschool-tutor-CODE-1729000000",
              payments: [{ id: "pay_123", attributes: { source: { type: "gcash" } } }],
            },
          },
        },
      },
    };

    const req = createSignedRequest(payload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(json.alreadyFulfilled).toBe(false);
    expect(json.transactionId).toBe("tx_123");
    expect(fulfillPayMongoCheckoutPayment).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: "cs_valid_123" })
    );
  });

  it("should return HTTP 200 for missing PAYMONGO_WEBHOOK_SECRET to prevent PayMongo disabling endpoint", async () => {
    delete process.env.PAYMONGO_WEBHOOK_SECRET;

    const payload = { data: { id: "evt_123" } };
    const req = new NextRequest("http://localhost:3000/api/v1/webhooks/paymongo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    // Crucial: Must NEVER leak internal configuration details in public responses
    expect(json.error).toBeUndefined();
  });

  it("should return HTTP 401 when signature header is present but HMAC does not match", async () => {
    const payload = { data: { id: "evt_123" } };
    const req = new NextRequest("http://localhost:3000/api/v1/webhooks/paymongo", {
      method: "POST",
      headers: {
        "paymongo-signature": "t=1729000000,te=invalid_hash_value",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBeDefined();
  });

  it("should return HTTP 200 and skip malformed JSON payloads gracefully", async () => {
    const malformedBody = "{\"data\": { invalid json";
    const req = createSignedRequest(malformedBody);

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(json.skipped).toBe(true);
    expect(json.error).toBe("Malformed JSON payload");
  });

  it("should return HTTP 200 and safely skip unhandled event types without error", async () => {
    const unhandledPayload = {
      data: {
        id: "evt_unhandled_01",
        type: "event",
        attributes: {
          type: "payment.failed",
          livemode: false,
          data: { id: "pay_failed_123" },
        },
      },
    };

    const req = createSignedRequest(unhandledPayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(json.skipped).toBe(true);
    expect(json.eventType).toBe("payment.failed");
    expect(fulfillPayMongoCheckoutPayment).not.toHaveBeenCalled();
  });

  it("should return HTTP 200 and skip mismatched livemode events", async () => {
    process.env.PAYMONGO_LIVEMODE = "true";

    const testModePayload = {
      data: {
        id: "evt_test_01",
        type: "event",
        attributes: {
          type: "checkout_session.payment.paid",
          livemode: false, // Mismatched with PAYMONGO_LIVEMODE="true"
          data: { id: "cs_test_01" },
        },
      },
    };

    const req = createSignedRequest(testModePayload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(json.skipped).toBe(true);
    expect(json.reason).toBe("Livemode mismatch");
    expect(fulfillPayMongoCheckoutPayment).not.toHaveBeenCalled();
  });

  it("should return HTTP 200 idempotently for already fulfilled payment transactions", async () => {
    (fulfillPayMongoCheckoutPayment as jest.Mock).mockResolvedValue({
      success: true,
      alreadyFulfilled: true,
      transactionId: "tx_existing_paid",
    });

    const payload = {
      data: {
        id: "evt_dup_01",
        type: "event",
        attributes: {
          type: "checkout_session.payment.paid",
          livemode: false,
          data: { id: "cs_dup_123" },
        },
      },
    };

    const req = createSignedRequest(payload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(json.alreadyFulfilled).toBe(true);
    expect(json.transactionId).toBe("tx_existing_paid");
  });

  it("should return HTTP 200 when fulfillment throws an unexpected internal error", async () => {
    (fulfillPayMongoCheckoutPayment as jest.Mock).mockRejectedValue(
      new Error("Database connection dropped unexpectedly")
    );

    const payload = {
      data: {
        id: "evt_err_01",
        type: "event",
        attributes: {
          type: "checkout_session.payment.paid",
          livemode: false,
          data: { id: "cs_err_123" },
        },
      },
    };

    const req = createSignedRequest(payload);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    // Crucial: Must NEVER leak internal database or stack trace messages in public responses
    expect(json.message).toBeUndefined();
  });
});
