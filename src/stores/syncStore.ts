import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SyncAction } from "@/types";
import { generateId } from "@/lib/utils";

interface SyncState {
  queue: SyncAction[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
}

interface SyncActions {
  addToQueue: (
    type: SyncAction["type"],
    payload: unknown
  ) => void;
  markAsSynced: (actionId: string) => void;
  clearSynced: () => void;
  setIsOnline: (isOnline: boolean) => void;
  setIsSyncing: (isSyncing: boolean) => void;
  processQueue: () => Promise<void>;
  getPendingActions: () => SyncAction[];
}

type SyncStore = SyncState & SyncActions;

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      queue: [],
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      isSyncing: false,
      lastSyncedAt: null,

      addToQueue: (type, payload) => {
        const action: SyncAction = {
          id: generateId(),
          type,
          payload,
          timestamp: Date.now(),
          synced: false,
        };

        set((state) => ({
          queue: [...state.queue, action],
        }));
      },

      markAsSynced: (actionId) => {
        set((state) => ({
          queue: state.queue.map((action) =>
            action.id === actionId ? { ...action, synced: true } : action
          ),
        }));
      },

      clearSynced: () => {
        set((state) => ({
          queue: state.queue.filter((action) => !action.synced),
          lastSyncedAt: Date.now(),
        }));
      },

      setIsOnline: (isOnline) => set({ isOnline }),

      setIsSyncing: (isSyncing) => set({ isSyncing }),

      processQueue: async () => {
        const { queue, isSyncing, isOnline } = get();
        if (isSyncing || !isOnline) return;

        const pending = queue.filter((a) => !a.synced);
        if (pending.length === 0) return;

        set({ isSyncing: true });

        try {
          for (const action of pending) {
            get().markAsSynced(action.id);
          }
          get().clearSynced();
        } finally {
          set({ isSyncing: false });
        }
      },

      getPendingActions: () => {
        return get().queue.filter((a) => !a.synced);
      },
    }),
    {
      name: "learn8-sync-queue",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ queue: state.queue, lastSyncedAt: state.lastSyncedAt }),
    }
  )
);

export const selectPendingCount = (state: SyncStore) =>
  state.queue.filter((a) => !a.synced).length;

export const selectIsOnline = (state: SyncStore) => state.isOnline;
