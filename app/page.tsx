import { SubjectCatalog } from "@/features/curriculum/components/SubjectCatalog";
import { CurriculumGuard } from "@/features/curriculum/components/CurriculumGuard";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <CurriculumGuard>
        <SubjectCatalog />
      </CurriculumGuard>
    </div>
  );
}
