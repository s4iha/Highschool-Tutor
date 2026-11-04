"use client";

import * as React from "react";
import Link from "next/link";
import {
  Crown,
  ShieldCheck,
  QrCode,
  Smartphone,
  CreditCard,
  LogIn,
  ArrowRight,
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
import {
  MONTHLY_PRICE_PHP,
  ANNUAL_PRICE_PHP,
  formatPhp,
} from "../utils/pricing";
import { saveReturnIntent } from "../utils/returnIntent";

export interface AuthInterceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: "MONTHLY" | "ANNUAL";
  referralCode?: string;
  sourceUrl?: string;
}

const DOMESTIC_RAILS = [
  { name: "QR Ph", icon: QrCode },
  { name: "GCash", icon: Smartphone },
  { name: "Maya", icon: Smartphone },
  { name: "Cards", icon: CreditCard },
];

export function AuthInterceptDialog({
  open,
  onOpenChange,
  selectedPlan,
  referralCode,
  sourceUrl,
}: AuthInterceptDialogProps) {
  const activePrice = selectedPlan === "ANNUAL" ? ANNUAL_PRICE_PHP : MONTHLY_PRICE_PHP;
  const isAnnual = selectedPlan === "ANNUAL";

  const handleContinueAuth = () => {
    saveReturnIntent({
      planId: selectedPlan,
      referralCode: referralCode || null,
      sourceUrl: sourceUrl || (typeof window !== "undefined" ? window.location.pathname : "/"),
    });
    onOpenChange(false);
  };

  const loginUrl = `/login?returnToCheckout=1&plan=${selectedPlan}${referralCode ? `&ref=${encodeURIComponent(referralCode)}` : ""}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border/60 shadow-2xl">
        <DialogHeader className="text-center items-center space-y-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Crown className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold font-heading text-foreground">
            Sign In to Avail Subscription
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            A free student account is required to link your payment, activate curriculum passes, and track your DepEd learning progress.
          </DialogDescription>
        </DialogHeader>

        {/* Selected Plan Summary Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Selected Plan
              </span>
              {isAnnual && (
                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-medium text-[10px] px-2 py-0.2">
                  Save ₱1,089
                </Badge>
              )}
            </div>
            <span className="text-xs font-semibold text-primary">
              {isAnnual ? "Full School Year" : "Flexible Monthly"}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-foreground">
              {isAnnual ? "Annual Unlimited Pass" : "Monthly Pass"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground font-heading">
                {formatPhp(activePrice)}
              </span>
              <span className="text-xs text-muted-foreground">
                {isAnnual ? "/ yr" : "/ mo"}
              </span>
            </div>
          </div>

          {/* Domestic Payment Rails */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            <span>Pay securely via:</span>
            <div className="flex items-center gap-1.5">
              {DOMESTIC_RAILS.map((rail) => (
                <span
                  key={rail.name}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background text-[10px] font-medium text-foreground border border-border/50"
                >
                  <rail.icon className="size-2.5 text-primary" />
                  {rail.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Single Primary Action Button */}
        <div className="pt-2">
          <Button
            asChild
            size="lg"
            className="w-full rounded-2xl font-semibold text-sm gap-2 shadow-md hover:shadow-lg"
            onClick={handleContinueAuth}
          >
            <Link href={loginUrl}>
              <LogIn className="size-4" />
              <span>Continue to Sign In / Sign Up</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>PayMongo 256-bit encryption • No credit card required upfront</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
