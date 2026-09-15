import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { SUBJECT_BY_SLUG } from "@/features/curriculum/utils/curriculum-data";
import { canAccessLesson } from "@/features/curriculum/utils/tier-guardrails";
import { QuizRunner } from "@/features/curriculum/components/QuizRunner";
import { CurriculumGuard } from "@/features/curriculum/components/CurriculumGuard";

interface QuizPageProps {
  params: Promise<{
    slug: string;
    lesson: string;
  }>;
  searchParams?: Promise<{
    session?: string;
    mode?: string;
    count?: string;
  }>;
}

export async function generateMetadata({ params }: QuizPageProps) {
  const { slug, lesson } = await params;
  const subject = SUBJECT_BY_SLUG.get(slug);
  const lessonNumber = parseInt(lesson, 10);

  if (!subject || isNaN(lessonNumber)) {
    return { title: "Quiz - HighSchool Tutor" };
  }

  return {
    title: `Lesson ${lessonNumber} Quiz • ${subject.name} - HighSchool Tutor`,
    description: `Practice and test your knowledge on Lesson ${lessonNumber} of ${subject.name} with AI Socratic assistance.`,
  };
}

export default async function LessonQuizPage({ params, searchParams }: QuizPageProps) {
  const { slug, lesson } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const subject = SUBJECT_BY_SLUG.get(slug);
  const lessonNumber = parseInt(lesson, 10);

  if (!subject || isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 24) {
    notFound();
  }

  // Server-side paywall security guardrail: enforce lesson tier access
  const sessionUser = await getCurrentUser();
  let isSubscribed = false;
  if (sessionUser?.id) {
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId: sessionUser.id,
        status: "ACTIVE",
        expiresAt: { gte: new Date() },
      },
    });
    isSubscribed = !!activeSub;
  }

  if (!canAccessLesson(lessonNumber, isSubscribed)) {
    redirect(`/curriculum/${slug}?upgrade=true&lesson=${lessonNumber}`);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <CurriculumGuard>
        <QuizRunner
          subject={subject}
          lessonNumber={lessonNumber}
          initialSessionId={resolvedSearchParams.session}
        />
      </CurriculumGuard>
    </div>
  );
}
