import { get, set, del, keys } from "idb-keyval";
import type { LearningPlan, SyncAction } from "@/types";
import { generateId } from "@/lib/utils";

const PLAN_KEY = "learn8-plan";
const QUEUE_KEY = "learn8-sync-queue";

export async function savePlanToIndexedDB(plan: LearningPlan): Promise<void> {
  await set(PLAN_KEY, plan);
}

export async function getPlanFromIndexedDB(): Promise<LearningPlan | null> {
  const plan = await get<LearningPlan>(PLAN_KEY);
  return plan ?? null;
}

export async function deletePlanFromIndexedDB(): Promise<void> {
  await del(PLAN_KEY);
}

export async function addToSyncQueue(
  type: SyncAction["type"],
  payload: unknown
): Promise<void> {
  const queue = await getSyncQueue();
  const action: SyncAction = {
    id: generateId(),
    type,
    payload,
    timestamp: Date.now(),
    synced: false,
  };
  queue.push(action);
  await set(QUEUE_KEY, queue);
}

export async function getSyncQueue(): Promise<SyncAction[]> {
  const queue = await get<SyncAction[]>(QUEUE_KEY);
  return queue ?? [];
}

export async function markActionAsSynced(actionId: string): Promise<void> {
  const queue = await getSyncQueue();
  const updated = queue.map((action) =>
    action.id === actionId ? { ...action, synced: true } : action
  );
  await set(QUEUE_KEY, updated);
}

export async function clearSyncedActions(): Promise<void> {
  const queue = await getSyncQueue();
  const pending = queue.filter((action) => !action.synced);
  await set(QUEUE_KEY, pending);
}

export async function processSyncQueue(): Promise<void> {
  const queue = await getSyncQueue();
  const pending = queue.filter((action) => !action.synced);

  for (const action of pending) {
    try {
      await markActionAsSynced(action.id);
    } catch (error) {
      console.error("Failed to sync action:", action.id, error);
      break;
    }
  }

  await clearSyncedActions();
}

export class SyncEngine {
  private isProcessing = false;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  async init(): Promise<void> {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => this.onOnline());
    window.addEventListener("offline", () => this.onOffline());

    if (navigator.onLine) {
      await this.processQueue();
    }
  }

  private onOnline(): void {
    this.processQueue();
  }

  private onOffline(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  async addAction(type: SyncAction["type"], payload: unknown): Promise<void> {
    await addToSyncQueue(type, payload);

    if (navigator.onLine) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      await processSyncQueue();
    } catch (error) {
      console.error("Sync failed, will retry:", error);
      this.scheduleRetry();
    } finally {
      this.isProcessing = false;
    }
  }

  private scheduleRetry(): void {
    if (this.retryTimeout) return;

    this.retryTimeout = setTimeout(() => {
      this.retryTimeout = null;
      if (navigator.onLine) {
        this.processQueue();
      }
    }, 5000);
  }

  destroy(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }
}

export const syncEngine = new SyncEngine();
