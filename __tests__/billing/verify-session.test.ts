import { NextRequest } from "next/server";
import { GET } from "@/app/api/v1/billing/checkout/verify-session/route";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { retrievePayMongoCheckoutSession } from "@/lib/paymongo/client";
import { fulfillPayMongoCheckoutPayment } from "@/lib/services/paymentFulfillmentService";

jest.mock("@/lib/prisma", () => {
  const p = {
    paymentTransaction: {
      findUnique: jest.fn(),
    },
  };
  return {
    prisma: p,
    default: p,
    __esModule: true,
  };
});

jest.mock("@/features/auth/lib/session", () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock("@/lib/paymongo/client", () => ({
  retrievePayMongoCheckoutSession: jest.fn(),
}));

jest.mock("@/lib/services/paymentFulfillmentService", () => ({
  fulfillPayMongoCheckoutPayment: jest.fn(),
}));

describe("GET /api/v1/billing/checkout/verify-session", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: "user-1",
      role: "STUDENT",
    });
  });

  it("rejects literal {CHECKOUT_SESSION_ID} without ref with 400", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/v1/billing/checkout/verify-session?session_id=%7BCHECKOUT_SESSION_ID%7D"
    );

    const res = await GET(req);
    expect(res.status).toBe(400);
    expect(prisma.paymentTransaction.findUnique).not.toHaveBeenCalled();
  });

  it("resolves transaction by ref and reconciles PAID status via PayMongo API", async () => {
    (prisma.paymentTransaction.findUnique as jest.Mock)
      .mockResolvedValueOnce({
        id: "tx-1",
        userId: "user-1",
        paymongoSessionId: "cs_paymongo_123",
        referenceNumber: "HST-2026-REF1",
        plan: "MONTHLY",
        amountCentavos: 29900,
        status: "PENDING",
        paidAt: null,
        subscription: null,
      })
      .mockResolvedValueOnce({
        id: "tx-1",
        userId: "user-1",
        paymongoSessionId: "cs_paymongo_123",
        referenceNumber: "HST-2026-REF1",
        plan: "MONTHLY",
        amountCentavos: 29900,
        status: "PAID",
        paidAt: new Date("2026-11-24T06:00:00Z"),
        subscription: {
          status: "ACTIVE",
          expiresAt: new Date("2026-12-24T06:00:00Z"),
        },
      });

    (retrievePayMongoCheckoutSession as jest.Mock).mockResolvedValue({
      attributes: {
        status: "paid",
        payments: [
          {
            id: "pay_123",
            attributes: {
              status: "paid",
              source: { type: "gcash" },
              paid_at: 1795500000,
            },
          },
        ],
      },
    });

    (fulfillPayMongoCheckoutPayment as jest.Mock).mockResolvedValue({
      success: true,
    });

    const req = new NextRequest(
      "http://localhost:3000/api/v1/billing/checkout/verify-session?session_id=%7BCHECKOUT_SESSION_ID%7D&ref=HST-2026-REF1"
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.status).toBe("PAID");
    expect(json.subscriptionActive).toBe(true);
    expect(retrievePayMongoCheckoutSession).toHaveBeenCalledWith("cs_paymongo_123");
    expect(fulfillPayMongoCheckoutPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: "cs_paymongo_123",
        referenceNumber: "HST-2026-REF1",
      })
    );
  });
});
