import {
  SUBJECTS,
  getSubjectBySlug,
  getSubjectsByGrade,
} from "@/features/curriculum/utils/curriculum-data";

describe("Curriculum Metadata & Data Structure", () => {
  it("should contain DepEd subjects spanning Junior and Senior High School", () => {
    expect(SUBJECTS.length).toBeGreaterThan(0);
    const jhsSubjects = SUBJECTS.filter((s) => s.level === "Junior High School");
    const shsSubjects = SUBJECTS.filter((s) => s.level === "Senior High School");

    expect(jhsSubjects.length).toBeGreaterThan(0);
    expect(shsSubjects.length).toBeGreaterThan(0);
  });

  it("should find subject by slug correctly", () => {
    const firstSubject = SUBJECTS[0];
    const foundSubject = getSubjectBySlug(firstSubject.slug);
    expect(foundSubject).toBeDefined();
    expect(foundSubject?.code).toBe(firstSubject.code);
    expect(foundSubject?.name).toBe(firstSubject.name);
  });

  it("should retrieve subjects filtered by Grade level", () => {
    const g7Subjects = getSubjectsByGrade("Grade 7");
    expect(g7Subjects.length).toBeGreaterThan(0);
    g7Subjects.forEach((s) => {
      expect(s.grade).toBe("Grade 7");
      expect(s.level).toBe("Junior High School");
    });

    const g11Subjects = getSubjectsByGrade("Grade 11");
    expect(g11Subjects.length).toBeGreaterThan(0);
    g11Subjects.forEach((s) => {
      expect(s.grade).toBe("Grade 11");
      expect(s.level).toBe("Senior High School");
    });
  });

  it("every subject should have non-empty required fields", () => {
    SUBJECTS.forEach((subject) => {
      expect(subject.slug).toBeTruthy();
      expect(subject.code).toBeTruthy();
      expect(subject.name).toBeTruthy();
      expect(subject.grade).toBeTruthy();
      expect(subject.level).toMatch(/Junior High School|Senior High School/);
    });
  });
});
