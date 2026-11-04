import {
  saveReturnIntent,
  getReturnIntent,
  clearReturnIntent,
  isReturnIntentValid,
  parseReturnIntentFromUrl,
} from "@/features/billing/utils/returnIntent";
import { RETURN_INTENT_STORAGE_KEY } from "@/features/billing/types/billingTypes";

describe("Auth Intercept & Return Intent Utilities", () => {
  let mockStore: Record<string, string> = {};

  beforeAll(() => {
    const mockSessionStorage = {
      getItem: (key: string) => mockStore[key] || null,
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
    };

    (global as any).window = {
      location: { pathname: "/#pricing" },
    };
    (global as any).sessionStorage = mockSessionStorage;
  });

  afterAll(() => {
    delete (global as any).window;
    delete (global as any).sessionStorage;
  });

  beforeEach(() => {
    mockStore = {};
    jest.restoreAllMocks();
  });

  it("should successfully persist and retrieve a valid ReturnIntent", () => {
    saveReturnIntent({
      planId: "ANNUAL",
      referralCode: "SGWS-EDU",
      sourceUrl: "/#pricing",
    });

    const retrieved = getReturnIntent();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.planId).toBe("ANNUAL");
    expect(retrieved?.referralCode).toBe("SGWS-EDU");
    expect(retrieved?.sourceUrl).toBe("/#pricing");
    expect(retrieved?.timestamp).toBeGreaterThan(0);
  });

  it("should invalidate intent if expired beyond 2 hours TTL", () => {
    const expiredTimestamp = Date.now() - 3 * 60 * 60 * 1000; // 3 hours ago
    saveReturnIntent({
      planId: "MONTHLY",
      timestamp: expiredTimestamp,
    });

    const retrieved = getReturnIntent();
    expect(retrieved).toBeNull();
    // Verify expired intent was purged from storage
    expect(mockStore[RETURN_INTENT_STORAGE_KEY]).toBeUndefined();
  });

  it("should purge storage on clearReturnIntent for one-time idempotency", () => {
    saveReturnIntent({ planId: "MONTHLY" });
    expect(getReturnIntent()).not.toBeNull();

    clearReturnIntent();
    expect(getReturnIntent()).toBeNull();
  });

  it("isReturnIntentValid should return false for invalid plans or missing intent", () => {
    expect(isReturnIntentValid(null)).toBe(false);
    expect(isReturnIntentValid({ planId: "INVALID" as any, timestamp: Date.now() })).toBe(false);
  });

  it("should parse return intent from URL query parameters as fallback", () => {
    const params = new URLSearchParams("resumeCheckout=1&plan=ANNUAL&ref=PARTNER99&source=/");
    const parsed = parseReturnIntentFromUrl(params);

    expect(parsed).not.toBeNull();
    expect(parsed?.planId).toBe("ANNUAL");
    expect(parsed?.referralCode).toBe("PARTNER99");
    expect(parsed?.sourceUrl).toBe("/");
  });

  it("should return null for URL params without valid plan", () => {
    const params = new URLSearchParams("resumeCheckout=1&plan=LIFETIME");
    expect(parseReturnIntentFromUrl(params)).toBeNull();
  });
});
