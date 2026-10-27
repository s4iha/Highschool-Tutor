import { Metadata } from "next";
import { getCanonicalUrl } from "./siteConfig";
import { OpenGraphCardConfig, TwitterCardConfig } from "../types";

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Builds authoritative Next.js 16 Metadata with canonical URL resolution,
 * query parameter stripping, alternate hreflang tags, OpenGraph, and Twitter cards.
 */
export function buildPageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, path, ogImage, noIndex } = options;
  const canonicalUrl = getCanonicalUrl(path);
  const resolvedOgImage = ogImage || "/opengraph-image";

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-PH": canonicalUrl,
        "fil-PH": canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HighSchool Tutor",
      locale: "en_PH",
      type: "website",
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: title
            ? `${title} • HighSchool Tutor`
            : "HighSchool Tutor DepEd K-12 AI Learning Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  } else {
    metadata.robots = {
      index: true,
      follow: true,
    };
  }

  return metadata;
}

/**
 * Builds raw OpenGraph and Twitter card configuration objects.
 */
export function buildSocialCards(options: PageMetadataOptions): {
  openGraph: OpenGraphCardConfig;
  twitter: TwitterCardConfig;
} {
  const {
    title = "HighSchool Tutor",
    description = "",
    path,
    ogImage,
  } = options;
  const canonicalUrl = getCanonicalUrl(path);
  const image = ogImage || "/opengraph-image";

  return {
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HighSchool Tutor",
      locale: "en_PH",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} • HighSchool Tutor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
