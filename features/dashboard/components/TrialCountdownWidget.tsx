"use client";

import React from "react";
import { Clock, Crown, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useUser } from "@/features/auth/hooks/useUser";
import { usePublicConfigQuery } from "@/features/settings";
import { getTrialStatus } from "@/features/curriculum/utils/tier-guardrails";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/lib/utils";

interface TrialCountdownWidgetProps {
  className?: string;
}

export function TrialCountdownWidget({ className }: TrialCountdownWidgetProps) {
  const { user } = useUser();
  const { data: config } = usePublicConfigQuery();
  const { openUpgradeModal } = useUpgradeModalStore();

  const isPaidActive =
    user?.subscription?.status === "ACTIVE" &&
    (user.subscription.plan === "MONTHLY" || user.subscription.plan === "ANNUAL");

  const trialDurationDays = config?.trialDurationDays ?? 30;
  const trialStatus = React.useMemo(() => {
    return getTrialStatus(user?.createdAt, trialDurationDays);
  }, [user?.createdAt, trialDurationDays]);

  // If user has an active paid subscription, render a subtle premium status badge
  if (isPaidActive) {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Crown className="size-3.5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {user.subscription?.plan === "ANNUAL" ? "Annual Pass Active" : "Monthly Pass Active"}
            </p>
            <p className="text-muted-foreground text-[11px]">
              Full access to all 130+ DepEd subjects, lessons, and AI tutors.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary font-mono text-[10px]">
          VIP Learner
        </Badge>
      </div>
    );
  }

  const { daysRemaining, percentRemaining, isExpired } = trialStatus;

  if (isExpired) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background p-5 shadow-xs",
          className
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground">30-Day Free Trial Has Ended</h4>
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400">
                  Trial Expired
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Your trial period has concluded. Upgrade to an Annual or Monthly Pass to continue exploring all lessons, taking graded drills, and receiving Socratic AI assistance.
              </p>
            </div>
          </div>

          <Button
            onClick={() => openUpgradeModal({ reason: "Continue unlimited learning after your 30-day trial." })}
            size="sm"
            className="shrink-0 gap-1.5 rounded-xl font-semibold shadow-xs"
          >
            <Crown className="size-3.5" />
            <span>Upgrade Now</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  // Active 30-Day Free Trial
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-5 shadow-xs transition-all",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Clock className="size-5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">
                30-Day Free Trial — Full Access
              </h4>
              <Badge variant="secondary" className="gap-1 bg-primary/15 text-primary text-[10px] font-semibold">
                <Sparkles className="size-3" />
                {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              You currently have full, unrestricted access to all DepEd subjects, competencies, and AI-assisted drills during your 30-day trial window.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Progress value={percentRemaining} className="h-1.5 w-36 sm:w-48 bg-primary/15" />
              <span className="text-[11px] font-mono font-medium text-muted-foreground">
                {percentRemaining}% left
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
          <Button
            onClick={() =>
              openUpgradeModal({
                reason: "Upgrade now to lock in your Annual Pass discount and guarantee uninterrupted learning.",
              })
            }
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl border-primary/30 text-xs font-semibold hover:bg-primary hover:text-primary-foreground"
          >
            <Crown className="size-3.5 text-amber-500" />
            <span>Upgrade to Annual Pass</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
