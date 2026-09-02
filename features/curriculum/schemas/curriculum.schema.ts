import { z } from "zod";

export const subjectSchema = z.object({
  code: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
  name: z.string().min(2),
  grade: z.string().regex(/^Grade (7|8|9|10|11|12)$/),
  term: z.string().regex(/^(Trimester [1-3]|Semester [1-2])$/),
  level: z.enum(["Junior High School", "Senior High School"]),
});

export const quizQuestionSchema = z.object({
  question: z.string().min(5),
  options: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
  }),
  answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(5),
});

export const lessonSchema = z.object({
  number: z.number().int().min(1),
  title: z.string().min(3),
  summary: z.string().min(10),
  keyConcepts: z.array(z.string()).min(1),
});

export const askTutorInputSchema = z.object({
  subjectSlug: z.string(),
  lessonTitle: z.string(),
  question: z.string(),
  options: z.record(z.string(), z.string()),
  answer: z.string(),
  explanation: z.string(),
  language: z.string().default("English"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20),
  message: z.string().min(1).max(2000),
});

export const translateInputSchema = z.object({
  text: z.string().min(1).max(6000),
  language: z.string(),
});

export const recordAttemptInputSchema = z.object({
  subjectSlug: z.string(),
  subjectCode: z.string(),
  lessonNumber: z.number().int(),
  lessonTitle: z.string(),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  mode: z.enum(["study", "exam"]),
});
