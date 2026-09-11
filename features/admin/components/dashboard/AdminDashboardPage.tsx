"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Clock,
  Shield,
  RefreshCw,
  Sparkles,
  DollarSign,
  FileQuestion,
  Megaphone,
  Settings,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import {
  useAdminMetricsQuery,
  useAdminActivityQuery,
} from "../../hooks/useAdminPortal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function AdminDashboardPage() {
  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics,
    isRefetching: metricsRefetching,
  } = useAdminMetricsQuery();

  const {
    data: activity,
    isLoading: activityLoading,
    refetch: refetchActivity,
  } = useAdminActivityQuery();

  const handleRefreshAll = () => {
    refetchMetrics();
    refetchActivity();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Shield className="size-3.5" />
              DepEd SaaS Plane
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">HighSchool Tutor Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time platform metrics, revenue tracking, and student activity overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={metricsRefetching}
            className="gap-1.5 rounded-xl text-xs"
          >
            <RefreshCw
              className={`size-3.5 ${metricsRefetching ? "animate-spin" : ""}`}
            />
            <span>Sync Live Data</span>
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Students
            </CardTitle>
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground font-heading">
                  {metrics?.totalStudents.toLocaleString()}
                </div>
                <p className="text-xs text-success flex items-center gap-1 mt-1 font-medium">
                  <span>{metrics?.monthlyGrowth}</span>
                  <span className="text-muted-foreground">vs last month</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Active Premium Subs
            </CardTitle>
            <div className="size-8 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground font-heading">
                  {metrics?.activeSubscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Conversion: <strong className="text-foreground">{metrics?.conversionRate}</strong>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Monthly Revenue
            </CardTitle>
            <div className="size-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground font-heading">
                  ₱{metrics?.revenuePhp.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Via GCash & Maya
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Pending Approvals
            </CardTitle>
            <div className="size-8 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground font-heading">
                  {metrics?.pendingPayments}
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                  Ref verification needed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Control Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/students"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xs transition-all"
          >
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Students & Subs
              </h3>
              <p className="text-xs text-muted-foreground">
                Activate or expire student tiers and check trial limits.
              </p>
            </div>
            <div className="flex items-center text-xs text-primary font-semibold mt-4 gap-1">
              <span>Manage Students</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/admin/quiz-config"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xs transition-all"
          >
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <FileQuestion className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Quiz Bank Editor
              </h3>
              <p className="text-xs text-muted-foreground">
                Edit 120+ DepEd subjects and configure lesson questions.
              </p>
            </div>
            <div className="flex items-center text-xs text-primary font-semibold mt-4 gap-1">
              <span>Edit Quizzes</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/admin/announcements"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xs transition-all"
          >
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Megaphone className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Announcements
              </h3>
              <p className="text-xs text-muted-foreground">
                Post system updates, promos, and exam announcements.
              </p>
            </div>
            <div className="flex items-center text-xs text-primary font-semibold mt-4 gap-1">
              <span>Broadcast Now</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="group flex flex-col justify-between p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xs transition-all"
          >
            <div className="space-y-2">
              <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Settings className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Pricing & Guardrails
              </h3>
              <p className="text-xs text-muted-foreground">
                Update subscription prices and GCash/Maya receiver numbers.
              </p>
            </div>
            <div className="flex items-center text-xs text-primary font-semibold mt-4 gap-1">
              <span>Configure Settings</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments & Verifications */}
        <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold font-heading">
                Recent Payments & Verification
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest transactions submitted by high school students.
              </p>
            </div>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="text-xs rounded-xl">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : activity?.payments?.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No recent payment transactions.
              </p>
            ) : (
              activity?.payments?.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-xs text-foreground truncate">
                      {payment.userName}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">
                      {payment.referenceNo} • {payment.method.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold font-mono text-foreground">
                      ₱{payment.amountPhp.toLocaleString()}
                    </span>
                    <Badge
                      variant={
                        payment.status === "VERIFIED"
                          ? "default"
                          : payment.status === "PENDING"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Quiz Attempts */}
        <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold font-heading">
                Student Quiz Activity
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time practice test and exam mode submissions.
              </p>
            </div>
            <Link href="/admin/quiz-config">
              <Button variant="ghost" size="sm" className="text-xs rounded-xl">
                Configure Quizzes
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : activity?.quizAttempts?.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No recent quiz attempts recorded.
              </p>
            ) : (
              activity?.quizAttempts?.map((quiz) => {
                const percentage = Math.round((quiz.score / (quiz.total || 1)) * 100);
                const isPassed = percentage >= 75;

                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">
                        {quiz.userName}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {quiz.lessonTitle} ({quiz.mode.toUpperCase()} MODE)
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-semibold">
                        {quiz.score}/{quiz.total} ({percentage}%)
                      </span>
                      <Badge
                        variant={isPassed ? "default" : "secondary"}
                        className={`text-[10px] ${
                          isPassed ? "bg-success text-success-foreground" : ""
                        }`}
                      >
                        {isPassed ? "Passed" : "Needs Review"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insight Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-base font-bold text-foreground font-heading">
              DepEd MATATAG Curriculum Compliance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Grades 7 through 12 practice tests adhere to DepEd Order No. 015, s. 2026 transmutation guidelines. All student quiz attempts are scored with official 75% passing transmutation thresholds.
          </p>
        </div>
        <Link href="/admin/quiz-config">
          <Button className="rounded-xl text-xs font-semibold shadow-xs gap-1.5" size="sm">
            <GraduationCap className="size-3.5" />
            <span>Review Curriculum Bank</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
