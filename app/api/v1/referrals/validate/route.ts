import { NextRequest, NextResponse } from "next/server";
import { ValidateReferralSchema } from "@/features/billing/schemas/checkoutSchemas";
import { validateReferralCode } from "@/lib/affiliate/sgwsService";
import { DEFAULT_PRODUCT_SLUG } from "@/lib/affiliate/constants";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = ValidateReferralSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          valid: false,
          affiliate: null,
          product: null,
          reason: parseResult.error.issues?.[0]?.message || "Invalid referral payload",
        },
        { status: 400 }
      );
    }

    const { referralCode, productSlug = DEFAULT_PRODUCT_SLUG } = parseResult.data;
    const result = await validateReferralCode(referralCode, productSlug);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Referral validation proxy error:", error);
    return NextResponse.json(
      {
        valid: false,
        affiliate: null,
        product: null,
        reason: "INTERNAL_VALIDATION_ERROR",
      },
      { status: 200 }
    );
  }
}
