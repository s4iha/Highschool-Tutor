import { buildSitemapEntries } from "@/features/seo/utils/sitemapBuilder";

describe("buildSitemapEntries", () => {
  it("should return exactly 12 canonical sitemap entries for public pages and tracks", () => {
    const sitemap = buildSitemapEntries();

    expect(sitemap).toBeDefined();
    expect(sitemap.length).toBe(12);

    // Verify static routes
    const urls = sitemap.map((entry) => entry.url);
    expect(urls).toContain("https://highschool-tutor.sgws.tech");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/how-it-works");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/privacy");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/terms");

    // Verify dynamic track routes from TRACKS_DATA
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/junior-high-core");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/stem-strand");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/abm-strand");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/humss-strand");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/shs-core");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/gas-strand");
    expect(urls).toContain("https://highschool-tutor.sgws.tech/tracks/tvl-track");

    // Verify priorities
    const homeEntry = sitemap.find((e) => e.url === "https://highschool-tutor.sgws.tech");
    expect(homeEntry?.priority).toBe(1.0);
    expect(homeEntry?.changeFrequency).toBe("daily");

    const tracksEntry = sitemap.find((e) => e.url === "https://highschool-tutor.sgws.tech/tracks");
    expect(tracksEntry?.priority).toBe(0.9);

    const stemEntry = sitemap.find(
      (e) => e.url === "https://highschool-tutor.sgws.tech/tracks/stem-strand"
    );
    expect(stemEntry?.priority).toBe(0.8);
    expect(stemEntry?.changeFrequency).toBe("weekly");

    // Verify no private routes are present
    const disallowedPatterns = ["/dashboard", "/admin", "/curriculum", "/api"];
    sitemap.forEach((entry) => {
      disallowedPatterns.forEach((disallowed) => {
        expect(entry.url).not.toContain(disallowed);
      });
    });
  });
});
