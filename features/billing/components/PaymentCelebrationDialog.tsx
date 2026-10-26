"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  PartyPopper,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Brain,
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
import { useVerifySession } from "../hooks/useVerifySession";

function PaymentCelebrationDialogInner() {
  const searchParams = useSearchParams();

  const isSuccessParam = searchParams?.get("payment") === "success";
  const sessionId = searchParams?.get("session_id") || null;

  const [dismissedSessionId, setDismissedSessionId] = React.useState<string | null>(null);
  const isOpen = Boolean(isSuccessParam && sessionId && dismissedSessionId !== sessionId);

  const { data, isPaid, isLoading, isPending } = useVerifySession(
    isOpen ? sessionId : null
  );

  const handleClose = () => {
    if (sessionId) {
      setDismissedSessionId(sessionId);
    }
    // Clean up query parameters without full page reload
    if (typeof window !== "undefined" && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.pathname);
    }
  };

  if (!isSuccessParam || !sessionId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border/60 shadow-2xl text-center">
        <DialogHeader className="space-y-2 items-center">
          <div className="size-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-xs mb-1 animate-bounce">
            <PartyPopper className="size-8" />
          </div>

          <DialogTitle className="text-2xl font-bold font-heading text-foreground">
            {isPaid ? "Payment Verified! 🎉" : "Verifying Payment..."}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {isPaid
              ? "Your subscription is now active! All 130+ DepEd MATATAG subjects and Socratic AI tutoring are unlocked."
              : isPending || isLoading
              ? "Reconciling your payment with PayMongo. Your access will activate in just a moment..."
              : "Thank you for subscribing! Your transaction has been recorded."}
          </DialogDescription>
        </DialogHeader>

        {/* Status Details */}
        <div className="my-4 p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-2.5 text-xs text-left">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              {isPaid ? (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>ACTIVE</span>
                </>
              ) : (
                <>
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>PROCESSING</span>
                </>
              )}
            </span>
          </div>

          {data?.plan && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium text-foreground">
                {data.plan === "ANNUAL" ? "Annual Unlimited Pass" : "Monthly Access Pass"}
              </span>
            </div>
          )}

          {data?.referenceNumber && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reference No.</span>
              <span className="font-mono text-[11px] text-foreground">
                {data.referenceNumber}
              </span>
            </div>
          )}

          {data?.subscriptionExpiresAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Valid Through</span>
              <span className="font-medium text-foreground">
                {new Date(data.subscriptionExpiresAt).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Feature Unlocked Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs text-foreground mb-4">
          <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
            <BookOpen className="size-4 text-primary shrink-0" />
            <span className="font-medium text-[11px]">130+ Subjects Unlocked</span>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
            <Brain className="size-4 text-primary shrink-0" />
            <span className="font-medium text-[11px]">Unlimited AI Hints</span>
          </div>
        </div>

        <Button
          onClick={handleClose}
          className="w-full h-11 rounded-2xl font-semibold gap-2 shadow-md"
        >
          <Sparkles className="size-4" />
          <span>Start Learning Now</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentCelebrationDialog() {
  return (
    <React.Suspense fallback={null}>
      <PaymentCelebrationDialogInner />
    </React.Suspense>
  );
}
