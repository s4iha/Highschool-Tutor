import {
  subjectSchema,
  quizQuestionSchema,
  lessonSchema,
  recordAttemptInputSchema,
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
});
