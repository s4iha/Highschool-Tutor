import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const DEFAULT_PUBLIC_CONFIG = {
  monthlyPricePhp: 299,
  annualPricePhp: 2999,
  maxTrialSubjects: 3,
  maxFreeLessons: 3,
  targetLessonsPerSubject: 8,
  trialDurationDays: 30,
  availableQuestionCounts: "5, 10, 15, 20",
  gcashReceiverNumber: "0917-888-4321",
  gcashAccountName: "HIGHSCHOOL TUTOR PH",
  mayaReceiverNumber: "0918-999-8765",
  mayaAccountName: "HIGHSCHOOL TUTOR PH",
  enableAiTutorTrial: true,
  promoDiscountPercent: 20,
};

export async function GET() {
  try {
    const config = await prisma.adminConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_PUBLIC_CONFIG,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        monthlyPricePhp: config.monthlyPricePhp,
        annualPricePhp: config.annualPricePhp,
        maxTrialSubjects: config.maxTrialSubjects,
        maxFreeLessons: config.maxFreeLessons,
        targetLessonsPerSubject: config.targetLessonsPerSubject,
        trialDurationDays: config.trialDurationDays,
        availableQuestionCounts: config.availableQuestionCounts ?? "5, 10, 15, 20",
        gcashReceiverNumber: config.gcashReceiverNumber,
        gcashAccountName: config.gcashAccountName,
        mayaReceiverNumber: config.mayaReceiverNumber,
        mayaAccountName: config.mayaAccountName,
        enableAiTutorTrial: config.enableAiTutorTrial,
        promoDiscountPercent: config.promoDiscountPercent,
      },
    });
  } catch (error) {
    console.warn("Error fetching public config, using defaults:", error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_PUBLIC_CONFIG,
    });
  }
}
