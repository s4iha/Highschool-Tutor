import { NextRequest, NextResponse } from "next/server";
import { runAsAdmin } from "@/lib/prisma";
import { QuizConfigUpdateSchema } from "@/features/admin/schemas/adminSchemas";
import { getSubjectBySlug } from "@/features/curriculum/utils/curriculum-data";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string; lesson: string }> }
) {
  try {
    const { slug, lesson } = await context.params;
    const lessonNumber = parseInt(lesson, 10);

    if (isNaN(lessonNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid lesson number" },
        { status: 400 }
      );
    }

    const quiz = await runAsAdmin(async (tx) => {
      return tx.cachedQuiz.findUnique({
        where: {
          subjectSlug_lessonNumber: {
            subjectSlug: slug,
            lessonNumber,
          },
        },
      });
    });

    if (!quiz) {
      const subject = getSubjectBySlug(slug);
      return NextResponse.json({
        success: true,
        data: {
          exists: false,
          subjectSlug: slug,
          lessonNumber,
          lessonTitle: `Lesson ${lessonNumber}`,
          subjectName: subject?.name || slug,
          questions: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        exists: true,
        id: quiz.id,
        subjectSlug: quiz.subjectSlug,
        lessonNumber: quiz.lessonNumber,
        lessonTitle: quiz.lessonTitle,
        questions: quiz.questions,
        createdAt: quiz.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching quiz config:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string; lesson: string }> }
) {
  try {
    const { slug, lesson } = await context.params;
    const lessonNumber = parseInt(lesson, 10);

    if (isNaN(lessonNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid lesson number" },
        { status: 400 }
      );
    }

    const rawBody = await req.json();
    const parsed = QuizConfigUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { lessonTitle = `Lesson ${lessonNumber}`, questions } = parsed.data;

    const quiz = await runAsAdmin(async (tx) => {
      return tx.cachedQuiz.upsert({
        where: {
          subjectSlug_lessonNumber: {
            subjectSlug: slug,
            lessonNumber,
          },
        },
        update: {
          lessonTitle,
          questions: questions as unknown as object,
        },
        create: {
          subjectSlug: slug,
          lessonNumber,
          lessonTitle,
          questions: questions as unknown as object,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Quiz configuration saved successfully.",
      data: quiz,
    });
  } catch (error) {
    console.error("Error updating quiz config:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ slug: string; lesson: string }> }
) {
  try {
    const { slug, lesson } = await context.params;
    const lessonNumber = parseInt(lesson, 10);

    if (isNaN(lessonNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid lesson number" },
        { status: 400 }
      );
    }

    await runAsAdmin(async (tx) => {
      return tx.cachedQuiz.deleteMany({
        where: {
          subjectSlug: slug,
          lessonNumber,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Quiz cache cleared successfully.",
    });
  } catch (error) {
    console.error("Error deleting quiz config:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
