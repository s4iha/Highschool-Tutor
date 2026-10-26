import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { retrievePayMongoCheckoutSession } from "@/lib/paymongo/client";
import { fulfillPayMongoCheckoutPayment } from "@/lib/services/paymentFulfillmentService";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "session_id parameter is required" },
        { status: 400 }
      );
    }

    let transaction = await prisma.paymentTransaction.findUnique({
      where: { paymongoSessionId: sessionId },
      include: { subscription: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Payment transaction not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (transaction.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Fallback status reconciliation if still PENDING (e.g. slight webhook latency)
    if (transaction.status === "PENDING") {
      try {
        const remoteSession = await retrievePayMongoCheckoutSession(sessionId);
        const payments = remoteSession?.attributes?.payments || [];
        const latestPayment = payments[0];
        const isPaid =
          remoteSession?.attributes?.status === "paid" ||
          latestPayment?.attributes?.status === "paid";

        if (isPaid) {
          const fulfillment = await fulfillPayMongoCheckoutPayment({
            sessionId,
            paymentId: latestPayment?.id,
            paymentMethod: latestPayment?.attributes?.source?.type,
            referenceNumber: transaction.referenceNumber,
            paidAtTimestamp: latestPayment?.attributes?.paid_at,
          });

          if (fulfillment.success) {
            transaction = await prisma.paymentTransaction.findUnique({
              where: { paymongoSessionId: sessionId },
              include: { subscription: true },
            });
          }
        }
      } catch (gatewayErr) {
        console.warn("PayMongo fallback query error:", gatewayErr);
      }
    }

    const isSubActive = transaction?.subscription?.status === "ACTIVE";

    return NextResponse.json({
      success: true,
      sessionId: transaction?.paymongoSessionId,
      status: transaction?.status,
      referenceNumber: transaction?.referenceNumber,
      plan: transaction?.plan,
      amountPhp: transaction ? transaction.amountCentavos / 100 : 0,
      paidAt: transaction?.paidAt?.toISOString() || null,
      subscriptionActive: isSubActive,
      subscriptionExpiresAt: transaction?.subscription?.expiresAt?.toISOString() || null,
    });
  } catch (error: unknown) {
    console.error("Verify checkout session error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
