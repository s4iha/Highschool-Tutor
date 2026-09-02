import { create } from "zustand";

export type DashboardRole = "student" | "admin";
export type DashboardTab = "overview" | "subjects" | "quizzes" | "scorecards" | "ai-tutor" | "settings";

interface DashboardState {
  role: DashboardRole;
  activeTab: DashboardTab;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  selectedSubject: string;
  studyMode: "syllabus" | "quizzes" | "ai-tutor";
  
  // Actions
  setRole: (role: DashboardRole) => void;
  toggleRole: () => void;
  setActiveTab: (tab: DashboardTab) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSelectedSubject: (subject: string) => void;
  setStudyMode: (mode: "syllabus" | "quizzes" | "ai-tutor") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  role: "student",
  activeTab: "overview",
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  selectedSubject: "General Mathematics",
  studyMode: "syllabus",

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
}));
