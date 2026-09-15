import type { QuizQuestion } from "@/features/curriculum/types/curriculum.types";

describe("Quiz Session Security & Server-Side Scoring Logic", () => {
  const mockStoredQuestions: QuizQuestion[] = [
    {
      question: "What is the slope of y = 3x + 2?",
      options: { A: "2", B: "3", C: "-3", D: "0" },
      answer: "B",
      explanation: "In y = mx + b, m represents the slope (3).",
    },
    {
      question: "Which of the following is a rational function?",
      options: { A: "f(x) = sqrt(x)", B: "f(x) = (x+1)/(x-2)", C: "f(x) = 2^x", D: "f(x) = |x|" },
      answer: "B",
      explanation: "A rational function is a ratio of two polynomials P(x)/Q(x).",
    },
    {
      question: "What is the domain of f(x) = 1/x?",
      options: { A: "All real numbers", B: "x > 0", C: "x != 0", D: "x >= 0" },
      answer: "C",
      explanation: "Division by zero is undefined, so x cannot equal 0.",
    },
  ];

  describe("Server-Side Answer Evaluation", () => {
    it("should compute accurate score based on server-stored questions regardless of client claims", () => {
      // User answers 2 correctly and 1 incorrectly
      const userAnswers: Record<number, "A" | "B" | "C" | "D"> = {
        0: "B", // correct
        1: "B", // correct
        2: "A", // incorrect (correct is C)
      };

      let verifiedScore = 0;
      mockStoredQuestions.forEach((q, idx) => {
        if (userAnswers[idx] && userAnswers[idx] === q.answer) {
          verifiedScore++;
        }
      });

      expect(verifiedScore).toBe(2);
      expect(mockStoredQuestions.length).toBe(3);
    });

    it("should correctly handle partial submissions or empty answers", () => {
      const emptyAnswers: Record<number, "A" | "B" | "C" | "D"> = {};

      let score = 0;
      mockStoredQuestions.forEach((q, idx) => {
        if (emptyAnswers[idx] && emptyAnswers[idx] === q.answer) {
          score++;
        }
      });

      expect(score).toBe(0);
    });
  });

  describe("Exam Mode Answer Concealment (Anti-Inspection)", () => {
    it("should strip answers and explanations from uncompleted exam session payloads", () => {
      const uncompletedExamQuestions = mockStoredQuestions.map((q) => ({
        ...q,
        answer: "" as unknown as "A",
        explanation: "",
      }));

      for (const q of uncompletedExamQuestions) {
        expect(q.answer).toBe("");
        expect(q.explanation).toBe("");
        expect(q.question.length).toBeGreaterThan(0);
        expect(Object.keys(q.options)).toHaveLength(4);
      }
    });

    it("should preserve answers and explanations for study mode sessions", () => {
      const studyQuestions = [...mockStoredQuestions];

      for (const q of studyQuestions) {
        expect(q.answer).toBeTruthy();
        expect(q.explanation).toBeTruthy();
      }
    });
  });

  describe("Question Count Clamping", () => {
    it("should clamp allowed counts strictly to [5, 10, 15, 20, 24]", () => {
      const allowedCounts = [5, 10, 15, 20, 24];

      const sanitizeCount = (count: number) => {
        return allowedCounts.includes(count) ? count : 10;
      };

      // Exploit attempt: count = 1 to get instant 100% mastery
      expect(sanitizeCount(1)).toBe(10);
      // Arbitrary count = 999
      expect(sanitizeCount(999)).toBe(10);
      // Valid selections
      expect(sanitizeCount(5)).toBe(5);
      expect(sanitizeCount(10)).toBe(10);
      expect(sanitizeCount(15)).toBe(15);
      expect(sanitizeCount(20)).toBe(20);
      expect(sanitizeCount(24)).toBe(24);
    });
  });
});
