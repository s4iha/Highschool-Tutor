import { notFound } from "next/navigation";
import { SUBJECT_BY_SLUG } from "@/features/curriculum/utils/curriculum-data";
import { LessonList } from "@/features/curriculum/components/LessonList";
import { CurriculumGuard } from "@/features/curriculum/components/CurriculumGuard";

interface SubjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subject = SUBJECT_BY_SLUG.get(slug);

  if (!subject) {
    return { title: "Subject Not Found - HighSchool Tutor" };
  }

  return {
    title: `${subject.name} (${subject.grade}) - HighSchool Tutor`,
    description: `Master ${subject.name} competencies for ${subject.grade} (${subject.term}) with DepEd curriculum modules and Gemini AI tutoring.`,
  };
}

export default async function SubjectLessonsPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subject = SUBJECT_BY_SLUG.get(slug);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6">
      <CurriculumGuard>
        <LessonList subject={subject} />
      </CurriculumGuard>
    </div>
  );
}
