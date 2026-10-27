import fs from "fs";
import path from "path";
import {
  buildRobotsConfig,
  buildSitemapEntries,
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildFAQPageSchema,
  buildCourseSchema,
  buildBreadcrumbSchema,
  buildPageMetadata,
  buildSocialCards,
  getSiteUrl,
} from "@/features/seo";
import { TRACKS_DATA } from "@/features/landing/components";

describe("SEO Comprehensive Diagnostic Auditor", () => {
  describe("T033 - Schema.org JSON-LD Verification (validate_schema.py equivalent)", () => {
    const schemas = [
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      buildFAQPageSchema(),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Tracks", path: "/tracks" },
      ]),
      buildCourseSchema(TRACKS_DATA["stem-strand"]),
    ];

    it("should ensure all schemas have @context https://schema.org and valid @type", () => {
      schemas.forEach((schema) => {
        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBeDefined();
        expect(typeof schema["@type"]).toBe("string");
      });
    });

    it("should ensure zero placeholder text across all generated schemas", () => {
      const placeholders = [
        "[Business Name]",
        "[City]",
        "[State]",
        "[Phone]",
        "[Address]",
        "[Your",
        "[INSERT",
        "REPLACE",
        "[URL]",
        "[Email]",
        "TODO",
        "Lorem ipsum",
      ];

      schemas.forEach((schema) => {
        const text = JSON.stringify(schema).toLowerCase();
        placeholders.forEach((p) => {
          expect(text).not.toContain(p.toLowerCase());
        });
      });
    });

    it("should ensure all required properties for EducationalOrganization", () => {
      const org = buildOrganizationSchema();
      expect(org.name).toBe("HighSchool Tutor");
      expect(org.url).toBe(getSiteUrl());
      expect(org.logo).toContain("/logo/");
      expect(org.description).toBeTruthy();
      expect(org.address).toBeDefined();
    });

    it("should ensure all required properties for Course schema across all 7 tracks", () => {
      Object.values(TRACKS_DATA).forEach((track) => {
        const course = buildCourseSchema(track);
        expect(course["@type"]).toBe("Course");
        expect(course.name).toBe(track.name);
        expect(course.description).toBe(track.overview);
        expect(course.provider).toBeDefined();
        expect(course.provider.name).toBe("HighSchool Tutor");
        expect(course.educationalLevel).toBeTruthy();
        expect(course.hasCourseInstance).toBeDefined();
      });
    });
  });

  describe("T034 - Robots & Sitemap Verification (robots_checker & sitemap_checker equivalent)", () => {
    it("should verify robots directives boundary enforcement", () => {
      const robots = buildRobotsConfig();
      expect(robots.sitemap).toBe(`${getSiteUrl()}/sitemap.xml`);
      expect(robots.host).toBe(getSiteUrl());

      const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
      const wildcard = rules.find((r) => r.userAgent === "*");
      expect(wildcard).toBeDefined();

      const disallowed = (wildcard?.disallow as string[]) || [];
      expect(disallowed).toContain("/dashboard/");
      expect(disallowed).toContain("/admin/");
      expect(disallowed).toContain("/curriculum/");
      expect(disallowed).toContain("/api/");

      const allowed = (wildcard?.allow as string[]) || [];
      expect(allowed).toContain("/");
      expect(allowed).toContain("/tracks");
      expect(allowed).toContain("/tracks/*");
      expect(allowed).toContain("/how-it-works");
      expect(allowed).toContain("/privacy");
      expect(allowed).toContain("/terms");
    });

    it("should verify dynamic sitemap enumerates exactly 12 public URLs with zero leaks", () => {
      const sitemap = buildSitemapEntries();
      expect(sitemap.length).toBe(12);

      const urls = sitemap.map((entry) => entry.url);
      // All URLs start with canonical siteUrl
      urls.forEach((url) => {
        expect(url.startsWith("https://highschool-tutor.sgws.tech")).toBe(true);
        expect(url).not.toContain("/dashboard");
        expect(url).not.toContain("/admin");
        expect(url).not.toContain("/curriculum");
        expect(url).not.toContain("/api");
      });

      // Priorities
      const rootEntry = sitemap.find((e) => e.url === "https://highschool-tutor.sgws.tech");
      expect(rootEntry?.priority).toBe(1.0);
    });
  });

  describe("T035 - Social Metadata Diagnostic (social_meta.py equivalent)", () => {
    it("should verify full OpenGraph and Twitter card completeness across pages", () => {
      const pages = ["/", "/how-it-works", "/tracks", "/privacy", "/terms"];

      pages.forEach((p) => {
        const meta = buildPageMetadata({
          title: "Test Page",
          description: "Test Description",
          path: p,
        });

        // OpenGraph checks
        expect(meta.openGraph).toBeDefined();
        expect(meta.openGraph?.title).toBe("Test Page");
        expect(meta.openGraph?.description).toBe("Test Description");
        expect(meta.openGraph?.url).toBe(getSiteUrl() + (p === "/" ? "" : p));
        expect(meta.openGraph?.siteName).toBe("HighSchool Tutor");
        expect(meta.openGraph?.locale).toBe("en_PH");
        expect(meta.openGraph?.type).toBe("website");
        expect(meta.openGraph?.images).toBeDefined();

        // Twitter checks
        expect(meta.twitter).toBeDefined();
        expect(meta.twitter?.title).toBe("Test Page");
        expect((meta.twitter as { card?: string })?.card).toBe("summary_large_image");
        expect(meta.twitter?.images).toBeDefined();
      });
    });

    it("should assert static fallback OpenGraph preview graphic exists at public/images/og-image.png", () => {
      const ogImagePath = path.join(process.cwd(), "public", "images", "og-image.png");
      expect(fs.existsSync(ogImagePath)).toBe(true);

      const stats = fs.statSync(ogImagePath);
      expect(stats.size).toBeGreaterThan(1000); // Valid PNG file

      // Read PNG header to verify 1200x630
      const buffer = fs.readFileSync(ogImagePath);
      const signature = buffer.subarray(0, 8);
      expect(signature).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      expect(width).toBe(1200);
      expect(height).toBe(630);
    });
  });
});
