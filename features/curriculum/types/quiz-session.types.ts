export type QuizAnswerKey = "A" | "B" | "C" | "D";

export interface SaveQuizProgressInput {
  sessionId: string;
  activeQuestionIndex: number;
  userAnswers: Record<string, QuizAnswerKey>;
}

export interface ActiveQuizSessionInfo {
  sessionId: string;
  subjectSlug: string;
  subjectName: string;
  lessonNumber: number;
  lessonTitle: string;
  mode: "study" | "exam";
  questionCount: number;
  answeredCount: number;
  activeQuestionIndex: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ActiveQuizSessionSummary {
  hasActiveSession: boolean;
  session: ActiveQuizSessionInfo | null;
}
