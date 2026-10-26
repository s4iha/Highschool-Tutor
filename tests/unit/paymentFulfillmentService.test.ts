import prisma from "@/lib/prisma";
import { fulfillPayMongoCheckoutPayment } from "@/lib/services/paymentFulfillmentService";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    paymentTransaction: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

describe("Payment Fulfillment Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return alreadyFulfilled when transaction is already marked PAID", async () => {
    (prisma.paymentTransaction.findFirst as jest.Mock).mockResolvedValue({
      id: "tx_123",
      userId: "user_123",
      paymongoSessionId: "cs_123",
      status: "PAID",
      amountCentavos: 249900,
      subscriptionId: "sub_123",
      subscription: {
        id: "sub_123",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 1000000),
      },
    });

    const result = await fulfillPayMongoCheckoutPayment({
      sessionId: "cs_123",
      paymentId: "pay_123",
    });

    expect(result.success).toBe(true);
    expect(result.alreadyFulfilled).toBe(true);
    expect(result.status).toBe("PAID");
    expect(prisma.paymentTransaction.update).not.toHaveBeenCalled();
  });

  it("should fulfill pending transaction and stack subscription periods on upgrade", async () => {
    const existingExpiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days remaining
    const existingStartedAt = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

    (prisma.paymentTransaction.findFirst as jest.Mock).mockResolvedValue({
      id: "tx_456",
      userId: "user_456",
      paymongoSessionId: "cs_456",
      referenceNumber: "HST-DIRECT-1729340000",
      plan: "ANNUAL",
      amountCentavos: 249900,
      status: "PENDING",
      paymentMethod: null,
    });

    (prisma.subscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub_existing",
      userId: "user_456",
      plan: "MONTHLY",
      status: "ACTIVE",
      amountPhp: 299,
      startedAt: existingStartedAt,
      expiresAt: existingExpiresAt,
    });

    (prisma.subscription.update as jest.Mock).mockImplementation(({ data }) => ({
      id: "sub_existing",
      ...data,
    }));

    (prisma.paymentTransaction.update as jest.Mock).mockImplementation(({ data }) => ({
      id: "tx_456",
      ...data,
    }));

    const result = await fulfillPayMongoCheckoutPayment({
      sessionId: "cs_456",
      paymentId: "pay_456",
      paymentMethod: "gcash",
    });

    expect(result.success).toBe(true);
    expect(result.alreadyFulfilled).toBe(false);
    expect(result.status).toBe("PAID");

    // Assert stacking: new expiresAt should be existingExpiresAt + 365 days
    const updatedSubCall = (prisma.subscription.update as jest.Mock).mock.calls[0][0];
    const stackedExpiresAt = new Date(updatedSubCall.data.expiresAt).getTime();
    const expectedExpiresAt = existingExpiresAt.getTime() + 365 * 24 * 60 * 60 * 1000;

    expect(Math.abs(stackedExpiresAt - expectedExpiresAt)).toBeLessThan(1000);
    expect(updatedSubCall.data.plan).toBe("ANNUAL");
    expect(updatedSubCall.data.amountPhp).toBe(2499);
  });

  it("should return failure if transaction does not exist", async () => {
    (prisma.paymentTransaction.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await fulfillPayMongoCheckoutPayment({
      sessionId: "cs_nonexistent",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("Transaction not found");
  });
});
