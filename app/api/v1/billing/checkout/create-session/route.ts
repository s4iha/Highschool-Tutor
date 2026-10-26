import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { CreateCheckoutSessionSchema } from "@/features/billing/schemas/checkoutSchemas";
import { PLAN_CONFIGS } from "@/features/billing/utils/pricing";
import { createPayMongoCheckoutSession } from "@/lib/paymongo/client";
import { buildReferenceNumber } from "@/lib/affiliate/referenceNumber";
import { validateReferralCode } from "@/lib/affiliate/sgwsService";
import {
  SGWS_COOKIE_NAME,
  DEFAULT_PRODUCT_SLUG,
} from "@/lib/affiliate/constants";
import { getReferralCookieOptions } from "@/lib/affiliate/cookies";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to subscribe." },
        { status: 401 }
      );
    }

    const rawBody = await req.json().catch(() => ({}));
    const parseResult = CreateCheckoutSessionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues?.[0]?.message || "Invalid request payload";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    const { planId } = parseResult.data;
    const planConfig = PLAN_CONFIGS[planId];
    if (!planConfig) {
      return NextResponse.json({ success: false, error: "Unsupported subscription plan" }, { status: 400 });
    }

    // Determine referral attribution (payload takes precedence, falling back to cookie)
    const cookieStore = await cookies();
    const cookieRef = cookieStore.get(SGWS_COOKIE_NAME)?.value;
    const rawRefCode = (parseResult.data.referralCode || cookieRef || "").trim();

    let validatedRefCode: string | null = null;
    if (rawRefCode.length > 0) {
      const validation = await validateReferralCode(rawRefCode, DEFAULT_PRODUCT_SLUG);
      if (validation.valid && validation.affiliate?.code) {
        validatedRefCode = validation.affiliate.code;
      }
    }

    // Generate collision-free reference number
    const referenceNumber = buildReferenceNumber({
      referralCode: validatedRefCode,
      productSlug: DEFAULT_PRODUCT_SLUG,
      timestamp: Date.now(),
    });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const successUrl = `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/dashboard?payment=cancelled`;

    // Create session in PayMongo
    const session = await createPayMongoCheckoutSession({
      lineItems: [
        {
          name: `HighSchool Tutor ${planConfig.title}`,
          amount: planConfig.priceCentavos,
          currency: "PHP",
          quantity: 1,
          description: planConfig.description,
        },
      ],
      referenceNumber,
      successUrl,
      cancelUrl,
      description: `HighSchool Tutor ${planConfig.title} Subscription`,
      billing: {
        name: user.name || undefined,
        email: user.email || undefined,
      },
      metadata: {
        userId: user.id,
        planId,
        referralCode: validatedRefCode || "",
        productSlug: DEFAULT_PRODUCT_SLUG,
      },
    });

    // Persist pending transaction in PostgreSQL
    await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        paymongoSessionId: session.id,
        referenceNumber,
        referralCode: validatedRefCode,
        productSlug: DEFAULT_PRODUCT_SLUG,
        plan: planId,
        amountCentavos: planConfig.priceCentavos,
        currency: "PHP",
        status: "PENDING",
      },
    });

    const response = NextResponse.json({
      success: true,
      checkoutUrl: session.checkoutUrl,
      sessionId: session.id,
      referenceNumber,
      amountCentavos: planConfig.priceCentavos,
      planId,
      referralCode: validatedRefCode,
    });

    // If an affiliate code was provided and validated, persist or refresh cookie
    if (validatedRefCode) {
      const cookieOpts = getReferralCookieOptions();
      response.cookies.set(SGWS_COOKIE_NAME, validatedRefCode, cookieOpts);
    }

    return response;
  } catch (error: unknown) {
    console.error("Create checkout session error:", error);
    const message = error instanceof Error ? error.message : "Failed to initiate payment";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
