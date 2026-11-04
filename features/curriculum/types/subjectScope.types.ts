export interface SubjectScopeLesson {
  lessonNumber: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  practiceDrillsCount: number;
}

export interface JhsGradeQuarterScope {
  grade: "Grade 7" | "Grade 8" | "Grade 9" | "Grade 10";
  quarter: "Quarter 1" | "Quarter 2" | "Quarter 3" | "Quarter 4";
  slug: string;
  description: string;
  competencies: string[];
  lessons: SubjectScopeLesson[];
}

export interface SubjectScopeDefinition {
  slug: string;
  code: string;
  name: string;
  level: "Junior High School" | "Senior High School";
  grade: string;
  term: string;
  track: string;
  strand: string;
  timeAllotment: string;
  prerequisites: string[];
  corequisites?: string[];
  description: string;
  competencies: string[];
  tesdaNcLevel?: string | null;
  careerPathways?: string[];
  featuredModulesCount?: number;
  lessons: SubjectScopeLesson[];
  isJhsCore?: boolean;
  abbr?: string;
}

export interface SubjectFilterState {
  searchQuery: string;
  academicLevel: "ALL" | "JHS" | "SHS";
  trackOrStrand: string;
}
