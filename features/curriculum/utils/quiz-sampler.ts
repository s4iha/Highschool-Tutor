import type { QuizQuestion } from "../types/curriculum.types";

/**
 * Randomly samples `count` questions from the full `questions` pool using
 * the Fisher-Yates shuffle algorithm.
 *
 * @param questions Full pool of quiz questions from database cache
 * @param count Desired number of questions to sample
 * @returns Array of sampled QuizQuestions, clamped between 1 and questions.length
 */
export function sampleQuizQuestions(
  questions: QuizQuestion[],
  count: number
): QuizQuestion[] {
  if (!questions || questions.length === 0) {
    return [];
  }

  const targetCount = Math.min(Math.max(1, count), questions.length);
  const pool = [...questions];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }

  return pool.slice(0, targetCount);
}

export interface SelectTargetedPracticeParams {
  availableQuestions: QuizQuestion[];
  missedQuestionTexts?: string[];
  keyConcepts?: string[];
  count?: number;
}

/**
 * Diagnostic-driven question selector for Targeted Practice:
 * - Tier 1: Questions previously missed or unanswered in past attempts
 * - Tier 2: Questions matching the lesson's diagnostic keyConcepts keywords
 * - Tier 3: Remaining pool questions shuffled via Fisher-Yates to reach `count`
 *
 * Ensures deduplication and clamped output length.
 */
export function selectTargetedPracticeQuestions({
  availableQuestions,
  missedQuestionTexts = [],
  keyConcepts = [],
  count = 10,
}: SelectTargetedPracticeParams): QuizQuestion[] {
  if (!availableQuestions || availableQuestions.length === 0) {
    return [];
  }

  const targetCount = Math.min(Math.max(1, count), availableQuestions.length);
  const selected: QuizQuestion[] = [];
  const selectedIndices = new Set<number>();

  // Normalize missed question strings
  const normalizedMissed = new Set(
    missedQuestionTexts.map((q) => q.trim().toLowerCase()).filter(Boolean)
  );

  // Normalize key concepts
  const normalizedConcepts = keyConcepts
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

  // Tier 1: Questions matching previously missed question texts
  if (normalizedMissed.size > 0) {
    for (let i = 0; i < availableQuestions.length; i++) {
      if (selected.length >= targetCount) break;
      const q = availableQuestions[i];
      if (normalizedMissed.has(q.question.trim().toLowerCase())) {
        selected.push(q);
        selectedIndices.add(i);
      }
    }
  }

  // Tier 2: Questions matching keyConcepts keywords
  if (selected.length < targetCount && normalizedConcepts.length > 0) {
    for (let i = 0; i < availableQuestions.length; i++) {
      if (selected.length >= targetCount) break;
      if (selectedIndices.has(i)) continue;

      const q = availableQuestions[i];
      const searchableText = `${q.question} ${q.explanation || ""} ${Object.values(
        q.options || {}
      ).join(" ")}`.toLowerCase();

      const matchesConcept = normalizedConcepts.some((concept) =>
        searchableText.includes(concept)
      );

      if (matchesConcept) {
        selected.push(q);
        selectedIndices.add(i);
      }
    }
  }

  // Tier 3: Remaining pool fallback with Fisher-Yates shuffle
  if (selected.length < targetCount) {
    const remainingIndices: number[] = [];
    for (let i = 0; i < availableQuestions.length; i++) {
      if (!selectedIndices.has(i)) {
        remainingIndices.push(i);
      }
    }

    // Shuffle remaining indices
    for (let i = remainingIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = remainingIndices[i];
      remainingIndices[i] = remainingIndices[j];
      remainingIndices[j] = temp;
    }

    for (const idx of remainingIndices) {
      if (selected.length >= targetCount) break;
      selected.push(availableQuestions[idx]);
      selectedIndices.add(idx);
    }
  }

  return selected;
}
