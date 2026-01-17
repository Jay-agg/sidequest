import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LearningPlan, Technique, MasteryState, DepthLevel } from "@/types";
import { generateId } from "@/lib/utils";

interface LearningPlanState {
  plan: LearningPlan | null;
  isGenerating: boolean;
  generationError: string | null;
}

interface LearningPlanActions {
  setPlan: (plan: LearningPlan) => void;
  clearPlan: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  updateTechniqueMastery: (techniqueId: string, state: MasteryState) => void;
  replaceTechnique: (oldTechniqueId: string, newTechnique: Technique) => void;
  decomposeTechnique: (techniqueId: string, microSteps: string[]) => void;
  updateDailyMinutes: (minutes: number) => void;
  getTechniqueById: (techniqueId: string) => Technique | undefined;
  getNextTechnique: () => Technique | undefined;
  getProgress: () => { completed: number; total: number; percentage: number };
}

type LearningPlanStore = LearningPlanState & LearningPlanActions;

export const useLearningPlanStore = create<LearningPlanStore>()(
  persist(
    (set, get) => ({
      plan: null,
      isGenerating: false,
      generationError: null,

      setPlan: (plan) => set({ plan, generationError: null }),

      clearPlan: () => set({ plan: null }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationError: (error) => set({ generationError: error }),

      updateTechniqueMastery: (techniqueId, masteryState) => {
        const { plan } = get();
        if (!plan) return;

        const updatedTechniques = plan.techniques.map((technique) =>
          technique.id === techniqueId
            ? { ...technique, masteryState }
            : technique
        );

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            updatedAt: Date.now(),
          },
        });
      },

      replaceTechnique: (oldTechniqueId, newTechnique) => {
        const { plan } = get();
        if (!plan) return;

        const oldTechniqueIndex = plan.techniques.findIndex(
          (t) => t.id === oldTechniqueId
        );
        if (oldTechniqueIndex === -1) return;

        const updatedTechniques = [...plan.techniques];
        updatedTechniques[oldTechniqueIndex] = {
          ...newTechnique,
          id: generateId(),
          order: plan.techniques[oldTechniqueIndex].order,
          masteryState: "unstarted",
        };

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            updatedAt: Date.now(),
          },
        });
      },

      decomposeTechnique: (techniqueId, microSteps) => {
        const { plan } = get();
        if (!plan) return;

        const updatedTechniques = plan.techniques.map((technique) =>
          technique.id === techniqueId
            ? { ...technique, microSteps }
            : technique
        );

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            updatedAt: Date.now(),
          },
        });
      },

      updateDailyMinutes: (minutes) => {
        const { plan } = get();
        if (!plan) return;

        set({
          plan: {
            ...plan,
            dailyMinutes: minutes,
            updatedAt: Date.now(),
          },
        });
      },

      getTechniqueById: (techniqueId) => {
        const { plan } = get();
        if (!plan) return undefined;
        return plan.techniques.find((t) => t.id === techniqueId);
      },

      getNextTechnique: () => {
        const { plan } = get();
        if (!plan) return undefined;

        const sorted = [...plan.techniques].sort((a, b) => a.order - b.order);

        return sorted.find(
          (t) => t.masteryState !== "mastered"
        );
      },

      getProgress: () => {
        const { plan } = get();
        if (!plan) return { completed: 0, total: 0, percentage: 0 };

        const completed = plan.techniques.filter(
          (t) => t.masteryState === "mastered"
        ).length;
        const total = plan.techniques.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
      },
    }),
    {
      name: "learn8-learning-plan",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ plan: state.plan }),
    }
  )
);

export const selectPlan = (state: LearningPlanStore) => state.plan;
export const selectIsGenerating = (state: LearningPlanStore) => state.isGenerating;
export const selectTechniques = (state: LearningPlanStore) =>
  state.plan?.techniques ?? [];
export const selectProgress = (state: LearningPlanStore) => {
  const plan = state.plan;
  if (!plan) return { completed: 0, total: 0, percentage: 0 };

  const completed = plan.techniques.filter(
    (t) => t.masteryState === "mastered"
  ).length;
  const total = plan.techniques.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};
