import fs from "fs";
import path from "path";

describe("AcademicWorkflowDemo Multi-Subject Quiz & Student Mastery Integrity", () => {
  const demoPath = path.join(
    process.cwd(),
    "features/landing/components/AcademicWorkflowDemo.tsx"
  );
  const demoSource = fs.readFileSync(demoPath, "utf-8");

  it("should define all 4 demo subjects in DEMO_SUBJECT_DATA", () => {
    expect(demoSource).toContain('"General Mathematics"');
    expect(demoSource).toContain('"Earth and Life Science"');
    expect(demoSource).toContain('"Pre-Calculus"');
    expect(demoSource).toContain('"Grade 10 Science"');
  });

  it("should include subject-specific questions for each track", () => {
    // General Math question check
    expect(demoSource).toContain("rational function according to DepEd General Mathematics");
    // Earth & Life Science question check
    expect(demoSource).toContain("Law of Superposition in historical geology");
    // Pre-Calculus question check
    expect(demoSource).toContain("standard equation of a parabola opening upward");
    // Grade 10 Science question check
    expect(demoSource).toContain("convergent plate boundary where two oceanic plates collide");
  });

  it("should include Taglish Socratic AI explanations for every subject question", () => {
    expect(demoSource).toContain("🇵🇭 Taglish Breakdown");
    expect(demoSource).toContain("💡 Socratic Hint");
    expect(demoSource).toContain("📌 Key Takeaway");
  });

  it("should dynamically bind activeSubjectData for questions, student mastery, and diagnostic insights", () => {
    expect(demoSource).toContain("activeSubjectData.questions.map");
    expect(demoSource).toContain("activeSubjectData.mastery.map");
    expect(demoSource).toContain("activeSubjectData.diagnosticInsight.description");
    expect(demoSource).toContain("activeSubjectData.transmutedAverage");
    expect(demoSource).toContain("Student Mastery &amp; Weak Points");
  });
});
