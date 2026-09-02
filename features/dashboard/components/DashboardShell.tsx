"use client";

import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Responsive Dashboard Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
        {/* Top Sticky Header Toolbar */}
        <DashboardHeader />

        {/* Dynamic Main View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
