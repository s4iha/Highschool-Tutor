"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import { useAdminSidebarStore } from "../hooks/useAdminSidebarStore";
import { NAV_ITEMS } from "./AdminSidebar";
import { NotificationBell } from "@/shared/components/NotificationBell";

const emptySubscribe = () => () => {};

export function AdminHeader() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { isCollapsed, toggleCollapse, toggleMobile } = useAdminSidebarStore();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleMobile();
    } else {
      toggleCollapse();
    }
  };

  // Determine active nav title for breadcrumb
  const currentNavItem = NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );
  const sectionTitle = currentNavItem ? currentNavItem.title : "Control Plane";

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 transition-colors shadow-xs min-w-0">
      {/* Left: Menu toggle button & breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="p-1.5 sm:p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors shrink-0 cursor-pointer"
          aria-label="Toggle navigation sidebar"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-lg font-semibold text-foreground min-w-0">
            <span className="text-foreground font-extrabold truncate">
              {sectionTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications, Student Portal Switcher */}
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

        {/* Modern Notification Bell for Admin Alerts */}
        <NotificationBell variant="admin" />

        {/* Student Portal Switcher */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-colors"
          title="Return to Student Portal"
        >
          <GraduationCap className="size-3.5" />
          <span className="hidden sm:inline">Student Portal</span>
        </Link>
      </div>
    </header>
  );
}
