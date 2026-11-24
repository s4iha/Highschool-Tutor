/**
 * DepEd Order No. 015, s. 2026 MATATAG Piecewise Grade Transmutation
 *
 * Official Transmutation Mapping:
 * - Total <= 0: 0
 * - Raw Score <= 0 (0%): 60 (transmutation floor)
 * - 0% < Raw% < 60%: 60 + (Raw% / 60) * 14
 * - Raw% = 60%: 75 (Official DepEd passing mark)
 * - 60% <= Raw% < 100%: 75 + ((Raw% - 60) * 25) / 40
 * - Raw% >= 100%: 100
 */
export function calculateDepEdTransmutation(score: number, total: number): number {
  if (total <= 0) return 0;
  if (score <= 0) return 60;

  const rawPercentage = (score / total) * 100;
  if (rawPercentage >= 100) return 100;
  if (rawPercentage >= 60) {
    return Math.min(100, Math.round(75 + ((rawPercentage - 60) * 25) / 40));
  }
  return Math.max(60, Math.round(60 + (rawPercentage / 60) * 14));
}

/**
 * Mastery and performance remarks based on transmuted grade
 */
export function getDepEdTransmutationRemarks(avg: number | null | undefined): string {
  if (avg === null || avg === undefined) return "No evaluations yet";
  if (avg >= 90) return "Mastered (Outstanding)";
  if (avg >= 85) return "Mastered (Very Satisfactory)";
  if (avg >= 80) return "Proficient (Satisfactory)";
  if (avg >= 75) return "Competency Met";
  return "Needs Review (<75%)";
}

/**
 * Helper to determine if a transmuted score meets DepEd DO 015 passing standard (>= 75)
 */
export function isPassingDepEd(transmutedGrade: number): boolean {
  return transmutedGrade >= 75;
}
