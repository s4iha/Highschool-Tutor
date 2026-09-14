"use client";

import * as React from "react";
import {
  Bell,
  Info,
  AlertTriangle,
  Tag,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Badge } from "@/shared/components/ui/badge";
import {
  useAnnouncementsQuery,
  Announcement,
} from "@/features/dashboard/hooks/useAnnouncements";

interface NotificationBellProps {
  variant?: "student" | "admin";
}

const STORAGE_KEY = "hst-notifications-last-viewed";

const subscribeLocalStorage = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("hst-notifications-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hst-notifications-updated", callback);
  };
};

const getSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const getServerSnapshot = () => null;

export function NotificationBell({ variant = "student" }: NotificationBellProps) {
  const [open, setOpen] = React.useState(false);
  const lastViewedAt = React.useSyncExternalStore(
    subscribeLocalStorage,
    getSnapshot,
    getServerSnapshot
  );

  const { data: announcements = [], isLoading } = useAnnouncementsQuery();

  const hasUnread = React.useMemo(() => {
    if (announcements.length === 0) return false;
    if (!lastViewedAt) return true;

    const lastTime = new Date(lastViewedAt).getTime();
    return announcements.some((a) => {
      const pubTime = new Date(a.publishedAt || a.createdAt).getTime();
      return pubTime > lastTime;
    });
  }, [announcements, lastViewedAt]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      const now = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, now);
        window.dispatchEvent(new Event("hst-notifications-updated"));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const getTypeIcon = (type: Announcement["type"]) => {
    switch (type) {
      case "WARNING":
        return <AlertTriangle className="size-3 text-amber-500" />;
      case "PROMO":
        return <Tag className="size-3 text-emerald-500" />;
      case "MAINTENANCE":
        return <Wrench className="size-3 text-rose-500" />;
      case "INFO":
      default:
        return <Info className="size-3 text-blue-500" />;
    }
  };

  const getTypeBadgeClass = (type: Announcement["type"]) => {
    switch (type) {
      case "WARNING":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "PROMO":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "MAINTENANCE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "INFO":
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    }
  };

  const formatTimestamp = (dateStr: string | null) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        aria-label={variant === "admin" ? "Admin Notifications" : "Student Notifications"}
        className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-card text-foreground hover:text-primary flex items-center justify-center border border-border shadow-2xs transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {hasUnread && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 rounded-2xl bg-card border border-border/80 shadow-2xl p-0 overflow-hidden z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm font-heading text-foreground">
              {variant === "admin" ? "Platform Alerts & Broadcasts" : "Notifications"}
            </span>
            {announcements.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {announcements.length}
              </Badge>
            )}
          </div>
          {hasUnread && (
            <span className="text-[10px] font-semibold text-primary">New alerts</span>
          )}
        </div>

        {/* Content list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
              <div className="animate-spin size-4 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p>Loading notifications...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <CheckCircle2 className="size-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                {variant === "admin" ? "No Platform Alerts" : "All caught up!"}
              </p>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                {variant === "admin"
                  ? "There are no active broadcasts or platform warnings at this moment."
                  : "You have no unread notifications. Check back later for announcements and updates."}
              </p>
            </div>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 hover:bg-muted/40 transition-colors space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1 ${getTypeBadgeClass(
                      item.type
                    )}`}
                  >
                    {getTypeIcon(item.type)}
                    <span>{item.type}</span>
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatTimestamp(item.publishedAt || item.createdAt)}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                  {item.body}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
