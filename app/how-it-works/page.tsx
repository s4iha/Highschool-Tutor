import { HowItWorks } from "@/features/landing/components";
import {
  JsonLd,
  buildFAQPageSchema,
  buildPageMetadata,
} from "@/features/seo";

export const metadata = buildPageMetadata({
  title: "How It Works — HighSchool Tutor",
  description:
    "Discover how HighSchool Tutor provides structured DepEd MATATAG modules, practice quizzes, real-time Socratic AI hints, and comprehensive study tools.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  const faqSchema = buildFAQPageSchema();

  return (
    <>
      <JsonLd schema={faqSchema} />
      <HowItWorks />
    </>
  );
}
