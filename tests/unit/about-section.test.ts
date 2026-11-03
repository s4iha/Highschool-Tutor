import fs from "fs";
import path from "path";

describe("AboutSection Filipino High School Imagery Integrity", () => {
  const aboutPath = path.join(
    process.cwd(),
    "features/landing/components/AboutSection.tsx"
  );
  const aboutSource = fs.readFileSync(aboutPath, "utf-8");

  it("should reference authentic Filipino high school student imagery", () => {
    expect(aboutSource).toContain("/images/filipino-students-group.jpg");
    expect(aboutSource).toContain("/images/filipino-student-writing.jpg");
  });

  it("should not reference foreign stock photo assets", () => {
    expect(aboutSource).not.toContain("/images/library-group.jpg");
    expect(aboutSource).not.toContain("/images/student-writing.jpg");
  });

  it("should provide culturally representative alt descriptions", () => {
    expect(aboutSource).toContain("Filipino high school students");
    expect(aboutSource).toContain("Filipina high school student");
  });
});
