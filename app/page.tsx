import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import {
  HeroSection,
  StatsBar,
  AboutSection,
  HowToUseAppSection,
  CategorySection,
  PopularSubjectsSection,
  TrialNoticeSection,
  AcademicWorkflowDemo,
  CtaBanner,
} from "@/features/landing/components";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-12">
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <HowToUseAppSection />
      <CategorySection />
      <PopularSubjectsSection />
      <TrialNoticeSection />
      <AcademicWorkflowDemo />
      <CtaBanner />
    </div>
  );
}
