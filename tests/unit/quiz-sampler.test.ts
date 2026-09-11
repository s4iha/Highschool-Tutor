import { sampleQuizQuestions } from "@/features/curriculum/utils/quiz-sampler";
import type { QuizQuestion } from "@/features/curriculum/types/curriculum.types";

describe("sampleQuizQuestions", () => {
  const dummyQuestions: QuizQuestion[] = Array.from({ length: 24 }, (_, i) => ({
    question: `Question ${i + 1}`,
    options: {
      A: `Option A for Q${i + 1}`,
      B: `Option B for Q${i + 1}`,
      C: `Option C for Q${i + 1}`,
      D: `Option D for Q${i + 1}`,
    },
    answer: "A" as const,
    explanation: `Explanation for Q${i + 1}`,
  }));

  it("should return an empty array if input questions is empty", () => {
    expect(sampleQuizQuestions([], 10)).toEqual([]);
  });

  it("should sample exactly requested number of questions when count is within range", () => {
    const sampled5 = sampleQuizQuestions(dummyQuestions, 5);
    expect(sampled5).toHaveLength(5);

    const sampled10 = sampleQuizQuestions(dummyQuestions, 10);
    expect(sampled10).toHaveLength(10);

    const sampled15 = sampleQuizQuestions(dummyQuestions, 15);
    expect(sampled15).toHaveLength(15);
  });

  it("should clamp to total available if requested count exceeds pool size", () => {
    const sampled30 = sampleQuizQuestions(dummyQuestions, 30);
    expect(sampled30).toHaveLength(24);
  });

  it("should return at least 1 question when count is 0 or negative", () => {
    const sampledZero = sampleQuizQuestions(dummyQuestions, 0);
    expect(sampledZero).toHaveLength(1);
  });

  it("should return distinct questions without duplicates in the sampled subset", () => {
    const sampled = sampleQuizQuestions(dummyQuestions, 10);
    const questionTexts = sampled.map((q) => q.question);
    const uniqueTexts = new Set(questionTexts);
    expect(uniqueTexts.size).toBe(10);
  });

  it("should not mutate the original questions array", () => {
    const originalLength = dummyQuestions.length;
    const firstQuestionBefore = dummyQuestions[0].question;

    sampleQuizQuestions(dummyQuestions, 5);

    expect(dummyQuestions).toHaveLength(originalLength);
    expect(dummyQuestions[0].question).toBe(firstQuestionBefore);
  });
});
