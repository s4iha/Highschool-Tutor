import { NextRequest, NextResponse } from "next/server";
import {
  verifyPayMongoSignatureDetailed,
  isHandledPayMongoEvent,
} from "@/lib/paymongo/webhook";
import { fulfillPayMongoCheckoutPayment } from "@/lib/services/paymentFulfillmentService";
import { PayMongoWebhookSchema } from "@/features/billing/schemas/checkoutSchemas";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract raw body text and PayMongo signature header
    const rawBody = await req.text();
    const signatureHeader =
      req.headers.get("paymongo-signature") || req.headers.get("Paymongo-Signature");

    // 2. Check webhook secret availability on server
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[PayMongo Webhook] Missing PAYMONGO_WEBHOOK_SECRET environment variable");
      // Return opaque HTTP 200 to satisfy webhook delivery without disclosing internal configuration
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 3. Cryptographic signature validation with constant-time comparison and 300s replay protection
    const verification = verifyPayMongoSignatureDetailed(rawBody, signatureHeader, webhookSecret);
    if (!verification.isValid) {
      console.warn("[PayMongo Webhook] Invalid signature rejected:", verification.error);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 4. Safe JSON parsing (Never crash on malformed HTTP bodies)
    let jsonPayload: unknown;
    try {
      jsonPayload = JSON.parse(rawBody);
    } catch {
      console.warn("[PayMongo Webhook] Malformed JSON payload received");
      return NextResponse.json(
        { received: true, skipped: true, error: "Malformed JSON payload" },
        { status: 200 }
      );
    }

    // 5. Schema validation against minimal event structure
    const parseResult = PayMongoWebhookSchema.safeParse(jsonPayload);
    if (!parseResult.success) {
      console.warn(
        "[PayMongo Webhook] Payload does not match minimal expected schema:",
        parseResult.error.issues
      );
      return NextResponse.json(
        { received: true, skipped: true, error: "Unrecognized schema" },
        { status: 200 }
      );
    }

    const event = parseResult.data.data;
    const providerEventId = event.id;
    const eventType = event.attributes.type;
    const livemode = event.attributes.livemode;

    // 6. Safely ignore unhandled event types with HTTP 200 (prevents max retries and endpoint deactivation)
    if (!isHandledPayMongoEvent(eventType)) {
      console.log(
        `[PayMongo Webhook] Safely acknowledging and skipping unhandled event type: ${eventType} (${providerEventId})`
      );
      return NextResponse.json(
        { received: true, skipped: true, eventType },
        { status: 200 }
      );
    }

    // 7. Livemode check (if PAYMONGO_LIVEMODE configured)
    if (process.env.PAYMONGO_LIVEMODE !== undefined) {
      const expectedLivemode = process.env.PAYMONGO_LIVEMODE === "true";
      if (livemode !== expectedLivemode) {
        console.log(
          `[PayMongo Webhook] Skipping event with mismatched livemode (received: ${livemode}, expected: ${expectedLivemode})`
        );
        return NextResponse.json(
          { received: true, skipped: true, reason: "Livemode mismatch" },
          { status: 200 }
        );
      }
    }

    // 8. Extract session details and execute idempotent fulfillment
    const sessionData = event.attributes.data as
      | {
          id?: string;
          attributes?: {
            checkout_session_id?: string;
            reference_number?: string;
            payment_id?: string;
            payment_method_used?: string;
            paid_at?: number;
            payments?: Array<{
              id?: string;
              attributes?: {
                source?: { type?: string };
                paid_at?: number;
              };
            }>;
          };
        }
      | undefined;
    const sessionId =
      sessionData?.id ||
      sessionData?.attributes?.checkout_session_id;

    const referenceNumber = sessionData?.attributes?.reference_number;
    const payments = sessionData?.attributes?.payments || [];
    const latestPayment = payments[0];

    const paymentId = latestPayment?.id || sessionData?.attributes?.payment_id;
    const paymentMethod =
      latestPayment?.attributes?.source?.type ||
      sessionData?.attributes?.payment_method_used;
    const paidAtTimestamp =
      latestPayment?.attributes?.paid_at ||
      sessionData?.attributes?.paid_at;

    if (!sessionId) {
      console.warn(`[PayMongo Webhook] Event ${providerEventId} missing checkout session identifier`);
      return NextResponse.json(
        { received: true, skipped: true, reason: "Missing session ID" },
        { status: 200 }
      );
    }

    const result = await fulfillPayMongoCheckoutPayment({
      sessionId,
      paymentId,
      paymentMethod,
      referenceNumber,
      rawWebhookPayload: jsonPayload as Record<string, unknown>,
      paidAtTimestamp,
    });

    return NextResponse.json({
      received: true,
      alreadyFulfilled: result.alreadyFulfilled ?? false,
      transactionId: result.transactionId,
    });
  } catch (error: unknown) {
    console.error("[PayMongo Webhook] Internal processing error:", error);
    // Return opaque HTTP 200 to prevent PayMongo retries while keeping error details strictly in server logs
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
