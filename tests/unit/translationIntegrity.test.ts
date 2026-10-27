import {
  batchTranslateQuizQuestion,
  type TranslatableQuizQuestion,
} from "@/features/curriculum/api/gemini-service";

describe("Language Translation Integrity (Preserve English Choices)", () => {
  const originalFetch = global.fetch;
  const originalEnvKey = process.env.GEMINI_API_KEY;

  beforeAll(() => {
    process.env.GEMINI_API_KEY = "test-mock-api-key";
  });

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalEnvKey;
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGeminiJson = (data: Record<string, unknown>) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(data) }],
            },
          },
        ],
      }),
    });
  };

  const sampleQuestion: TranslatableQuizQuestion = {
    question: "What is the slope of the line given by the equation $y = 3x - 5$?",
    options: {
      A: "3",
      B: "-5",
      C: "5/3",
      D: "Undefined",
    },
    explanation: "In the slope-intercept form $y = mx + b$, $m$ represents the slope. Here, $m = 3$.",
  };

  it("should return identical question and options without calling Gemini when language is English", async () => {
    global.fetch = jest.fn();
    const result = await batchTranslateQuizQuestion(sampleQuestion, "English");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.question).toBe(sampleQuestion.question);
    expect(result.options).toEqual(sampleQuestion.options);
    expect(result.explanation).toBe(sampleQuestion.explanation);
  });

  it("should preserve options A, B, C, D strictly in English when translating into Taglish", async () => {
    mockGeminiJson({
      question: "Ano ang slope ng linya batay sa equation na $y = 3x - 5$?",
      explanation: "Sa slope-intercept form na $y = mx + b$, ang $m$ ang slope. Dito, $m = 3$.",
    });

    const result = await batchTranslateQuizQuestion(sampleQuestion, "Taglish");

    expect(result.question).toContain("Ano ang slope");
    expect(result.explanation).toContain("slope-intercept");
    // Choices MUST remain 100% identical to the original English options
    expect(result.options).toEqual({
      A: "3",
      B: "-5",
      C: "5/3",
      D: "Undefined",
    });
    expect(result.options.D).toBe("Undefined");
  });

  it("should preserve complex English choices with scientific/academic terms when translating to Cebuano", async () => {
    const scienceQuestion: TranslatableQuizQuestion = {
      question: "Which organelle is considered the powerhouse of the cell?",
      options: {
        A: "Mitochondria",
        B: "Nucleus",
        C: "Endoplasmic Reticulum",
        D: "Golgi Apparatus",
      },
      explanation: "Mitochondria generate most of the chemical energy needed to power the biochemical reactions.",
    };

    mockGeminiJson({
      question: "Unsa nga organelle ang giisip nga powerhouse sa selula?",
      explanation: "Ang mitochondria maoy nagahimo sa kadaghanan sa kemikal nga enerhiya.",
    });

    const result = await batchTranslateQuizQuestion(scienceQuestion, "Cebuano");

    expect(result.question).toContain("powerhouse sa selula");
    // Academic English terms in options must not be translated or altered
    expect(result.options).toEqual(scienceQuestion.options);
    expect(result.options.A).toBe("Mitochondria");
    expect(result.options.C).toBe("Endoplasmic Reticulum");
  });

  it("should preserve LaTeX math formulas inside question and explanation", async () => {
    const mathQuestion: TranslatableQuizQuestion = {
      question: "Evaluate $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$.",
      options: {
        A: "0",
        B: "1",
        C: "$\\infty$",
        D: "Does not exist",
      },
      explanation: "Using L'Hôpital's Rule or fundamental trigonometric limits, $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$.",
    };

    mockGeminiJson({
      question: "Kalkulahin ang halaga ng $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$.",
      explanation: "Gamit ang fundamental trigonometric limits, $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$.",
    });

    const result = await batchTranslateQuizQuestion(mathQuestion, "Filipino");

    expect(result.question).toContain("$\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$");
    expect(result.explanation).toContain("$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$");
    expect(result.options.C).toBe("$\\infty$");
    expect(result.options.D).toBe("Does not exist");
  });
});
