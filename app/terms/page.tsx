import { Metadata } from "next";
import { TermsOfService } from "@/features/landing/components";

export const metadata: Metadata = {
  title: "Terms of Service & Academic Usage — HighSchool Tutor",
  description:
    "Review the terms of service, acceptable AI use policies, and DepEd DO 015 s. 2026 guidelines for the HighSchool Tutor learning platform.",
};

export default function TermsPage() {
  return <TermsOfService />;
}
