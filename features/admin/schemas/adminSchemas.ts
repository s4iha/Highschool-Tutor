import { z } from "zod";

// =============================================================================
// Admin Pricing & Guardrails Settings Schemas
// =============================================================================

export const AdminConfigUpdateSchema = z.object({
  monthlyPricePhp: z.number().int().min(0, "Monthly price must be non-negative").optional(),
  annualPricePhp: z.number().int().min(0, "Annual price must be non-negative").optional(),
  maxTrialSubjects: z.number().int().min(1, "Must allow at least 1 trial subject").optional(),
  maxFreeLessons: z.number().int().min(1, "Must allow at least 1 free lesson").optional(),
  gcashReceiverNumber: z.string().min(10, "Invalid GCash number format").optional(),
  gcashAccountName: z.string().min(2, "Account name required").optional(),
  mayaReceiverNumber: z.string().min(10, "Invalid Maya number format").optional(),
  mayaAccountName: z.string().min(2, "Account name required").optional(),
  enableAiTutorTrial: z.boolean().optional(),
  promoDiscountPercent: z.number().int().min(0).max(100).optional(),
});

export type AdminConfigUpdateInput = z.infer<typeof AdminConfigUpdateSchema>;

// =============================================================================
// Announcement Schemas
// =============================================================================

export const AnnouncementCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title too long"),
  body: z.string().min(5, "Body must be at least 5 characters"),
  type: z.enum(["INFO", "WARNING", "PROMO", "MAINTENANCE"]).default("INFO"),
  targetAudience: z.enum(["ALL", "PREMIUM", "TRIAL"]).default("ALL"),
  isActive: z.boolean().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
});

export type AnnouncementCreateInput = z.infer<typeof AnnouncementCreateSchema>;

export const AnnouncementUpdateSchema = AnnouncementCreateSchema.partial();
export type AnnouncementUpdateInput = z.infer<typeof AnnouncementUpdateSchema>;

// =============================================================================
// Quiz Configuration Schemas
// =============================================================================

export const QuizQuestionSchema = z.object({
  question: z.string().min(3, "Question text required"),
  options: z.object({
    A: z.string().min(1, "Option A required"),
    B: z.string().min(1, "Option B required"),
    C: z.string().min(1, "Option C required"),
    D: z.string().min(1, "Option D required"),
  }),
  answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().optional().default(""),
});

export type QuizQuestionItem = z.infer<typeof QuizQuestionSchema>;

export const QuizConfigUpdateSchema = z.object({
  lessonTitle: z.string().min(1, "Lesson title required").optional(),
  questions: z.array(QuizQuestionSchema).min(1, "At least one question required"),
});

export type QuizConfigUpdateInput = z.infer<typeof QuizConfigUpdateSchema>;

// =============================================================================
// Student Subscription Update Schema
// =============================================================================

export const StudentSubscriptionUpdateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["ACTIVE", "TRIAL", "PENDING", "EXPIRED"]),
  plan: z.enum(["MONTHLY", "ANNUAL", "GRADE_7", "GRADE_8", "GRADE_9", "GRADE_10", "GRADE_11", "GRADE_12", "ALL_LEVELS", "NONE"]).optional(),
});

export type StudentSubscriptionUpdateInput = z.infer<typeof StudentSubscriptionUpdateSchema>;
