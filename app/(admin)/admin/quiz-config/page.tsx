import type { Metadata } from "next";
import { AdminQuizConfigPage } from "@/features/admin";

export const metadata: Metadata = {
  title: "Quiz Configuration • Admin Portal",
  description: "Curriculum question bank editor and Socratic explanation management for DepEd MATATAG subjects.",
};

export default function QuizConfigRoutePage() {
  return <AdminQuizConfigPage />;
}
