import type { Subject, DistinctSubject } from "../types/curriculum.types";

export const JHS_SUBJECTS: [string, string][] = [
  ["ENG", "English"],
  ["FIL", "Filipino"],
  ["MATH", "Mathematics"],
  ["SCI", "Science"],
  ["AP", "Araling Panlipunan"],
  ["ESP", "Edukasyon sa Pagpapakatao"],
  ["MAPEH", "Music, Arts, Physical Education, and Health"],
  ["TLE", "Technology and Livelihood Education"],
];

export const JHS_GRADES = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"] as const;
export const JHS_QUARTERS = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"] as const;
// Legacy alias for backwards compatibility
export const JHS_TERMS = JHS_QUARTERS;

export const SHS_GRADES = ["Grade 11", "Grade 12"] as const;
export const SHS_TERMS = ["Semester 1", "Semester 2"] as const;

export interface ShsSubjectDefinition {
  abbr: string;
  name: string;
  grade: 11 | 12;
  semester: 1 | 2;
  strand: "Core" | "Applied" | "STEM" | "ABM" | "HUMSS" | "GAS" | "TVL";
}

export const SHS_SUBJECT_CATALOG: ShsSubjectDefinition[] = [
  // ---------------------------------------------------------------------------
  // Core Subjects (All Strands)
  // ---------------------------------------------------------------------------
  { abbr: "ORALCOMM", name: "Oral Communication in Context", grade: 11, semester: 1, strand: "Core" },
  { abbr: "KOMFIL", name: "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino", grade: 11, semester: 1, strand: "Core" },
  { abbr: "GENMATH", name: "General Mathematics", grade: 11, semester: 1, strand: "Core" },
  { abbr: "EARTHLIFE", name: "Earth and Life Science", grade: 11, semester: 1, strand: "Core" },
  { abbr: "PERDEV", name: "Personal Development / Pansariling Kaunlaran", grade: 11, semester: 1, strand: "Core" },
  { abbr: "PEH1", name: "Physical Education and Health 1", grade: 11, semester: 1, strand: "Core" },
  { abbr: "PHILOSOPHY", name: "Introduction to the Philosophy of the Human Person", grade: 11, semester: 1, strand: "Core" },

  { abbr: "READWRITE", name: "Reading and Writing Skills", grade: 11, semester: 2, strand: "Core" },
  { abbr: "PAGBASA", name: "Pagbasa at Pagsusuri ng Iba't ibang Teksto Tungo sa Pananaliksik", grade: 11, semester: 2, strand: "Core" },
  { abbr: "STATPROB", name: "Statistics and Probability", grade: 11, semester: 2, strand: "Core" },
  { abbr: "PHYSSCI", name: "Physical Science", grade: 11, semester: 2, strand: "Core" },
  { abbr: "PEH2", name: "Physical Education and Health 2", grade: 11, semester: 2, strand: "Core" },

  { abbr: "LIT21", name: "21st Century Literature from the Philippines and the World", grade: 12, semester: 1, strand: "Core" },
  { abbr: "MIL", name: "Media and Information Literacy", grade: 12, semester: 1, strand: "Core" },
  { abbr: "PEH3", name: "Physical Education and Health 3", grade: 12, semester: 1, strand: "Core" },

  { abbr: "CONTEMPARTS", name: "Contemporary Philippine Arts from the Regions", grade: 12, semester: 2, strand: "Core" },
  { abbr: "UCSP", name: "Understanding Culture, Society, and Politics", grade: 12, semester: 2, strand: "Core" },
  { abbr: "PEH4", name: "Physical Education and Health 4", grade: 12, semester: 2, strand: "Core" },

  // ---------------------------------------------------------------------------
  // Applied Track Subjects (All Strands)
  // ---------------------------------------------------------------------------
  { abbr: "EAPP", name: "English for Academic and Professional Purposes", grade: 11, semester: 1, strand: "Applied" },
  { abbr: "ETECH", name: "Empowerment Technologies", grade: 11, semester: 1, strand: "Applied" },
  { abbr: "PRACRES1", name: "Practical Research 1 (Qualitative)", grade: 11, semester: 2, strand: "Applied" },
  { abbr: "PRACRES2", name: "Practical Research 2 (Quantitative)", grade: 12, semester: 1, strand: "Applied" },
  { abbr: "FILPIL", name: "Filipino sa Piling Larang (Akademik)", grade: 12, semester: 1, strand: "Applied" },
  { abbr: "ENTREP", name: "Entrepreneurship", grade: 12, semester: 2, strand: "Applied" },
  { abbr: "3IS", name: "Inquiries, Investigations, and Immersion", grade: 12, semester: 2, strand: "Applied" },

  // ---------------------------------------------------------------------------
  // STEM Specialized Subjects
  // ---------------------------------------------------------------------------
  { abbr: "PRECALC", name: "Pre-Calculus", grade: 11, semester: 1, strand: "STEM" },
  { abbr: "EARTHSCI", name: "Earth Science", grade: 11, semester: 1, strand: "STEM" },
  { abbr: "BASCALC", name: "Basic Calculus", grade: 11, semester: 2, strand: "STEM" },
  { abbr: "CHEM1", name: "General Chemistry 1", grade: 11, semester: 2, strand: "STEM" },
  { abbr: "DRRR", name: "Disaster Readiness and Risk Reduction", grade: 11, semester: 2, strand: "STEM" },
  { abbr: "PHYS1", name: "General Physics 1", grade: 12, semester: 1, strand: "STEM" },
  { abbr: "BIO1", name: "General Biology 1", grade: 12, semester: 1, strand: "STEM" },
  { abbr: "PHYS2", name: "General Physics 2", grade: 12, semester: 2, strand: "STEM" },
  { abbr: "BIO2", name: "General Biology 2", grade: 12, semester: 2, strand: "STEM" },
  { abbr: "CHEM2", name: "General Chemistry 2", grade: 12, semester: 2, strand: "STEM" },
  { abbr: "WORKIMM", name: "Work Immersion / Culminating Activity", grade: 12, semester: 2, strand: "STEM" },

  // ---------------------------------------------------------------------------
  // ABM Specialized Subjects
  // ---------------------------------------------------------------------------
  { abbr: "ORGMAN", name: "Organization and Management", grade: 11, semester: 1, strand: "ABM" },
  { abbr: "BUSMATH", name: "Business Math", grade: 11, semester: 1, strand: "ABM" },
  { abbr: "FABM1", name: "Fundamentals of Accountancy, Business, and Management 1", grade: 11, semester: 2, strand: "ABM" },
  { abbr: "PRINMKT", name: "Principles of Marketing", grade: 11, semester: 2, strand: "ABM" },
  { abbr: "FABM2", name: "Fundamentals of Accountancy, Business, and Management 2", grade: 12, semester: 1, strand: "ABM" },
  { abbr: "BUSFIN", name: "Business Finance", grade: 12, semester: 1, strand: "ABM" },
  { abbr: "ABMETHICS", name: "Business Ethics and Social Responsibility", grade: 12, semester: 1, strand: "ABM" },
  { abbr: "ABMECO", name: "Applied Economics", grade: 12, semester: 2, strand: "ABM" },
  { abbr: "ABMSIM", name: "Business Enterprise Simulation / Work Immersion", grade: 12, semester: 2, strand: "ABM" },

  // ---------------------------------------------------------------------------
  // HUMSS Specialized Subjects
  // ---------------------------------------------------------------------------
  { abbr: "CREATWRITE", name: "Creative Writing / Malikhaing Pagsulat", grade: 11, semester: 1, strand: "HUMSS" },
  { abbr: "DISS", name: "Disciplines and Ideas in the Social Sciences", grade: 11, semester: 1, strand: "HUMSS" },
  { abbr: "CREATNONFIC", name: "Creative Nonfiction", grade: 11, semester: 2, strand: "HUMSS" },
  { abbr: "WORLDREL", name: "Introduction to World Religions and Belief Systems", grade: 11, semester: 2, strand: "HUMSS" },
  { abbr: "POLGOV", name: "Philippine Politics and Governance", grade: 12, semester: 1, strand: "HUMSS" },
  { abbr: "DIASS", name: "Disciplines and Ideas in the Applied Social Sciences", grade: 12, semester: 1, strand: "HUMSS" },
  { abbr: "COMMENG", name: "Community Engagement, Solidarity, and Citizenship", grade: 12, semester: 2, strand: "HUMSS" },
  { abbr: "TRENDS21", name: "Trends, Networks, and Critical Thinking in the 21st Century", grade: 12, semester: 2, strand: "HUMSS" },
  { abbr: "HUMSSCULM", name: "HUMSS Culminating Activity / Work Immersion", grade: 12, semester: 2, strand: "HUMSS" },

  // ---------------------------------------------------------------------------
  // GAS Specialized Subjects
  // ---------------------------------------------------------------------------
  { abbr: "GASHUM1", name: "Humanities 1 (Creative Writing / Literature)", grade: 11, semester: 1, strand: "GAS" },
  { abbr: "GASSOC1", name: "Social Science 1 (Philippine Politics / DISS)", grade: 11, semester: 2, strand: "GAS" },
  { abbr: "GASDRRR", name: "Disaster Readiness and Risk Reduction", grade: 11, semester: 2, strand: "GAS" },
  { abbr: "GASHUM2", name: "Humanities 2 (World Religions / Culture)", grade: 12, semester: 1, strand: "GAS" },
  { abbr: "GASECON", name: "Applied Economics & Organization Management", grade: 12, semester: 1, strand: "GAS" },
  { abbr: "GASELECT", name: "General Academic Elective", grade: 12, semester: 2, strand: "GAS" },
  { abbr: "GASCULM", name: "GAS Culminating Activity / Work Immersion", grade: 12, semester: 2, strand: "GAS" },

  // ---------------------------------------------------------------------------
  // TVL Specialized Subjects (ICT & Home Economics)
  // ---------------------------------------------------------------------------
  { abbr: "TVLCSS1", name: "Computer Systems Servicing 1", grade: 11, semester: 1, strand: "TVL" },
  { abbr: "TVLCOOK1", name: "Commercial Cookery 1", grade: 11, semester: 1, strand: "TVL" },
  { abbr: "TVLCSS2", name: "Computer Systems Servicing 2", grade: 11, semester: 2, strand: "TVL" },
  { abbr: "TVLBREAD", name: "Bread and Pastry Production", grade: 11, semester: 2, strand: "TVL" },
  { abbr: "TVLANIM", name: "Animation & Digital Arts", grade: 12, semester: 1, strand: "TVL" },
  { abbr: "TVLFBS", name: "Food and Beverage Services", grade: 12, semester: 1, strand: "TVL" },
  { abbr: "TVLPROG", name: "Computer Programming & Systems", grade: 12, semester: 2, strand: "TVL" },
  { abbr: "TVLTOUR", name: "Tourism Promotion Services", grade: 12, semester: 2, strand: "TVL" },
  { abbr: "TVLIMM", name: "TVL Industry Work Immersion", grade: 12, semester: 2, strand: "TVL" },
];

