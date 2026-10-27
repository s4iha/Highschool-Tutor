import {
  SchemaEducationalOrganization,
  SchemaWebSite,
  SchemaFAQPage,
  SchemaCourse,
  SchemaBreadcrumbList,
} from "../types";
import { getSiteUrl, getCanonicalUrl } from "./siteConfig";

/**
 * Builds Schema.org EducationalOrganization structured data.
 */
export function buildOrganizationSchema(): SchemaEducationalOrganization {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name: "HighSchool Tutor",
    url: siteUrl,
    logo: `${siteUrl}/logo/highschool-tutor-logo-favicon-squared.png`,
    description:
      "Philippine DepEd K-12 MATATAG classroom study companion providing structured lessons, 24 practice quizzes per lesson, and Socratic AI tutoring for Junior and Senior High School students.",
    sameAs: [
      "https://facebook.com/highschooltutor",
      "https://twitter.com/highschooltutor",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "PH",
    },
  };
}

/**
 * Builds Schema.org WebSite structured data with SearchAction query input.
 */
export function buildWebSiteSchema(): SchemaWebSite {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "HighSchool Tutor",
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/tracks?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en-PH", "fil-PH"],
  };
}

export const DEFAULT_FAQ_ITEMS = [
  {
    question: "What is HighSchool Tutor?",
    answer:
      "HighSchool Tutor is an AI-powered classroom study companion designed for Philippine Junior and Senior High School students (Grades 7 to 12). It provides 130+ DepEd K-12 MATATAG aligned subjects with structured lesson modules, verified practice quizzes, and real-time Socratic AI guidance.",
  },
  {
    question: "Is HighSchool Tutor aligned with the new DepEd MATATAG curriculum?",
    answer:
      "Yes. All curriculum codes, learning competencies, and grading calculations strictly follow the Philippine Department of Education (DepEd) K-12 MATATAG guidelines and DepEd Order No. 015, s. 2026.",
  },
  {
    question: "What devices can I use HighSchool Tutor on?",
    answer:
      "You can use HighSchool Tutor on any smartphone, tablet, laptop, or desktop computer with an internet connection. The app is fully responsive and optimized for mobile web browsers.",
  },
  {
    question: "How does the Socratic AI tutor help me learn?",
    answer:
      "Instead of giving away answers directly, our Google Gemini AI tutor uses the Socratic method. It asks guiding questions, highlights foundational concepts, explains 'Bakit Mali Ito?' (Why is this wrong?), and translates explanations into your preferred dialect (English, Filipino, Taglish, Cebuano, Ilocano).",
  },
  {
    question: "Does using HighSchool Tutor violate school academic integrity rules?",
    answer:
      "HighSchool Tutor is designed strictly for study, concept mastery, and exam preparation. Using it to practice and test your understanding is encouraged. However, students should never copy AI-generated text for submission in graded classroom assignments.",
  },
  {
    question: "How are grades transmuted on the platform?",
    answer:
      "Quiz scores are automatically processed through the official DepEd Order No. 015, s. 2026 transmutation scale, showing both the raw percentage and the official transmuted grade descriptor.",
  },
];

/**
 * Builds Schema.org FAQPage structured data for /how-it-works.
 */
export function buildFAQPageSchema(
  faqs?: Array<{ question: string; answer: string }>
): SchemaFAQPage {
  const siteUrl = getSiteUrl();
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQ_ITEMS;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/how-it-works#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Builds Schema.org Course and credential structured data for an academic track.
 */
export function buildCourseSchema(track: {
  id: string;
  name: string;
  overview: string;
  grades: string;
}): SchemaCourse {
  const siteUrl = getSiteUrl();
  const trackUrl = getCanonicalUrl(`/tracks/${track.id}`);
  const isJuniorHigh =
    track.id === "junior-high-core" ||
    track.grades.toLowerCase().includes("junior") ||
    track.grades.includes("7");

  const educationalLevel = isJuniorHigh
    ? "Junior High School (Grades 7-10)"
    : "Senior High School (Grades 11-12)";

  const credential = isJuniorHigh
    ? "DepEd MATATAG Junior High School Certificate of Completion"
    : `DepEd MATATAG Senior High School ${track.name} Certification`;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${trackUrl}#course`,
    name: track.name,
    description: track.overview,
    provider: {
      "@type": "EducationalOrganization",
      name: "HighSchool Tutor",
      url: siteUrl,
    },
    educationalLevel,
    educationalCredentialAwarded: credential,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: ["en-PH", "fil-PH"],
    },
  };
}

/**
 * Builds Schema.org BreadcrumbList structured data for hierarchical navigation trails.
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
): SchemaBreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}
