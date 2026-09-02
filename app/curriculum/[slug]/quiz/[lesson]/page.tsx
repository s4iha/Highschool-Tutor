import { notFound } from "next/navigation";
import { SUBJECT_BY_SLUG } from "@/features/curriculum/utils/curriculum-data";
import { QuizRunner } from "@/features/curriculum/components/QuizRunner";
import { CurriculumGuard } from "@/features/curriculum/components/CurriculumGuard";

interface QuizPageProps {
  params: Promise<{
    slug: string;
    lesson: string;
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

export default async function LessonQuizPage({ params }: QuizPageProps) {
  const { slug, lesson } = await params;
  const subject = SUBJECT_BY_SLUG.get(slug);
  const lessonNumber = parseInt(lesson, 10);

  if (!subject || isNaN(lessonNumber) || lessonNumber < 1) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <CurriculumGuard>
        <QuizRunner subject={subject} lessonNumber={lessonNumber} />
      </CurriculumGuard>
    </div>
  );
}
