"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Award,
  Bot,
  CheckCircle2,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  X,
  Crown,
  Search,
  Sparkles,
} from "lucide-react";
import { useDashboardStore, DashboardTab } from "../hooks/useDashboardStore";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    setSelectedSubject,
  } = useDashboardStore();
  const { openUpgradeModal } = useUpgradeModalStore();

  const [curriculumMenuOpen, setCurriculumMenuOpen] = useState(false);
  const [curriculumSearch, setCurriculumSearch] = useState("");

  const highschoolTracks = [
    {
      id: "jhs",
      name: "Junior High School",
      grade: "Grades 7-10",
      subjects: ["Mathematics", "Science", "English", "Filipino", "Araling Panlipunan"],
    },
    {
      id: "stem",
      name: "STEM Strand",
      grade: "Grades 11-12",
      subjects: ["Pre-Calculus", "Basic Calculus", "General Biology", "General Chemistry", "General Physics"],
    },
    {
      id: "abm",
      name: "ABM Strand",
      grade: "Grades 11-12",
      subjects: ["Business Math", "Org & Management", "Principles of Marketing", "Applied Economics"],
    },
    {
      id: "humss",
      name: "HUMSS Strand",
      grade: "Grades 11-12",
      subjects: ["Philippine Politics", "Creative Writing", "World Religions", "Community Engagement"],
    },
    {
      id: "shs-core",
      name: "SHS Core Subjects",
      grade: "Grades 11-12",
      subjects: ["Oral Communication", "Komunikasyon", "21st Century Literature", "General Mathematics", "Earth & Life Science"],
    },
  ];

  const studentNavItems: { id: DashboardTab; label: string; icon: any; badge?: string }[] = [
    { id: "overview", label: "Academic Overview", icon: LayoutDashboard, badge: "Active" },
    { id: "subjects", label: "Enrolled Subjects", icon: BookOpen, badge: "6 Subjects" },
    { id: "quizzes", label: "DepEd Quizzes", icon: Award, badge: "24 Quizzes" },
    { id: "scorecards", label: "Grades & Transmutation", icon: CheckCircle2, badge: "94.2%" },
    { id: "ai-tutor", label: "Gemini AI Tutor", icon: Bot, badge: "24/7" },
    { id: "settings", label: "Student Settings", icon: Settings },
  ];

  const filteredTracks = highschoolTracks.filter((track) =>
    track.name.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
    track.subjects.some((s) => s.toLowerCase().includes(curriculumSearch.toLowerCase()))
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header: Logo and Brand */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 min-w-0 transition-opacity hover:opacity-90"
        >
          <div className="relative size-9 shrink-0 overflow-hidden rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20 shadow-xs">
            <Image
              src="/logo/highschool-tutor-bg-removed.png"
              alt="HighSchool Tutor"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black tracking-tight text-foreground truncate">
                HighSchool<span className="text-primary">Tutor</span>
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                DepEd K-12 MATATAG
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle Button (Desktop) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

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
                    ? "bg-primary text-primary-foreground shadow-xs"
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

        {/* Quick Curriculum Tracks Submenu */}
        {!sidebarCollapsed && (
          <div className="pt-4 border-t border-border mt-4">
            <button
              type="button"
              onClick={() => setCurriculumMenuOpen(!curriculumMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span>DepEd Curriculum Tracks</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  curriculumMenuOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            {curriculumMenuOpen && (
              <div className="mt-2 space-y-2 pl-2">
                <div className="relative mb-2">
                  <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search strands & subjects..."
                    value={curriculumSearch}
                    onChange={(e) => setCurriculumSearch(e.target.value)}
                    className="w-full bg-muted text-[11px] text-foreground pl-7 pr-2.5 py-1.5 rounded-lg border border-border focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {filteredTracks.map((track) => (
                    <div key={track.id} className="p-2 bg-muted/40 rounded-xl border border-border/60">
                      <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
                        <span>{track.name}</span>
                        <span className="text-[9px] text-muted-foreground">{track.grade}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {track.subjects.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setSelectedSubject(sub);
                              setActiveTab("subjects");
                              setMobileSidebarOpen(false);
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-card hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground border border-border"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgrade Banner in Sidebar */}
      {!sidebarCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-teal-500/10 border border-primary/20 space-y-2">
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

      {/* Student Profile Footer */}
      <div className="p-3 border-t border-border bg-card">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs border border-primary/30 shrink-0">
            JD
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-foreground block truncate">
                Juan Dela Cruz
              </span>
              <span className="text-[10px] text-muted-foreground block truncate">
                Grade 11 • STEM Track
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block bg-card border-r border-border transition-all duration-200 z-30 shrink-0 ${
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
