"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
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
    console.error("Global application error captured:", error);

    if (isServerActionSkew && typeof window !== "undefined") {
      const skewKey = `global_sa_skew_${error.digest || "auto"}`;
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
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="size-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="size-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isServerActionSkew ? "New Version Deployed" : "Application Error"}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isServerActionSkew
                ? "A new update has been deployed. Please reload to load the latest application version."
                : "A critical application error occurred. Please reload or try again."}
            </p>
          </div>

          {error?.digest && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-500 truncate">
              Error ID: {error.digest}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={isServerActionSkew ? handleManualReload : () => reset()}
              disabled={isReloading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${isReloading ? "animate-spin" : ""}`} />
              <span>{isReloading ? "Reloading..." : "Reload Platform"}</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
