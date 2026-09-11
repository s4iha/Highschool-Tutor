"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, Bell, ShieldAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { useDashboardStore } from "../hooks/useDashboardStore";
import { useUser } from "@/features/auth/hooks/useUser";

const emptySubscribe = () => () => {};

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { setMobileSidebarOpen, activeTab } = useDashboardStore();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Compute dynamic page title for breadcrumb
  const getBreadcrumbTitle = () => {
    if (pathname.startsWith("/curriculum/")) {
      return "Study Studio (Lessons, Practice Tests & AI Tutor)";
    }
    if (pathname.startsWith("/admin")) {
      return "DepEd Administrative & Metrics Portal";
    }
    switch (activeTab) {
      case "overview":
        return "Dashboard";
      case "subjects":
        return "Enrolled High School Subjects";
      case "scorecards":
        return "Quarterly Grades & Scorecards";
      case "ai-tutor":
        return "Gemini Socratic AI Tutor";
      case "settings":
        return "Student Preferences & Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 transition-colors shadow-xs min-w-0">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-1.5 sm:p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-muted-foreground min-w-0">
            <span className="hidden sm:inline shrink-0">Student Portal</span>
            <span className="hidden sm:inline shrink-0">/</span>
            <span className="text-foreground font-extrabold truncate">{getBreadcrumbTitle()}</span>
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground hidden md:inline truncate">
            HighSchool Tutor • DepEd K-12 MATATAG Autonomous AI Learning Workspace
          </span>
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-card text-foreground hover:text-primary flex items-center justify-center border border-border shadow-2xs transition-colors cursor-pointer"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* Notification Badge */}
        <button
          type="button"
          onClick={() => alert("No new notifications")}
          aria-label="Notifications"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-card text-foreground hover:text-primary flex items-center justify-center border border-border shadow-2xs transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Admin Switcher for ADMIN role */}
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-colors"
          >
            <ShieldAlert className="size-3.5" />
            <span className="hidden sm:inline">Admin Console</span>
          </Link>
        )}
      </div>
    </header>
  );
}
