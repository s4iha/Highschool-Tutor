import type { Metadata } from "next";
import { AdminSettingsPage } from "@/features/admin";

export const metadata: Metadata = {
  title: "Pricing & Guardrails • Admin Portal",
  description: "SaaS subscription pricing, GCash/Maya merchant accounts, and free tier guardrails.",
};

export default function SettingsRoutePage() {
  return <AdminSettingsPage />;
}
