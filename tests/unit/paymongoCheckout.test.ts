import {
  getPayMongoAuthHeader,
  buildPayMongoCheckoutPayload,
  createPayMongoCheckoutSession,
  retrievePayMongoCheckoutSession,
  DEFAULT_PAYMENT_METHOD_TYPES,
} from "@/lib/paymongo/client";

describe("PayMongo Checkout Client Unit & Contract Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, PAYMONGO_SECRET_KEY: "sk_test_mock_secret_key" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("getPayMongoAuthHeader", () => {
    it("should generate a valid Basic auth header with Base64 encoding", () => {
      const header = getPayMongoAuthHeader("sk_test_12345");
      const expected = `Basic ${Buffer.from("sk_test_12345:").toString("base64")}`;
      expect(header).toBe(expected);
    });

    it("should read from process.env.PAYMONGO_SECRET_KEY when not provided", () => {
      const header = getPayMongoAuthHeader();
      const expected = `Basic ${Buffer.from("sk_test_mock_secret_key:").toString("base64")}`;
      expect(header).toBe(expected);
    });

    it("should throw an error if no secret key is configured", () => {
      delete process.env.PAYMONGO_SECRET_KEY;
      expect(() => getPayMongoAuthHeader("")).toThrow("PAYMONGO_SECRET_KEY is not defined");
    });
  });

  describe("buildPayMongoCheckoutPayload", () => {
    it("should round amounts to integer centavos and format line items correctly", () => {
      const payload = buildPayMongoCheckoutPayload({
        lineItems: [
          {
            name: "HighSchool Tutor Monthly Pass",
            amount: 29900,
            currency: "PHP",
            quantity: 1,
            description: "30-day access",
          },
        ],
        referenceNumber: "HST-DIRECT-1729340000",
        successUrl: "http://localhost:3000/dashboard?payment=success",
        cancelUrl: "http://localhost:3000/dashboard?payment=cancelled",
        billing: {
          name: "Maria Santos",
          email: "maria@example.ph",
        },
        metadata: {
          userId: "user_123",
          planId: "MONTHLY",
        },
      });

      const attrs = payload.data.attributes;
      expect(attrs.reference_number).toBe("HST-DIRECT-1729340000");
      expect(attrs.line_items).toHaveLength(1);
      expect(attrs.line_items[0].amount).toBe(29900);
      expect(attrs.line_items[0].name).toBe("HighSchool Tutor Monthly Pass");
      expect(attrs.payment_method_types).toEqual(DEFAULT_PAYMENT_METHOD_TYPES);
      expect(attrs.billing?.name).toBe("Maria Santos");
      expect(attrs.billing?.email).toBe("maria@example.ph");
      expect(attrs.metadata.userId).toBe("user_123");
    });
  });

  describe("createPayMongoCheckoutSession", () => {
    it("should successfully invoke PayMongo endpoint and return parsed checkout URL", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            id: "cs_test_mock_session_id",
            type: "checkout_session",
            attributes: {
              checkout_url: "https://checkout.paymongo.com/cs_test_mock_session_id",
              reference_number: "HST-DIRECT-1729340000",
              status: "active",
            },
          },
        }),
      });

      const result = await createPayMongoCheckoutSession(
        {
          lineItems: [
            {
              name: "Annual Unlimited Pass",
              amount: 249900,
            },
          ],
          referenceNumber: "HST-DIRECT-1729340000",
          successUrl: "http://localhost:3000/dashboard?payment=success",
          cancelUrl: "http://localhost:3000/dashboard?payment=cancelled",
        },
        { secretKey: "sk_test_123", fetchFn: mockFetch as unknown as typeof fetch }
      );

      expect(result.id).toBe("cs_test_mock_session_id");
      expect(result.checkoutUrl).toBe("https://checkout.paymongo.com/cs_test_mock_session_id");
      expect(result.referenceNumber).toBe("HST-DIRECT-1729340000");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw a descriptive error when PayMongo API returns error status", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          errors: [
            {
              code: "parameter_invalid",
              detail: "Amount must be at least 10000 centavos.",
            },
          ],
        }),
      });

      await expect(
        createPayMongoCheckoutSession(
          {
            lineItems: [{ name: "Invalid Item", amount: 50 }],
            referenceNumber: "HST-DIRECT-000",
            successUrl: "http://localhost/success",
            cancelUrl: "http://localhost/cancel",
          },
          { secretKey: "sk_test_123", fetchFn: mockFetch as unknown as typeof fetch }
        )
      ).rejects.toThrow("Amount must be at least 10000 centavos.");
    });
  });

  describe("retrievePayMongoCheckoutSession", () => {
    it("should retrieve session details cleanly", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            id: "cs_123",
            attributes: {
              status: "paid",
              payments: [{ id: "pay_123", attributes: { status: "paid" } }],
            },
          },
        }),
      });

      const result = await retrievePayMongoCheckoutSession("cs_123", {
        secretKey: "sk_test_123",
        fetchFn: mockFetch as unknown as typeof fetch,
      });

      expect(result.id).toBe("cs_123");
      expect(result.attributes.status).toBe("paid");
    });
  });
});
