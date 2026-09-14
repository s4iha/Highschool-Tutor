import { TRACKS_DATA } from "@/features/landing/components/TrackDetail";

describe("Academic Tracks & Strands Data Integrity", () => {
  const expectedTrackIds = [
    "junior-high-core",
    "stem-strand",
    "abm-strand",
    "humss-strand",
    "gas-strand",
    "tvl-track",
  ];

  it("should contain all 6 core tracks and strands including GAS and TVL", () => {
    expectedTrackIds.forEach((trackId) => {
      expect(TRACKS_DATA[trackId]).toBeDefined();
      expect(TRACKS_DATA[trackId].id).toBe(trackId);
    });
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

  it("should have comprehensive data for tvl-track", () => {
    const tvl = TRACKS_DATA["tvl-track"];
    expect(tvl.name).toBe("Technical-Vocational-Livelihood (TVL) Track");
    expect(tvl.badge).toContain("Technical Track");
    expect(tvl.learningGoals.length).toBeGreaterThan(0);
    expect(tvl.featuredSubjects.length).toBeGreaterThan(0);
    expect(tvl.careerPathways.length).toBeGreaterThan(0);
    expect(tvl.aiTutorCapabilities.length).toBeGreaterThan(0);
  });

  it("should validate that all tracks have valid featured subjects", () => {
    Object.values(TRACKS_DATA).forEach((track) => {
      track.featuredSubjects.forEach((subject) => {
        expect(subject.code).toBeTruthy();
        expect(subject.title).toBeTruthy();
        expect(subject.description).toBeTruthy();
        expect(subject.modules).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
