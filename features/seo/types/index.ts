/**
 * SEO & Social Preview Domain Types
 * Conforming to Schema.org and Next.js 16 Metadata API specifications.
 */

export interface SiteConfig {
  /** Canonical production domain URL (e.g., "https://highschool-tutor.sgws.tech") */
  siteUrl: string;
  /** Full platform brand name */
  siteName: string;
  /** Primary platform headline description */
  defaultDescription: string;
  /** Default BCP-47 / OpenGraph locale */
  defaultLocale: "en_PH" | "fil_PH";
  /** Fallback OpenGraph social card image URL (relative or absolute) */
  defaultOgImage: string;
  /** Fallback image dimensions */
  ogImageDimensions: {
    width: number;
    height: number;
  };
  /** Official brand social profiles (for Schema.org sameAs) */
  socialLinks: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
  };
}

export interface RobotsRule {
  /** User agent pattern (e.g., "*", "Googlebot", "GPTBot") */
  userAgent: string | string[];
  /** Relative path patterns explicitly allowed for crawling */
  allow?: string | string[];
  /** Relative path patterns strictly disallowed from crawling */
  disallow?: string | string[];
  /** Crawl delay in seconds (optional) */
  crawlDelay?: number;
}

export interface RobotsConfig {
  /** Array of user-agent rules */
  rules: RobotsRule[];
  /** Authoritative XML sitemap URL */
  sitemap: string;
  /** Preferred hostname */
  host?: string;
}

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapEntry {
  /** Canonical absolute URL of the page */
  url: string;
  /** ISO 8601 string or Date object representing last modification */
  lastModified?: string | Date;
  /** Estimated frequency of content updates */
  changeFrequency?: ChangeFrequency;
  /** Priority relative to other pages on the site (0.0 to 1.0) */
  priority?: number;
  /** Alternate language URLs (hreflang mapping) */
  alternates?: {
    languages?: Record<string, string>;
  };
}

export interface SchemaPostalAddress {
  "@type": "PostalAddress";
  addressCountry: "PH";
  addressRegion?: string;
  addressLocality?: string;
}

export interface SchemaEducationalOrganization {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  "@id": string; // Canonical URL + "#organization"
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  address?: SchemaPostalAddress;
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email: string;
    availableLanguage: string[];
  };
}

export interface SchemaSearchAction {
  "@type": "SearchAction";
  target: {
    "@type": "EntryPoint";
    urlTemplate: string;
  };
  "query-input": "required name=search_term_string";
}

export interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string; // Canonical URL + "#website"
  name: string;
  url: string;
  publisher: {
    "@id": string;
  };
  potentialAction?: SchemaSearchAction;
  inLanguage: string[];
}

export interface SchemaFaqQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface SchemaFAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  "@id": string; // Canonical URL + "#faq"
  mainEntity: SchemaFaqQuestion[];
}

export interface SchemaCourse {
  "@context": "https://schema.org";
  "@type": "Course";
  "@id": string; // Track URL + "#course"
  name: string;
  description: string;
  provider: {
    "@type": "EducationalOrganization";
    name: string;
    url: string;
  };
  educationalLevel: string;
  educationalCredentialAwarded?: string;
  hasCourseInstance?: {
    "@type": "CourseInstance";
    courseMode: "online";
    inLanguage: string[];
  };
  about?: string[];
}

export interface SchemaBreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string; // Canonical URL
}

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: SchemaBreadcrumbItem[];
}

export interface OpenGraphCardConfig {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale: "en_PH" | "fil_PH";
  type: "website" | "article";
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
    type?: string;
  }>;
}

export interface TwitterCardConfig {
  card: "summary_large_image" | "summary";
  title: string;
  description: string;
  images: string[];
  creator?: string;
  site?: string;
}
