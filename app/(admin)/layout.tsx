import * as React from "react";
import type { Metadata } from "next";
import { AdminSidebarLayout } from "@/features/admin/components/AdminSidebarLayout";

export const metadata: Metadata = {
  title: "Admin Portal • HighSchool Tutor",
  description: "Administrative control plane for HighSchool Tutor subscriptions, student tracking, and SaaS pricing.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminSidebarLayout>{children}</AdminSidebarLayout>;
}
