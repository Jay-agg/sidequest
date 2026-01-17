import { describe, it, expect, beforeEach } from "vitest";
import { useLearningPlanStore } from "@/stores/learningPlanStore";
import type { LearningPlan, Technique } from "@/types";

const createMockTechnique = (overrides: Partial<Technique> = {}): Technique => ({
  id: `technique-${Math.random().toString(36).substring(7)}`,
  name: "Test Technique",
  description: "A test technique description",
  whyItMatters: "This technique matters because...",
  estimatedMinutes: 30,
  depthLevel: "intermediate",
  masteryState: "unstarted",
  resources: [],
  prerequisites: [],
  order: 0,
  ...overrides,
});

const createMockPlan = (overrides: Partial<LearningPlan> = {}): LearningPlan => ({
  id: "test-plan-1",
  hobby: "Guitar",
  goal: "Play songs at campfires",
  dailyMinutes: 30,
  techniques: [
    createMockTechnique({ id: "tech-1", order: 0 }),
    createMockTechnique({ id: "tech-2", order: 1 }),
    createMockTechnique({ id: "tech-3", order: 2 }),
    createMockTechnique({ id: "tech-4", order: 3 }),
    createMockTechnique({ id: "tech-5", order: 4 }),
  ],
  reasoning: "Test reasoning",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

describe("LearningPlanStore", () => {
  beforeEach(() => {
    useLearningPlanStore.setState({
      plan: null,
      isGenerating: false,
      generationError: null,
    });
  });

  describe("setPlan", () => {
    it("should set a new learning plan", () => {
      const store = useLearningPlanStore.getState();
      const mockPlan = createMockPlan();

      store.setPlan(mockPlan);

      expect(useLearningPlanStore.getState().plan).toEqual(mockPlan);
    });

    it("should clear any generation error when setting a plan", () => {
      useLearningPlanStore.setState({ generationError: "Previous error" });
      const store = useLearningPlanStore.getState();
      const mockPlan = createMockPlan();

      store.setPlan(mockPlan);

      expect(useLearningPlanStore.getState().generationError).toBeNull();
    });
  });

  describe("clearPlan", () => {
    it("should clear the learning plan", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      useLearningPlanStore.getState().clearPlan();

      expect(useLearningPlanStore.getState().plan).toBeNull();
    });
  });

  describe("updateTechniqueMastery", () => {
    it("should update a technique's mastery state", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      useLearningPlanStore.getState().updateTechniqueMastery("tech-1", "learning");

      const updatedPlan = useLearningPlanStore.getState().plan;
      const technique = updatedPlan?.techniques.find((t) => t.id === "tech-1");
      expect(technique?.masteryState).toBe("learning");
    });

    it("should update the plan's updatedAt timestamp", async () => {
      const mockPlan = createMockPlan({ updatedAt: Date.now() - 1000 });
      const originalUpdatedAt = mockPlan.updatedAt;
      useLearningPlanStore.setState({ plan: mockPlan });

      useLearningPlanStore.getState().updateTechniqueMastery("tech-1", "learning");

      const updatedPlan = useLearningPlanStore.getState().plan;
      expect(updatedPlan?.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    });

    it("should not modify other techniques", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      useLearningPlanStore.getState().updateTechniqueMastery("tech-1", "mastered");

      const updatedPlan = useLearningPlanStore.getState().plan;
      const otherTechnique = updatedPlan?.techniques.find((t) => t.id === "tech-2");
      expect(otherTechnique?.masteryState).toBe("unstarted");
    });
  });

  describe("replaceTechnique", () => {
    it("should replace a technique with a new one", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      const newTechnique = createMockTechnique({
        name: "Replacement Technique",
        description: "A replacement",
      });

      useLearningPlanStore.getState().replaceTechnique("tech-2", newTechnique);

      const updatedPlan = useLearningPlanStore.getState().plan;
      expect(updatedPlan?.techniques.length).toBe(5);

      const replaced = updatedPlan?.techniques.find((t) => t.order === 1);
      expect(replaced?.name).toBe("Replacement Technique");
      expect(replaced?.masteryState).toBe("unstarted");
    });

    it("should preserve the order of the replaced technique", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      const newTechnique = createMockTechnique({ name: "New Replacement Technique", order: 99 });

      useLearningPlanStore.getState().replaceTechnique("tech-3", newTechnique);

      const updatedPlan = useLearningPlanStore.getState().plan;
      const replaced = updatedPlan?.techniques.find((t) => t.order === 2);
      expect(replaced).toBeDefined();
      expect(replaced?.name).toBe("New Replacement Technique");
    });
  });

  describe("decomposeTechnique", () => {
    it("should add micro steps to a technique", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      const microSteps = ["Step 1", "Step 2", "Step 3"];
      useLearningPlanStore.getState().decomposeTechnique("tech-1", microSteps);

      const updatedPlan = useLearningPlanStore.getState().plan;
      const technique = updatedPlan?.techniques.find((t) => t.id === "tech-1");
      expect(technique?.microSteps).toEqual(microSteps);
    });
  });

  describe("updateDailyMinutes", () => {
    it("should update the daily minutes commitment", () => {
      const mockPlan = createMockPlan({ dailyMinutes: 30 });
      useLearningPlanStore.setState({ plan: mockPlan });

      useLearningPlanStore.getState().updateDailyMinutes(45);

      expect(useLearningPlanStore.getState().plan?.dailyMinutes).toBe(45);
    });
  });

  describe("getTechniqueById", () => {
    it("should return the correct technique", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      const technique = useLearningPlanStore.getState().getTechniqueById("tech-3");

      expect(technique?.id).toBe("tech-3");
    });

    it("should return undefined for non-existent technique", () => {
      const mockPlan = createMockPlan();
      useLearningPlanStore.setState({ plan: mockPlan });

      const technique = useLearningPlanStore.getState().getTechniqueById("non-existent");

      expect(technique).toBeUndefined();
    });
  });

  describe("getNextTechnique", () => {
    it("should return the first unmastered technique by order", () => {
      const mockPlan = createMockPlan();
      mockPlan.techniques[0].masteryState = "mastered";
      mockPlan.techniques[1].masteryState = "mastered";
      useLearningPlanStore.setState({ plan: mockPlan });

      const next = useLearningPlanStore.getState().getNextTechnique();

      expect(next?.id).toBe("tech-3");
    });

    it("should return undefined when all techniques are mastered", () => {
      const mockPlan = createMockPlan();
      mockPlan.techniques.forEach((t) => {
        t.masteryState = "mastered";
      });
      useLearningPlanStore.setState({ plan: mockPlan });

      const next = useLearningPlanStore.getState().getNextTechnique();

      expect(next).toBeUndefined();
    });
  });

  describe("getProgress", () => {
    it("should calculate progress correctly", () => {
      const mockPlan = createMockPlan();
      mockPlan.techniques[0].masteryState = "mastered";
      mockPlan.techniques[1].masteryState = "mastered";
      useLearningPlanStore.setState({ plan: mockPlan });

      const progress = useLearningPlanStore.getState().getProgress();

      expect(progress.completed).toBe(2);
      expect(progress.total).toBe(5);
      expect(progress.percentage).toBe(40);
    });

    it("should return zeros when no plan exists", () => {
      const progress = useLearningPlanStore.getState().getProgress();

      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(0);
      expect(progress.percentage).toBe(0);
    });
  });
});
