import { create } from "zustand";
import type { DepthLevel } from "@/types";

interface ReaderState {
  isOpen: boolean;
  resourceUrl: string | null;
  resourceTitle: string | null;
  sessionStartTime: number | null;
}

interface ModalState {
  replaceModal: {
    isOpen: boolean;
    techniqueId: string | null;
  };
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
  reader: ReaderState;
  modals: ModalState;
  isMobile: boolean;
  activeSessionMinutes: number;
  showTransition: boolean;
}

interface UIActions {
  setDailyMinutes: (minutes: number) => void;
  setPreferredDepth: (depth: DepthLevel) => void;
  openReader: (url: string, title: string) => void;
  closeReader: () => void;
  openReplaceModal: (techniqueId: string) => void;
  closeReplaceModal: () => void;
  openReasoningModal: () => void;
  closeReasoningModal: () => void;
  openDecompositionModal: (techniqueId: string) => void;
  closeDecompositionModal: () => void;
  setIsMobile: (isMobile: boolean) => void;
  incrementSessionTime: () => void;
  resetSessionTime: () => void;
  setShowTransition: (show: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set) => ({
  dailyMinutes: 30,
  preferredDepth: "intermediate",
  reader: {
    isOpen: false,
    resourceUrl: null,
    resourceTitle: null,
    sessionStartTime: null,
  },
  modals: {
    replaceModal: { isOpen: false, techniqueId: null },
    reasoningModal: { isOpen: false },
    decompositionModal: { isOpen: false, techniqueId: null },
  },
  isMobile: false,
  activeSessionMinutes: 0,
  showTransition: false,

  setDailyMinutes: (minutes) => set({ dailyMinutes: minutes }),

  setPreferredDepth: (depth) => set({ preferredDepth: depth }),

  openReader: (url, title) =>
    set({
      reader: {
        isOpen: true,
        resourceUrl: url,
        resourceTitle: title,
        sessionStartTime: Date.now(),
      },
    }),

  closeReader: () =>
    set({
      reader: {
        isOpen: false,
        resourceUrl: null,
        resourceTitle: null,
        sessionStartTime: null,
      },
    }),

  openReplaceModal: (techniqueId) =>
    set((state) => ({
      modals: {
        ...state.modals,
        replaceModal: { isOpen: true, techniqueId },
      },
    })),

  closeReplaceModal: () =>
    set((state) => ({
      modals: {
        ...state.modals,
        replaceModal: { isOpen: false, techniqueId: null },
      },
    })),

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
}));

export const selectReader = (state: UIStore) => state.reader;
export const selectIsMobile = (state: UIStore) => state.isMobile;
export const selectReplaceModal = (state: UIStore) => state.modals.replaceModal;
export const selectReasoningModal = (state: UIStore) => state.modals.reasoningModal;
