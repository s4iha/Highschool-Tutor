import type { Subject, Lesson, QuizQuestion, TutorMessage } from "../types/curriculum.types";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables (.env.local).");
  }
  return key;
}

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  role?: string;
  parts: GeminiContentPart[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

async function callGemini(
  contents: GeminiContent[],
  systemInstruction?: string,
  responseSchema?: Record<string, unknown>
): Promise<string> {
  const apiKey = getApiKey();
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents,
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const generationConfig: Record<string, unknown> = {
    temperature: 0.2,
  };

  if (responseSchema) {
    generationConfig.responseMimeType = "application/json";
    generationConfig.responseSchema = responseSchema;
  }

  body.generationConfig = generationConfig;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 429) {
      throw new Error("Gemini AI rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error(`Gemini API error (${res.status}): ${errorText.slice(0, 300)}`);
  }

  const data = (await res.json()) as GeminiResponse;
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!outputText) {
    throw new Error("Gemini returned an empty response.");
  }

  return outputText;
}

export async function generateLessonsForSubject(subject: Subject): Promise<Lesson[]> {
  const prompt = `You are a curriculum specialist for the Philippine Department of Education (DepEd K-12 and MATATAG Curriculum).
Generate a comprehensive list of 8 to 12 core lessons for the subject:
- Code: ${subject.code}
- Name: ${subject.name}
- Grade Level: ${subject.grade}
- Term: ${subject.term} (${subject.level})

Each lesson must have:
1. number (1, 2, 3...)
2. title (concise DepEd lesson title)
3. summary (2-3 sentences explaining the competency and topic)
4. keyConcepts (list of 3-5 key terms or formulas)`;

  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        number: { type: "INTEGER" },
        title: { type: "STRING" },
        summary: { type: "STRING" },
        keyConcepts: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
      },
      required: ["number", "title", "summary", "keyConcepts"],
    },
  };

  const rawJson = await callGemini(
    [{ parts: [{ text: prompt }] }],
    "You output valid JSON strictly conforming to the requested schema.",
    schema
  );

  return JSON.parse(rawJson) as Lesson[];
}

export async function generateQuizForLesson(
  subject: Subject,
  lessonNumber: number,
  lessonTitle: string
): Promise<QuizQuestion[]> {
  const prompt = `You are an expert DepEd high school teacher.
Create a 5-question multiple choice quiz for:
Subject: ${subject.name} (${subject.grade}, ${subject.term})
Lesson ${lessonNumber}: ${lessonTitle}

Requirements:
- 4 options: A, B, C, D.
- Clear correct answer (A, B, C, or D).
- Detailed, friendly explanation for why the answer is correct and why other options are incorrect.
- Tone: Encouraging, academic, and tailored to Philippine high school students.`;

  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        question: { type: "STRING" },
        options: {
          type: "OBJECT",
          properties: {
            A: { type: "STRING" },
            B: { type: "STRING" },
            C: { type: "STRING" },
            D: { type: "STRING" },
          },
          required: ["A", "B", "C", "D"],
        },
        answer: { type: "STRING", enum: ["A", "B", "C", "D"] },
        explanation: { type: "STRING" },
      },
      required: ["question", "options", "answer", "explanation"],
    },
  };

  const rawJson = await callGemini(
    [{ parts: [{ text: prompt }] }],
    "You output valid JSON strictly conforming to the requested schema.",
    schema
  );

  return JSON.parse(rawJson) as QuizQuestion[];
}

export async function generateTutorReply(params: {
  subjectName: string;
  lessonTitle: string;
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
  language: string;
  history: TutorMessage[];
  message: string;
}): Promise<string> {
  const systemPrompt = `You are "Tutor Kuya/Ate", a helpful, empathetic, and brilliant Filipino Socratic AI tutor for HighSchool Tutor.
Current Subject: ${params.subjectName}
Lesson Topic: ${params.lessonTitle}
Active Quiz Question: "${params.question}"
Options: A) ${params.options.A}, B) ${params.options.B}, C) ${params.options.C}, D) ${params.options.D}
Correct Answer: Option ${params.answer}
Official Explanation: ${params.explanation}

Guidance Rules:
1. Speak in the requested language/dialect: ${params.language} (If Taglish/Filipino is requested, use natural Filipino high-school student phrasing like "Kumusta!", "Tingnan natin...", "Dahil dito...").
2. Be Socratic: Never immediately give away the final answer if the student asks for it directly. Guide them step-by-step with analogies, hints, and encouragement.
3. Keep responses concise (2-4 paragraphs max) with clear bullet points where helpful.`;

  const geminiContents: GeminiContent[] = [];

  for (const h of params.history) {
    geminiContents.push({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    });
  }

  geminiContents.push({
    role: "user",
    parts: [{ text: params.message }],
  });

  return callGemini(geminiContents, systemPrompt);
}

export async function translateText(text: string, language: string): Promise<string> {
  if (!language || language.toLowerCase() === "english") {
    return text;
  }

  const prompt = `Translate the following educational quiz/lesson text accurately into ${language}.
Keep technical terms or DepEd names in their standard Philippine usage if appropriate.

Text to translate:
"""
${text}
"""

Provide ONLY the direct translated text.`;

  return callGemini([{ parts: [{ text: prompt }] }]);
}