export function slugify(code: string) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function buildJhsSlug(
  abbr: string,
  grade: string = "Grade 7",
  term: string = "Quarter 1"
): string {
  const gradeMatch = grade.match(/\d+/);
  const gradeNum = gradeMatch ? gradeMatch[0] : "7";
  const termMatch = term.match(/\d+/);
  const termNum = termMatch ? termMatch[0] : "1";
  return `g${gradeNum}-q${termNum}-${abbr.toLowerCase()}`;
}

export function parseJhsSlug(slug: string): {
  isJhs: boolean;
  grade: string;
  term: string;
  abbr: string;
  name?: string;
} {
  // Support both new g7-q1-math and legacy g7-t1-math formats
  const match = slug.match(/^g(7|8|9|10)-(?:q|t)(1|2|3|4)-([a-z0-9]+)$/i);
  if (!match) {
    return { isJhs: false, grade: "", term: "", abbr: "" };
  }
  const [, g, q, abbrLower] = match;
  const found = JHS_SUBJECTS.find(([abbr]) => abbr.toLowerCase() === abbrLower.toLowerCase());
  return {
    isJhs: true,
    grade: `Grade ${g}`,
    term: `Quarter ${q}`,
    abbr: abbrLower.toUpperCase(),
    name: found ? found[1] : undefined,
  };
}

