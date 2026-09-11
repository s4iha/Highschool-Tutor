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
