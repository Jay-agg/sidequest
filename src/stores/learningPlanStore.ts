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

      addSubTechniques: (parentTechniqueId, subTechniques) => {
        const { plan } = get();
        if (!plan) return;

        const parentIndex = plan.techniques.findIndex((t) => t.id === parentTechniqueId);
        if (parentIndex === -1) return;

        const parentTechnique = plan.techniques[parentIndex];
        const insertPosition = parentIndex + 1;

        const newTechniques = subTechniques.map((subTech, index) => ({
          id: generateId(),
          name: subTech.name,
          description: subTech.description,
          whyItMatters: subTech.whyItMatters,
          estimatedMinutes: subTech.estimatedMinutes,
          depthLevel: parentTechnique.depthLevel,
          masteryState: "unstarted" as const,
          resources: [],
          prerequisites: index === 0 ? [parentTechniqueId] : [subTechniques[index - 1].name],
          order: parentTechnique.order + 0.1 + (index * 0.01),
          youtubeQuery: subTech.youtubeQuery,
          quizQuestions: subTech.quizQuestions || [],
          practiceResource: subTech.practiceResource,
        }));

        const updatedTechniques = [
          ...plan.techniques.slice(0, insertPosition),
          ...newTechniques,
          ...plan.techniques.slice(insertPosition),
        ].map((tech, idx) => ({
          ...tech,
          order: idx,
        }));

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

        // First technique is always unlocked
        if (technique.order === 0) return false;

        // Find the previous technique
        const previousTechnique = plan.techniques.find(
          (t) => t.order === technique.order - 1
        );

        // Technique is locked if previous technique is not mastered
        return previousTechnique?.masteryState !== "mastered";
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
