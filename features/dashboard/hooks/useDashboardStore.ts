import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DashboardRole = "student" | "admin";
export type DashboardTab = "overview" | "subjects" | "scorecards" | "ai-tutor" | "settings";
export type SubjectsViewMode = "grid" | "list";

interface DashboardState {
  role: DashboardRole;
  activeTab: DashboardTab;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  selectedSubject: string;
  studyMode: "syllabus" | "quizzes" | "ai-tutor";
  subjectsViewMode: SubjectsViewMode;
  
  // Actions
  setRole: (role: DashboardRole) => void;
  toggleRole: () => void;
  setActiveTab: (tab: DashboardTab) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSelectedSubject: (subject: string) => void;
  setStudyMode: (mode: "syllabus" | "quizzes" | "ai-tutor") => void;
  setSubjectsViewMode: (mode: SubjectsViewMode) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      role: "student",
      activeTab: "overview",
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      selectedSubject: "General Mathematics",
      studyMode: "syllabus",
      subjectsViewMode: "grid",

      setRole: (role) => set({ role }),
      toggleRole: () =>
        set((state) => ({ role: state.role === "student" ? "admin" : "student" })),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
      setSelectedSubject: (selectedSubject) => set({ selectedSubject }),
      setStudyMode: (studyMode) => set({ studyMode }),
      setSubjectsViewMode: (subjectsViewMode) => set({ subjectsViewMode }),
    }),
    {
      name: "highschool-tutor-dashboard-store",
      partialize: (state) => ({
        subjectsViewMode: state.subjectsViewMode,
      }),
    }
  )
);
