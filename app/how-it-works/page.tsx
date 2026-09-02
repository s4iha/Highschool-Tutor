import { Metadata } from "next";
import { HowItWorks } from "@/features/landing/components";

export const metadata: Metadata = {
  title: "How It Works — HighSchool Tutor",
  description:
    "Discover how HighSchool Tutor provides structured 12-lesson DepEd MATATAG modules, 24 practice quizzes, real-time Socratic AI hints, and offline study capabilities.",
};

export default function HowItWorksPage() {
  return <HowItWorks />;
}
