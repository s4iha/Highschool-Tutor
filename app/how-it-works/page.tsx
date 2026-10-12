import { Metadata } from "next";
import { HowItWorks } from "@/features/landing/components";

export const metadata: Metadata = {
  title: "How It Works — HighSchool Tutor",
  description:
    "Discover how HighSchool Tutor provides structured DepEd MATATAG modules, practice quizzes, real-time Socratic AI hints, and comprehensive study tools.",
};

export default function HowItWorksPage() {
  return <HowItWorks />;
}
