export type Subject = {
  code: string;
  slug: string;
  name: string;
  grade: string;
  term: string;
  level: "Junior High School" | "Senior High School";
  strand?: string;
  track?: string;
};

export type DistinctSubject = {
  id: string;
  code: string;
  name: string;
  level: "Junior High School" | "Senior High School";
  grade: string;
  term: string;
  defaultSlug: string;
  isJhsCore?: boolean;
  abbr?: string;
  strand?: string;
  track?: string;
};

export type Lesson = {
  number: number;
  title: string;
  summary: string;
  keyConcepts: string[];
};

export type QuizQuestion = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};

export type LessonProgressStatus =
  | "Not Started"
  | "In Progress"
  | "Needs Review"
  | "Practice Passed"
  | "Mastered";

export type StudentAttempt = {
  id?: string;
  subjectSlug: string;
  subjectCode: string;
  lessonNumber: number;
  lessonTitle: string;
  score: number;
  total: number;
  mode: "study" | "exam";
  createdAt: string | Date;
};

export type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

// -----------------------------------------------------------------------------
// Weak Points & Diagnostic Learning Types
// -----------------------------------------------------------------------------

export type WeakPointTopic = {
  lessonNumber: number;
  lessonTitle: string;
  rawScore: number;
  totalQuestions: number;
  percentageScore: number;
  transmutedGrade: number;
  status: "Needs Review";
  keyConcepts: string[];
  lastAttemptAt: Date | string;
};

export type SubjectWeakPointsResult = {
  subjectSlug: string;
  subjectName: string;
  totalLessons: number;
  weakPointsCount: number;
  weakTopics: WeakPointTopic[];
};

// -----------------------------------------------------------------------------
// Catalog Filter & Presentation Types
// -----------------------------------------------------------------------------

export type CatalogFilterLevel = "all" | "Junior High School" | "Senior High School";
export type CatalogJhsQuarter = "all" | "Quarter 1" | "Quarter 2" | "Quarter 3" | "Quarter 4";
export type CatalogShsSemester = "all" | "Semester 1" | "Semester 2";
export type CatalogShsStrand = "all" | "STEM" | "ABM" | "HUMSS" | "GAS" | "TVL";

export type CatalogFilterState = {
  level: CatalogFilterLevel;
  jhsQuarter: CatalogJhsQuarter;
  shsSemester: CatalogShsSemester;
  shsStrand: CatalogShsStrand;
  search: string;
};

export type SubjectCardPresentation = {
  id: string;
  code: string;
  name: string;
  level: "Junior High School" | "Senior High School";
  grade: string;
  term: string;
  strand?: string;
  track?: string;
  slug: string;
  totalLessons: number;
  isStudentGradeMatch: boolean;
};

// -----------------------------------------------------------------------------
// Translation Types
// -----------------------------------------------------------------------------

export type TranslatableQuizQuestion = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanation: string;
};
