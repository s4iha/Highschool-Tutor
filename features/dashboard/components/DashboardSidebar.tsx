"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Crown,
} from "lucide-react";
import { useDashboardStore, DashboardTab } from "../hooks/useDashboardStore";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { useUser } from "@/features/auth/hooks/useUser";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";

export default function DashboardSidebar() {
  const router = useRouter();
  const { user } = useUser();
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useDashboardStore();
  const { openUpgradeModal } = useUpgradeModalStore();

  const studentNavItems: {
    id: DashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "subjects", label: "Enrolled Subjects", icon: BookOpen },
    { id: "quizzes", label: "DepEd Quizzes", icon: Award },
    { id: "ai-tutor", label: "Gemini AI Tutor", icon: Bot, badge: "Socratic" },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  const displayName = user?.profile?.fullName || user?.name || "Student";
  const displayGrade = user?.profile?.gradeLevel
    ? `${user.profile.gradeLevel} • ${user.profile.track || "DepEd K-12"}`
    : "DepEd MATATAG Student";

  const userInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "ST";

  const sidebarContent = (
    <div className="relative flex flex-col h-full bg-card">
      {/* Sidebar Header: Logo and Brand (Increased Size) */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-3 min-w-0 transition-opacity hover:opacity-90"
        >
          <div className="relative size-11 shrink-0 overflow-hidden rounded-2xl bg-primary/10 p-1.5 flex items-center justify-center border border-primary/20 shadow-xs">
            <Image
              src="/logo/highschool-tutor-logo-favicon-squared.png"
              alt="HighSchool Tutor"
              width={44}
              height={44}
              className="object-contain"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-black tracking-tight text-foreground truncate">
                HighSchool<span className="text-primary">Tutor</span>
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                DepEd K-12 MATATAG
              </span>
            </div>
          )}
        </Link>

        {/* Close Button (Mobile) */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Collapse Toggle Button (Desktop) */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-6 z-40 p-1 rounded-full bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-sm"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Nav items list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="space-y-1">
          {studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "secondary" : "outline"}
                        className={`text-[9px] px-1.5 py-0 font-bold ml-1.5 ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upgrade Banner in Sidebar */}
      {!sidebarCollapsed && (
        <div className="p-3.5 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-teal-500/10 border border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Crown className="w-4 h-4 text-primary" />
            <span>HighSchool Premium</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Unlock all 130+ DepEd subjects &amp; unlimited AI Socratic assistance.
          </p>
          <Button
            size="sm"
            onClick={() =>
              openUpgradeModal({
                featureName: "All High School Subjects",
                reason: "Upgrade to Premium to unlock full curriculum and quarterly transmutation sheets.",
              })
            }
            className="w-full text-xs font-bold rounded-xl h-7"
          >
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Student Profile & Logout Footer */}
      <div className="p-3 border-t border-border bg-card/80 backdrop-blur-xs">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? "flex-col justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/30 shrink-0">
              {userInitials}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-foreground block truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground block truncate">
                  {displayGrade}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ${
              sidebarCollapsed ? "w-full flex justify-center" : ""
            }`}
            title="Log Out"
            aria-label="Log out of account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`relative hidden lg:block bg-card border-r border-border transition-all duration-200 z-30 shrink-0 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-card border-r border-border shadow-2xl h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

