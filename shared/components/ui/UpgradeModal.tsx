"use client";

import * as React from "react";
import { Check, Sparkles, Zap, ShieldCheck, Crown } from "lucide-react";
import { toast } from "sonner";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
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
  const [selectedPlan, setSelectedPlan] = React.useState<"monthly" | "annual">(
    "annual"
  );
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      closeUpgradeModal();
      toast.success("Subscription Requested!", {
        description: `Redirecting to Philippine GCash / Maya payment gateway for ${
          selectedPlan === "annual" ? "Annual Plan (₱1,499)" : "Monthly Plan (₱199)"
        }...`,
      });
    }, 700);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8 bg-card border-border/60 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 text-center items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-1">
            <Crown className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold font-heading text-foreground">
            Upgrade to Premium Tier
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {reason ||
              `Unlock full access to ${
                featureName || "all DepEd high school lessons"
              } and unlimited Google Gemini AI Socratic tutoring.`}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border/60 bg-background hover:border-border"
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Monthly Pass
              </span>
              <div className="text-2xl font-bold text-foreground font-heading">
                ₱199<span className="text-xs font-normal text-muted-foreground">/mo</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Billed monthly. Cancel anytime.
            </p>
          </div>

          <div
            onClick={() => setSelectedPlan("annual")}
            className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedPlan === "annual"
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border/60 bg-background hover:border-border"
            }`}
          >
            <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">
              SAVE 37%
            </Badge>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-primary uppercase flex items-center gap-1">
                <Sparkles className="size-3" />
                Annual Pass
              </span>
              <div className="text-2xl font-bold text-foreground font-heading">
                ₱1,499<span className="text-xs font-normal text-muted-foreground">/yr</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Best value for full school year.
            </p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="rounded-2xl bg-muted/40 border border-border/40 p-4 space-y-2.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-success" />
            Everything included in Premium:
          </span>
          <ul className="text-xs space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>Full access to all 130+ DepEd JHS & SHS STEM subjects</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>Unlock all 12 lessons & competencies per subject</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>Unlimited Gemini Socratic AI tutoring hints & multi-dialect translation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-3.5 text-primary shrink-0" />
              <span>Unlimited Exam & Study Mode quiz practice drills</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full h-11 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 gap-2"
          >
            {isProcessing ? (
              "Securing Checkout..."
            ) : (
              <>
                <Zap className="size-4 fill-current" />
                <span>
                  Subscribe via GCash / Maya (
                  {selectedPlan === "annual" ? "₱1,499/yr" : "₱199/mo"})
                </span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={closeUpgradeModal}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Continue with Free Tier (3 Subjects / 3 Lessons)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
