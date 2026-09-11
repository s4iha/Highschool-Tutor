import { NextRequest, NextResponse } from "next/server";
import { runAsAdmin } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectSlug = searchParams.get("subjectSlug") || "";

    const quizzes = await runAsAdmin(async (tx) => {
      const where = subjectSlug ? { subjectSlug } : {};
      return tx.cachedQuiz.findMany({
        where,
        orderBy: [{ subjectSlug: "asc" }, { lessonNumber: "asc" }],
      });
    });

    const summary = quizzes.map((q) => {
      const questionsArray = Array.isArray(q.questions) ? q.questions : [];
      return {
        id: q.id,
        subjectSlug: q.subjectSlug,
        lessonNumber: q.lessonNumber,
        lessonTitle: q.lessonTitle,
        questionCount: questionsArray.length,
        createdAt: q.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error listing quiz configs:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
