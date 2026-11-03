import fs from "fs";
import path from "path";

describe("PopularSubjectsSection & CategorySection Component Audits", () => {
  const popularPath = path.join(process.cwd(), "features/landing/components/PopularSubjectsSection.tsx");
  const popularSource = fs.readFileSync(popularPath, "utf-8");

  const categoryPath = path.join(process.cwd(), "features/landing/components/CategorySection.tsx");
  const categorySource = fs.readFileSync(categoryPath, "utf-8");

  it("should never contain star ratings or review counts in PopularSubjectsSection", () => {
    expect(popularSource).not.toMatch(/<Star\b/);
    expect(popularSource).not.toMatch(/import\s*\{[^}]*Star[^}]*\}\s*from/);
    expect(popularSource).not.toContain("4.9");
    expect(popularSource).not.toContain("2.4K");
    expect(popularSource).not.toContain("1.8K");
    expect(popularSource).not.toContain("130+");
  });

  it("should reference official DepEd 75+ subjects and Quarter in PopularSubjectsSection", () => {
    expect(popularSource).toContain("View All 75+ DepEd Subjects");
    expect(popularSource).toContain("FEATURED_POPULAR_SUBJECTS");
    expect(popularSource).not.toContain("Trimester");
  });

  it("should use GraduationCap instead of Code icon for SHS Core in CategorySection", () => {
    expect(categorySource).toContain("GraduationCap");
    expect(categorySource).not.toMatch(/icon:\s*Code/);
    expect(categorySource).toContain("15 DepEd Core Subjects");
  });

  it("should reflect accurate DepEd subject and offering counts in CategorySection", () => {
    expect(categorySource).toContain("8 Core (32 Offerings)");
    expect(categorySource).toContain("11 Specialized Subjects");
    expect(categorySource).toContain("9 Specialized Subjects");
    expect(categorySource).toContain("7 Specialized Subjects");
    expect(categorySource).toContain("8 sequential lesson modules and 24 practice drills");
  });
});
