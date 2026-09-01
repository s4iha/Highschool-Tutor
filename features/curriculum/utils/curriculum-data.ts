import type { Subject } from "../types/curriculum.types";

const JHS_SUBJECTS: [string, string][] = [
  ["ENG", "English"],
  ["FIL", "Filipino"],
  ["MATH", "Mathematics"],
  ["SCI", "Science"],
  ["AP", "Araling Panlipunan"],
  ["ESP", "Edukasyon sa Pagpapakatao"],
  ["MAPEH", "Music, Arts, Physical Education, and Health"],
  ["TLE", "Technology and Livelihood Education"],
];

const SHS_PROGRAM: Record<number, Record<number, [string, string][]>> = {
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

function slugify(code: string) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
