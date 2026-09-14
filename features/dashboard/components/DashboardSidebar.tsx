"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useDashboardStore, DashboardTab } from "../hooks/useDashboardStore";
import { useUser } from "@/features/auth/hooks/useUser";
import { authClient } from "@/features/auth/lib/auth-client";
import { toast } from "sonner";

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useDashboardStore();

  const studentNavItems: {
    id: DashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "subjects", label: "Enrolled Subjects", icon: BookOpen },
    { id: "ai-tutor", label: "Gemini AI Tutor", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      try {
        await authClient.signOut();
      } catch (clientErr) {
        console.warn("Client signOut warning:", clientErr);
      }
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
    <div className="relative flex flex-col h-full bg-card overflow-hidden">
      {/* Sidebar Header: Logo and Brand */}
      <div
        className={`p-4 border-b border-border flex items-center justify-between gap-3 shrink-0 ${
          sidebarCollapsed ? "justify-center px-2" : ""
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-3 min-w-0 transition-opacity hover:opacity-90"
        >
          <div className="size-9 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center bg-card border border-border/60">
            <Image
              src="/logo/highschool-tutor-logo-favicon-rounded.png"
              alt="Highschool Tutor"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              priority
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

      {/* Nav items list & upgrade banner (scrollable on compact screens) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-0">
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
                  if (pathname !== "/dashboard") {
                    router.push("/dashboard");
                  }
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
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Profile & Logout Footer (Always pinned at the bottom) */}
      <div className="p-3 border-t border-border bg-card/80 backdrop-blur-xs shrink-0">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? "flex-col justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={displayName}
                className="size-9 rounded-xl object-cover border border-primary/30 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/30 shrink-0">
                {userInitials}
              </div>
            )}
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
      {/* Desktop Persistent Sidebar (Fixed Viewport Height) */}
      <aside
        className={`sticky top-0 h-screen hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 z-30 shrink-0 overflow-hidden ${
          sidebarCollapsed ? "w-[72px]" : "w-64"
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
          <div className="relative w-72 max-w-[85vw] bg-card border-r border-border shadow-2xl h-full z-10 animate-in slide-in-from-left duration-200 flex flex-col overflow-hidden">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

