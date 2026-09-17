import type { Metadata } from "next";
import { AdminLessonsPage } from "@/features/admin";

export const metadata: Metadata = {
  title: "Lesson Directory • Admin Portal",
  description: "Curate, preview, and auto-generate comprehensive DepEd MATATAG lesson study material before quizzes.",
};

export default function AdminLessonsRoutePage() {
  return <AdminLessonsPage />;
}
