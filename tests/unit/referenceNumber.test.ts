import {
  buildReferenceNumber,
  parseReferenceNumber,
} from "@/lib/affiliate/referenceNumber";

describe("Reference Number Utility Tests", () => {
  const fixedTimestamp = 1729340000000;

  it("should generate standardized affiliate reference numbers", () => {
    const ref = buildReferenceNumber({
      referralCode: "SGWS-A001",
      productSlug: "highschool-tutor",
      timestamp: fixedTimestamp,
    });

    expect(ref).toBe("SGWS-highschool-tutor-SGWS-A001-1729340000000");
  });

  it("should generate standardized direct reference numbers when code is empty or null", () => {
    const refNull = buildReferenceNumber({
      referralCode: null,
      timestamp: fixedTimestamp,
    });
    expect(refNull).toBe("HST-DIRECT-1729340000000");

    const refEmpty = buildReferenceNumber({
      referralCode: "   ",
      timestamp: fixedTimestamp,
    });
    expect(refEmpty).toBe("HST-DIRECT-1729340000000");
  });

  it("should decompose an affiliate reference number into its components", () => {
    const parsed = parseReferenceNumber("SGWS-highschool-tutor-SGWS-A001-1729340000000");

    expect(parsed.isAffiliate).toBe(true);
    expect(parsed.prefix).toBe("SGWS");
    expect(parsed.productSlug).toBe("highschool-tutor");
    expect(parsed.referralCode).toBe("SGWS-A001");
    expect(parsed.timestamp).toBe(1729340000000);
  });

  it("should decompose a direct reference number cleanly", () => {
    const parsed = parseReferenceNumber("HST-DIRECT-1729340000000");

    expect(parsed.isAffiliate).toBe(false);
    expect(parsed.prefix).toBe("HST-DIRECT");
    expect(parsed.productSlug).toBeNull();
    expect(parsed.referralCode).toBeNull();
    expect(parsed.timestamp).toBe(1729340000000);
  });
});
