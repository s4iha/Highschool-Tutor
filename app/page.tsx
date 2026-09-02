import {
  HeroSection,
  StatsBar,
  AboutSection,
  CategorySection,
  PopularSubjectsSection,
  AcademicWorkflowDemo,
  CtaBanner,
} from "@/features/landing/components";
import { SubjectCatalog } from "@/features/curriculum/components/SubjectCatalog";
import { CurriculumGuard } from "@/features/curriculum/components/CurriculumGuard";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <CategorySection />
      <PopularSubjectsSection />
      <AcademicWorkflowDemo />
      <section id="subjects" className="container mx-auto max-w-7xl px-4 sm:px-6 pt-4">
        <CurriculumGuard>
          <SubjectCatalog />
        </CurriculumGuard>
      </section>
      <CtaBanner />
    </div>
  );
}
