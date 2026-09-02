"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, User, Shield, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useDashboardStore } from "../hooks/useDashboardStore";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { role, setRole, setMobileSidebarOpen, activeTab } = useDashboardStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Compute dynamic page title for breadcrumb
  const getBreadcrumbTitle = () => {
    if (pathname.startsWith("/curriculum/")) {
      return "Study Studio (Lessons, Quizzes & AI Tutor)";
    }
    if (pathname.startsWith("/admin")) {
      return "DepEd Administrative & Metrics Portal";
    }
    switch (activeTab) {
      case "overview":
        return "Dashboard";
      case "subjects":
        return "Enrolled High School Subjects";
      case "quizzes":
        return "DepEd Quizzes & Transmutation";
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

      {/* Right: Mock Role Switcher, Theme Toggle, Notifications */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Interactive Mock Role Switcher Control */}
        <div className="bg-muted p-0.5 sm:p-1 rounded-xl sm:rounded-2xl flex items-center gap-0.5 sm:gap-1 border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
              role === "student"
                ? "bg-card text-primary shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Student View</span>
            <span className="hidden sm:inline md:hidden">Student</span>
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin Portal</span>
            <span className="hidden sm:inline md:hidden">Admin</span>
          </Link>
        </div>

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
      </div>
    </header>
  );
}
