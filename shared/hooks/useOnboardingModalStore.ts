import { create } from "zustand";

interface OnboardingModalState {
  isOpen: boolean;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
}

export const useOnboardingModalStore = create<OnboardingModalState>((set) => ({
  isOpen: false,
  openOnboardingModal: () => set({ isOpen: true }),
  closeOnboardingModal: () => set({ isOpen: false }),
}));
