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
import { useUser } from "@/features/auth/hooks/useUser";
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
  const { user } = useUser();

  const isExistingSubscriber = user?.subscription?.status === "ACTIVE";

  const [step, setStep] = React.useState<"plan_selection" | "payment_instructions">("plan_selection");
  const [planType, setPlanType] = React.useState<"monthly" | "annual">("monthly");

  // Synchronize default plan choice when modal opens or user subscription status loads
  React.useEffect(() => {
    if (isExistingSubscriber) {
      setPlanType("annual");
    } else {
      setPlanType("monthly");
    }
  }, [isExistingSubscriber, isOpen]);

  // Dynamic configuration from admin settings
  const monthlyPrice = config?.monthlyPricePhp ?? 300;
  const annualPrice = config?.annualPricePhp ?? 2600;
  const maxTrialSubjects = config?.maxTrialSubjects ?? 3;
  const maxFreeLessons = config?.maxFreeLessons ?? 3;
  const gcashReceiverNumber = config?.gcashReceiverNumber ?? "0917-888-4321";
  const gcashAccountName = config?.gcashAccountName ?? "HIGHSCHOOL TUTOR PH";
  const mayaReceiverNumber = config?.mayaReceiverNumber ?? "0918-999-8765";
  const mayaAccountName = config?.mayaAccountName ?? "HIGHSCHOOL TUTOR PH";

  const currentPrice = planType === "annual" ? annualPrice : monthlyPrice;
  const planTitle =
    planType === "annual"
      ? isExistingSubscriber
        ? "Annual Pass Upgrade (Save ₱1,000)"
        : "Annual Unlimited Pass"
      : "Monthly Access Pass";

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
                {isExistingSubscriber ? "Upgrade Your Membership" : "Choose Your Study Plan"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground max-w-md mx-auto">
                {reason ||
                  (isExistingSubscriber
                    ? "Upgrade your existing subscription to our Annual Pass for ₱2,600 and save ₱1,000 compared to paying monthly."
                    : `Unlock full access to ${
                        featureName || "all DepEd high school lessons"
                      } with DepEd MATATAG curriculum and unlimited practice tests.`)}
              </DialogDescription>
            </DialogHeader>

            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
              {/* Monthly Pass */}
              <div
                onClick={() => setPlanType("monthly")}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  planType === "monthly"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/60 bg-background hover:border-border"
                }`}
              >
                {!isExistingSubscriber && (
                  <Badge className="absolute -top-2.5 right-3 bg-muted text-foreground border border-border text-[10px] font-bold px-2 py-0.5">
                    STANDARD
                  </Badge>
                )}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    {isExistingSubscriber ? "Renew Monthly" : "Monthly Pass"}
                  </span>
                  <div className="text-2xl font-bold text-foreground font-heading">
                    ₱{monthlyPrice.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Flexible 30-day recurring access to all DepEd JHS & SHS subjects.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border/40 text-[10px] font-medium text-muted-foreground">
                  Includes all short lessons & quizzes
                </div>
              </div>

              {/* Annual Pass / Upgrade Option */}
              <div
                onClick={() => setPlanType("annual")}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  planType === "annual"
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border/60 bg-background hover:border-border"
                }`}
              >
                <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 shadow-xs">
                  SAVE ₱1,000
                </Badge>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary uppercase flex items-center gap-1">
                    {isExistingSubscriber ? "Annual Upgrade" : "Annual Pass"}
                  </span>
                  <div className="text-2xl font-bold text-foreground font-heading">
                    ₱{annualPrice.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">/full year</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    {isExistingSubscriber
                      ? "Special upgrade price for existing subscribers: 365 days of unlimited access."
                      : "Full 365-day access to all DepEd subjects (save ₱1,000 compared to 12 months)."}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border/40 text-[10px] font-semibold text-primary/90 flex items-center gap-1">
                  <span>Best value • ₱216/month equivalent</span>
                </div>
              </div>
            </div>

            {/* Benefits List (Compact 2-column grid) */}
            <div className="rounded-2xl bg-muted/40 border border-border/40 p-3.5 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                Everything included in HighSchool Tutor Pass:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>All DepEd JHS & SHS curriculum subjects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Short lessons & study notes before quizzes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary shrink-0" />
                  <span>Curated AI study prompt templates & guides</span>
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
                  {planType === "annual" ? "Annual Pass" : "Monthly Pass"})
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
                {planType === "annual" ? "365-Day Unlimited High School Access" : "30-Day Recurring Learning Access"}
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
