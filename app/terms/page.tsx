import { TermsOfService } from "@/features/landing/components";
import { buildPageMetadata } from "@/features/seo";

export const metadata = buildPageMetadata({
  title: "Terms of Service & Academic Usage — HighSchool Tutor",
  description:
    "Review the terms of service, acceptable AI use policies, and DepEd DO 015 s. 2026 guidelines for the HighSchool Tutor learning platform.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsOfService />;
}
