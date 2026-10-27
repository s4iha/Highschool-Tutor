import { MetadataRoute } from "next";
import { getCanonicalUrl } from "./siteConfig";
import { TRACKS_DATA } from "@/features/landing/components";

/**
 * Builds dynamic sitemap entries conforming to Next.js 16 MetadataRoute.Sitemap.
 * Enumerates all public static marketing routes and dynamic curriculum track routes.
 */
export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: getCanonicalUrl("/tracks"),
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getCanonicalUrl("/how-it-works"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/privacy"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getCanonicalUrl("/terms"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const trackEntries: MetadataRoute.Sitemap = Object.keys(TRACKS_DATA).map(
    (trackId) => ({
      url: getCanonicalUrl(`/tracks/${trackId}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticEntries, ...trackEntries];
}
