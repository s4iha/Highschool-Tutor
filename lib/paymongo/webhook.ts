import crypto from "crypto";

export interface ParsedSignatureHeader {
  timestamp: number | null;
  testHash: string | null;
  liveHash: string | null;
}

/**
 * Parses the Paymongo-Signature header string (e.g., "t=1729340000,te=hash1,li=hash2").
 */
export function parsePayMongoSignatureHeader(header: string | null): ParsedSignatureHeader {
  if (!header) {
    return { timestamp: null, testHash: null, liveHash: null };
  }

  const result: ParsedSignatureHeader = {
    timestamp: null,
    testHash: null,
    liveHash: null,
  };

  const parts = header.split(",");
  for (const part of parts) {
    const [key, value] = part.split("=").map((s) => s.trim());
    if (key === "t" && value) {
      const parsed = parseInt(value, 10);
      result.timestamp = isNaN(parsed) ? null : parsed;
    } else if (key === "te" && value) {
      result.testHash = value;
    } else if (key === "li" && value) {
      result.liveHash = value;
    }
  }

  return result;
}

/**
 * Timing-safe string comparison to protect against side-channel timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export const HANDLED_PAYMONGO_EVENTS = [
  "checkout_session.payment.paid",
  "payment.paid",
] as const;

export type HandledPayMongoEventType = (typeof HANDLED_PAYMONGO_EVENTS)[number];

export function isHandledPayMongoEvent(eventType: string): boolean {
  return (HANDLED_PAYMONGO_EVENTS as readonly string[]).includes(eventType);
}

export interface WebhookVerificationResult {
  isValid: boolean;
  timestamp?: number;
  error?: string;
}

/**
 * Validates a PayMongo webhook signature header with constant-time comparison and error categorization.
 */
export function verifyPayMongoSignatureDetailed(
  rawBody: string,
  signatureHeader: string | null,
  secret?: string,
  toleranceSeconds: number = 300,
  currentTimestamp?: number
): WebhookVerificationResult {
  if (!signatureHeader || !signatureHeader.trim()) {
    return { isValid: false, error: "Missing Paymongo-Signature header" };
  }

  const webhookSecret = secret || process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!webhookSecret || !webhookSecret.trim()) {
    return { isValid: false, error: "Missing PayMongo webhook secret on server" };
  }

  const { timestamp, testHash, liveHash } = parsePayMongoSignatureHeader(signatureHeader);
  if (!timestamp) {
    return { isValid: false, error: "Missing or invalid timestamp 't' in signature" };
  }

  const expectedSignature = testHash || liveHash;
  if (!expectedSignature) {
    return { isValid: false, timestamp, error: "Missing 'te' or 'li' signature hash in header" };
  }

  const now = currentTimestamp !== undefined ? currentTimestamp : Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    return {
      isValid: false,
      timestamp,
      error: `Timestamp outside acceptable tolerance window (${toleranceSeconds}s)`,
    };
  }

  const signaturePayload = `${timestamp}.${rawBody}`;
  const computedHashHex = crypto
    .createHmac("sha256", webhookSecret)
    .update(signaturePayload)
    .digest("hex");

  const isTestMatch = testHash ? safeCompare(computedHashHex, testHash) : false;
  const isLiveMatch = liveHash ? safeCompare(computedHashHex, liveHash) : false;

  if (!isTestMatch && !isLiveMatch) {
    return { isValid: false, timestamp, error: "Signature mismatch" };
  }

  return { isValid: true, timestamp };
}

/**
 * Verifies the PayMongo webhook signature using HMAC-SHA256 and a 300-second replay window.
 */
export function verifyPayMongoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret?: string,
  toleranceSeconds: number = 300
): boolean {
  return verifyPayMongoSignatureDetailed(
    rawBody,
    signatureHeader,
    secret,
    toleranceSeconds
  ).isValid;
}
