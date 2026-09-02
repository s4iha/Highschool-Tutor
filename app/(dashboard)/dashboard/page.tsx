import { Metadata } from "next";
import DashboardShell from "@/features/dashboard/components/DashboardShell";
import StudentDashboardView from "@/features/dashboard/components/StudentDashboardView";

export const metadata: Metadata = {
  title: "Student Dashboard - HighSchool Tutor",
  description: "Track your DepEd K-12 MATATAG subjects, practice quizzes, and AI tutor inquiries.",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <StudentDashboardView />
    </DashboardShell>
  );
}
