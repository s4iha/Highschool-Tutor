import { prisma } from "@/lib/prisma";
import { SUBJECT_BY_SLUG } from "./curriculum-data";

/**
 * Returns default starter subject slugs for a given grade level and term preference.
 */
export function getStarterSubjectSlugs(
  gradeLevel: string = "Grade 7",
  termPreference: string = ""
): string[] {
  const cleanGrade = gradeLevel.trim();
  const isShs = cleanGrade.startsWith("Grade 11") || cleanGrade.startsWith("Grade 12");
  const gradeNum = cleanGrade.replace(/\D+/g, "") || (isShs ? "11" : "7");

  if (isShs) {
    const isSem2 =
      termPreference.toLowerCase().includes("semester 2") ||
      termPreference.toLowerCase().includes("s2");
    const semPrefix = isSem2 ? "s2" : "s1";
    if (gradeNum === "12") {
      return [`g12-${semPrefix}-lit21`, `g12-${semPrefix}-pracres2`, `g12-${semPrefix}-phys1`];
    }
    return [`g11-${semPrefix}-genmath`, `g11-${semPrefix}-oralcomm`, `g11-${semPrefix}-earthlife`];
  }

  // JHS (Grade 7 - 10)
  const quarterMatch = termPreference.match(/q(?:uarter)?\s*([1-4])/i);
  const qStr = quarterMatch ? `q${quarterMatch[1]}` : "q1";
  return [`g${gradeNum}-${qStr}-math`, `g${gradeNum}-${qStr}-sci`, `g${gradeNum}-${qStr}-eng`];
}

/**
 * Provisions starter trial subjects for a user if they do not already have enrolled subjects.
 */
export async function enrollStarterSubjects(
  userId: string,
  gradeLevel: string = "Grade 7",
  termPreference: string = ""
): Promise<string[]> {
  const existing = await prisma.trialSubject.findMany({
    where: { userId },
    select: { subjectSlug: true },
  });

  if (existing.length > 0) {
    return existing.map((e) => e.subjectSlug);
  }

  const slugs = getStarterSubjectSlugs(gradeLevel, termPreference);
  const enrolledSlugs: string[] = [];

  for (const slug of slugs) {
    const subject = SUBJECT_BY_SLUG.get(slug);
    try {
      await prisma.trialSubject.create({
        data: {
          userId,
          subjectSlug: slug,
          subjectLabel: subject?.name || slug,
        },
      });
      enrolledSlugs.push(slug);
    } catch {
      // Ignore conflict / already enrolled
    }
  }

  return enrolledSlugs;
}
