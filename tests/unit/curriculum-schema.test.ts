import {
  subjectSchema,
  quizQuestionSchema,
  lessonSchema,
  recordAttemptInputSchema,
  batchTranslateQuizInputSchema,
  askTutorInputSchema,
} from "@/features/curriculum/schemas/curriculum.schema";

describe("Curriculum Zod Schemas Validation", () => {
  it("should validate a valid Subject schema object", () => {
    const validSubject = {
      code: "GENMATH",
      slug: "genmath",
      name: "General Mathematics",
      grade: "Grade 11",
      term: "Semester 1",
      level: "Senior High School",
    };

    const result = subjectSchema.safeParse(validSubject);
    expect(result.success).toBe(true);
  });

  it("should reject an invalid subject slug format", () => {
    const invalidSubject = {
      code: "MATH",
      slug: "Math_With_Uppercase",
      name: "Mathematics",
      grade: "Grade 7",
      term: "Trimester 1",
      level: "Junior High School",
    };

    const result = subjectSchema.safeParse(invalidSubject);
    expect(result.success).toBe(false);
  });

  it("should validate a quiz question format", () => {
    const validQuizQuestion = {
      question: "What is the primary powerhouse of a cell?",
      options: {
        A: "Nucleus",
        B: "Mitochondria",
        C: "Ribosome",
        D: "Endoplasmic Reticulum",
      },
      answer: "B",
      explanation: "Mitochondria produce the energy (ATP) required for cellular functions.",
    };

    const result = quizQuestionSchema.safeParse(validQuizQuestion);
    expect(result.success).toBe(true);
  });

  it("should validate score attempt input", () => {
    const validAttempt = {
      subjectSlug: "earthsci",
      subjectCode: "EARTHSCI",
      lessonNumber: 1,
      lessonTitle: "Origin and Structure of the Earth",
      score: 8,
      total: 10,
      mode: "exam" as const,
    };

    const result = recordAttemptInputSchema.safeParse(validAttempt);
    expect(result.success).toBe(true);
  });

  it("should validate a structured lesson outline schema", () => {
    const validLesson = {
      number: 1,
      title: "Functions and Their Graphs",
      summary: "Understanding linear, quadratic, and piecewise function representations.",
      keyConcepts: ["Domain", "Range", "Piecewise Functions"],
    };

    const result = lessonSchema.safeParse(validLesson);
    expect(result.success).toBe(true);
  });

  describe("batchTranslateQuizInputSchema", () => {
    it("should validate a complete quiz translation input payload", () => {
      const payload = {
        question: "What is the inverse function of f(x) = 2x + 1?",
        options: {
          A: "(x - 1) / 2",
          B: "(x + 1) / 2",
          C: "2x - 1",
          D: "1 / (2x + 1)",
        },
        explanation: "To find the inverse, swap x and y and solve for y.",
        language: "Taglish",
      };

      const result = batchTranslateQuizInputSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject payload with missing options", () => {
      const payload = {
        question: "What is the inverse function?",
        options: {
          A: "Option A",
          B: "Option B",
        },
        explanation: "Explanation",
        language: "Taglish",
      };

      const result = batchTranslateQuizInputSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject payload with unsupported language", () => {
      const payload = {
        question: "What is the inverse function?",
        options: {
          A: "A",
          B: "B",
          C: "C",
          D: "D",
        },
        explanation: "Explanation",
        language: "Klingon",
      };

      const result = batchTranslateQuizInputSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("askTutorInputSchema with persona support", () => {
    it("should accept valid payload with default socratic persona", () => {
      const payload = {
        subjectSlug: "math-7-q1",
        lessonTitle: "Sets and Real Numbers",
        question: "What is a subset?",
        options: { A: "Part of set", B: "Whole set", C: "Empty", D: "Universal" },
        answer: "A",
        explanation: "A subset contains elements of another set.",
        language: "English",
        history: [{ role: "user", content: "Hi" }, { role: "assistant", content: "Let's explore." }],
        message: "Can you give me an analogy?",
      };

      const parsed = askTutorInputSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.persona).toBe("socratic");
      }
    });

    it("should accept explicit persona: detailed and exam-prep", () => {
      const detailedPayload = {
        subjectSlug: "math-7-q1",
        lessonTitle: "Sets",
        question: "Q",
        options: { A: "1", B: "2", C: "3", D: "4" },
        answer: "A",
        explanation: "Exp",
        persona: "detailed",
        history: [],
        message: "Explain in detail please",
      };

      const examPayload = {
        ...detailedPayload,
        persona: "exam-prep",
        message: "What are common test mistakes?",
      };

      expect(askTutorInputSchema.safeParse(detailedPayload).success).toBe(true);
      expect(askTutorInputSchema.safeParse(examPayload).success).toBe(true);
    });

    it("should reject invalid persona value", () => {
      const invalidPayload = {
        subjectSlug: "math-7-q1",
        lessonTitle: "Sets",
        question: "Q",
        options: { A: "1", B: "2", C: "3", D: "4" },
        answer: "A",
        explanation: "Exp",
        persona: "unrestricted-pirate",
        history: [],
        message: "Hello",
      };

      const result = askTutorInputSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
