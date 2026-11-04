import {
  getSubjectScopeDefinition,
  getAllSubjectScopeSlugs,
  getAllSubjectScopeDefinitions,
  BASE_SCOPE_REGISTRY,
} from "@/features/curriculum/utils/subject-scope-data";

describe("DepEd MATATAG Subject Scope Data Resolvers", () => {
  it("should resolve accurate metadata for General Mathematics (SHS Core)", () => {
    const scope = getSubjectScopeDefinition("g11-s1-genmath");
    expect(scope).toBeDefined();
    expect(scope?.code).toBe("G11-S1-GENMATH");
    expect(scope?.name).toBe("General Mathematics");
    expect(scope?.timeAllotment).toBe("80 hours per semester");
    expect(scope?.level).toBe("Senior High School");
    expect(scope?.prerequisites).toEqual(["Junior High School Mathematics"]);
    expect(scope?.competencies.length).toBeGreaterThan(0);
  });

  it("should resolve accurate 20-hour time allotment for Physical Education and Health", () => {
    const peh1 = getSubjectScopeDefinition("g11-s1-peh1");
    expect(peh1).toBeDefined();
    expect(peh1?.timeAllotment).toBe("20 hours per semester");

    const peh2 = getSubjectScopeDefinition("g11-s2-peh2");
    expect(peh2).toBeDefined();
    expect(peh2?.timeAllotment).toBe("20 hours per semester");
  });

  it("should resolve accurate prerequisite chain for Basic Calculus requiring Pre-Calculus", () => {
    const bascalc = getSubjectScopeDefinition("g11-s2-bascalc");
    expect(bascalc).toBeDefined();
    expect(bascalc?.prerequisites).toContain("Pre-Calculus");
  });

  it("should resolve JHS subject scope with weekly hours allotment", () => {
    const jhsMath = getSubjectScopeDefinition("g7-q1-math");
    expect(jhsMath).toBeDefined();
    expect(jhsMath?.level).toBe("Junior High School");
    expect(jhsMath?.timeAllotment).toContain("hours per week");
    expect(jhsMath?.competencies.length).toBeGreaterThan(0);
  });

  it("should return undefined for non-existent subject slug", () => {
    const notFound = getSubjectScopeDefinition("non-existent-slug-xyz");
    expect(notFound).toBeUndefined();
  });

  it("should return non-empty list of canonical slugs for static generation", () => {
    const slugs = getAllSubjectScopeSlugs();
    expect(slugs.length).toBeGreaterThan(20);
    expect(slugs).toContain("g11-s1-genmath");
  });

  it("should resolve all definitions with valid required fields", () => {
    const definitions = getAllSubjectScopeDefinitions();
    expect(definitions.length).toBeGreaterThan(20);
    for (const def of definitions) {
      expect(def.slug).toBeTruthy();
      expect(def.code).toBeTruthy();
      expect(def.name).toBeTruthy();
      expect(def.timeAllotment).toBeTruthy();
      expect(def.description).toBeTruthy();
      expect(Array.isArray(def.competencies)).toBe(true);
      expect(def.competencies.length).toBeGreaterThan(0);
    }
  });
});
