import fs from "fs";
import path from "path";

describe("StatsBar Component Source & Metric Integrity", () => {
  const statsPath = path.join(process.cwd(), "features/landing/components/StatsBar.tsx");
  const statsSource = fs.readFileSync(statsPath, "utf-8");

  it("should never contain fabricated vanity metrics", () => {
    expect(statsSource).not.toContain("15,000+");
    expect(statsSource).not.toContain("98.2%");
    expect(statsSource).not.toContain("130+");
    expect(statsSource).not.toContain("12 / 24");
  });

  it("should consume useLandingStatsQuery or catalog baseline stats", () => {
    expect(statsSource).toMatch(/useLandingStatsQuery|CATALOG_BASELINE_STATS/);
  });

  it("should render 4 authoritative DepEd MATATAG curriculum proof cards", () => {
    expect(statsSource).toContain("totalSubjects");
    expect(statsSource).toContain("practiceDrills");
    expect(statsSource).toContain("lessonModules");
    expect(statsSource).toContain("curriculumStandard");
  });
});
