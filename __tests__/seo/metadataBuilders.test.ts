import {
  buildPageMetadata,
  buildSocialCards,
} from "@/features/seo/utils/metadataBuilders";

describe("metadataBuilders", () => {
  describe("buildPageMetadata", () => {
    it("should construct canonical URL, alternates, and social tags with query stripping", () => {
      const meta = buildPageMetadata({
        title: "STEM Strand (Grades 11-12)",
        description: "Prepares students for college STEM courses.",
        path: "/tracks/stem-strand?utm_source=facebook&ref=promo#hash",
      });

      expect(meta.title).toBe("STEM Strand (Grades 11-12)");
      expect(meta.description).toBe("Prepares students for college STEM courses.");

      // Canonical URL should have queries and hashes stripped
      expect(meta.alternates?.canonical).toBe(
        "https://highschool-tutor.sgws.tech/tracks/stem-strand"
      );
      expect(meta.alternates?.languages?.["en-PH"]).toBe(
        "https://highschool-tutor.sgws.tech/tracks/stem-strand"
      );

      // OpenGraph
      expect(meta.openGraph?.url).toBe(
        "https://highschool-tutor.sgws.tech/tracks/stem-strand"
      );
      expect(meta.openGraph?.title).toBe("STEM Strand (Grades 11-12)");
      expect(meta.openGraph?.siteName).toBe("HighSchool Tutor");
      expect(meta.openGraph?.locale).toBe("en_PH");

      // Twitter
      expect((meta.twitter as { card?: string })?.card).toBe("summary_large_image");
      expect(meta.twitter?.title).toBe("STEM Strand (Grades 11-12)");
    });

    it("should support noIndex directive for 404 and unlisted pages", () => {
      const meta = buildPageMetadata({
        title: "Not Found",
        description: "Page not found",
        path: "/invalid",
        noIndex: true,
      });

      expect(meta.robots).toEqual({
        index: false,
        follow: false,
      });
    });

    it("should allow custom ogImage or default to /opengraph-image", () => {
      const defaultMeta = buildPageMetadata({
        title: "Home",
        path: "/",
      });
      expect(defaultMeta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
      ]);

      const customMeta = buildPageMetadata({
        title: "Custom",
        path: "/custom",
        ogImage: "/images/custom-card.png",
      });
      expect(customMeta.openGraph?.images).toEqual([
        expect.objectContaining({ url: "/images/custom-card.png" }),
      ]);
    });
  });

  describe("buildSocialCards", () => {
    it("should return typed OpenGraphCardConfig and TwitterCardConfig", () => {
      const { openGraph, twitter } = buildSocialCards({
        title: "Track Catalog",
        description: "Browse 130+ subjects",
        path: "/tracks",
      });

      expect(openGraph.title).toBe("Track Catalog");
      expect(openGraph.url).toBe("https://highschool-tutor.sgws.tech/tracks");
      expect(openGraph.locale).toBe("en_PH");
      expect(openGraph.images[0].width).toBe(1200);
      expect(openGraph.images[0].height).toBe(630);

      expect(twitter.card).toBe("summary_large_image");
      expect(twitter.title).toBe("Track Catalog");
      expect(twitter.images).toContain("/opengraph-image");
    });
  });
});
