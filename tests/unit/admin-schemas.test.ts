import {
  AdminConfigUpdateSchema,
  AdminEnrollStudentSchema,
  AnnouncementCreateSchema,
  AnnouncementUpdateSchema,
  QuizQuestionSchema,
  QuizConfigUpdateSchema,
  StudentSubscriptionUpdateSchema,
} from "@/features/admin/schemas/adminSchemas";

describe("Admin Portal Zod Schemas Validation", () => {
  describe("AdminConfigUpdateSchema", () => {
    it("should validate a valid settings update payload with targetLessonsPerSubject and trialDurationDays", () => {
      const validPayload = {
        monthlyPricePhp: 299,
        annualPricePhp: 1499,
        maxTrialSubjects: 3,
        maxFreeLessons: 3,
        targetLessonsPerSubject: 8,
        trialDurationDays: 30,
        gcashReceiverNumber: "0917-888-4321",
        gcashAccountName: "HIGHSCHOOL TUTOR PH",
        mayaReceiverNumber: "0918-999-8765",
        mayaAccountName: "HIGHSCHOOL TUTOR PH",
        enableAiTutorTrial: true,
        promoDiscountPercent: 25,
      };

      const result = AdminConfigUpdateSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.targetLessonsPerSubject).toBe(8);
        expect(result.data.trialDurationDays).toBe(30);
      }
    });

    it("should reject negative prices, invalid lessons count, and invalid percentages", () => {
      const invalidPayload = {
        monthlyPricePhp: -50,
        targetLessonsPerSubject: 0,
        trialDurationDays: -5,
        promoDiscountPercent: 150,
      };

      const result = AdminConfigUpdateSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("AnnouncementCreateSchema & UpdateSchema", () => {
    it("should validate a valid announcement creation", () => {
      const validAnnouncement = {
        title: "Midterm Examination Review Window Open",
        body: "Junior and Senior High School mock examinations are now live across all 120+ subjects.",
        type: "INFO",
        targetAudience: "ALL",
        isActive: true,
      };

      const result = AnnouncementCreateSchema.safeParse(validAnnouncement);
      expect(result.success).toBe(true);
    });

    it("should reject invalid announcement type", () => {
      const invalidAnnouncement = {
        title: "Invalid Notice",
        body: "Valid body text here",
        type: "UNKNOWN_TYPE",
      };

      const result = AnnouncementCreateSchema.safeParse(invalidAnnouncement);
      expect(result.success).toBe(false);
    });

    it("should allow partial updates", () => {
      const updatePayload = {
        isActive: false,
      };

      const result = AnnouncementUpdateSchema.safeParse(updatePayload);
      expect(result.success).toBe(true);
    });
  });

  describe("QuizQuestionSchema & QuizConfigUpdateSchema", () => {
    it("should validate a proper quiz question with options A through D", () => {
      const validQuestion = {
        question: "What is the derivative of f(x) = x^2 with respect to x?",
        options: {
          A: "x",
          B: "2x",
          C: "x^2",
          D: "2",
        },
        answer: "B",
        explanation: "By the power rule of differentiation, d/dx(x^n) = n*x^(n-1). Thus d/dx(x^2) = 2x.",
      };

      const result = QuizQuestionSchema.safeParse(validQuestion);
      expect(result.success).toBe(true);
    });

    it("should reject a question missing an option", () => {
      const invalidQuestion = {
        question: "Incomplete question",
        options: {
          A: "Choice 1",
          B: "Choice 2",
          C: "Choice 3",
          D: "",
        },
        answer: "A",
      };

      const result = QuizQuestionSchema.safeParse(invalidQuestion);
      expect(result.success).toBe(false);
    });

    it("should validate a full quiz configuration update", () => {
      const validConfigUpdate = {
        lessonTitle: "Basic Derivatives and Differentiation Rules",
        questions: [
          {
            question: "What is the derivative of a constant c?",
            options: {
              A: "1",
              B: "c",
              C: "0",
              D: "Undefined",
            },
            answer: "C",
            explanation: "The rate of change of a constant value is zero.",
          },
        ],
      };

      const result = QuizConfigUpdateSchema.safeParse(validConfigUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe("StudentSubscriptionUpdateSchema", () => {
    it("should validate updating a subscription status and plan", () => {
      const validSubUpdate = {
        userId: "user_test_123",
        status: "ACTIVE",
        plan: "ANNUAL",
      };

      const result = StudentSubscriptionUpdateSchema.safeParse(validSubUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe("AdminEnrollStudentSchema", () => {
    it("should validate valid student enrollment with email and plan", () => {
      const validPayload = {
        email: "student@deped.gov.ph",
        name: "Maria Dela Cruz",
        gradeLevel: "Grade 11",
        school: "Manila Science High School",
        plan: "MONTHLY",
        status: "ACTIVE",
      };

      const result = AdminEnrollStudentSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("student@deped.gov.ph");
        expect(result.data.plan).toBe("MONTHLY");
      }
    });

    it("should validate enrollment with defaults and explicit plan", () => {
      const minimalPayload = {
        email: "juan@example.com",
      };

      const result = AdminEnrollStudentSchema.safeParse(minimalPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.plan).toBe("MONTHLY");
      }

      const trialPayload = {
        email: "trial.student@example.com",
        plan: "TRIAL_30",
      };
      const trialResult = AdminEnrollStudentSchema.safeParse(trialPayload);
      expect(trialResult.success).toBe(true);
      if (trialResult.success) {
        expect(trialResult.data.plan).toBe("TRIAL_30");
      }
    });

    it("should reject invalid email addresses", () => {
      const invalidPayload = {
        email: "not-an-email",
        plan: "MONTHLY",
      };

      const result = AdminEnrollStudentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
