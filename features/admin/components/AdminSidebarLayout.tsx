"use client";

import * as React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAdminSidebarStore } from "../hooks/useAdminSidebarStore";

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
}

export function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const { isMobileOpen, setMobileOpen } = useAdminSidebarStore();

  // Close mobile drawer on ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, setMobileOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* 2. Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-card h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <AdminSidebar isMobile />
          </div>
        </div>
      )}

      {/* 3. Main Body Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar with Breadcrumbs, Theme Toggle & Navigation Switcher */}
        <AdminHeader />

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
