import { MetadataRoute } from "next";
import { getSiteUrl } from "./siteConfig";

/**
 * Builds standard robots crawl directives matrix adhering to Next.js 16 MetadataRoute.Robots.
 * Permits public marketing and track pages while strictly quarantining protected student/admin routes.
 */
export function buildRobotsConfig(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/tracks",
          "/tracks/*",
          "/how-it-works",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/dashboard/",
          "/admin/",
          "/curriculum/",
          "/api/",
        ],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: [
          "/",
          "/tracks",
          "/tracks/*",
          "/how-it-works",
        ],
        disallow: [
          "/dashboard/",
          "/admin/",
          "/curriculum/",
          "/api/",
          "/privacy",
          "/terms",
        ],
      },
    ],
    sitemap: sitemapUrl,
    host: siteUrl,
  };
}
