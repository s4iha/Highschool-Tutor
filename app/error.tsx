"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReloading, setIsReloading] = useState(false);

  const isServerActionSkew = Boolean(
    error?.message?.includes("Failed to find Server Action") ||
    error?.message?.includes("older or newer deployment") ||
    error?.message?.includes("server action")
  );

  useEffect(() => {
    console.error("Application error captured:", error);

    // If caused by deployment action skew, automatically reload once to refresh client bundle
    if (isServerActionSkew && typeof window !== "undefined") {
      const skewKey = `sa_skew_${error.digest || "auto"}`;
      const hasReloaded = sessionStorage.getItem(skewKey);
      if (!hasReloaded) {
        sessionStorage.setItem(skewKey, "true");
        window.location.reload();
      }
    }
  }, [error, isServerActionSkew]);

  const handleManualReload = () => {
    setIsReloading(true);
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6">
        <div className="size-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
          <AlertTriangle className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            {isServerActionSkew
              ? "New Version Deployed"
              : "Something went wrong"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isServerActionSkew
              ? "A fresh update has been deployed to the platform. Please refresh to load the latest application version."
              : error.message ||
                "An unexpected application error occurred. You can retry the request or return to the dashboard."}
          </p>
        </div>

        {error?.digest && (
          <div className="bg-muted/40 border border-border/60 rounded-xl px-3 py-1.5 text-xs font-mono text-muted-foreground truncate">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            onClick={isServerActionSkew ? handleManualReload : () => reset()}
            disabled={isReloading}
            className="flex-1 gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <RefreshCw className={`size-4 ${isReloading ? "animate-spin" : ""}`} />
            <span>{isReloading ? "Reloading..." : isServerActionSkew ? "Reload Page" : "Try Again"}</span>
          </Button>

          <Button
            variant="outline"
            asChild
            className="flex-1 gap-2 rounded-xl border-border"
          >
            <Link href="/dashboard">
              <Home className="size-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
