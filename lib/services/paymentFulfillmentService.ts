import prisma from "@/lib/prisma";
import type { FulfillmentResult } from "@/features/billing/types/billingTypes";

// In-memory mutex to serialize concurrent webhook retries for the same session
const sessionLocks = new Map<string, Promise<FulfillmentResult>>();

export interface FulfillPaymentParams {
  sessionId: string;
  paymentId?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  rawWebhookPayload?: Record<string, unknown> | null;
  paidAtTimestamp?: number; // Unix timestamp in seconds or ms
}

/**
 * Fulfills a PayMongo payment session atomically and idempotently.
 * Applies subscription period stacking when active subscribers upgrade.
 */
export async function fulfillPayMongoCheckoutPayment(
  params: FulfillPaymentParams
): Promise<FulfillmentResult> {
  const { sessionId } = params;
  if (!sessionId) {
    return { success: false, error: "Missing session ID" };
  }

  // Deduplicate simultaneous webhook retries with an in-memory lock
  const existingLock = sessionLocks.get(sessionId);
  if (existingLock) {
    return existingLock;
  }

  const fulfillmentPromise = executeFulfillment(params);
  sessionLocks.set(sessionId, fulfillmentPromise);

  try {
    return await fulfillmentPromise;
  } finally {
    sessionLocks.delete(sessionId);
  }
}

async function executeFulfillment(
  params: FulfillPaymentParams
): Promise<FulfillmentResult> {
  const {
    sessionId,
    paymentId,
    paymentMethod,
    referenceNumber,
    rawWebhookPayload,
    paidAtTimestamp,
  } = params;

  try {
    // 1. Locate the PaymentTransaction by sessionId or referenceNumber
    const transaction = await prisma.paymentTransaction.findFirst({
      where: {
        OR: [
          { paymongoSessionId: sessionId },
          ...(referenceNumber ? [{ referenceNumber }] : []),
        ],
      },
      include: {
        subscription: true,
      },
    });

    if (!transaction) {
      console.warn(`PaymentTransaction not found for session ${sessionId} / ref ${referenceNumber}`);
      return {
        success: false,
        error: `Transaction not found for session: ${sessionId}`,
      };
    }

    // 2. Idempotency Check: if already paid, return early with zero redundant mutations
    if (transaction.status === "PAID") {
      return {
        success: true,
        alreadyFulfilled: true,
        transactionId: transaction.id,
        subscriptionId: transaction.subscriptionId || undefined,
        status: "PAID",
        expiresAt: transaction.subscription?.expiresAt || null,
      };
    }

    const now = new Date();
    const paidAtDate = paidAtTimestamp
      ? new Date(paidAtTimestamp > 1e11 ? paidAtTimestamp : paidAtTimestamp * 1000)
      : now;

    // 3. Subscription Period Stacking Calculation
    // Plan validity duration: Annual = 365 days, Monthly = 30 days
    const durationDays = transaction.plan === "ANNUAL" ? 365 : 30;

    // Check student's current active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: transaction.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const isCurrentActive =
      existingSubscription?.status === "ACTIVE" &&
      existingSubscription?.expiresAt &&
      new Date(existingSubscription.expiresAt) > now;

    const currentExpiresAt = isCurrentActive && existingSubscription?.expiresAt
      ? new Date(existingSubscription.expiresAt)
      : now;

    // Stacking: add durationDays to the existing active expiration date
    const stackedExpiresAt = new Date(
      currentExpiresAt.getTime() + durationDays * 24 * 60 * 60 * 1000
    );

    const subscriptionStartedAt =
      isCurrentActive && existingSubscription?.startedAt
        ? existingSubscription.startedAt
        : paidAtDate;

    const amountPhp = Math.round(transaction.amountCentavos / 100);

    // 4. Atomic Execution inside a PostgreSQL transaction
    const result = await prisma.$transaction(async (tx) => {
      // Upsert student subscription
      let subscription;
      if (existingSubscription) {
        subscription = await tx.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            plan: transaction.plan,
            status: "ACTIVE",
            amountPhp,
            startedAt: subscriptionStartedAt,
            expiresAt: stackedExpiresAt,
            updatedAt: now,
          },
        });
      } else {
        subscription = await tx.subscription.create({
          data: {
            userId: transaction.userId,
            plan: transaction.plan,
            status: "ACTIVE",
            amountPhp,
            startedAt: subscriptionStartedAt,
            expiresAt: stackedExpiresAt,
          },
        });
      }

      // Update PaymentTransaction to PAID
      const updatedTx = await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "PAID",
          subscriptionId: subscription.id,
          paidAt: paidAtDate,
          paymentMethod: paymentMethod || transaction.paymentMethod,
          paymongoPaymentId: paymentId || transaction.paymongoPaymentId,
          rawWebhookPayload: rawWebhookPayload as object || undefined,
          updatedAt: now,
        },
      });

      return {
        transaction: updatedTx,
        subscription,
      };
    });

    return {
      success: true,
      alreadyFulfilled: false,
      transactionId: result.transaction.id,
      subscriptionId: result.subscription.id,
      status: "PAID",
      expiresAt: result.subscription.expiresAt,
    };
  } catch (error: unknown) {
    console.error("Payment fulfillment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fulfillment failed",
    };
  }
}
