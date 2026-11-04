import fs from "fs";
import path from "path";
import { TRACKS_DATA } from "@/features/landing/constants/tracks-data";
import { getSubjectScopeDefinition } from "@/features/curriculum/utils/subject-scope-data";

describe("PopularSubjectsSection, CategorySection & Landing Layout Audits", () => {
  const popularPath = path.join(process.cwd(), "features/landing/components/PopularSubjectsSection.tsx");
  const popularSource = fs.readFileSync(popularPath, "utf-8");

  const categoryPath = path.join(process.cwd(), "features/landing/components/CategorySection.tsx");
  const categorySource = fs.readFileSync(categoryPath, "utf-8");

  const homePagePath = path.join(process.cwd(), "app/page.tsx");
  const homePageSource = fs.readFileSync(homePagePath, "utf-8");

  const heroPath = path.join(process.cwd(), "features/landing/components/HeroSection.tsx");
  const heroSource = fs.readFileSync(heroPath, "utf-8");

  const statsPath = path.join(process.cwd(), "features/landing/components/StatsBar.tsx");
  const statsSource = fs.readFileSync(statsPath, "utf-8");

  const aboutPath = path.join(process.cwd(), "features/landing/components/AboutSection.tsx");
  const aboutSource = fs.readFileSync(aboutPath, "utf-8");

  const demoPath = path.join(process.cwd(), "features/landing/components/AcademicWorkflowDemo.tsx");
  const demoSource = fs.readFileSync(demoPath, "utf-8");

  const howToUsePath = path.join(process.cwd(), "features/landing/components/HowToUseAppSection.tsx");
  const howToUseSource = fs.readFileSync(howToUsePath, "utf-8");

  const trialPath = path.join(process.cwd(), "features/landing/components/TrialNoticeSection.tsx");
  const trialSource = fs.readFileSync(trialPath, "utf-8");

  const ctaPath = path.join(process.cwd(), "features/landing/components/CtaBanner.tsx");
  const ctaSource = fs.readFileSync(ctaPath, "utf-8");

  const catalogPath = path.join(process.cwd(), "features/curriculum/components/PublicSubjectCatalog.tsx");
  const catalogSource = fs.readFileSync(catalogPath, "utf-8");

  const trackDetailPath = path.join(process.cwd(), "features/landing/components/TrackDetail.tsx");
  const trackDetailSource = fs.readFileSync(trackDetailPath, "utf-8");

  describe("PopularSubjectsSection Audits", () => {
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

    it("should NOT render ChevronLeft / ChevronRight buttons and must be natively swipable and draggable", () => {
      // Must not have chevron navigation buttons
      expect(popularSource).not.toContain("ChevronLeft");
      expect(popularSource).not.toContain("ChevronRight");
      expect(popularSource).not.toContain("Previous subjects");
      expect(popularSource).not.toContain("Next subjects");

      // Must support mouse drag & touch swiping
      expect(popularSource).toContain("onMouseDown");
      expect(popularSource).toContain("onMouseMove");
      expect(popularSource).toContain("cursor-grab");
      expect(popularSource).toContain("cursor-grabbing");
      expect(popularSource).toContain("scrollSnapType");
    });

    it("should use standardized vertical padding", () => {
      expect(popularSource).toContain("py-12 sm:py-16 lg:py-20");
      expect(popularSource).toContain("mb-8 sm:mb-10");
    });
  });

  describe("CategorySection Audits", () => {
    it("should provide clean iconless track card headers in CategorySection", () => {
      expect(categorySource).not.toContain("<IconComponent");
      expect(categorySource).not.toMatch(/icon:\s*(BookOpenCheck|FlaskConical|Briefcase|Compass|GraduationCap|Layers|Wrench)/);
      expect(categorySource).toContain("15 DepEd Core Subjects");
    });

    it("should reflect accurate DepEd subject and offering counts in CategorySection", () => {
      expect(categorySource).toContain("8 Core (32 Offerings)");
      expect(categorySource).toContain("11 Specialized Subjects");
      expect(categorySource).toContain("9 Specialized Subjects");
      expect(categorySource).toContain("7 Specialized Subjects");
      expect(categorySource).toContain("8 sequential lesson modules and 24 practice drills");
    });

    it("should use standardized spacing and card padding", () => {
      expect(categorySource).toContain("py-12 sm:py-16 lg:py-20");
      expect(categorySource).toContain("mb-8 sm:mb-12");
      expect(categorySource).toContain("p-5 sm:p-6");
    });
  });

  describe("Landing Page Consistent Padding & Zero Section Gaps", () => {
    it("app/page.tsx should NOT have outer flex gap margins", () => {
      expect(homePageSource).not.toContain("gap-12");
      expect(homePageSource).not.toContain("gap-16");
      expect(homePageSource).toContain('className="flex flex-col"');
    });

    it("all sections should use standardized vertical padding and responsive container", () => {
      expect(heroSource).toContain("pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20");
      expect(statsSource).toContain("-mt-4 sm:-mt-6 pb-6 sm:pb-8");
      expect(statsSource).toContain("p-5 sm:p-6 lg:p-8");
      expect(aboutSource).toContain("py-12 sm:py-16 lg:py-20");
      expect(demoSource).toContain("py-12 sm:py-16 lg:py-20");
      expect(demoSource).toContain("p-4 sm:p-6 lg:p-8");
      expect(howToUseSource).toContain("py-12 sm:py-16 lg:py-20");
      expect(trialSource).toContain("py-12 sm:py-16 lg:py-20");
      expect(trialSource).toContain("p-5 sm:p-8 lg:p-12");
      expect(ctaSource).toContain("py-12 sm:py-16 lg:py-20");
      expect(ctaSource).toContain("p-6 sm:p-10 lg:p-12");
    });
  });

  describe("PublicSubjectCatalog & TrackDetail Audits", () => {
    it("PublicSubjectCatalog should use flex-wrap for responsive filter buttons without clipping", () => {
      expect(catalogSource).toContain("flex flex-wrap items-center gap-2 pt-1 text-xs");
      expect(catalogSource).toContain("flex flex-wrap sm:flex-nowrap items-center gap-1.5");
      expect(catalogSource).toContain("initialLevel");
      expect(catalogSource).toContain("initialStrand");
      expect(catalogSource).toContain("handleLevelChange");
      expect(catalogSource).toContain("handleStrandChange");
    });

    it("TrackDetail should map trackId to deep links and wrap badges cleanly on mobile", () => {
      expect(trackDetailSource).toContain("TRACK_SUBJECTS_URL_MAP");
      expect(trackDetailSource).toContain("/subjects?level=JHS");
      expect(trackDetailSource).toContain("/subjects?track=STEM");
      expect(trackDetailSource).toContain("flex flex-wrap items-start sm:items-center justify-between gap-2.5");
      expect(trackDetailSource).toContain("shrink-0 whitespace-nowrap");
    });

    it("all featuredSubjects across all tracks should have valid slugs pointing to existing curriculum scopes", () => {
      for (const track of Object.values(TRACKS_DATA)) {
        for (const subj of track.featuredSubjects) {
          expect(subj.slug).toBeDefined();
          expect(typeof subj.slug).toBe("string");
          expect(subj.slug!.length).toBeGreaterThan(0);

          // Verify that this slug actually exists in subject-scope-data
          const scope = getSubjectScopeDefinition(subj.slug!);
          expect(scope).toBeDefined();
        }
      }
    });
  });
});
