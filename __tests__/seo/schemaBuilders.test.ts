import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildFAQPageSchema,
  buildCourseSchema,
  buildBreadcrumbSchema,
} from "@/features/seo/utils/schemaBuilders";

describe("Schema.org JSON-LD builders", () => {
  describe("buildOrganizationSchema", () => {
    it("should return valid EducationalOrganization schema with DepEd details", () => {
      const schema = buildOrganizationSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("EducationalOrganization");
      expect(schema["@id"]).toBe("https://highschool-tutor.sgws.tech/#organization");
      expect(schema.name).toBe("HighSchool Tutor");
      expect(schema.url).toBe("https://highschool-tutor.sgws.tech");
      expect(schema.logo).toContain("/logo/highschool-tutor-logo-favicon-squared.png");
      expect(schema.address).toEqual({
        "@type": "PostalAddress",
        addressCountry: "PH",
      });
      expect(schema.description).toContain("MATATAG");
    });
  });

  describe("buildWebSiteSchema", () => {
    it("should return WebSite schema with SearchAction query input", () => {
      const schema = buildWebSiteSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema["@id"]).toBe("https://highschool-tutor.sgws.tech/#website");
      expect(schema.publisher).toEqual({
        "@id": "https://highschool-tutor.sgws.tech/#organization",
      });
      expect(schema.potentialAction).toBeDefined();
      expect(schema.potentialAction?.["@type"]).toBe("SearchAction");
      expect(schema.potentialAction?.target.urlTemplate).toBe(
        "https://highschool-tutor.sgws.tech/tracks?q={search_term_string}"
      );
      expect(schema.potentialAction?.["query-input"]).toBe(
        "required name=search_term_string"
      );
      expect(schema.inLanguage).toEqual(expect.arrayContaining(["en-PH", "fil-PH"]));
    });
  });

  describe("buildFAQPageSchema", () => {
    it("should return FAQPage schema with 6 default questions covering MATATAG and AI tutoring", () => {
      const schema = buildFAQPageSchema();
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("FAQPage");
      expect(schema["@id"]).toBe("https://highschool-tutor.sgws.tech/how-it-works#faq");
      expect(schema.mainEntity.length).toBe(6);

      const q1 = schema.mainEntity[0];
      expect(q1["@type"]).toBe("Question");
      expect(q1.name).toContain("What is HighSchool Tutor?");
      expect(q1.acceptedAnswer["@type"]).toBe("Answer");
      expect(q1.acceptedAnswer.text).toContain("MATATAG");

      const questionNames = schema.mainEntity.map((q) => q.name);
      expect(questionNames).toContain(
        "Is HighSchool Tutor aligned with the new DepEd MATATAG curriculum?"
      );
      expect(questionNames).toContain("How does the Socratic AI tutor help me learn?");
    });

    it("should support custom FAQs if provided", () => {
      const customFaqs = [
        { question: "Custom Q?", answer: "Custom Answer." },
      ];
      const schema = buildFAQPageSchema(customFaqs);
      expect(schema.mainEntity.length).toBe(1);
      expect(schema.mainEntity[0].name).toBe("Custom Q?");
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Custom Answer.");
    });
  });

  describe("buildCourseSchema", () => {
    it("should return Course schema with credential and course instance for STEM", () => {
      const track = {
        id: "stem-strand",
        name: "STEM Strand (Science, Technology, Engineering, & Mathematics)",
        overview:
          "Prepares Senior High School students for college science, engineering, and mathematics programs.",
        grades: "Grades 11 and 12",
      };
      const schema = buildCourseSchema(track);
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Course");
      expect(schema["@id"]).toBe(
        "https://highschool-tutor.sgws.tech/tracks/stem-strand#course"
      );
      expect(schema.name).toBe(track.name);
      expect(schema.description).toBe(track.overview);
      expect(schema.provider).toEqual({
        "@type": "EducationalOrganization",
        name: "HighSchool Tutor",
        url: "https://highschool-tutor.sgws.tech",
      });
      expect(schema.educationalLevel).toContain("Senior High School");
      expect(schema.educationalCredentialAwarded).toContain("STEM");
      expect(schema.hasCourseInstance).toEqual({
        "@type": "CourseInstance",
        courseMode: "online",
        inLanguage: ["en-PH", "fil-PH"],
      });
    });

    it("should return correct educationalLevel for Junior High Core", () => {
      const track = {
        id: "junior-high-core",
        name: "Junior High School Core",
        overview: "Foundational K-12 Mastery with DepEd MATATAG Competencies",
        grades: "Grades 7, 8, 9, and 10",
      };
      const schema = buildCourseSchema(track);
      expect(schema.educationalLevel).toBe("Junior High School (Grades 7-10)");
      expect(schema.educationalCredentialAwarded).toContain("Junior High School");
    });
  });

  describe("buildBreadcrumbSchema", () => {
    it("should generate ordered BreadcrumbList with canonical URLs", () => {
      const items = [
        { name: "Home", path: "/" },
        { name: "Tracks", path: "/tracks" },
        { name: "STEM Strand", path: "/tracks/stem-strand" },
      ];
      const schema = buildBreadcrumbSchema(items);
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement.length).toBe(3);

      expect(schema.itemListElement[0]).toEqual({
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://highschool-tutor.sgws.tech",
      });
      expect(schema.itemListElement[1]).toEqual({
        "@type": "ListItem",
        position: 2,
        name: "Tracks",
        item: "https://highschool-tutor.sgws.tech/tracks",
      });
      expect(schema.itemListElement[2]).toEqual({
        "@type": "ListItem",
        position: 3,
        name: "STEM Strand",
        item: "https://highschool-tutor.sgws.tech/tracks/stem-strand",
      });
    });
  });
});
