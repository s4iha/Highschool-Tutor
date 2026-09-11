"use client";

import * as React from "react";
import {
  DollarSign,
  ShieldCheck,
  Smartphone,
  Save,
  RefreshCw,
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
      monthlyPricePhp: 199,
      annualPricePhp: 1499,
      maxTrialSubjects: 3,
      maxFreeLessons: 3,
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold border border-amber-500/20">
              <DollarSign className="size-3.5" />
              SaaS Monetization
            </span>
          </div>
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
                      value={currentSettings.monthlyPricePhp ?? 199}
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
                      value={currentSettings.annualPricePhp ?? 1499}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          annualPricePhp: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Full school year access for all grade levels.
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
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 mt-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-foreground">
                      Allow AI Tutor Hints on Free Tier
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Students receive Google Gemini Socratic hints during free trial lessons.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.enableAiTutorTrial ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        enableAiTutorTrial: e.target.checked,
                      }))
                    }
                    className="size-4 rounded text-primary focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Merchant Details Sidebar Card */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-border/60 bg-card shadow-xs">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Smartphone className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      E-Wallet Merchant Numbers
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Displayed on GCash & Maya checkout modals.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* GCash */}
                <div className="space-y-3 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    GCash Receiver
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Mobile Number
                    </label>
                    <Input
                      value={currentSettings.gcashReceiverNumber || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gcashReceiverNumber: e.target.value,
                        }))
                      }
                      placeholder="0917-888-4321"
                      className="rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Account Name
                    </label>
                    <Input
                      value={currentSettings.gcashAccountName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gcashAccountName: e.target.value,
                        }))
                      }
                      placeholder="HIGHSCHOOL TUTOR PH"
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Maya */}
                <div className="space-y-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Maya Receiver
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Mobile Number
                    </label>
                    <Input
                      value={currentSettings.mayaReceiverNumber || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mayaReceiverNumber: e.target.value,
                        }))
                      }
                      placeholder="0918-999-8765"
                      className="rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Account Name
                    </label>
                    <Input
                      value={currentSettings.mayaAccountName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mayaAccountName: e.target.value,
                        }))
                      }
                      placeholder="HIGHSCHOOL TUTOR PH"
                      className="rounded-xl text-xs"
                    />
                  </div>
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
