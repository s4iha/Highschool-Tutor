import { resolveOnboardingDefaults } from "@/features/auth/utils/onboarding-defaults";

describe("User Story 2: Onboarding Default Grading Period Resolution", () => {
  it("defaults to Grade 11, STEM Strand, and Semester 1 when no prior preferences exist", () => {
    const defaults = resolveOnboardingDefaults();
    expect(defaults.gradeLevel).toBe("Grade 11");
    expect(defaults.track).toBe("STEM Strand");
    expect(defaults.termPreference).toBe("Semester 1");
  });

  it("resolves Senior High (Grade 12) with Semester 1 when no term specified", () => {
    const defaults = resolveOnboardingDefaults("Grade 12", "ABM Strand", null);
    expect(defaults.gradeLevel).toBe("Grade 12");
    expect(defaults.track).toBe("ABM Strand");
    expect(defaults.termPreference).toBe("Semester 1");
  });

  it("corrects invalid Quarter preference to Semester 1 for Senior High", () => {
    const defaults = resolveOnboardingDefaults("Grade 11", "HUMSS Strand", "Quarter 1");
    expect(defaults.gradeLevel).toBe("Grade 11");
    expect(defaults.termPreference).toBe("Semester 1");
  });

  it("preserves valid Semester 2 for Senior High", () => {
    const defaults = resolveOnboardingDefaults("Grade 11", "STEM Strand", "Semester 2");
    expect(defaults.termPreference).toBe("Semester 2");
  });

  it("resolves Junior High (Grade 7) with Quarter 1 and JHS Core", () => {
    const defaults = resolveOnboardingDefaults("Grade 7", null, null);
    expect(defaults.gradeLevel).toBe("Grade 7");
    expect(defaults.track).toBe("JHS Core");
    expect(defaults.termPreference).toBe("Quarter 1");
  });

  it("corrects invalid Semester preference to Quarter 1 for Junior High (Grade 10)", () => {
    const defaults = resolveOnboardingDefaults("Grade 10", "STEM Strand", "Semester 1");
    expect(defaults.gradeLevel).toBe("Grade 10");
    expect(defaults.track).toBe("JHS Core");
    expect(defaults.termPreference).toBe("Quarter 1");
  });

  it("preserves valid Quarter 3 for Junior High (Grade 8)", () => {
    const defaults = resolveOnboardingDefaults("Grade 8", "JHS Core", "Quarter 3");
    expect(defaults.termPreference).toBe("Quarter 3");
  });
});
