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
  AlertCircle,
  RefreshCw,
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
  const refParam = searchParams?.get("ref") || null;
  const trackingKey = refParam || (sessionId && sessionId !== "{CHECKOUT_SESSION_ID}" ? sessionId : null);

  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null);
  const isOpen = Boolean(isSuccessParam && (sessionId || refParam) && dismissedKey !== (trackingKey || "success"));

  const { data, isPaid, isFailed, isLoading, isPending, isError, error, refetch } = useVerifySession(
    isOpen ? { sessionId, ref: refParam } : null
  );

  const handleClose = () => {
    setDismissedKey(trackingKey || "success");
    // Clean up query parameters without full page reload
    if (typeof window !== "undefined" && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.pathname);
    }
  };

  if (!isSuccessParam || (!sessionId && !refParam)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border/60 shadow-2xl text-center">
        <DialogHeader className="space-y-2 items-center">
          <div className="size-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-xs mb-1 animate-bounce">
            {isError || isFailed ? (
              <AlertCircle className="size-8 text-amber-500" />
            ) : (
              <PartyPopper className="size-8" />
            )}
          </div>

          <DialogTitle className="text-2xl font-bold font-heading text-foreground">
            {isPaid
              ? "Payment Verified! 🎉"
              : isError || isFailed
              ? "Verification Needs Attention"
              : "Verifying Payment..."}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {isPaid
              ? "Your subscription is now active! All 130+ DepEd MATATAG subjects and Socratic AI tutoring are unlocked."
              : isError || isFailed
              ? (error instanceof Error ? error.message : "We could not verify this payment session automatically. Please retry or contact support.")
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
              ) : isError || isFailed ? (
                <>
                  <AlertCircle className="size-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">UNVERIFIED</span>
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

        {isError || isFailed ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex-1 h-11 rounded-2xl font-semibold gap-2"
            >
              <RefreshCw className="size-4" />
              <span>Retry Verification</span>
            </Button>
            <Button
              onClick={handleClose}
              className="flex-1 h-11 rounded-2xl font-semibold"
            >
              <span>Close</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleClose}
            className="w-full h-11 rounded-2xl font-semibold gap-2 shadow-md"
          >
            <Sparkles className="size-4" />
            <span>Start Learning Now</span>
          </Button>
        )}
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
