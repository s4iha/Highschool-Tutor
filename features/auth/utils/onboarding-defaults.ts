/**
 * Resolves standard onboarding defaults ensuring proper alignment
 * between Philippine High School levels (Senior High vs Junior High)
 * and their respective academic periods (Semesters vs Quarters).
 */
export function resolveOnboardingDefaults(
  existingGrade?: string | null,
  existingTrack?: string | null,
  existingTerm?: string | null
): {
  gradeLevel: string;
  track: string;
  termPreference: string;
} {
  const gradeLevel = existingGrade?.trim() || "Grade 11";
  const isSeniorHigh = gradeLevel === "Grade 11" || gradeLevel === "Grade 12";

  let track = existingTrack?.trim();
  if (!track) {
    track = isSeniorHigh ? "STEM Strand" : "JHS Core";
  } else if (!isSeniorHigh && track !== "JHS Core") {
    track = "JHS Core";
  }

  let termPreference = existingTerm?.trim();
  if (!termPreference) {
    termPreference = isSeniorHigh ? "Semester 1" : "Quarter 1";
  } else if (isSeniorHigh && !termPreference.startsWith("Semester")) {
    termPreference = "Semester 1";
  } else if (!isSeniorHigh && !termPreference.startsWith("Quarter")) {
    termPreference = "Quarter 1";
  }

  return { gradeLevel, track, termPreference };
}
