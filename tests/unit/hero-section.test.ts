import fs from "fs";
import path from "path";

describe("HeroSection Component Source & Requirements Audit", () => {
  const heroPath = path.join(process.cwd(), "features/landing/components/HeroSection.tsx");
  const heroSource = fs.readFileSync(heroPath, "utf-8");

  it("should have a populated eyebrow badge with DepEd Order No. 015 s. 2026 text and GraduationCap icon", () => {
    expect(heroSource).toContain("GraduationCap");
    expect(heroSource).toContain("DepEd Order No. 015, s. 2026 Aligned");
    // Ensure the empty div anti-pattern is gone
    expect(heroSource).not.toMatch(/<div className="[^"]*rounded-full[^"]*">\s*<\/div>/);
  });

  it("should feature a specific outcome-driven headline for high school exam mastery", () => {
    expect(heroSource).toContain("Ace DepEd High School Exams");
    expect(heroSource).toContain("Socratic AI Tutoring");
  });

  it("should feature primary PLG CTA 'Start 30-Day Free Trial' with friction-reducing microcopy", () => {
    expect(heroSource).toContain("Start 30-Day Free Trial");
    expect(heroSource).toContain("₱0 upfront • No credit card required • Cancel anytime");
  });

  it("should strictly contain zero occurrences of the Sparkles icon", () => {
    expect(heroSource).not.toContain("Sparkles");
  });

  it("should render authentic learning data in floating preview cards without fake claims", () => {
    expect(heroSource).toContain("General Mathematics");
    expect(heroSource).toContain("AI Socratic Tutor");
    expect(heroSource).toContain("Earth &amp; Life Science");
    expect(heroSource).toContain("DepEd MATATAG");
  });

  it("should reference authentic Filipino student image with 4:5 aspect ratio and proper SEO attributes", () => {
    // TSK-025: Filipino hero image source
    expect(heroSource).toContain("/images/filipino-student-writing.jpg");

    // Verify image file exists on disk
    const imagePath = path.join(process.cwd(), "public/images/filipino-student-writing.jpg");
    expect(fs.existsSync(imagePath)).toBe(true);

    // TSK-026: 4:5 vertical portrait aspect ratio & object-top positioning
    expect(heroSource).toContain("aspect-[4/5]");
    expect(heroSource).toContain("object-cover");
    expect(heroSource).toContain("object-top");

    // TSK-027: Descriptive alt text, priority, and sizes
    expect(heroSource).toContain('alt="Filipino high school student studying DepEd MATATAG curriculum with HighSchool Tutor"');
    expect(heroSource).toContain("priority");
    expect(heroSource).toContain('sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"');
  });
});
