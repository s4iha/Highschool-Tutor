import { getStarterSubjectSlugs, enrollStarterSubjects } from "@/features/curriculum/utils/starter-subjects";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    trialSubject: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("starter-subjects utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStarterSubjectSlugs", () => {
    it("returns 3 starter subjects for Junior High School Grade 7 Quarter 1", () => {
      const slugs = getStarterSubjectSlugs("Grade 7", "Quarter 1");
      expect(slugs).toEqual(["g7-q1-math", "g7-q1-sci", "g7-q1-eng"]);
    });

    it("respects quarter preference for Junior High School Grade 8 Quarter 3", () => {
      const slugs = getStarterSubjectSlugs("Grade 8", "Quarter 3");
      expect(slugs).toEqual(["g8-q3-math", "g8-q3-sci", "g8-q3-eng"]);
    });

    it("returns Grade 11 STEM/Core starter subjects for Semester 1", () => {
      const slugs = getStarterSubjectSlugs("Grade 11", "Semester 1");
      expect(slugs).toEqual(["g11-s1-genmath", "g11-s1-oralcomm", "g11-s1-earthlife"]);
    });

    it("returns Grade 12 starter subjects for Semester 2", () => {
      const slugs = getStarterSubjectSlugs("Grade 12", "Semester 2");
      expect(slugs).toEqual(["g12-s2-lit21", "g12-s2-pracres2", "g12-s2-phys1"]);
    });
  });

  describe("enrollStarterSubjects", () => {
    it("does not re-enroll if user already has enrolled subjects", async () => {
      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([
        { subjectSlug: "g11-s1-genmath" },
      ]);

      const result = await enrollStarterSubjects("user-1", "Grade 11", "Semester 1");
      expect(result).toEqual(["g11-s1-genmath"]);
      expect(prisma.trialSubject.create).not.toHaveBeenCalled();
    });

    it("enrolls 3 starter subjects if user has 0 enrolled subjects", async () => {
      (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.trialSubject.create as jest.Mock).mockResolvedValue({});

      const result = await enrollStarterSubjects("user-2", "Grade 7", "Quarter 1");
      expect(result).toEqual(["g7-q1-math", "g7-q1-sci", "g7-q1-eng"]);
      expect(prisma.trialSubject.create).toHaveBeenCalledTimes(3);
    });
  });
});
