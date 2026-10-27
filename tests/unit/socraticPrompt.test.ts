import { buildTutorSystemPrompt } from "@/features/curriculum/api/gemini-service";

describe("Question-Level Socratic AI Context Guardrails", () => {
  const sampleParams = {
    subjectName: "General Mathematics",
    lessonTitle: "Rational Functions, Equations, and Inequalities",
    question: "Solve for x: (2x + 1) / (x - 3) = 5",
    options: {
      A: "x = 16/3",
      B: "x = 4",
      C: "x = -4",
      D: "x = 3",
    },
    answer: "A",
    explanation: "Multiply both sides by (x - 3): 2x + 1 = 5(x - 3) => 2x + 1 = 5x - 15 => 16 = 3x => x = 16/3.",
    language: "Taglish",
    persona: "socratic" as const,
    questionIndex: 2,
    totalQuestions: 10,
  };

  it("should explicitly instruct the tutor to focus strictly on the active question and ban broad subject lectures", () => {
    const prompt = buildTutorSystemPrompt(sampleParams);

    expect(prompt).toContain("Solve for x: (2x + 1) / (x - 3) = 5");
    expect(prompt).toMatch(/focus exclusively on the active (quiz )?question/i);
    expect(prompt).toMatch(/do NOT lecture on the broad subject/i);
    expect(prompt).toMatch(/specific numbers|equations|terms/i);
  });

  it("should contain strict socratic mode guardrails against revealing answers", () => {
    const prompt = buildTutorSystemPrompt(sampleParams);

    expect(prompt).toContain("SOCRATIC MODE (STRICT)");
    expect(prompt).toContain("NEVER reveal the correct option letter");
    expect(prompt).toContain("Option A");
  });

  it("should incorporate question index anchoring when provided", () => {
    const prompt = buildTutorSystemPrompt(sampleParams);

    expect(prompt).toContain("Question #3 of 10");
  });

  it("should prohibit conversational pleasantries/greetings", () => {
    const prompt = buildTutorSystemPrompt(sampleParams);

    expect(prompt).toMatch(/never start your response with any greeting/i);
  });
});
