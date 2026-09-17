"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AnnouncementCreateInput,
  AnnouncementUpdateInput,
  QuizConfigUpdateInput,
  QuizQuestionItem,
} from "../schemas/adminSchemas";
import {
  getLessonMaterialAction,
  getSubjectLessonMaterialsAction,
  saveLessonMaterialAction,
  generateLessonMaterialAiAction,
  type LessonMaterialData,
} from "@/features/curriculum/actions/lesson-material.actions";

// =============================================================================
// TypeScript Interfaces
// =============================================================================

export interface AdminMetrics {
  totalStudents: number;
  activeSubscriptions: number;
  revenuePhp: number;
  pendingPayments: number;
  totalQuizAttempts: number;
  conversionRate: string;
  monthlyGrowth: string;
}

export interface StudentItem {
  id: string;
  name: string;
  email: string;
  gradeLevel: string;
  school: string;
  subscriptionStatus: "ACTIVE" | "TRIAL" | "PENDING" | "EXPIRED";
  plan: "MONTHLY" | "ANNUAL" | "NONE" | string;
  trialSubjectsCount: number;
  quizAttemptsCount: number;
  joinedAt: string;
}

export interface AdminSettingsData {
  id?: string;
  monthlyPricePhp: number;
  annualPricePhp: number;
  maxTrialSubjects: number;
  maxFreeLessons: number;
  gcashReceiverNumber: string;
  gcashAccountName: string;
  mayaReceiverNumber: string;
  mayaAccountName: string;
  enableAiTutorTrial: boolean;
  promoDiscountPercent: number;
  updatedAt: string;
}

export interface AdminActivityPayment {
  id: string;
  userName: string;
  userEmail: string;
  amountPhp: number;
  method: string;
  referenceNo: string;
  status: string;
  date: string;
}

export interface AdminActivitySubscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: string;
  amountPhp: number;
  date: string;
}

export interface AdminActivityQuiz {
  id: string;
  userName: string;
  subjectSlug: string;
  lessonTitle: string;
  score: number;
  total: number;
  mode: string;
  date: string;
}

export interface AdminActivityData {
  payments: AdminActivityPayment[];
  subscriptions: AdminActivitySubscription[];
  quizAttempts: AdminActivityQuiz[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  type: "INFO" | "WARNING" | "PROMO" | "MAINTENANCE";
  targetAudience: "ALL" | "PREMIUM" | "TRIAL";
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuizConfigSummary {
  id: string;
  subjectSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizConfigDetail {
  exists: boolean;
  id?: string;
  subjectSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  subjectName?: string;
  questions: QuizQuestionItem[];
  createdAt?: string;
}

// =============================================================================
// 1. Dashboard & Metrics Hooks
// =============================================================================

export function useAdminMetricsQuery() {
  return useQuery<AdminMetrics>({
    queryKey: ["admin", "metrics"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/metrics");
      if (!res.ok) throw new Error("Failed to fetch admin metrics");
      const json = await res.json();
      return json.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminActivityQuery() {
  return useQuery<AdminActivityData>({
    queryKey: ["admin", "activity"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/activity");
      if (!res.ok) throw new Error("Failed to fetch admin activity");
      const json = await res.json();
      return json.data;
    },
    staleTime: 30 * 1000,
  });
}

// =============================================================================
// 2. Students & Subscriptions Hooks
// =============================================================================

export function useAdminStudentsQuery({
  page = 1,
  search = "",
  status = "all",
}: {
  page?: number;
  search?: string;
  status?: string;
}) {
  return useQuery<{
    students: StudentItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ["admin", "students", { page, search, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        status,
      });
      const res = await fetch(`/api/v1/admin/students?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const json = await res.json();
      return json.data;
    },
    staleTime: 15 * 1000,
  });
}

export function useUpdateSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      status,
      plan,
    }: {
      userId: string;
      status: string;
      plan?: string;
    }) => {
      const res = await fetch("/api/v1/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status, plan }),
      });
      if (!res.ok) throw new Error("Failed to update subscription status");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "metrics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity"] });
      toast.success("Subscription Status Updated", {
        description: `Student marked as ${variables.status}.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Update Failed", {
        description: err.message,
      });
    },
  });
}

// =============================================================================
// 3. Settings & Pricing Hooks
// =============================================================================

export function useAdminSettingsQuery() {
  return useQuery<AdminSettingsData>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/settings");
      if (!res.ok) throw new Error("Failed to fetch admin settings");
      const json = await res.json();
      return json.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useUpdatePricingSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedSettings: Partial<AdminSettingsData>) => {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings Saved Successfully", {
        description: "New subscription prices and guardrail limits are now live.",
      });
    },
    onError: (err: Error) => {
      toast.error("Settings Update Failed", {
        description: err.message,
      });
    },
  });
}

// =============================================================================
// 4. Announcements Hooks
// =============================================================================

export function useAdminAnnouncementsQuery({
  type,
  audience,
  activeOnly,
}: {
  type?: string;
  audience?: string;
  activeOnly?: boolean;
} = {}) {
  return useQuery<AnnouncementItem[]>({
    queryKey: ["admin", "announcements", { type, audience, activeOnly }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (audience) params.set("audience", audience);
      if (activeOnly) params.set("activeOnly", "true");

      const res = await fetch(`/api/v1/admin/announcements?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const json = await res.json();
      return json.data;
    },
    staleTime: 20 * 1000,
  });
}

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AnnouncementCreateInput) => {
      const res = await fetch("/api/v1/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create announcement");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
      toast.success("Announcement Created", {
        description: "Your announcement is now recorded.",
      });
    },
    onError: (err: Error) => {
      toast.error("Creation Failed", { description: err.message });
    },
  });
}

export function useUpdateAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AnnouncementUpdateInput;
    }) => {
      const res = await fetch(`/api/v1/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update announcement");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
      toast.success("Announcement Updated");
    },
    onError: (err: Error) => {
      toast.error("Update Failed", { description: err.message });
    },
  });
}

export function useDeleteAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/admin/announcements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete announcement");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcements"] });
      toast.success("Announcement Deleted");
    },
    onError: (err: Error) => {
      toast.error("Deletion Failed", { description: err.message });
    },
  });
}

