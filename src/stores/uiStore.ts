import { create } from "zustand";
import type { DepthLevel } from "@/types";

interface ModalState {
  reasoningModal: {
    isOpen: boolean;
  };
  decompositionModal: {
    isOpen: boolean;
    techniqueId: string | null;
  };
}

interface UIState {
  dailyMinutes: number;
  preferredDepth: DepthLevel;
  modals: ModalState;
  isMobile: boolean;
  activeSessionMinutes: number;
  showTransition: boolean;
  showHobbyTransition: boolean;
}

interface UIActions {
  setDailyMinutes: (minutes: number) => void;
  setPreferredDepth: (depth: DepthLevel) => void;
  openReasoningModal: () => void;
  closeReasoningModal: () => void;
  openDecompositionModal: (techniqueId: string) => void;
  closeDecompositionModal: () => void;
  setIsMobile: (isMobile: boolean) => void;
  incrementSessionTime: () => void;
  resetSessionTime: () => void;
  setShowTransition: (show: boolean) => void;
  setShowHobbyTransition: (show: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set) => ({
  dailyMinutes: 30,
  preferredDepth: "intermediate",
  modals: {
    reasoningModal: { isOpen: false },
    decompositionModal: { isOpen: false, techniqueId: null },
  },
  isMobile: false,
  activeSessionMinutes: 0,
  showTransition: false,
  showHobbyTransition: false,

  setDailyMinutes: (minutes) => set({ dailyMinutes: minutes }),

  setPreferredDepth: (depth) => set({ preferredDepth: depth }),

  openReasoningModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        reasoningModal: { isOpen: true },
      },
    })),

  closeReasoningModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        reasoningModal: { isOpen: false },
      },
    })),

  openDecompositionModal: (techniqueId) =>
    set((state) => ({
      modals: {
        ...state.modals,
        decompositionModal: { isOpen: true, techniqueId },
      },
    })),

  closeDecompositionModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        decompositionModal: { isOpen: false, techniqueId: null },
      },
    })),

  setIsMobile: (isMobile) => set({ isMobile }),

  incrementSessionTime: () =>
    set((state) => ({
      activeSessionMinutes: state.activeSessionMinutes + 1,
    })),

  resetSessionTime: () => set({ activeSessionMinutes: 0 }),

  setShowTransition: (show) => set({ showTransition: show }),

  setShowHobbyTransition: (show) => set({ showHobbyTransition: show }),
}));

export const selectIsMobile = (state: UIStore) => state.isMobile;
export const selectReasoningModal = (state: UIStore) => state.modals.reasoningModal;
