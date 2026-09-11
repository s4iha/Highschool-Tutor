import type { Metadata } from "next";
import { AdminAnnouncementsPage } from "@/features/admin";

export const metadata: Metadata = {
  title: "Announcements • Admin Portal",
  description: "Create and publish broadcast announcements and notifications to students.",
};

export default function AnnouncementsRoutePage() {
  return <AdminAnnouncementsPage />;
}
