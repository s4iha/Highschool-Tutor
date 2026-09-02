"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  plan: "MONTHLY" | "ANNUAL" | "NONE";
  trialSubjectsCount: number;
  quizAttemptsCount: number;
  joinedAt: string;
}

export interface AdminSettingsData {
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

// 1. Fetch Metrics Query
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

// 2. Fetch Students List Query
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

// 3. Fetch Settings Query
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

// 4. Update Student Subscription Mutation
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

// 5. Update Pricing & Tier Settings Mutation
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
