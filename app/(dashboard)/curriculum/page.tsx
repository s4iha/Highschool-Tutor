import { Metadata } from "next";
import { SubjectCatalog } from "@/features/curriculum/components/SubjectCatalog";
import { CurriculumGuard } from "@/features/curriculum/components/CurriculumGuard";

export const metadata: Metadata = {
  title: "DepEd Curriculum Catalog • HighSchool Tutor",
  description:
    "Explore DepEd MATATAG-aligned subjects for Junior and Senior High School with interactive lessons and Socratic AI tutoring.",
};

export default function CurriculumIndexPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-3">
      <CurriculumGuard>
        <SubjectCatalog />
      </CurriculumGuard>
    </div>
  );
}
