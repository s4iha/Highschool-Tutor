import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin Portal • HighSchool Tutor",
  description: "Administrative control plane for HighSchool Tutor subscriptions, student tracking, and SaaS pricing.",
};

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <AdminDashboard />
    </div>
  );
}
