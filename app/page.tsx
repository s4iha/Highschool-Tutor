import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildPageMetadata } from "@/features/seo";
import {
  HeroSection,
  StatsBar,
  AboutSection,
  AcademicWorkflowDemo,
  HowToUseAppSection,
  CategorySection,
  PopularSubjectsSection,
  TrialNoticeSection,
  CtaBanner,
} from "@/features/landing/components";

export const dynamic = "force-dynamic";

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
    <div className="flex flex-col">
      {/* 1. Hero Experience (PLG Value Proposition & Frictionless Trial CTA) */}
      <HeroSection />

      {/* 2. Stats Bar (Proof-Stacked Verified Curriculum Realities & Live Counts) */}
      <StatsBar />

      {/* 3. Problem & Solution Framing (Why DepEd Students Struggle with Exams) */}
      <AboutSection />

      {/* 4. Interactive Product Preview BEFORE Signup Wall (Socratic AI & DO 015 Demo) */}
      <AcademicWorkflowDemo />

      {/* 5. Student Onboarding Guide (4-Step Learning Workflow) */}
      <HowToUseAppSection />

      {/* 6. Academic Tracks & Strands (7 Verified DepEd Tracks) */}
      <CategorySection />

      {/* 7. Popular High School Subjects (DepEd Quarter 1 & 8-Lesson Modules) */}
      <PopularSubjectsSection />

      {/* 8. 30-Day Free Trial & Transparent Subscription Pricing */}
      <TrialNoticeSection />

      {/* 9. Final High-Converting Trial Action Push */}
      <CtaBanner />
    </div>
  );
}
