import { buildRobotsConfig } from "@/features/seo/utils/robotsBuilder";

describe("buildRobotsConfig", () => {
  it("should return compliant robots configuration with public allows and private disallows", () => {
    const robots = buildRobotsConfig();

    expect(robots).toBeDefined();
    expect(robots.sitemap).toBe("https://highschool-tutor.sgws.tech/sitemap.xml");
    expect(robots.host).toBe("https://highschool-tutor.sgws.tech");

    const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
    expect(rules.length).toBeGreaterThanOrEqual(1);

    // General wildcard rule
    const generalRule = rules.find((r) => r.userAgent === "*");
    expect(generalRule).toBeDefined();
    expect(generalRule?.allow).toEqual(
      expect.arrayContaining(["/", "/tracks", "/tracks/*", "/how-it-works", "/privacy", "/terms"])
    );
    expect(generalRule?.disallow).toEqual(
      expect.arrayContaining(["/dashboard/", "/admin/", "/curriculum/", "/api/"])
    );

    // AI bot rule
    const aiRule = rules.find((r) =>
      Array.isArray(r.userAgent)
        ? r.userAgent.includes("GPTBot")
        : r.userAgent === "GPTBot"
    );
    expect(aiRule).toBeDefined();
    expect(aiRule?.disallow).toEqual(
      expect.arrayContaining(["/dashboard/", "/admin/", "/curriculum/", "/api/", "/privacy", "/terms"])
    );
  });
});
