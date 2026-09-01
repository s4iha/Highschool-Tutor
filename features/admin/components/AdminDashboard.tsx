"use client";

import * as React from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  Shield,
  Search,
  RefreshCw,
  Save,
  Check,
  GraduationCap,
  Sparkles,
  DollarSign,
  Filter,
} from "lucide-react";
import {
  useAdminMetricsQuery,
  useAdminStudentsQuery,
  useAdminSettingsQuery,
  useUpdateSubscriptionMutation,
  useUpdatePricingSettingsMutation,
  AdminSettingsData,
} from "../hooks/useAdminPortal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "students" | "settings">("overview");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);

  // TanStack Queries
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useAdminMetricsQuery();
  const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents } = useAdminStudentsQuery({
    page,
    search,
    status: statusFilter,
  });
  const { data: settings } = useAdminSettingsQuery();

  // Mutations
  const updateSubscription = useUpdateSubscriptionMutation();
  const updateSettings = useUpdatePricingSettingsMutation();

  // Form state tracking
  const [localFormData, setLocalFormData] = React.useState<Partial<AdminSettingsData>>({});

  const currentSettings = React.useMemo<Partial<AdminSettingsData>>(() => {
    return {
      monthlyPricePhp: 199,
      annualPricePhp: 1499,
      maxTrialSubjects: 3,
      maxFreeLessons: 3,
      gcashReceiverNumber: "0917-888-4321",
      mayaReceiverNumber: "0918-999-8765",
      ...settings,
      ...localFormData,
    };
  }, [settings, localFormData]);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(currentSettings);
  };

  const handleRefreshAll = () => {
    refetchMetrics();
    refetchStudents();
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Shield className="size-3.5" />
              Administrative Portal
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">DepEd SaaS Control Plane</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Tutor Administration & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage student enrollments, subscription statuses, payment verifications, and pricing rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="gap-1.5 rounded-xl"
          >
            <RefreshCw className="size-3.5" />
            <span>Sync Live Data</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
        <TabsList className="bg-muted/80 p-1 rounded-2xl w-full sm:w-auto">
          <TabsTrigger value="overview" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="size-4" />
            <span>Overview & KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <Users className="size-4" />
            <span>Students & Subscriptions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl gap-1.5 text-xs sm:text-sm">
            <DollarSign className="size-4" />
            <span>Pricing & Guardrails</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & KPIS */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Students */}
            <Card className="rounded-2xl border-border/60 bg-card">
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
            <Card className="rounded-2xl border-border/60 bg-card">
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
                      Conversion rate: <strong className="text-foreground">{metrics?.conversionRate}</strong>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="rounded-2xl border-border/60 bg-card">
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
                      PHP via GCash & Maya
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="rounded-2xl border-border/60 bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                  Pending Verification
                </CardTitle>
                <div className="size-8 rounded-xl bg-warning/10 text-warning-foreground flex items-center justify-center">
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
                      Requires GCash ref matching
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights Banner */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-base font-bold text-foreground font-heading">
                  Philippine High School Enrollment Growth
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Junior High School Grade 10 and Senior High School Grade 11 STEM comprise 64% of total daily quiz attempts and AI tutor interactions.
              </p>
            </div>
            <Button
              onClick={() => setActiveTab("students")}
              className="rounded-xl shadow-xs text-xs"
              size="sm"
            >
              Review Students List
            </Button>
          </div>
        </TabsContent>

        {/* TAB 2: STUDENTS & SUBSCRIPTIONS */}
        <TabsContent value="students" className="space-y-6 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search student by name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by Subscription Status"
                className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active Subscribed</option>
                <option value="TRIAL">Free Trial Tier</option>
                <option value="PENDING">Pending Verification</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4">Student & Email</th>
                    <th className="py-3.5 px-4">School & Grade</th>
                    <th className="py-3.5 px-4">Subscription Plan</th>
                    <th className="py-3.5 px-4 text-center">Trial Subjects</th>
                    <th className="py-3.5 px-4 text-center">Quiz Drills</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {studentsLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        <td colSpan={6} className="py-4 px-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : studentsData?.students.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    studentsData?.students.map((student) => {
                      const isActive = student.subscriptionStatus === "ACTIVE";
                      const isPending = student.subscriptionStatus === "PENDING";

                      return (
                        <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-foreground">{student.name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {student.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-foreground font-medium">
                              <GraduationCap className="size-3.5 text-primary shrink-0" />
                              <span>{student.gradeLevel}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                              {student.school}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant={
                                  isActive
                                    ? "default"
                                    : isPending
                                    ? "warning"
                                    : "secondary"
                                }
                                className={`text-[10px] ${
                                  isActive ? "bg-success text-success-foreground hover:bg-success" : ""
                                }`}
                              >
                                {student.subscriptionStatus}
                              </Badge>
                              {student.plan !== "NONE" && (
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  ({student.plan})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono font-medium">
                              {student.trialSubjectsCount} / 3
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono">
                            {student.quizAttemptsCount}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isActive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateSubscription.mutate({
                                    userId: student.id,
                                    status: "EXPIRED",
                                  })
                                }
                                disabled={updateSubscription.isPending}
                                className="h-7 text-[11px] rounded-lg text-destructive hover:text-destructive"
                              >
                                Expire Sub
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateSubscription.mutate({
                                    userId: student.id,
                                    status: "ACTIVE",
                                    plan: "ANNUAL",
                                  })
                                }
                                disabled={updateSubscription.isPending}
                                className="h-7 text-[11px] rounded-lg gap-1"
                              >
                                <Check className="size-3" />
                                <span>Activate (Annual)</span>
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: PRICING & GUARDRAILS CONFIGURATION */}
        <TabsContent value="settings" className="space-y-6 pt-4">
          <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
            <form onSubmit={handleSettingsSubmit}>
              <CardHeader>
                <CardTitle className="text-lg font-bold font-heading">
                  SaaS Pricing & Free Tier Guardrails
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure subscription price points (in PHP) and guardrails enforced for unsubscribed accounts.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Monthly Pass Price (₱ PHP)
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.monthlyPricePhp || 199}
                      onChange={(e) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          monthlyPricePhp: parseInt(e.target.value, 10),
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">Standard 30-day recurring access.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Annual Pass Price (₱ PHP)
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.annualPricePhp || 1499}
                      onChange={(e) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          annualPricePhp: parseInt(e.target.value, 10),
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">Full academic school year access.</p>
                  </div>
                </div>

                {/* Guardrail Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Max Free Trial Subjects Allowed
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.maxTrialSubjects || 3}
                      onChange={(e) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          maxTrialSubjects: parseInt(e.target.value, 10),
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">Number of subjects a free tier user can explore.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Max Free Lessons Per Subject
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.maxFreeLessons || 3}
                      onChange={(e) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          maxFreeLessons: parseInt(e.target.value, 10),
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">Lessons 1–3 free; Lesson 4+ triggers upgrade.</p>
                  </div>
                </div>

                {/* Payment Receiver Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      GCash Merchant Account No.
                    </label>
                    <Input
                      type="text"
                      value={currentSettings.gcashReceiverNumber || "0917-888-4321"}
                      onChange={(e) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          gcashReceiverNumber: e.target.value,
                        }))
                      }
                      className="rounded-xl text-sm font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Maya Merchant Account No.
                    </label>
                    <Input
                      type="text"
                      value={currentSettings.mayaReceiverNumber || "0918-999-8765"}
                      onChange={(e) =>
                        setLocalFormData((prev) => ({
                          ...prev,
                          mayaReceiverNumber: e.target.value,
                        }))
                      }
                      className="rounded-xl text-sm font-mono"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 border-t border-border/40 pt-4">
                <Button
                  type="submit"
                  disabled={updateSettings.isPending}
                  className="rounded-xl gap-2 text-xs font-semibold"
                >
                  <Save className="size-3.5" />
                  <span>{updateSettings.isPending ? "Saving..." : "Save Configuration"}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
