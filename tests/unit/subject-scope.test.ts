import {
  getSubjectScopeDefinition,
  getAllSubjectScopeSlugs,
  getAllSubjectScopeDefinitions,
  getJhsGradeQuarterScope,
} from "@/features/curriculum/utils/subject-scope-data";

describe("DepEd MATATAG Subject Scope Data Resolvers", () => {
  it("should resolve accurate metadata and 8-lesson syllabus for General Mathematics (SHS Core)", () => {
    const scope = getSubjectScopeDefinition("g11-s1-genmath");
    expect(scope).toBeDefined();
    expect(scope?.code).toBe("G11-S1-GENMATH");
    expect(scope?.name).toBe("General Mathematics");
    expect(scope?.timeAllotment).toBe("80 hours per semester");
    expect(scope?.level).toBe("Senior High School");
    expect(scope?.prerequisites).toEqual(["Junior High School Mathematics"]);
    expect(scope?.competencies.length).toBeGreaterThan(0);
    expect(scope?.lessons).toHaveLength(8);

    // Verify 8-lesson syllabus structure
    let totalDrills = 0;
    scope?.lessons.forEach((lesson, index) => {
      expect(lesson.lessonNumber).toBe(index + 1);
      expect(lesson.title).toBeTruthy();
      expect(lesson.summary).toBeTruthy();
      expect(lesson.keyConcepts.length).toBeGreaterThanOrEqual(3);
      expect(lesson.practiceDrillsCount).toBe(3);
      totalDrills += lesson.practiceDrillsCount;
    });
    expect(totalDrills).toBe(24);
  });

  it("should resolve accurate 20-hour time allotment and 8 lessons for Physical Education and Health", () => {
    const peh1 = getSubjectScopeDefinition("g11-s1-peh1");
    expect(peh1).toBeDefined();
    expect(peh1?.timeAllotment).toBe("20 hours per semester");
    expect(peh1?.lessons).toHaveLength(8);

    const peh2 = getSubjectScopeDefinition("g11-s2-peh2");
    expect(peh2).toBeDefined();
    expect(peh2?.timeAllotment).toBe("20 hours per semester");
    expect(peh2?.lessons).toHaveLength(8);
  });

  it("should resolve accurate prerequisite chain for Basic Calculus requiring Pre-Calculus", () => {
    const bascalc = getSubjectScopeDefinition("g11-s2-bascalc");
    expect(bascalc).toBeDefined();
    expect(bascalc?.prerequisites).toContain("Pre-Calculus");
    expect(bascalc?.lessons).toHaveLength(8);
  });

  it("should resolve JHS subject scope with weekly hours allotment, 8 lessons, and isJhsCore flag", () => {
    const jhsMath = getSubjectScopeDefinition("g7-q1-math");
    expect(jhsMath).toBeDefined();
    expect(jhsMath?.level).toBe("Junior High School");
    expect(jhsMath?.timeAllotment).toContain("hours per week");
    expect(jhsMath?.competencies.length).toBeGreaterThan(0);
    expect(jhsMath?.isJhsCore).toBe(true);
    expect(jhsMath?.abbr).toBe("MATH");
    expect(jhsMath?.lessons).toHaveLength(8);
  });

  it("should resolve grade- and quarter-specific JHS scope via getJhsGradeQuarterScope", () => {
    const g8q2Math = getJhsGradeQuarterScope("MATH", "Grade 8", "Quarter 2");
    expect(g8q2Math).toBeDefined();
    expect(g8q2Math.grade).toBe("Grade 8");
    expect(g8q2Math.quarter).toBe("Quarter 2");
    expect(g8q2Math.slug).toBe("g8-q2-math");
    expect(g8q2Math.lessons).toHaveLength(8);
    expect(g8q2Math.lessons[0].title).toContain("Linear Inequalities");

    const g9q4Math = getJhsGradeQuarterScope("MATH", "Grade 9", "Quarter 4");
    expect(g9q4Math.lessons[0].title).toContain("Trigonometric");
  });

  it("should return undefined for non-existent subject slug", () => {
    const notFound = getSubjectScopeDefinition("non-existent-slug-xyz");
    expect(notFound).toBeUndefined();
  });

  it("should return non-empty list of canonical slugs for static generation", () => {
    const slugs = getAllSubjectScopeSlugs();
    expect(slugs.length).toBeGreaterThan(20);
    expect(slugs).toContain("g11-s1-genmath");
    // Ensure zero legacy trimester slugs in static slugs
    const legacyTrimester = slugs.filter((s) => /-t[1-3]-/.test(s));
    expect(legacyTrimester).toHaveLength(0);
  });

  it("should resolve all definitions with valid required fields and 8 lessons", () => {
    const definitions = getAllSubjectScopeDefinitions();
    expect(definitions.length).toBe(108); // Exactly 108 deduplicated subjects
    for (const def of definitions) {
      expect(def.slug).toBeTruthy();
      expect(def.code).toBeTruthy();
      expect(def.name).toBeTruthy();
      expect(def.timeAllotment).toBeTruthy();
      expect(def.description).toBeTruthy();
      expect(Array.isArray(def.competencies)).toBe(true);
      expect(def.competencies.length).toBeGreaterThan(0);
      expect(Array.isArray(def.lessons)).toBe(true);
      expect(def.lessons).toHaveLength(8);
    }
  });
});
