import { create } from "zustand";

interface AiPromptsModalState {
  isOpen: boolean;
  topic?: string;
  openModal: (topic?: string) => void;
  closeModal: () => void;
}

export const useAiPromptsModalStore = create<AiPromptsModalState>((set) => ({
  isOpen: false,
  topic: undefined,
  openModal: (topic) => set({ isOpen: true, topic }),
  closeModal: () => set({ isOpen: false, topic: undefined }),
}));
