"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle2 className="size-4 shrink-0 text-current" />
        ),
        info: (
          <Info className="size-4 shrink-0 text-current" />
        ),
        warning: (
          <AlertTriangle className="size-4 shrink-0 text-current" />
        ),
        error: (
          <AlertCircle className="size-4 shrink-0 text-current" />
        ),
        loading: (
          <Loader2 className="size-4 shrink-0 animate-spin text-current" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group relative font-sans shadow-lg rounded-xl border border-border/40 bg-card text-card-foreground",
          success:
            "!bg-success !text-success-foreground !border-success/30",
          error:
            "!bg-destructive !text-destructive-foreground !border-destructive/30",
          warning:
            "!bg-warning !text-warning-foreground !border-warning/30",
          info:
            "!bg-info !text-info-foreground !border-info/30",
          description: "!text-current/90 text-xs",
          title: "!text-current font-bold",
          actionButton:
            "!bg-white !text-neutral-900 font-semibold hover:!bg-white/90 dark:!bg-neutral-900 dark:!text-white",
          cancelButton:
            "!bg-current/15 !text-current hover:!bg-current/25",
          closeButton:
            "!left-auto !right-2.5 !top-2.5 !transform-none !size-5 !rounded-md !bg-current/10 hover:!bg-current/20 !text-current !border-none !opacity-0 group-hover:!opacity-100 !transition-opacity cursor-pointer flex items-center justify-center [&>svg]:size-3.5 [&>svg]:shrink-0",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

