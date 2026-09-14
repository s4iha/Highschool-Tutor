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
export const JHS_TERMS = ["Trimester 1", "Trimester 2", "Trimester 3"] as const;
export const SHS_GRADES = ["Grade 11", "Grade 12"] as const;
export const SHS_TERMS = ["Semester 1", "Semester 2"] as const;

export const SHS_PROGRAM: Record<number, Record<number, [string, string][]>> = {
  11: {
    1: [
      ["ORALCOMM", "Oral Communication in Context"],
      ["KOMFIL", "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino"],
      ["GENMATH", "General Mathematics"],
      ["EARTHSCI", "Earth Science"],
      ["PERDEV", "Personal Development / Pansariling Kaunlaran"],
      ["PEH1", "Physical Education and Health 1"],
      ["EAPP", "English for Academic and Professional Purposes"],
      ["ETECH", "Empowerment Technologies"],
      ["PRECALC", "Pre-Calculus"],
    ],
    2: [
      ["READWRITE", "Reading and Writing Skills"],
      ["PAGBASA", "Pagbasa at Pagsusuri ng Iba't ibang Teksto Tungo sa Pananaliksik"],
      ["STATPROB", "Statistics and Probability"],
      ["DRRR", "Disaster Readiness and Risk Reduction"],
      ["PEH2", "Physical Education and Health 2"],
      ["PRACRES1", "Practical Research 1 (Qualitative)"],
      ["BASCALC", "Basic Calculus"],
      ["CHEM1", "General Chemistry 1"],
    ],
  },
  12: {
    1: [
      ["LIT21", "21st Century Literature from the Philippines and the World"],
      ["MIL", "Media and Information Literacy"],
      ["PHILOSOPHY", "Introduction to the Philosophy of the Human Person"],
      ["PEH3", "Physical Education and Health 3"],
      ["PRACRES2", "Practical Research 2 (Quantitative)"],
      ["FILPIL", "Pagsulat sa Piling Larangan (Akademik)"],
      ["PHYS1", "General Physics 1"],
      ["BIO1", "General Biology 1"],
    ],
    2: [
      ["CONTEMPARTS", "Contemporary Philippine Arts from the Regions"],
      ["UCSP", "Understanding Culture, Society, and Politics"],
      ["PEH4", "Physical Education and Health 4"],
      ["ENTREP", "Entrepreneurship"],
      ["3IS", "Inquiries, Investigations, and Immersion"],
      ["PHYS2", "General Physics 2"],
      ["BIO2", "General Biology 2"],
      ["CHEM2", "General Chemistry 2"],
      ["WORKIMM", "Work Immersion / Culminating Activity"],
    ],
  },
};

export function slugify(code: string) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function buildJhsSlug(
  abbr: string,
  grade: string = "Grade 7",
  term: string = "Trimester 1"
): string {
  const gradeMatch = grade.match(/\d+/);
  const gradeNum = gradeMatch ? gradeMatch[0] : "7";
  const termMatch = term.match(/\d+/);
  const termNum = termMatch ? termMatch[0] : "1";
  return `g${gradeNum}-t${termNum}-${abbr.toLowerCase()}`;
}

export function parseJhsSlug(slug: string): {
  isJhs: boolean;
  grade: string;
  term: string;
  abbr: string;
  name?: string;
} {
  const match = slug.match(/^g(7|8|9|10)-t(1|2|3)-([a-z0-9]+)$/i);
  if (!match) {
    return { isJhs: false, grade: "", term: "", abbr: "" };
  }
  const [, g, t, abbrLower] = match;
  const found = JHS_SUBJECTS.find(([abbr]) => abbr.toLowerCase() === abbrLower.toLowerCase());
  return {
    isJhs: true,
    grade: `Grade ${g}`,
    term: `Trimester ${t}`,
    abbr: abbrLower.toUpperCase(),
    name: found ? found[1] : undefined,
  };
}

export function getDistinctJhsSubjects(
  studentGrade: string = "Grade 7",
  studentTerm: string = "Trimester 1"
): DistinctSubject[] {
  const validGrade = JHS_GRADES.includes(studentGrade as (typeof JHS_GRADES)[number])
    ? studentGrade
    : "Grade 7";
  const validTerm = JHS_TERMS.includes(studentTerm as (typeof JHS_TERMS)[number])
    ? studentTerm
    : "Trimester 1";

  return JHS_SUBJECTS.map(([abbr, name]) => {
    const defaultSlug = buildJhsSlug(abbr, validGrade, validTerm);
    return {
      id: `jhs-${abbr.toLowerCase()}`,
      code: `JHS-${abbr}`,
      name,
      level: "Junior High School" as const,
      grade: "Grades 7–10",
      term: "Trimesters 1–3",
      defaultSlug,
      isJhsCore: true,
      abbr,
    };
  });
}

export function getDistinctShsSubjects(): DistinctSubject[] {
  const list: DistinctSubject[] = [];
  for (const grade of [11, 12]) {
    for (const s of [1, 2]) {
      const rows = SHS_PROGRAM[grade]?.[s] || [];
      for (const [abbr, name] of rows) {
        const code = `G${grade}-S${s}-${abbr}`;
        list.push({
          id: `shs-${code.toLowerCase()}`,
          code,
          name,
          level: "Senior High School" as const,
          grade: `Grade ${grade}`,
          term: `Semester ${s}`,
          defaultSlug: slugify(code),
          isJhsCore: false,
          abbr,
        });
      }
    }
  }
  return list;
}

export const SUBJECTS: Subject[] = (() => {
  const out: Subject[] = [];
  for (const grade of [7, 8, 9, 10]) {
    for (const t of [1, 2, 3]) {
      for (const [abbr, name] of JHS_SUBJECTS) {
        const code = `G${grade}-T${t}-${abbr}`;
        out.push({
          code,
          slug: slugify(code),
          name,
          grade: `Grade ${grade}`,
          term: `Trimester ${t}`,
          level: "Junior High School",
        });
      }
    }
  }
  for (const grade of [11, 12]) {
    for (const s of [1, 2]) {
      const rows = SHS_PROGRAM[grade]?.[s] || [];
      for (const [abbr, name] of rows) {
        const code = `G${grade}-S${s}-${abbr}`;
        out.push({
          code,
          slug: slugify(code),
          name,
          grade: `Grade ${grade}`,
          term: `Semester ${s}`,
          level: "Senior High School",
        });
      }
    }
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
