"use client";

import * as React from "react";
import {
  Check,
  Crown,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  ExternalLink,
  Tag,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useUser } from "@/features/auth/hooks/useUser";
import { useCheckoutSession } from "../hooks/useCheckoutSession";
import { useValidateReferralCode } from "../hooks/useValidateReferralCode";
import { getClientReferralCookie } from "@/lib/affiliate/cookies";
import {
  MONTHLY_PRICE_PHP,
  ANNUAL_PRICE_PHP,
  formatPhp,
} from "../utils/pricing";
import { cn } from "@/lib/utils";

export interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
  reason?: string;
  initialPlan?: "MONTHLY" | "ANNUAL";
}

const DOMESTIC_RAILS = [
  { name: "QR Ph", icon: QrCode },
  { name: "GCash", icon: Smartphone },
  { name: "Maya", icon: Smartphone },
  { name: "Cards", icon: CreditCard },
  { name: "GrabPay", icon: Smartphone },
];

export function CheckoutModal({
  open,
  onOpenChange,
  featureName,
  reason,
  initialPlan = "ANNUAL",
}: CheckoutModalProps) {
  const { user } = useUser();
  const isExistingSubscriber = user?.subscription?.status === "ACTIVE";

  const [selectedPlan, setSelectedPlan] = React.useState<"MONTHLY" | "ANNUAL">(
    isExistingSubscriber ? "ANNUAL" : initialPlan
  );

  const [referralInput, setReferralInput] = React.useState<string>(() => {
    return typeof window !== "undefined" ? getClientReferralCookie() || "" : "";
  });
  const [showReferralInput, setShowReferralInput] = React.useState<boolean>(() => {
    return typeof window !== "undefined" ? Boolean(getClientReferralCookie()) : false;
  });

  const { isChecking, isValid, affiliateName, errorMessage } =
    useValidateReferralCode(referralInput);

  const checkoutMutation = useCheckoutSession({
    autoRedirect: true,
  });

  const handleCheckout = () => {
    checkoutMutation.mutate({
      planId: selectedPlan,
      referralCode: isValid ? referralInput.trim() : undefined,
    });
  };

  const activePrice = selectedPlan === "ANNUAL" ? ANNUAL_PRICE_PHP : MONTHLY_PRICE_PHP;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-5 sm:p-7 bg-card border-border/60 shadow-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 text-center items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-1">
            <Crown className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            {isExistingSubscriber ? "Upgrade Your Membership" : "Unlock Full HighSchool Access"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {reason ||
              (isExistingSubscriber
                ? "Extend your subscription with the Annual Unlimited Pass and save ₱1,089 while keeping your active days."
                : `Master ${featureName || "all 130+ DepEd MATATAG subjects"} with unlimited quizzes and on-demand Socratic AI tutoring.`)}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Monthly Pass Card */}
          <div
            onClick={() => setSelectedPlan("MONTHLY")}
            className={cn(
              "relative cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between",
              selectedPlan === "MONTHLY"
                ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/40"
                : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">Monthly Pass</span>
                <span className="text-xs text-muted-foreground font-mono">30 Days</span>
              </div>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-2xl font-extrabold text-foreground">
                  {formatPhp(MONTHLY_PRICE_PHP)}
                </span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Flexible access to all subjects, quiz modes, and AI hints.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Standard Billing</span>
              <span className="size-4 rounded-full border border-primary/40 flex items-center justify-center">
                {selectedPlan === "MONTHLY" && <span className="size-2 rounded-full bg-primary" />}
              </span>
            </div>
          </div>

          {/* Annual Pass Card (Best Value) */}
          <div
            onClick={() => setSelectedPlan("ANNUAL")}
            className={cn(
              "relative cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between overflow-hidden",
              selectedPlan === "ANNUAL"
                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary"
                : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
            )}
          >
            <div className="absolute top-2 right-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-medium text-[10px] px-2 py-0.5 shadow-xs">
                Save ₱1,089
              </Badge>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="size-4.5 text-amber-500 fill-amber-500/20" />
                <span className="text-sm font-semibold text-foreground">Annual Unlimited</span>
              </div>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-2xl font-extrabold text-foreground">
                  {formatPhp(ANNUAL_PRICE_PHP)}
                </span>
                <span className="text-xs text-muted-foreground">/ year</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Save ₱1,089 vs. monthly payments (over 30% off)!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Full School Year Access</span>
              <span className="size-4 rounded-full border border-primary/40 flex items-center justify-center">
                {selectedPlan === "ANNUAL" && <span className="size-2 rounded-full bg-primary" />}
              </span>
            </div>
          </div>
        </div>

        {/* Feature Entitlements Checklist */}
        <div className="bg-muted/30 rounded-2xl p-4 border border-border/40 space-y-2 mt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Included in Your Pass
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>All 130+ DepEd JHS & SHS STEM Subjects</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>Full Lessons (Lessons 1 to 12 Unlimited)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>Study Mode & Transmuted Exam Mode Quizzes</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>On-Demand Google Gemini Socratic AI Tutor</span>
            </div>
          </div>
        </div>

        {/* Referral Code Accordion / Input */}
        <div className="space-y-2 pt-1">
          {!showReferralInput ? (
            <button
              type="button"
              onClick={() => setShowReferralInput(true)}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <Tag className="size-3" />
              <span>Have an educator or partner referral code?</span>
            </button>
          ) : (
            <div className="space-y-1.5 p-3 rounded-2xl bg-muted/20 border border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1">
                  <Tag className="size-3 text-primary" />
                  <span>Partner Referral Code</span>
                </label>
                {isChecking && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Loader2 className="size-3 animate-spin" />
                    <span>Verifying...</span>
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  placeholder="e.g. SGWS-A001"
                  className="h-8 text-xs font-mono uppercase bg-background"
                  maxLength={64}
                />
              </div>

              {isValid && affiliateName && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="size-3.5" />
                  <span>Verified Partner: {affiliateName}</span>
                </div>
              )}

              {errorMessage && !isChecking && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400">
                  {errorMessage} (Direct checkout will proceed without error).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Domestic Payment Rails Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 text-xs text-muted-foreground">
          <span className="text-[11px] font-medium">Supported Payment Methods:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {DOMESTIC_RAILS.map((rail) => (
              <span
                key={rail.name}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted text-[10px] font-medium text-foreground border border-border/40"
              >
                <rail.icon className="size-2.5 text-primary" />
                {rail.name}
              </span>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending}
            className="w-full h-11 rounded-2xl font-semibold text-sm gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            {checkoutMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Opening PayMongo Checkout...</span>
              </>
            ) : (
              <>
                <span>Proceed to PayMongo Checkout — {formatPhp(activePrice)}</span>
                <ExternalLink className="size-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground text-center">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>256-bit Encrypted Checkout • Instant Access • Official PayMongo Gateway</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
