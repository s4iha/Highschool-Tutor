import crypto from "crypto";
import {
  verifyPayMongoSignature,
  parsePayMongoSignatureHeader,
} from "@/lib/paymongo/webhook";

describe("PayMongo Webhook HMAC-SHA256 Signature Verification Tests", () => {
  const secret = "whsk_test_secret_123456789";
  const rawBody = JSON.stringify({
    data: {
      id: "evt_test_123",
      type: "event",
      attributes: {
        type: "checkout_session.payment.paid",
      },
    },
  });

  function createSignatureHeader(timestamp: number, body: string, webhookSecret: string, isLive = false) {
    const hash = crypto
      .createHmac("sha256", webhookSecret)
      .update(`${timestamp}.${body}`)
      .digest("hex");

    return isLive ? `t=${timestamp},li=${hash}` : `t=${timestamp},te=${hash}`;
  }

  it("should parse header parameters accurately", () => {
    const header = "t=1729340000,te=hash123,li=hash456";
    const parsed = parsePayMongoSignatureHeader(header);

    expect(parsed.timestamp).toBe(1729340000);
    expect(parsed.testHash).toBe("hash123");
    expect(parsed.liveHash).toBe("hash456");
  });

  it("should verify valid test signature within replay tolerance window", () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const header = createSignatureHeader(currentTimestamp, rawBody, secret, false);

    const isValid = verifyPayMongoSignature(rawBody, header, secret);
    expect(isValid).toBe(true);
  });

  it("should verify valid live signature within replay tolerance window", () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const header = createSignatureHeader(currentTimestamp, rawBody, secret, true);

    const isValid = verifyPayMongoSignature(rawBody, header, secret);
    expect(isValid).toBe(true);
  });

  it("should reject signature when payload body is tampered", () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const header = createSignatureHeader(currentTimestamp, rawBody, secret, false);
    const tamperedBody = rawBody + " ";

    const isValid = verifyPayMongoSignature(tamperedBody, header, secret);
    expect(isValid).toBe(false);
  });

  it("should reject signature when timestamp exceeds 300-second replay window", () => {
    // 301 seconds ago
    const expiredTimestamp = Math.floor(Date.now() / 1000) - 305;
    const header = createSignatureHeader(expiredTimestamp, rawBody, secret, false);

    const isValid = verifyPayMongoSignature(rawBody, header, secret);
    expect(isValid).toBe(false);
  });

  it("should reject when secret is missing or empty", () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const header = createSignatureHeader(currentTimestamp, rawBody, secret, false);

    const isValid = verifyPayMongoSignature(rawBody, header, "");
    expect(isValid).toBe(false);
  });
});
