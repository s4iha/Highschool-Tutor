import { TRACKS_DATA } from "@/features/landing/components/TrackDetail";

describe("Academic Tracks & Strands Data Integrity", () => {
  const expectedTrackIds = [
    "junior-high-core",
    "stem-strand",
    "abm-strand",
    "humss-strand",
    "shs-core",
    "gas-strand",
    "tvl-track",
    "arts-design-track",
    "sports-track",
  ];

  it("should contain all 9 core tracks and strands including Arts, Sports, and TVL", () => {
    expect(Object.keys(TRACKS_DATA).length).toBe(9);
    expectedTrackIds.forEach((trackId) => {
      expect(TRACKS_DATA[trackId]).toBeDefined();
      expect(TRACKS_DATA[trackId].id).toBe(trackId);
    });
  });

  it("should verify shs-core has 15 DepEd Core Subjects and academic badge", () => {
    const shsCore = TRACKS_DATA["shs-core"];
    expect(shsCore).toBeDefined();
    expect(shsCore.name).toBe("Senior High Core Subjects");
    expect(shsCore.subjectsCount).toBe("15 DepEd Core Subjects");
    expect(shsCore.badge).toContain("General Core");
  });

  it("should verify accurate subject counts across all 9 tracks without inflated claims", () => {
    expect(TRACKS_DATA["junior-high-core"].subjectsCount).toBe("8 Core (32 Offerings)");
    expect(TRACKS_DATA["stem-strand"].subjectsCount).toBe("11 Specialized Subjects");
    expect(TRACKS_DATA["abm-strand"].subjectsCount).toBe("9 Specialized Subjects");
    expect(TRACKS_DATA["humss-strand"].subjectsCount).toBe("9 Specialized Subjects");
    expect(TRACKS_DATA["shs-core"].subjectsCount).toBe("15 DepEd Core Subjects");
    expect(TRACKS_DATA["gas-strand"].subjectsCount).toBe("7 Specialized Subjects");
    expect(TRACKS_DATA["tvl-track"].subjectsCount).toBe("12 Core Specializations");
    expect(TRACKS_DATA["arts-design-track"].subjectsCount).toBe("11 Specialized Offerings");
    expect(TRACKS_DATA["sports-track"].subjectsCount).toBe("9 Specialized Subjects");
  });

  it("should have comprehensive data for gas-strand", () => {
    const gas = TRACKS_DATA["gas-strand"];
    expect(gas.name).toBe("General Academic Strand (GAS)");
    expect(gas.badge).toContain("Academic Strand");
    expect(gas.learningGoals.length).toBeGreaterThan(0);
    expect(gas.featuredSubjects.length).toBeGreaterThan(0);
    expect(gas.careerPathways.length).toBeGreaterThan(0);
    expect(gas.aiTutorCapabilities.length).toBeGreaterThan(0);
  });

  it("should have comprehensive data for tvl-track spanning AFA, IA, HE, and ICT", () => {
    const tvl = TRACKS_DATA["tvl-track"];
    expect(tvl.name).toBe("Technical-Vocational-Livelihood (TVL) Track");
    expect(tvl.badge).toContain("Technical Track");
    expect(tvl.learningGoals.length).toBeGreaterThan(0);
    expect(tvl.featuredSubjects.length).toBeGreaterThan(0);
    expect(tvl.careerPathways.length).toBeGreaterThan(0);
    expect(tvl.aiTutorCapabilities.length).toBeGreaterThan(0);

    // Verify representation across 4 core sectors: ICT, HE, IA, AFA
    const subjectCodes = tvl.featuredSubjects.map((s) => s.code);
    expect(subjectCodes).toContain("TVL-CSS");
    expect(subjectCodes).toContain("TVL-COOKERY");
    expect(subjectCodes).toContain("TVL-EIM");
    expect(subjectCodes).toContain("TVL-AGRI");
  });

  it("should have comprehensive data for arts-design-track", () => {
    const arts = TRACKS_DATA["arts-design-track"];
    expect(arts.name).toBe("Arts and Design Track");
    expect(arts.badge).toContain("Arts Track");
    expect(arts.learningGoals.length).toBeGreaterThan(0);
    expect(arts.featuredSubjects.length).toBeGreaterThan(0);
    expect(arts.careerPathways.length).toBeGreaterThan(0);
    expect(arts.aiTutorCapabilities.length).toBeGreaterThan(0);
  });

  it("should have comprehensive data for sports-track", () => {
    const sports = TRACKS_DATA["sports-track"];
    expect(sports.name).toBe("Sports Track");
    expect(sports.badge).toContain("Sports Track");
    expect(sports.learningGoals.length).toBeGreaterThan(0);
    expect(sports.featuredSubjects.length).toBeGreaterThan(0);
    expect(sports.careerPathways.length).toBeGreaterThan(0);
    expect(sports.aiTutorCapabilities.length).toBeGreaterThan(0);
  });

  it("should validate that all tracks have valid featured subjects standardized to 8 modules", () => {
    Object.values(TRACKS_DATA).forEach((track) => {
      track.featuredSubjects.forEach((subject) => {
        expect(subject.code).toBeTruthy();
        expect(subject.title).toBeTruthy();
        expect(subject.description).toBeTruthy();
        expect(subject.modules).toBe(8);
      });
    });
  });
});
