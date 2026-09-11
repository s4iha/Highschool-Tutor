import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminSidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;

  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useAdminSidebarStore = create<AdminSidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      setMobileOpen: (isMobileOpen: boolean) => set({ isMobileOpen }),
    }),
    {
      name: "highschool-tutor-admin-sidebar-store",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
    }
  )
);
