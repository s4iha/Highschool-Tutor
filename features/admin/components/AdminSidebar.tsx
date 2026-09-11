"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  Megaphone,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
} from "lucide-react";
import { useAdminSidebarStore } from "../hooks/useAdminSidebarStore";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  {
    title: "Overview & KPIs",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Students & Subs",
    href: "/admin/students",
    icon: Users,
    exact: false,
  },
  {
    title: "Quiz Config",
    href: "/admin/quiz-config",
    icon: FileQuestion,
    exact: false,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
    exact: false,
  },
  {
    title: "Pricing & Guardrails",
    href: "/admin/settings",
    icon: Settings,
    exact: false,
  },
];

interface AdminSidebarProps {
  isMobile?: boolean;
}

export function AdminSidebar({ isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, setMobileOpen } = useAdminSidebarStore();

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r border-border/60 transition-all duration-300 select-none z-30",
        isMobile
          ? "w-72 h-full"
          : isCollapsed
          ? "w-[72px] shrink-0 sticky top-0 h-screen"
          : "w-64 shrink-0 sticky top-0 h-screen"
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-border/40 px-4 h-16 shrink-0",
          !isMobile && isCollapsed ? "justify-center px-2" : ""
        )}
      >
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
            <ShieldAlert className="size-5" />
          </div>
          {(isMobile || !isCollapsed) && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-foreground font-heading truncate">
                Admin Console
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                DepEd SaaS Plane
              </span>
            </div>
          )}
        </Link>

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="size-8 rounded-lg"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {(isMobile || !isCollapsed) && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Administrative Control
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              title={item.title}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                !isMobile && isCollapsed ? "justify-center px-0" : ""
              )}
            >
              <Icon className="size-4 shrink-0" />
              {(isMobile || !isCollapsed) && (
                <span className="truncate">{item.title}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Switcher & Collapse Toggle */}
      <div className="p-3 border-t border-border/40 space-y-2 shrink-0 bg-muted/20">
        {/* Switch to Student Portal */}
        <Link
          href="/dashboard"
          title="Return to Student Dashboard"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
            !isMobile && isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <GraduationCap className="size-4 shrink-0 text-primary" />
          {(isMobile || !isCollapsed) && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground text-[11px] truncate">
                Student Portal
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                Back to Tutor
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className={cn(
              "w-full h-8 text-xs text-muted-foreground hover:text-foreground rounded-lg justify-start gap-2",
              isCollapsed ? "justify-center px-0" : "px-3"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                <span className="text-[11px]">Collapse Sidebar</span>
              </>
            )}
          </Button>
        )}
      </div>
    </aside>
  );
}
