import { MetadataRoute } from "next";
import { buildRobotsConfig } from "@/features/seo";

/**
 * Next.js App Router dynamic /robots.txt route handler.
 * Delegating all logic to the features/seo FDA module.
 */
export default function robots(): MetadataRoute.Robots {
  return buildRobotsConfig();
}
