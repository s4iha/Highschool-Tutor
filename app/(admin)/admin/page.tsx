import type { Metadata } from "next";
import { AdminDashboardPage } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard • HighSchool Tutor",
  description: "Executive administrative dashboard and KPI analytics for HighSchool Tutor.",
};

export default function AdminPage() {
  return <AdminDashboardPage />;
}
