import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set as idbSet, del as idbDel } from "idb-keyval";
import type { LearningPlan, Technique, MasteryState } from "@/types";
import { generateId } from "@/lib/utils";
import { useUIStore } from "./uiStore";

const indexedDbStringStorage = {
  getItem: async (name: string) => {
    const value = await get<string>(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await idbSet(name, value);
  },
  removeItem: async (name: string) => {
    await idbDel(name);
  },
};

interface LearningPlanState {
  plans: LearningPlan[];
  activePlanId: string | null;
  plan: LearningPlan | null;
  isGenerating: boolean;
  generationError: string | null;
  activeTechniqueId: string | null;
  activeTechniqueByPlan: Record<string, string | null>;
}

interface LearningPlanActions {
  setPlan: (plan: LearningPlan) => void;
  clearPlan: () => void;
  setActivePlan: (planId: string, showTransition?: boolean) => void;
  deletePlan: (planId: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  setActiveTechnique: (techniqueId: string | null) => void;
  updateTechniqueMastery: (techniqueId: string, state: MasteryState) => void;
  replaceTechnique: (oldTechniqueId: string, newTechnique: Technique) => void;
  decomposeTechnique: (techniqueId: string, microSteps: string[]) => void;
  addSubTechniques: (parentTechniqueId: string, subTechniques: Array<{
    name: string;
    description: string;
    whyItMatters: string;
    estimatedMinutes: number;
    youtubeQuery: string;
    quizQuestions?: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }>;
    practiceResource?: { name: string; url: string; description: string };
  }>) => void;
  updateDailyMinutes: (minutes: number) => void;
  regeneratePlan: (dailyMinutes: number) => Promise<void>;
  updateQuizScore: (techniqueId: string, score: number) => void;
  logPractice: (techniqueId: string, minutes: number) => void;
  getTechniqueById: (techniqueId: string) => Technique | undefined;
  getNextTechnique: () => Technique | undefined;
  getProgress: () => { completed: number; total: number; percentage: number };
  isTechniqueLocked: (techniqueId: string) => boolean;
}

type LearningPlanStore = LearningPlanState & LearningPlanActions;

export const useLearningPlanStore = create<LearningPlanStore>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlanId: null,
      plan: null,
      isGenerating: false,
      generationError: null,
      activeTechniqueId: null,
      activeTechniqueByPlan: {},

      setPlan: (incoming) => {
        const state = get();

        const planToStore: LearningPlan = {
          ...incoming,
          id: incoming.id || generateId(),
          createdAt: incoming.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        const nextPlans = [planToStore, ...state.plans];
        const nextActivePlanId = planToStore.id;
        const nextActiveTechniqueByPlan = {
          ...state.activeTechniqueByPlan,
          [nextActivePlanId]: null,
        };

        set({
          plans: nextPlans,
          activePlanId: nextActivePlanId,
          plan: planToStore,
          activeTechniqueId: null,
          activeTechniqueByPlan: nextActiveTechniqueByPlan,
          generationError: null,
        });
      },

      clearPlan: () => {
        const state = get();
        if (!state.activePlanId) {
          set({ plan: null, activeTechniqueId: null });
          return;
        }

        const remaining = state.plans.filter((p) => p.id !== state.activePlanId);
        const nextActivePlanId = remaining[0]?.id ?? null;
        const nextPlan = nextActivePlanId ? remaining.find((p) => p.id === nextActivePlanId) ?? null : null;
        const nextActiveTechniqueByPlan = { ...state.activeTechniqueByPlan };
        delete nextActiveTechniqueByPlan[state.activePlanId];
        const nextActiveTechniqueId = nextActivePlanId ? nextActiveTechniqueByPlan[nextActivePlanId] ?? null : null;

        set({
          plans: remaining,
          activePlanId: nextActivePlanId,
          plan: nextPlan,
          activeTechniqueId: nextActiveTechniqueId,
          activeTechniqueByPlan: nextActiveTechniqueByPlan,
        });
      },

      setActivePlan: (planId, showTransition = false) => {
        const state = get();
        if (state.activePlanId === planId) return;
        
        const uiState = useUIStore.getState();
        if (uiState.showHobbyTransition) {
          return;
        }
        
        const nextPlan = state.plans.find((p) => p.id === planId) ?? null;
        const nextActiveTechniqueId = state.activeTechniqueByPlan[planId] ?? null;
        
        if (showTransition && typeof window !== "undefined") {
          uiState.setShowHobbyTransition(true);
        }
        
        set({
          activePlanId: planId,
          plan: nextPlan,
          activeTechniqueId: nextActiveTechniqueId,
        });
      },

      deletePlan: (planId) => {
        const state = get();
        const remaining = state.plans.filter((p) => p.id !== planId);
        const nextActivePlanId =
          state.activePlanId === planId ? remaining[0]?.id ?? null : state.activePlanId;
        const nextPlan = nextActivePlanId ? remaining.find((p) => p.id === nextActivePlanId) ?? null : null;
        const nextActiveTechniqueByPlan = { ...state.activeTechniqueByPlan };
        delete nextActiveTechniqueByPlan[planId];
        const nextActiveTechniqueId = nextActivePlanId ? nextActiveTechniqueByPlan[nextActivePlanId] ?? null : null;

        set({
          plans: remaining,
          activePlanId: nextActivePlanId,
          plan: nextPlan,
          activeTechniqueId: nextActiveTechniqueId,
          activeTechniqueByPlan: nextActiveTechniqueByPlan,
        });
      },

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationError: (error) => set({ generationError: error }),

      setActiveTechnique: (techniqueId) => {
        const state = get();
        const planId = state.activePlanId;
        if (!planId) {
          set({ activeTechniqueId: techniqueId });
          return;
        }
        set({
          activeTechniqueId: techniqueId,
          activeTechniqueByPlan: { ...state.activeTechniqueByPlan, [planId]: techniqueId },
        });
      },

      updateTechniqueMastery: (techniqueId, masteryState) => {
        const { plan } = get();
        if (!plan) return;

        const updatedTechniques = plan.techniques.map((technique) =>
          technique.id === techniqueId
            ? { ...technique, masteryState }
            : technique
        );

        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const lastDate = plan.lastPracticeDate;
        
        let newStreak = plan.streakDays || 0;
        let newLastDate = plan.lastPracticeDate;
        
        if (masteryState === "mastered") {
          if (lastDate !== today) {
            if (lastDate === yesterday) {
              newStreak = newStreak + 1;
            } else if (!lastDate) {
              newStreak = 1;
            } else {
              newStreak = 1;
            }
            newLastDate = today;
          }
        }

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            streakDays: newStreak,
            lastPracticeDate: newLastDate,
            updatedAt: Date.now(),
          },
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  techniques: updatedTechniques,
                  streakDays: newStreak,
                  lastPracticeDate: newLastDate,
                  updatedAt: Date.now(),
                }
              : p
          ),
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
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  techniques: updatedTechniques,
                  updatedAt: Date.now(),
                }
              : p
          ),
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
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  techniques: updatedTechniques,
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      addSubTechniques: (parentTechniqueId, subTechniques) => {
        const { plan } = get();
        if (!plan) return;

        const parentIndex = plan.techniques.findIndex((t) => t.id === parentTechniqueId);
        if (parentIndex === -1) return;

        const parentTechnique = plan.techniques[parentIndex];
        const newTechniques = subTechniques.map((subTech) => ({
          id: generateId(),
          name: subTech.name,
          description: subTech.description,
          whyItMatters: subTech.whyItMatters,
          estimatedMinutes: subTech.estimatedMinutes,
          depthLevel: parentTechnique.depthLevel,
          masteryState: "unstarted" as const,
          resources: [],
          prerequisites: [],
          order: 0,
          youtubeQuery: subTech.youtubeQuery,
          quizQuestions: subTech.quizQuestions || [],
          practiceResource: subTech.practiceResource,
        }));

        const replaced = [
          ...plan.techniques.slice(0, parentIndex),
          ...newTechniques,
          ...plan.techniques.slice(parentIndex + 1),
        ];

        const updatedTechniques = replaced.map((tech, idx) => ({ ...tech, order: idx }));

        const currentActive = get().activeTechniqueId;
        const newActiveTechniqueId =
          currentActive === parentTechniqueId ? newTechniques[0]?.id ?? null : currentActive;

        set({
          activeTechniqueId: newActiveTechniqueId,
          plan: {
            ...plan,
            techniques: updatedTechniques,
            updatedAt: Date.now(),
          },
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  techniques: updatedTechniques,
                  updatedAt: Date.now(),
                }
              : p
          ),
          activeTechniqueByPlan: plan.id
            ? { ...get().activeTechniqueByPlan, [plan.id]: newActiveTechniqueId }
            : get().activeTechniqueByPlan,
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
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  dailyMinutes: minutes,
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      regeneratePlan: async (dailyMinutes) => {
        const { plan } = get();
        if (!plan) return;

        set({ isGenerating: true, generationError: null });

        try {
          const response = await fetch("/api/regenerate-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              hobby: plan.hobby,
              goal: plan.goal,
              dailyMinutes,
              preserveImage: true,
              existingImageUrl: plan.hobbyImageUrl,
              preserveStats: true,
              existingStats: {
                totalPracticeMinutes: plan.totalPracticeMinutes,
                streakDays: plan.streakDays,
                lastPracticeDate: plan.lastPracticeDate,
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to regenerate plan");
          }

          const regeneratedPlan = await response.json();
          
          set({
            plan: {
              ...regeneratedPlan,
              id: plan.id,
              createdAt: plan.createdAt,
            },
            plans: get().plans.map((p) =>
              p.id === plan.id
                ? {
                    ...regeneratedPlan,
                    id: plan.id,
                    createdAt: plan.createdAt,
                  }
                : p
            ),
            isGenerating: false,
            generationError: null,
            activeTechniqueId: null,
          });
        } catch (error) {
          set({
            isGenerating: false,
            generationError: error instanceof Error ? error.message : "Failed to regenerate plan",
          });
          throw error;
        }
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

        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const lastDate = plan.lastPracticeDate;
        
        let newStreak = plan.streakDays || 0;
        let newLastDate = plan.lastPracticeDate;
        
        if (score >= 60 && lastDate !== today) {
          if (lastDate === yesterday) {
            newStreak = newStreak + 1;
          } else if (!lastDate) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }
          newLastDate = today;
        }

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            streakDays: newStreak,
            lastPracticeDate: newLastDate,
            updatedAt: Date.now(),
          },
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  techniques: updatedTechniques,
                  streakDays: newStreak,
                  lastPracticeDate: newLastDate,
                  updatedAt: Date.now(),
                }
              : p
          ),
        });
      },

      logPractice: (techniqueId, minutes) => {
        const { plan } = get();
        if (!plan) return;

        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const lastDate = plan.lastPracticeDate;
        
        const updatedTechniques = plan.techniques.map((technique) =>
          technique.id === techniqueId
            ? { 
                ...technique, 
                practiceMinutes: (technique.practiceMinutes || 0) + minutes,
                lastPracticed: Date.now(),
              }
            : technique
        );

        let newStreak = plan.streakDays || 0;
        
        if (lastDate !== today) {
          if (lastDate === yesterday) {
            newStreak = newStreak + 1;
          } else if (!lastDate) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }
        }

        set({
          plan: {
            ...plan,
            techniques: updatedTechniques,
            totalPracticeMinutes: (plan.totalPracticeMinutes || 0) + minutes,
            streakDays: newStreak,
            lastPracticeDate: today,
            updatedAt: Date.now(),
          },
          plans: get().plans.map((p) =>
            p.id === plan.id
              ? {
                  ...plan,
                  techniques: updatedTechniques,
                  totalPracticeMinutes: (plan.totalPracticeMinutes || 0) + minutes,
                  streakDays: newStreak,
                  lastPracticeDate: today,
                  updatedAt: Date.now(),
                }
              : p
          ),
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

      isTechniqueLocked: (techniqueId) => {
        const { plan } = get();
        if (!plan) return true;

        const technique = plan.techniques.find((t) => t.id === techniqueId);
        if (!technique) return true;

        if (technique.order === 0) return false;

        const previousTechnique = plan.techniques.find(
          (t) => t.order === technique.order - 1
        );

        return previousTechnique?.masteryState !== "mastered";
      },
    }),
    {
      name: "sidequest-learning-plan",
      storage: createJSONStorage(() => indexedDbStringStorage),
      version: 2,
      migrate: (persisted: any) => {
        if (!persisted) return persisted;
        if (persisted?.plans) return persisted;
        const legacyPlan = persisted?.plan ?? null;
        if (!legacyPlan) {
          return {
            ...persisted,
            plans: [],
            activePlanId: null,
            plan: null,
            activeTechniqueByPlan: {},
          };
        }
        const planId = legacyPlan.id || generateId();
        const migratedPlan = {
          ...legacyPlan,
          id: planId,
          createdAt: legacyPlan.createdAt || Date.now(),
          updatedAt: Date.now(),
        };
        return {
          ...persisted,
          plans: [migratedPlan],
          activePlanId: planId,
          plan: migratedPlan,
          activeTechniqueByPlan: { [planId]: persisted.activeTechniqueId ?? null },
        };
      },
      partialize: (state) => ({
        plans: state.plans,
        activePlanId: state.activePlanId,
        activeTechniqueByPlan: state.activeTechniqueByPlan,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.activePlanId && state.plans.length > 0) {
          const activePlan = state.plans.find((p) => p.id === state.activePlanId);
          if (activePlan && !state.plan) {
            state.plan = activePlan;
            state.activeTechniqueId = state.activeTechniqueByPlan[state.activePlanId] ?? null;
          }
        } else if (!state.activePlanId) {
          state.plan = null;
          state.activeTechniqueId = null;
        }
      },
    }
  )
);

export const selectPlan = (state: LearningPlanStore) => state.plan;
export const selectIsGenerating = (state: LearningPlanStore) => state.isGenerating;
export const selectTechniques = (state: LearningPlanStore) =>
  state.plan?.techniques ?? [];
export const selectActiveTechniqueId = (state: LearningPlanStore) => state.activeTechniqueId;
