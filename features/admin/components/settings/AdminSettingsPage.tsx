"use client";

import * as React from "react";
import {
  DollarSign,
  ShieldCheck,
  Save,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Tag,
} from "lucide-react";
import {
  useAdminSettingsQuery,
  useUpdatePricingSettingsMutation,
  AdminSettingsData,
} from "../../hooks/useAdminPortal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export function AdminSettingsPage() {
  const { data: settings, refetch, isRefetching } = useAdminSettingsQuery();
  const updateSettings = useUpdatePricingSettingsMutation();

  const [formData, setFormData] = React.useState<Partial<AdminSettingsData>>({});

  const currentSettings = React.useMemo<Partial<AdminSettingsData>>(() => {
    return {
      monthlyPricePhp: 299,
      annualPricePhp: 2499,
      maxTrialSubjects: 3,
      maxFreeLessons: 3,
      targetLessonsPerSubject: 8,
      trialDurationDays: 30,
      availableQuestionCounts: "5, 10, 15, 20",
      gcashReceiverNumber: "0917-888-4321",
      gcashAccountName: "HIGHSCHOOL TUTOR PH",
      mayaReceiverNumber: "0918-999-8765",
      mayaAccountName: "HIGHSCHOOL TUTOR PH",
      enableAiTutorTrial: true,
      promoDiscountPercent: 20,
      ...settings,
      ...formData,
    };
  }, [settings, formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(currentSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Pricing & Free Tier Guardrails
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure subscription tiers, GCash/Maya receiver numbers, and student trial limits in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5 rounded-xl text-xs"
          >
            <RefreshCw className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            <span>Sync Settings</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Pricing & Guardrails Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Price Points */}
            <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <DollarSign className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      Subscription Plan Pricing (PHP)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Live pricing presented to students during checkout.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Monthly Pass (₱ PHP)
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.monthlyPricePhp ?? 300}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          monthlyPricePhp: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Standard 30-day recurring subscription.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Annual Pass (₱ PHP)
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.annualPricePhp ?? 2999}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          annualPricePhp: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Full school year access (Save ₱1,089 compared to 12 months at ₱299/mo).
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <label className="text-xs font-semibold text-foreground">
                    Promotional Discount Rate (%)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={currentSettings.promoDiscountPercent ?? 20}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        promoDiscountPercent: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="rounded-xl text-sm max-w-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Discount percentage displayed on seasonal promo banners.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Free Tier Guardrail Limits */}
            <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      Free Tier Guardrails & Limits
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Enforce paywalls for unsubscribed student accounts.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Max Free Trial Subjects Allowed
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={currentSettings.maxTrialSubjects ?? 3}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          maxTrialSubjects: parseInt(e.target.value, 10) || 1,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Free users can enroll up to this many subjects.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Max Free Lessons Per Subject
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={currentSettings.maxFreeLessons ?? 3}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          maxFreeLessons: parseInt(e.target.value, 10) || 1,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Lessons 1–3 free; Lesson 4+ triggers GCash checkout modal.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Target Lessons Per Subject
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={currentSettings.targetLessonsPerSubject ?? 8}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetLessonsPerSubject: parseInt(e.target.value, 10) || 8,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Standard number of lessons/topics configured per subject (default 8).
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Full-Access Free Trial Window (Days)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={currentSettings.trialDurationDays ?? 30}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          trialDurationDays: parseInt(e.target.value, 10) || 30,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Number of days newly registered students enjoy unrestricted all-access trial.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Available Quiz Question Counts
                    </label>
                    <Input
                      type="text"
                      placeholder="5, 10, 15, 20"
                      value={currentSettings.availableQuestionCounts ?? "5, 10, 15, 20"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          availableQuestionCounts: e.target.value,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Comma-separated list of question counts available to students (e.g. 5, 10, 15, 20). 10+ questions count toward Lesson Mastery.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Merchant Details Sidebar Card */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      Payment Gateway Status
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Automated PayMongo Hosted Checkout v2
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Gateway Integration Status */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      <span>PayMongo Gateway</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Checkout Mode</span>
                      <span className="font-medium text-foreground">Hosted Sessions v2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domestic Rails</span>
                      <span className="font-medium text-foreground">QR Ph, GCash, Maya, Cards</span>
                    </div>
                  </div>
                </div>

                {/* Webhook Endpoint */}
                <div className="space-y-2 p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span>Webhook Verification</span>
                  </div>
                  <div className="font-mono text-[11px] bg-background p-2 rounded-xl border border-border/60 break-all text-muted-foreground">
                    /api/v1/webhooks/paymongo
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Secured with HMAC-SHA256 signature verification & 300s replay window.
                  </p>
                </div>

                {/* SGWS Affiliate Portal */}
                <div className="space-y-2 p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" />
                    <span>SGWS Affiliate Portal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Product Slug</span>
                    <span className="font-mono text-xs font-bold text-primary">
                      highschool-tutor
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    30-day cookie attribution with 2,500ms timeout guardrail.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-border/40">
                <Button
                  type="submit"
                  disabled={updateSettings.isPending}
                  className="w-full rounded-xl text-xs font-semibold gap-2"
                >
                  <Save className="size-3.5" />
                  <span>
                    {updateSettings.isPending ? "Saving..." : "Save Configuration"}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
