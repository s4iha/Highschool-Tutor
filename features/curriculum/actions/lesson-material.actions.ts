"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { SUBJECT_BY_SLUG } from "../utils/curriculum-data";
import { generateLessonContentWithGemini } from "../api/gemini-service";
import { getLessonsAction } from "./curriculum.actions";

export interface LessonMaterialData {
  id?: string;
  subjectSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  content: string;
  summary?: string | null;
  keyTakeaways?: string[] | null;
  isAiGenerated?: boolean;
  updatedAt?: Date;
}

const SaveLessonMaterialSchema = z.object({
  subjectSlug: z.string().min(1),
  lessonNumber: z.number().int().min(1).max(25),
  lessonTitle: z.string().min(1).max(200),
  content: z.string().min(10, "Lesson content must be at least 10 characters long"),
  summary: z.string().optional(),
});

/**
 * Fetch lesson material for students or admin preview.
 * Falls back to structured curriculum outline if no custom material has been saved yet.
 */
export async function getLessonMaterialAction(
  subjectSlug: string,
  lessonNumber: number
): Promise<{ success: boolean; material?: LessonMaterialData; error?: string }> {
  try {
    const num = Number(lessonNumber);
    if (isNaN(num) || num < 1) {
      return { success: false, error: "Invalid lesson number" };
    }

    // 1. Check PostgreSQL for saved/generated lesson material
    const dbMaterial = await prisma.lessonMaterial.findUnique({
      where: {
        subjectSlug_lessonNumber: {
          subjectSlug,
          lessonNumber: num,
        },
      },
    });

    if (dbMaterial) {
      let parsedTakeaways: string[] | null = null;
      if (Array.isArray(dbMaterial.keyTakeaways)) {
        parsedTakeaways = dbMaterial.keyTakeaways as string[];
      }

      return {
        success: true,
        material: {
          id: dbMaterial.id,
          subjectSlug: dbMaterial.subjectSlug,
          lessonNumber: dbMaterial.lessonNumber,
          lessonTitle: dbMaterial.lessonTitle,
          content: dbMaterial.content,
          summary: dbMaterial.summary,
          keyTakeaways: parsedTakeaways,
          updatedAt: dbMaterial.updatedAt,
        },
      };
    }

    // 2. If not yet in DB, synthesize starter material from the curriculum lessons
    const lessonsResult = await getLessonsAction(subjectSlug);
    const subject = SUBJECT_BY_SLUG.get(subjectSlug);
    const lesson = lessonsResult.lessons?.find((l) => l.number === num);

    const title = lesson?.title || `Lesson ${num} Competencies`;
    const summary = lesson?.summary || `Core DepEd MATATAG competencies and learning guide for ${subject?.name || subjectSlug}.`;
    const concepts = lesson?.keyConcepts || [];

    const defaultContent = `# ${title}

**Subject**: ${subject?.name || subjectSlug} • Lesson ${num}
**Overview**: ${summary}

---

## 1. Key Learning Competency
In this lesson, you will master the essential Philippine DepEd curriculum standards:
${concepts.map((c) => `- **${c}**: Core principles and operational problem solving.`).join("\n")}

## 2. Core Concepts & Definitions
- Understand how each principle applies to practical test questions.
- Review mathematical derivations, scientific processes, or analytical frameworks.

## 3. High-Yield Study Notes
1. **Focus on Fundamentals**: Pay close attention to standard definitions and formulas.
2. **Avoid Common Traps**: Double check calculations and question conditions carefully.
3. **Practice Regularly**: Take the corresponding practice test drill to reinforce your retention!

---
*Ready to test your mastery? Click "Take Quiz" below to start your study drill!*
`;

    return {
      success: true,
      material: {
        subjectSlug,
        lessonNumber: num,
        lessonTitle: title,
        content: defaultContent,
        summary,
        keyTakeaways: concepts,
        isAiGenerated: false,
      },
    };
  } catch (error) {
    console.error("Error fetching lesson material:", error);
    return { success: false, error: "Failed to load lesson material" };
  }
}

/**
 * Fetch all saved lesson materials for a subject to support the Admin Lesson Directory overview.
 */
export async function getSubjectLessonMaterialsAction(subjectSlug: string) {
  try {
    const materials = await prisma.lessonMaterial.findMany({
      where: { subjectSlug },
      select: {
        id: true,
        subjectSlug: true,
        lessonNumber: true,
        lessonTitle: true,
        summary: true,
        updatedAt: true,
      },
      orderBy: { lessonNumber: "asc" },
    });
    return { success: true, materials };
  } catch (error) {
    console.error("Error fetching subject lesson materials:", error);
    return { success: false, materials: [], error: "Failed to load materials" };
  }
}

/**
 * Admin action to save or update curated lesson material.
 */
export async function saveLessonMaterialAction(input: z.infer<typeof SaveLessonMaterialSchema>) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    const validated = SaveLessonMaterialSchema.parse(input);

    const saved = await prisma.lessonMaterial.upsert({
      where: {
        subjectSlug_lessonNumber: {
          subjectSlug: validated.subjectSlug,
          lessonNumber: validated.lessonNumber,
        },
      },
      update: {
        lessonTitle: validated.lessonTitle,
        content: validated.content,
        summary: validated.summary || null,
      },
      create: {
        subjectSlug: validated.subjectSlug,
        lessonNumber: validated.lessonNumber,
        lessonTitle: validated.lessonTitle,
        content: validated.content,
        summary: validated.summary || null,
      },
    });

    return { success: true, material: saved };
  } catch (error) {
    console.error("Error saving lesson material:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save lesson material",
    };
  }
}

/**
 * Admin action to auto-generate high-quality lesson material using Gemini.
 */
export async function generateLessonMaterialAiAction(
  subjectSlug: string,
  lessonNumber: number,
  lessonTitleOverride?: string
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    const subject = SUBJECT_BY_SLUG.get(subjectSlug);
    const subjectName = subject?.name || subjectSlug;

    // Resolve lesson details from curriculum lessons
    const lessonsResult = await getLessonsAction(subjectSlug);
    const lesson = lessonsResult.lessons?.find((l) => l.number === lessonNumber);
    const title = lessonTitleOverride || lesson?.title || `Lesson ${lessonNumber}`;
    const keyConcepts = lesson?.keyConcepts || [];

    const generated = await generateLessonContentWithGemini(
      subjectName,
      lessonNumber,
      title,
      keyConcepts
    );

    // Save directly to PostgreSQL
    const saved = await prisma.lessonMaterial.upsert({
      where: {
        subjectSlug_lessonNumber: {
          subjectSlug,
          lessonNumber,
        },
      },
      update: {
        lessonTitle: generated.title || title,
        content: generated.content,
        summary: generated.summary,
        keyTakeaways: generated.keyTakeaways,
      },
      create: {
        subjectSlug,
        lessonNumber,
        lessonTitle: generated.title || title,
        content: generated.content,
        summary: generated.summary,
        keyTakeaways: generated.keyTakeaways,
      },
    });

    return {
      success: true,
      material: {
        ...saved,
        keyTakeaways: generated.keyTakeaways,
      },
    };
  } catch (error) {
    console.error("Error auto-generating lesson material:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate lesson material",
    };
  }
}
