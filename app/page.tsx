import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildPageMetadata } from "@/features/seo";
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

export const metadata = buildPageMetadata({
  title: "HighSchool Tutor - DepEd K-12 AI Learning Platform",
  description:
    "Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring.",
  path: "/",
});

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
