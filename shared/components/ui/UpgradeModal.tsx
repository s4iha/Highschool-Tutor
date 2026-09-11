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
  const [planType, setPlanType] = React.useState<"single_grade" | "all_grades">("all_grades");
  const [selectedGrade, setSelectedGrade] = React.useState<string>("Grade 10");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const gradeOptions = [
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      closeUpgradeModal();
      const planTitle =
        planType === "all_grades"
          ? "Complete High School Bundle (Grades 7–12) at ₱1,499"
          : `${selectedGrade} Access Pass at ₱499`;
      toast.success("Payment Gateway Initialized!", {
        description: `Redirecting to Philippine GCash / Maya payment checkout for ${planTitle}...`,
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
            Choose Your Study Plan
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {reason ||
              `Unlock full access to ${
                featureName || "all DepEd high school lessons"
              } with DepEd MATATAG curriculum and unlimited Gemini AI Socratic tutoring.`}
          </DialogDescription>
        </DialogHeader>

        {/* Plan Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {/* Single Grade Level */}
          <div
            onClick={() => setPlanType("single_grade")}
            className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
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
                ₱499<span className="text-xs font-normal text-muted-foreground">/school yr</span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">
                Full 1-year access for 1 selected grade level.
              </p>
            </div>

            {planType === "single_grade" && (
              <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5" onClick={(e) => e.stopPropagation()}>
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
            className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
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
                <Sparkles className="size-3" />
                All Levels (7–12)
              </span>
              <div className="text-2xl font-bold text-foreground font-heading">
                ₱1,499<span className="text-xs font-normal text-muted-foreground">/full access</span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">
                Complete access to all Junior & Senior High School subjects (Grades 7 to 12).
              </p>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-semibold text-primary/90 flex items-center gap-1">
              <span>Includes JHS Core + STEM, ABM, HUMSS</span>
            </div>
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
                  Checkout via GCash / Maya (
                  {planType === "all_grades"
                    ? "₱1,499 • All 7–12"
                    : `₱499 • ${selectedGrade}`}
                  )
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
