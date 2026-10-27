import {
  SITE_CONFIG,
  getSiteUrl,
  getCanonicalUrl,
} from "@/features/seo/utils/siteConfig";

describe("siteConfig and canonical URL helpers", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  });

  describe("SITE_CONFIG", () => {
    it("should have correct platform brand and defaults", () => {
      expect(SITE_CONFIG.siteName).toBe("HighSchool Tutor");
      expect(SITE_CONFIG.defaultLocale).toBe("en_PH");
      expect(SITE_CONFIG.ogImageDimensions).toEqual({ width: 1200, height: 630 });
      expect(SITE_CONFIG.defaultOgImage).toBe("/images/og-image.png");
      expect(SITE_CONFIG.defaultDescription).toContain("DepEd");
    });
  });

  describe("getSiteUrl", () => {
    it("should return canonical domain when env is not set", () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      expect(getSiteUrl()).toBe("https://highschool-tutor.sgws.tech");
    });

    it("should return configured env URL stripped of trailing slashes", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://custom-domain.ph///";
      expect(getSiteUrl()).toBe("https://custom-domain.ph");
    });
  });

  describe("getCanonicalUrl", () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    });

    it("should return root URL for empty or slash paths", () => {
      expect(getCanonicalUrl("")).toBe("https://highschool-tutor.sgws.tech");
      expect(getCanonicalUrl("/")).toBe("https://highschool-tutor.sgws.tech");
    });

    it("should format subpaths correctly", () => {
      expect(getCanonicalUrl("/tracks")).toBe("https://highschool-tutor.sgws.tech/tracks");
      expect(getCanonicalUrl("tracks")).toBe("https://highschool-tutor.sgws.tech/tracks");
      expect(getCanonicalUrl("/tracks/stem-strand")).toBe(
        "https://highschool-tutor.sgws.tech/tracks/stem-strand"
      );
    });

    it("should strip query parameters", () => {
      expect(
        getCanonicalUrl("/tracks/stem-strand?utm_source=facebook&ref=promo")
      ).toBe("https://highschool-tutor.sgws.tech/tracks/stem-strand");
      expect(getCanonicalUrl("/?ref=share")).toBe("https://highschool-tutor.sgws.tech");
    });

    it("should strip hash fragments", () => {
      expect(getCanonicalUrl("/how-it-works#faq-section")).toBe(
        "https://highschool-tutor.sgws.tech/how-it-works"
      );
    });

    it("should sanitize duplicate consecutive slashes and trailing slashes", () => {
      expect(getCanonicalUrl("///tracks///stem-strand///")).toBe(
        "https://highschool-tutor.sgws.tech/tracks/stem-strand"
      );
    });

    it("should normalize full URLs passed as path to the canonical domain", () => {
      expect(
        getCanonicalUrl("https://other-domain.com/tracks?foo=bar#hash")
      ).toBe("https://highschool-tutor.sgws.tech/tracks");
    });
  });
});
