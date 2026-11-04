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
}

export interface SubjectFilterState {
  searchQuery: string;
  academicLevel: "ALL" | "JHS" | "SHS";
  trackOrStrand: string;
}
