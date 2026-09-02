import {
  HeroSection,
  StatsBar,
  AboutSection,
  CategorySection,
  PopularSubjectsSection,
  AcademicWorkflowDemo,
  CtaBanner,
} from "@/features/landing/components";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <CategorySection />
      <PopularSubjectsSection />
      <AcademicWorkflowDemo />
      <CtaBanner />
    </div>
  );
}