// =============================================================================
// 5. Quiz Configuration Hooks
// =============================================================================

export function useAdminQuizListQuery(subjectSlug?: string) {
  return useQuery<QuizConfigSummary[]>({
    queryKey: ["admin", "quiz-config", "list", { subjectSlug }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subjectSlug) params.set("subjectSlug", subjectSlug);

      const res = await fetch(`/api/v1/admin/quiz-config?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch quiz configurations");
      const json = await res.json();
      return json.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminQuizDetailQuery(slug: string, lessonNumber: number) {
  return useQuery<QuizConfigDetail>({
    queryKey: ["admin", "quiz-config", "detail", slug, lessonNumber],
    queryFn: async () => {
      const res = await fetch(`/api/v1/admin/quiz-config/${slug}/${lessonNumber}`);
      if (!res.ok) throw new Error("Failed to fetch quiz details");
      const json = await res.json();
      return json.data;
    },
    enabled: Boolean(slug && lessonNumber > 0),
    staleTime: 10 * 1000,
  });
}

export function useUpdateQuizConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      lessonNumber,
      data,
    }: {
      slug: string;
      lessonNumber: number;
      data: QuizConfigUpdateInput;
    }) => {
      const res = await fetch(`/api/v1/admin/quiz-config/${slug}/${lessonNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save quiz configuration");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "quiz-config", "detail", variables.slug, variables.lessonNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "quiz-config", "list"],
      });
      toast.success("Quiz Configuration Saved", {
        description: `Questions for Lesson ${variables.lessonNumber} updated.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Save Failed", { description: err.message });
    },
  });
}

export function useDeleteQuizConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      lessonNumber,
    }: {
      slug: string;
      lessonNumber: number;
    }) => {
      const res = await fetch(`/api/v1/admin/quiz-config/${slug}/${lessonNumber}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to clear quiz cache");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "quiz-config", "detail", variables.slug, variables.lessonNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "quiz-config", "list"],
      });
      toast.success("Quiz Cache Cleared");
    },
    onError: (err: Error) => {
      toast.error("Clear Failed", { description: err.message });
    },
  });
}

// =============================================================================
// Admin Lesson Material Hooks
// =============================================================================

export interface AdminLessonMaterialItem {
  id: string;
  subjectSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  summary: string | null;
  updatedAt: Date;
}

export function useAdminSubjectLessonMaterialsQuery(slug: string) {
  return useQuery<AdminLessonMaterialItem[]>({
    queryKey: ["admin", "lesson-materials", "subject", slug],
    queryFn: async () => {
      const res = await getSubjectLessonMaterialsAction(slug);
      if (!res.success) throw new Error(res.error || "Failed to fetch lesson materials");
      return (res.materials || []) as AdminLessonMaterialItem[];
    },
    enabled: Boolean(slug),
    staleTime: 30 * 1000,
  });
}

export function useAdminLessonMaterialQuery(slug: string, lessonNumber: number) {
  return useQuery<LessonMaterialData | undefined>({
    queryKey: ["admin", "lesson-materials", "detail", slug, lessonNumber],
    queryFn: async () => {
      const res = await getLessonMaterialAction(slug, lessonNumber);
      if (!res.success) throw new Error(res.error || "Failed to fetch lesson material");
      return res.material;
    },
    enabled: Boolean(slug && lessonNumber > 0),
    staleTime: 10 * 1000,
  });
}

export function useSaveLessonMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      subjectSlug: string;
      lessonNumber: number;
      lessonTitle: string;
      content: string;
      summary?: string;
    }) => {
      const res = await saveLessonMaterialAction(data);
      if (!res.success) {
        throw new Error(res.error || "Failed to save lesson material");
      }
      return res.material;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "lesson-materials", "subject", variables.subjectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "lesson-materials", "detail", variables.subjectSlug, variables.lessonNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["curriculum", "lesson-material", variables.subjectSlug, variables.lessonNumber],
      });
      toast.success("Lesson Material Saved", {
        description: `Material for Lesson ${variables.lessonNumber} updated successfully.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Save Failed", { description: err.message });
    },
  });
}

export function useGenerateLessonMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      lessonNumber,
      lessonTitleOverride,
    }: {
      slug: string;
      lessonNumber: number;
      lessonTitleOverride?: string;
    }) => {
      const res = await generateLessonMaterialAiAction(slug, lessonNumber, lessonTitleOverride);
      if (!res.success) {
        throw new Error(res.error || "Failed to generate lesson material");
      }
      return res.material;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "lesson-materials", "subject", variables.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "lesson-materials", "detail", variables.slug, variables.lessonNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["curriculum", "lesson-material", variables.slug, variables.lessonNumber],
      });
      toast.success("AI Lesson Generated", {
        description: `Generated comprehensive study material for Lesson ${variables.lessonNumber}.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Generation Failed", { description: err.message });
    },
  });
}
