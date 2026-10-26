import { validateReferralCode } from "@/lib/affiliate/sgwsService";

describe("SGWS Affiliate Service Unit Tests", () => {
  it("should return valid result when upstream service confirms active affiliate", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        valid: true,
        affiliate: {
          code: "SGWS-A001",
          name: "Teacher Ana Santos",
          type: "educator",
        },
        product: {
          slug: "highschool-tutor",
          name: "HighSchool Tutor Pass",
          priceMinor: 29900,
        },
        reason: null,
      }),
    });

    const result = await validateReferralCode("SGWS-A001", "highschool-tutor", {
      fetchFn: mockFetch as unknown as typeof fetch,
    });

    expect(result.valid).toBe(true);
    expect(result.affiliate?.name).toBe("Teacher Ana Santos");
    expect(result.affiliate?.code).toBe("SGWS-A001");
    expect(result.reason).toBeNull();
  });

  it("should return invalid result when code is not found or expired", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        valid: false,
        affiliate: null,
        product: null,
        reason: "INVALID_REFERRAL_CODE",
      }),
    });

    const result = await validateReferralCode("INVALID123", "highschool-tutor", {
      fetchFn: mockFetch as unknown as typeof fetch,
    });

    expect(result.valid).toBe(false);
    expect(result.affiliate).toBeNull();
    expect(result.reason).toBe("INVALID_REFERRAL_CODE");
  });

  it("should handle service timeout gracefully without throwing exceptions", async () => {
    // Simulate AbortError when timeout occurs
    const mockFetch = jest.fn().mockImplementation(() => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    });

    const result = await validateReferralCode("SGWS-SLOW", "highschool-tutor", {
      fetchFn: mockFetch as unknown as typeof fetch,
      timeoutMs: 10,
    });

    expect(result.valid).toBe(false);
    expect(result.affiliate).toBeNull();
    expect(result.reason).toBe("TIMEOUT");
  });

  it("should handle network failure gracefully with SERVICE_UNAVAILABLE", async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error("Network connection lost"));

    const result = await validateReferralCode("SGWS-DOWN", "highschool-tutor", {
      fetchFn: mockFetch as unknown as typeof fetch,
    });

    expect(result.valid).toBe(false);
    expect(result.affiliate).toBeNull();
    expect(result.reason).toBe("SERVICE_UNAVAILABLE");
  });
});
