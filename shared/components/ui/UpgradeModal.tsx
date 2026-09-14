"use client";

import * as React from "react";
import {
  Check,
  ShieldCheck,
  Crown,
  ArrowLeft,
  Smartphone,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { usePublicConfigQuery } from "@/features/settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function UpgradeModal() {
  const { isOpen, featureName, reason, closeUpgradeModal } =
    useUpgradeModalStore();
  const { data: config } = usePublicConfigQuery();

  const [step, setStep] = React.useState<"plan_selection" | "payment_instructions">("plan_selection");
  const [planType, setPlanType] = React.useState<"single_grade" | "all_grades">("all_grades");
  const [selectedGrade, setSelectedGrade] = React.useState<string>("Grade 10");

  // Dynamic configuration from admin settings
  const annualPrice = config?.annualPricePhp ?? 1499;
  const singleGradePrice = Math.floor(annualPrice / 3);
  const maxTrialSubjects = config?.maxTrialSubjects ?? 3;
  const maxFreeLessons = config?.maxFreeLessons ?? 3;
  const gcashReceiverNumber = config?.gcashReceiverNumber ?? "0917-888-4321";
  const gcashAccountName = config?.gcashAccountName ?? "HIGHSCHOOL TUTOR PH";
  const mayaReceiverNumber = config?.mayaReceiverNumber ?? "0918-999-8765";
  const mayaAccountName = config?.mayaAccountName ?? "HIGHSCHOOL TUTOR PH";

  const gradeOptions = [
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const currentPrice = planType === "all_grades" ? annualPrice : singleGradePrice;
  const planTitle =
    planType === "all_grades"
      ? "Complete High School Bundle (Grades 7–12)"
      : `${selectedGrade} Access Pass`;

  const handleClose = () => {
    setStep("plan_selection");
    closeUpgradeModal();
  };

  const handleProceedToPayment = () => {
    setStep("payment_instructions");
  };

  const handleConfirmSentPayment = () => {
    toast.success("Payment Reference Noted!", {
      description: `Thank you for sending your payment for ${planTitle}. Our administration team will verify the payment and activate your subscription within 24 hours.`,
      duration: 6000,
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-5 sm:p-6 bg-card border-border/60 shadow-2xl max-h-[92vh] overflow-y-auto">
        {step === "plan_selection" ? (
          <>
            <DialogHeader className="space-y-1.5 text-center items-center">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-0.5">
                <Crown className="size-5 text-primary" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                Choose Your Study Plan
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground max-w-md mx-auto">
                {reason ||
                  `Unlock full access to ${
                    featureName || "all DepEd high school lessons"
                  } with DepEd MATATAG curriculum and unlimited Gemini AI Socratic tutoring.`}
              </DialogDescription>
            </DialogHeader>

            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
              {/* Single Grade Level */}
              <div
                onClick={() => setPlanType("single_grade")}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  planType === "single_grade"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/60 bg-background hover:border-border"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Single Grade Pass
                  </span>
                  <div className="text-2xl font-bold text-foreground font-heading">
                    ₱{singleGradePrice.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">/school yr</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Full 1-year access for 1 selected grade level.
                  </p>
                </div>

                {planType === "single_grade" && (
                  <div
                    className="mt-2.5 pt-2.5 border-t border-border/60 space-y-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Select Grade Level:
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full text-xs font-semibold bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>
                          {g} Core & Tracks
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* All Grades 7-12 Bundle */}
              <div
                onClick={() => setPlanType("all_grades")}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  planType === "all_grades"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/60 bg-background hover:border-border"
                }`}
              >
                <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">
                  BEST VALUE • SAVE 50%
                </Badge>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary uppercase flex items-center gap-1">
                    All Levels (7–12)
                  </span>
                  <div className="text-2xl font-bold text-foreground font-heading">
                    ₱{annualPrice.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">/full access</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Complete access to all Junior & Senior High School subjects (Grades 7 to 12).
                  </p>
                </div>
                <div className="mt-2.5 pt-2 text-[10px] font-semibold text-primary/90 flex items-center gap-1">
                  <span>Includes JHS Core + STEM, ABM, HUMSS</span>
                </div>
              </div>
            </div>

            {/* Benefits List (Compact 2-column grid) */}
            <div className="rounded-2xl bg-muted/40 border border-border/40 p-3.5 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                Everything included in Premium:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>All 130+ DepEd JHS & SHS STEM subjects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Unlock all 12 lessons per subject</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Unlimited Gemini Socratic AI hints</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Unlimited Exam & Study Mode quiz drills</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-1.5 pt-2">
              <Button
                onClick={handleProceedToPayment}
                className="w-full h-10 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 gap-2 cursor-pointer"
              >
                <span>
                  Proceed to Payment (₱{currentPrice.toLocaleString()} •{" "}
                  {planType === "all_grades" ? "All 7–12" : selectedGrade})
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Continue with Free Tier ({maxTrialSubjects} Subjects / {maxFreeLessons} Lessons)
              </Button>
            </div>
          </>
        ) : (
          /* Payment Instructions Step */
          <div className="space-y-4">
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("plan_selection")}
                  className="h-7 w-7 p-0 rounded-lg -ml-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <DialogTitle className="text-xl font-bold font-heading text-foreground">
                  Payment Instructions
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Transfer payment directly via GCash or Maya to activate your account.
              </DialogDescription>
            </DialogHeader>

            {/* Order Summary Card */}
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{planTitle}</span>
                <span className="text-base font-extrabold text-primary font-heading">
                  ₱{currentPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Academic School Year Unlimited Access
              </p>
            </div>

            {/* Merchant Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GCash Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <span className="font-bold text-xs text-foreground">GCash</span>
                </div>
                <div className="space-y-0.5 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Account Name
                    </span>
                    <span className="font-medium text-foreground text-xs">{gcashAccountName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Mobile Number
                    </span>
                    <span className="font-mono font-bold text-primary text-xs">{gcashReceiverNumber}</span>
                  </div>
                </div>
              </div>

              {/* Maya Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <span className="font-bold text-xs text-foreground">Maya</span>
                </div>
                <div className="space-y-0.5 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Account Name
                    </span>
                    <span className="font-medium text-foreground text-xs">{mayaAccountName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                      Mobile Number
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {mayaReceiverNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="rounded-2xl bg-muted/50 border border-border/60 p-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-semibold text-foreground">How activation works:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                    <li>Send exact amount (<strong>₱{currentPrice.toLocaleString()}</strong>) via GCash or Maya.</li>
                    <li>Include your <strong>registered email address</strong> in the transfer message/note.</li>
                    <li>Click <strong>&quot;I Have Sent Payment&quot;</strong> below to alert our administration team.</li>
                    <li>Accounts are verified and upgraded within <strong>24 hours</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <Button
                onClick={handleConfirmSentPayment}
                className="w-full h-10 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 gap-2 cursor-pointer"
              >
                <Smartphone className="size-4" />
                <span>I Have Sent Payment</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("plan_selection")}
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Back to Plan Selection
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
