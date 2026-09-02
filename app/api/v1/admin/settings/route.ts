import { NextRequest, NextResponse } from "next/server";

// In-memory / persisted runtime config for pricing and guardrails
let adminSettings = {
  monthlyPricePhp: 199,
  annualPricePhp: 1499,
  maxTrialSubjects: 3,
  maxFreeLessons: 3,
  gcashReceiverNumber: "0917-888-4321",
  gcashAccountName: "HIGHSCHOOL TUTOR PH",
  mayaReceiverNumber: "0918-999-8765",
  mayaAccountName: "HIGHSCHOOL TUTOR PH",
  enableAiTutorTrial: true,
  promoDiscountPercent: 20,
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: adminSettings,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    adminSettings = {
      ...adminSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Admin settings successfully updated.",
      data: adminSettings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
