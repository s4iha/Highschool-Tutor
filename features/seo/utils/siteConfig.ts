import { SiteConfig } from "../types";

export const DEFAULT_SITE_URL = "https://highschool-tutor.sgws.tech";

export const SITE_CONFIG: SiteConfig = {
  siteUrl: DEFAULT_SITE_URL,
  siteName: "HighSchool Tutor",
  defaultDescription:
    "Philippine DepEd K-12 MATATAG classroom study companion providing structured lessons, 24 practice quizzes per lesson, and Socratic AI tutoring for Junior and Senior High School students.",
  defaultLocale: "en_PH",
  defaultOgImage: "/images/og-image.png",
  ogImageDimensions: {
    width: 1200,
    height: 630,
  },
  socialLinks: {
    facebook: "https://www.facebook.com/profile.php?id=61593896055614",
  },
};

/**
 * Returns the authoritative base site URL, stripping any trailing slashes.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envUrl) {
    return DEFAULT_SITE_URL;
  }
  return envUrl.trim().replace(/\/+$/, "");
}

/**
 * Sanitizes and resolves a given path or URL against the authoritative canonical domain.
 * Strips query parameters, hash fragments, redundant slashes, and trailing slashes.
 */
export function getCanonicalUrl(path?: string): string {
  const baseUrl = getSiteUrl();

  if (!path || path.trim() === "" || path.trim() === "/") {
    return baseUrl;
  }

  let cleaned = path.trim();

  // If path is a full URL, extract only the pathname
  try {
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      const parsed = new URL(cleaned);
      cleaned = parsed.pathname;
    }
  } catch {
    // If URL parsing fails, proceed with string manipulation
  }

  // Strip query parameters (?...) and hash fragments (#...)
  cleaned = cleaned.split("?")[0].split("#")[0];

  // Collapse multiple slashes into a single slash and strip trailing slashes
  cleaned = cleaned.replace(/\/+/g, "/").replace(/\/+$/, "");

  // Ensure leading slash
  if (!cleaned.startsWith("/")) {
    cleaned = `/${cleaned}`;
  }

  if (cleaned === "/" || cleaned === "") {
    return baseUrl;
  }

  return `${baseUrl}${cleaned}`;
}
