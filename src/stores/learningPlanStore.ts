import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LearningPlan, Technique, MasteryState } from "@/types";
import { generateId } from "@/lib/utils";

interface LearningPlanState {
  plan: LearningPlan | null;
  isGenerating: boolean;
  generationError: string | null;
  activeTechniqueId: string | null;
}

interface LearningPlanActions {
  setPlan: (plan: LearningPlan) => void;
  clearPlan: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  setActiveTechnique: (techniqueId: string | null) => void;
  updateTechniqueMastery: (techniqueId: string, state: MasteryState) => void;
  replaceTechnique: (oldTechniqueId: string, newTechnique: Technique) => void;
  decomposeTechnique: (techniqueId: string, microSteps: string[]) => void;
  updateDailyMinutes: (minutes: number) => void;
  updateQuizScore: (techniqueId: string, score: number) => void;
  logPractice: (techniqueId: string, minutes: number) => void;
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
      activeTechniqueId: null,

      setPlan: (plan) => set({ plan, generationError: null }),

      clearPlan: () => set({ plan: null, activeTechniqueId: null }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationError: (error) => set({ generationError: error }),

      setActiveTechnique: (techniqueId) => set({ activeTechniqueId: techniqueId }),

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

      updateQuizScore: (techniqueId, score) => {
        const { plan } = get();
        if (!plan) return;

        const updatedTechniques = plan.techniques.map((technique) =>
          technique.id === techniqueId
            ? { 
                ...technique, 
                quizScore: score, 
                quizCompleted: true,
                masteryState: score >= 80 && technique.masteryState === "learning" 
                  ? "practicing" 
                  : technique.masteryState
              }
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

      logPractice: (techniqueId, minutes) => {
        const { plan } = get();
        if (!plan) return;

        const today = new Date().toISOString().split("T")[0];
        const updatedTechniques = plan.techniques.map((technique) =>
          technique.id === techniqueId
            ? { 
                ...technique, 
                practiceMinutes: (technique.practiceMinutes || 0) + minutes,
                lastPracticed: Date.now(),
              }
            : technique
        );

        const isNewDay = plan.lastPracticeDate !== today;
        const newStreak = isNewDay ? (plan.streakDays || 0) + 1 : plan.streakDays || 0;

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            totalPracticeMinutes: (plan.totalPracticeMinutes || 0) + minutes,
            streakDays: newStreak,
            lastPracticeDate: today,
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
      partialize: (state) => ({ plan: state.plan, activeTechniqueId: state.activeTechniqueId }),
    }
  )
);

export const selectPlan = (state: LearningPlanStore) => state.plan;
export const selectIsGenerating = (state: LearningPlanStore) => state.isGenerating;
export const selectTechniques = (state: LearningPlanStore) =>
  state.plan?.techniques ?? [];
export const selectActiveTechniqueId = (state: LearningPlanStore) => state.activeTechniqueId;
