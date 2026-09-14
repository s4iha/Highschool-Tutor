import {
  buildJhsSlug,
  parseJhsSlug,
  getDistinctJhsSubjects,
  getDistinctShsSubjects,
  JHS_SUBJECTS,
  JHS_GRADES,
  JHS_TERMS,
} from "@/features/curriculum/utils/curriculum-data";

describe("Curriculum Deduplication & Distinct Subjects Utilities", () => {
  describe("Curriculum Constants", () => {
    it("should export correct JHS grades and terms", () => {
      expect(JHS_GRADES).toHaveLength(4);
      expect(JHS_GRADES).toContain("Grade 7");
      expect(JHS_GRADES).toContain("Grade 10");

      expect(JHS_TERMS).toHaveLength(3);
      expect(JHS_TERMS).toContain("Trimester 1");
      expect(JHS_TERMS).toContain("Trimester 3");
    });
  });

  describe("buildJhsSlug", () => {
    it("should build valid JHS slug with default values", () => {
      const slug = buildJhsSlug("MATH");
      expect(slug).toBe("g7-t1-math");
    });

    it("should build valid JHS slug with custom grade and term", () => {
      expect(buildJhsSlug("MATH", "Grade 8", "Trimester 2")).toBe("g8-t2-math");
      expect(buildJhsSlug("SCI", "Grade 10", "Trimester 3")).toBe("g10-t3-sci");
      expect(buildJhsSlug("ENG", "Grade 9", "Trimester 1")).toBe("g9-t1-eng");
    });

    it("should handle raw numbers in grade and term strings", () => {
      expect(buildJhsSlug("ap", "8", "2")).toBe("g8-t2-ap");
    });
  });

  describe("parseJhsSlug", () => {
    it("should correctly parse valid JHS slugs", () => {
      const parsed = parseJhsSlug("g8-t2-math");
      expect(parsed.isJhs).toBe(true);
      expect(parsed.grade).toBe("Grade 8");
      expect(parsed.term).toBe("Trimester 2");
      expect(parsed.abbr).toBe("MATH");
      expect(parsed.name).toBe("Mathematics");
    });

    it("should parse other JHS core subjects", () => {
      const parsedSci = parseJhsSlug("g10-t3-sci");
      expect(parsedSci.isJhs).toBe(true);
      expect(parsedSci.grade).toBe("Grade 10");
      expect(parsedSci.term).toBe("Trimester 3");
      expect(parsedSci.name).toBe("Science");

      const parsedMapeh = parseJhsSlug("g7-t1-mapeh");
      expect(parsedMapeh.isJhs).toBe(true);
      expect(parsedMapeh.abbr).toBe("MAPEH");
    });

    it("should return isJhs false for non-JHS slugs", () => {
      expect(parseJhsSlug("g11-s1-genmath").isJhs).toBe(false);
      expect(parseJhsSlug("g12-s2-phys2").isJhs).toBe(false);
      expect(parseJhsSlug("invalid-slug").isJhs).toBe(false);
    });
  });

  describe("getDistinctJhsSubjects", () => {
    it("should return exactly 8 unique core JHS subjects", () => {
      const subjects = getDistinctJhsSubjects("Grade 8", "Trimester 2");
      expect(subjects).toHaveLength(8);
      expect(subjects).toHaveLength(JHS_SUBJECTS.length);

      const names = subjects.map((s) => s.name);
      expect(names).toContain("Mathematics");
      expect(names).toContain("Science");
      expect(names).toContain("English");
      expect(names).toContain("Filipino");
      expect(names).toContain("Araling Panlipunan");
      expect(names).toContain("Edukasyon sa Pagpapakatao");
      expect(names).toContain("Music, Arts, Physical Education, and Health");
      expect(names).toContain("Technology and Livelihood Education");
    });

    it("should set defaultSlug matching the student's grade and term", () => {
      const subjects = getDistinctJhsSubjects("Grade 9", "Trimester 3");
      const math = subjects.find((s) => s.abbr === "MATH");
      expect(math?.defaultSlug).toBe("g9-t3-math");
      expect(math?.level).toBe("Junior High School");
      expect(math?.isJhsCore).toBe(true);
    });

    it("should fallback to Grade 7 Trimester 1 if given invalid parameters", () => {
      const subjects = getDistinctJhsSubjects("Grade 99", "Invalid Term");
      const math = subjects.find((s) => s.abbr === "MATH");
      expect(math?.defaultSlug).toBe("g7-t1-math");
    });
  });

  describe("getDistinctShsSubjects", () => {
    it("should return exactly 34 unique SHS subjects", () => {
      const shs = getDistinctShsSubjects();
      expect(shs).toHaveLength(34);

      shs.forEach((s) => {
        expect(s.level).toBe("Senior High School");
        expect(s.grade).toMatch(/Grade 11|Grade 12/);
        expect(s.term).toMatch(/Semester 1|Semester 2/);
        expect(s.defaultSlug).toBeTruthy();
      });
    });

    it("should reduce catalog card volume from 130 to 42 items", () => {
      const jhsCount = getDistinctJhsSubjects().length;
      const shsCount = getDistinctShsSubjects().length;
      const totalCatalogCards = jhsCount + shsCount;

      expect(totalCatalogCards).toBe(42);
      expect(totalCatalogCards).toBeLessThan(130);
    });
  });
});
