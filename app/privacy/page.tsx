import { Metadata } from "next";
import { PrivacyPolicy } from "@/features/landing/components";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection — HighSchool Tutor",
  description:
    "Learn about how HighSchool Tutor safeguards student data, learning analytics, and personal information in compliance with Republic Act No. 10173 (Data Privacy Act of 2012).",
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
