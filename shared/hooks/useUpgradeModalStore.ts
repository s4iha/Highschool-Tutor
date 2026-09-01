import { create } from "zustand";

interface UpgradeModalState {
  isOpen: boolean;
  featureName?: string;
  reason?: string;
  openUpgradeModal: (options?: { featureName?: string; reason?: string }) => void;
  closeUpgradeModal: () => void;
}

export const useUpgradeModalStore = create<UpgradeModalState>((set) => ({
  isOpen: false,
  featureName: undefined,
  reason: undefined,
  openUpgradeModal: (options) =>
    set({
      isOpen: true,
      featureName: options?.featureName,
      reason: options?.reason,
    }),
  closeUpgradeModal: () =>
    set({
      isOpen: false,
      featureName: undefined,
      reason: undefined,
    }),
}));
