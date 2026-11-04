import {
  sampleQuizQuestions,
  selectTargetedPracticeQuestions,
} from "@/features/curriculum/utils/quiz-sampler";
import type { QuizQuestion } from "@/features/curriculum/types/curriculum.types";

describe("quiz-sampler tests", () => {
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

  describe("sampleQuizQuestions", () => {
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

  describe("selectTargetedPracticeQuestions (3-Tier Prioritization)", () => {
    const pool: QuizQuestion[] = [
      {
        question: "What is the domain of f(x) = 1/x?",
        options: { A: "x != 0", B: "All real", C: "x > 0", D: "x < 0" },
        answer: "A",
        explanation: "Cannot divide by zero.",
      },
      {
        question: "Calculate the vertical asymptote of (x+2)/(x-3).",
        options: { A: "x = 3", B: "x = -2", C: "y = 1", D: "None" },
        answer: "A",
        explanation: "Denominator is zero at x = 3.",
      },
      {
        question: "Define a piecewise function.",
        options: { A: "Multiple sub-functions", B: "Single linear line", C: "Parabola", D: "Constant" },
        answer: "A",
        explanation: "A function defined by multiple sub-functions.",
      },
      {
        question: "Find the x-intercept of 2x - 4 = 0.",
        options: { A: "2", B: "-2", C: "4", D: "0" },
        answer: "A",
        explanation: "Set y to 0, 2x = 4 -> x = 2.",
      },
      {
        question: "What is the range of f(x) = x^2?",
        options: { A: "y >= 0", B: "y <= 0", C: "All real", D: "y > 0" },
        answer: "A",
        explanation: "Squares are non-negative.",
      },
    ];

    it("should prioritize Tier 1 missed questions first, then Tier 2 keyConcepts, then Tier 3 remaining", () => {
      const result = selectTargetedPracticeQuestions({
        availableQuestions: pool,
        missedQuestionTexts: ["Define a piecewise function."], // Tier 1
        keyConcepts: ["Asymptote", "Intercept"],                // Tier 2: questions 2 & 4
        count: 4,
      });

      expect(result).toHaveLength(4);
      // First must be Tier 1 missed question
      expect(result[0].question).toBe("Define a piecewise function.");
      // Questions 2 and 4 match keyConcepts
      const tier2Texts = [result[1].question, result[2].question];
      expect(tier2Texts).toContain("Calculate the vertical asymptote of (x+2)/(x-3).");
      expect(tier2Texts).toContain("Find the x-intercept of 2x - 4 = 0.");
      // Fourth question is from remaining pool (Tier 3)
      expect(["What is the domain of f(x) = 1/x?", "What is the range of f(x) = x^2?"]).toContain(
        result[3].question
      );
    });

    it("should deduplicate questions if a missed question also matches a key concept", () => {
      const result = selectTargetedPracticeQuestions({
        availableQuestions: pool,
        missedQuestionTexts: ["Calculate the vertical asymptote of (x+2)/(x-3)."],
        keyConcepts: ["Asymptote"],
        count: 3,
      });

      expect(result).toHaveLength(3);
      const questionTexts = result.map((q) => q.question);
      const unique = new Set(questionTexts);
      expect(unique.size).toBe(3);
      expect(questionTexts[0]).toBe("Calculate the vertical asymptote of (x+2)/(x-3).");
    });

    it("should clamp to available questions count if requested count exceeds available", () => {
      const result = selectTargetedPracticeQuestions({
        availableQuestions: pool,
        count: 10,
      });

      expect(result).toHaveLength(pool.length);
    });

    it("should return empty array when availableQuestions is empty", () => {
      const result = selectTargetedPracticeQuestions({
        availableQuestions: [],
        missedQuestionTexts: ["Something"],
        count: 5,
      });

      expect(result).toEqual([]);
    });

    it("should function smoothly when missedQuestionTexts and keyConcepts are empty (pure Tier 3 shuffle)", () => {
      const result = selectTargetedPracticeQuestions({
        availableQuestions: pool,
        count: 3,
      });

      expect(result).toHaveLength(3);
      const unique = new Set(result.map((q) => q.question));
      expect(unique.size).toBe(3);
    });
  });
});
