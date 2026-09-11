import type { Metadata } from "next";
import { AdminStudentsPage } from "@/features/admin";

export const metadata: Metadata = {
  title: "Students & Subscriptions • Admin Portal",
  description: "Directory of registered and subscribed high school students with tier controls.",
};

export default function StudentsRoutePage() {
  return <AdminStudentsPage />;
}