export function getDistinctJhsSubjects(
  studentGrade: string = "Grade 7",
  studentTerm: string = "Quarter 1"
): DistinctSubject[] {
  const validGrade = JHS_GRADES.includes(studentGrade as (typeof JHS_GRADES)[number])
    ? studentGrade
    : "Grade 7";
  
  // Normalize term to Quarter
  let resolvedQuarter = studentTerm;
  if (resolvedQuarter.startsWith("Trimester")) {
    const num = resolvedQuarter.replace(/\D+/g, "") || "1";
    resolvedQuarter = `Quarter ${num}`;
  }
  if (!JHS_QUARTERS.includes(resolvedQuarter as (typeof JHS_QUARTERS)[number])) {
    resolvedQuarter = "Quarter 1";
  }

  return JHS_SUBJECTS.map(([abbr, name]) => {
    const defaultSlug = buildJhsSlug(abbr, validGrade, resolvedQuarter);
    return {
      id: `jhs-${abbr.toLowerCase()}`,
      code: `JHS-${abbr}`,
      name,
      level: "Junior High School" as const,
      grade: "Grades 7–10",
      term: "Quarters 1–4",
      defaultSlug,
      isJhsCore: true,
      abbr,
    };
  });
}

export function getDistinctShsSubjects(strandFilter?: string): DistinctSubject[] {
  const list: DistinctSubject[] = [];
  const subjects = strandFilter && strandFilter !== "all"
    ? SHS_SUBJECT_CATALOG.filter((s) => s.strand === strandFilter || s.strand === "Core" || s.strand === "Applied")
    : SHS_SUBJECT_CATALOG;

  for (const item of subjects) {
    const code = `G${item.grade}-S${item.semester}-${item.abbr}`;
    list.push({
      id: `shs-${code.toLowerCase()}`,
      code,
      name: item.name,
      level: "Senior High School" as const,
      grade: `Grade ${item.grade}`,
      term: `Semester ${item.semester}`,
      defaultSlug: slugify(code),
      isJhsCore: false,
      abbr: item.abbr,
      strand: item.strand,
      track: item.strand,
    });
  }
  return list;
}

