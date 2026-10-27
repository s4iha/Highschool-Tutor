import { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/features/seo";

/**
 * Next.js App Router dynamic /sitemap.xml route handler.
 * Delegating all logic to the features/seo FDA module.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries();
}
