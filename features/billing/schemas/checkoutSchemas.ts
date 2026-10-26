import { z } from "zod";

export const CreateCheckoutSessionSchema = z.object({
  planId: z.enum(["MONTHLY", "ANNUAL"], {
    message: "planId must be either 'MONTHLY' or 'ANNUAL'",
  }),
  referralCode: z
    .string()
    .trim()
    .max(64, "Referral code must not exceed 64 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;

export const ValidateReferralSchema = z.object({
  referralCode: z
    .string()
    .trim()
    .min(1, "Referral code cannot be empty")
    .max(64, "Referral code must not exceed 64 characters"),
  productSlug: z
    .string()
    .trim()
    .max(64)
    .optional()
    .default("highschool-tutor"),
});

export type ValidateReferralInput = z.infer<typeof ValidateReferralSchema>;

export const SgwsAffiliateSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.string().optional(),
});

export const SgwsProductSchema = z.object({
  slug: z.string(),
  name: z.string(),
  priceMinor: z.number(),
});

export const SgwsValidationUpstreamSchema = z.discriminatedUnion("valid", [
  z.object({
    valid: z.literal(true),
    affiliate: SgwsAffiliateSchema,
    product: SgwsProductSchema.nullable().optional(),
    reason: z.null(),
  }),
  z.object({
    valid: z.literal(false),
    affiliate: z.null(),
    product: z.null().optional(),
    reason: z.string().nullable(),
  }),
]);

export type SgwsValidationUpstream = z.infer<typeof SgwsValidationUpstreamSchema>;

export const PayMongoWebhookSchema = z.object({
  data: z.object({
    id: z.string().optional(),
    type: z.string().default("event"),
    attributes: z.object({
      type: z.string({ message: "Event type is required" }),
      livemode: z.boolean().default(false),
      data: z.record(z.string(), z.any()).optional().nullable(),
    }),
  }),
});

export type PayMongoWebhookPayload = z.infer<typeof PayMongoWebhookSchema>;
