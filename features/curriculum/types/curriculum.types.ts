export type Subject = {
  code: string;
  slug: string;
  name: string;
  grade: string;
  term: string;
  level: "Junior High School" | "Senior High School";
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