export const SUBJECTS: Subject[] = (() => {
  const out: Subject[] = [];
  // 1. JHS Subjects across Grades 7-10 and Quarters 1-4 (plus legacy Trimesters)
  for (const grade of [7, 8, 9, 10]) {
    for (const q of [1, 2, 3, 4]) {
      for (const [abbr, name] of JHS_SUBJECTS) {
        // Quarter format (new standard)
        const codeQ = `G${grade}-Q${q}-${abbr}`;
        out.push({
          code: codeQ,
          slug: slugify(codeQ),
          name,
          grade: `Grade ${grade}`,
          term: `Quarter ${q}`,
          level: "Junior High School",
        });
        // Trimester format (backwards compatibility for previously stored slugs/quizzes)
        if (q <= 3) {
          const codeT = `G${grade}-T${q}-${abbr}`;
          out.push({
            code: codeT,
            slug: slugify(codeT),
            name,
            grade: `Grade ${grade}`,
            term: `Quarter ${q}`,
            level: "Junior High School",
          });
        }
      }
    }
  }

  // 2. SHS Subjects across all strands
  for (const item of SHS_SUBJECT_CATALOG) {
    const code = `G${item.grade}-S${item.semester}-${item.abbr}`;
    out.push({
      code,
      slug: slugify(code),
      name: item.name,
      grade: `Grade ${item.grade}`,
      term: `Semester ${item.semester}`,
      level: "Senior High School",
      strand: item.strand,
      track: item.strand,
    });
  }
  return out;
})();

export const SUBJECT_BY_SLUG = new Map(SUBJECTS.map((s) => [s.slug, s]));

export const DIALECTS = [
  "English",
  "Filipino (Tagalog)",
  "Taglish",
  "Cebuano (Bisaya)",
  "Ilocano",
  "Hiligaynon (Ilonggo)",
  "Bicolano",
  "Waray",
  "Kapampangan",
  "Pangasinense",
] as const;

export function isEnglishSubject(subject: Subject) {
  return /english|reading and writing|oral communication/i.test(subject.name);
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECT_BY_SLUG.get(slug);
}

export function getSubjectsByGrade(grade: string): Subject[] {
  return SUBJECTS.filter((s) => s.grade === grade);
}
