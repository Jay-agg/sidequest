import { z } from "zod";

export const MasteryStateSchema = z.enum([
  "unstarted",
  "learning",
  "practicing",
  "mastered",
]);

export type MasteryState = z.infer<typeof MasteryStateSchema>;

export const DepthLevelSchema = z.enum(["basic", "intermediate", "deep"]);

export type DepthLevel = z.infer<typeof DepthLevelSchema>;

export const ResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  type: z.enum(["article", "video", "interactive", "documentation"]),
  estimatedMinutes: z.number().min(1).max(60),
  description: z.string(),
});

export type Resource = z.infer<typeof ResourceSchema>;

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2).max(4),
  correctIndex: z.number().min(0).max(3),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const PracticeResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string(),
});

export type PracticeResource = z.infer<typeof PracticeResourceSchema>;

export const TechniqueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  estimatedMinutes: z.number().min(5).max(120),
  depthLevel: DepthLevelSchema,
  masteryState: MasteryStateSchema,
  resources: z.array(ResourceSchema).max(2),
  prerequisites: z.array(z.string()).default([]),
  microSteps: z.array(z.string()).optional(),
  order: z.number(),
  youtubeQuery: z.string().optional(),
  quizQuestions: z.array(QuizQuestionSchema).optional(),
  quizScore: z.number().optional(),
  quizCompleted: z.boolean().optional(),
  practiceMinutes: z.number().optional(),
  lastPracticed: z.number().optional(),
  practiceResource: PracticeResourceSchema.optional(),
});

export type Technique = z.infer<typeof TechniqueSchema>;

export const LearningPlanSchema = z.object({
  id: z.string(),
  hobby: z.string(),
  goal: z.string(),
  dailyMinutes: z.number().min(10).max(60),
  techniques: z.array(TechniqueSchema).min(5).max(8),
  reasoning: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  totalPracticeMinutes: z.number().optional(),
  streakDays: z.number().optional(),
  lastPracticeDate: z.string().optional(),
  isTimerUseful: z.boolean().optional(),
  timerRationale: z.string().optional(),
  freeResourcesUrl: z.string().optional(),
  freeResourcesDescription: z.string().optional(),
  hobbyImageUrl: z.string().optional(),
  motivationalQuotes: z.array(z.string()).optional(),
});

export type LearningPlan = z.infer<typeof LearningPlanSchema>;

export const GeneratedTechniqueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  whyItMatters: z.string(),
  estimatedMinutes: z.number(),
  depthLevels: z.object({
    basic: z.object({
      estimatedMinutes: z.number(),
      focus: z.string(),
    }),
    intermediate: z.object({
      estimatedMinutes: z.number(),
      focus: z.string(),
    }),
    deep: z.object({
      estimatedMinutes: z.number(),
      focus: z.string(),
    }),
  }),
  prerequisites: z.array(z.string()),
  difficulty: z.number().min(1).max(10),
  youtubeQuery: z.string().optional(),
  quizQuestions: z.array(QuizQuestionSchema).optional(),
  practiceResource: PracticeResourceSchema.optional(),
});

export type GeneratedTechnique = z.infer<typeof GeneratedTechniqueSchema>;

export const ArchitectOutputSchema = z.object({
  hobby: z.string(),
  techniques: z.array(GeneratedTechniqueSchema).min(15).max(25),
  categoryBreakdown: z.record(z.string(), z.array(z.string())),
});

export type ArchitectOutput = z.infer<typeof ArchitectOutputSchema>;

export const FilterOutputSchema = z.object({
  selectedTechniques: z.array(GeneratedTechniqueSchema).min(5).max(8),
  reasoning: z.string(),
  timeAllocation: z.string(),
  progressionPath: z.string(),
});

export type FilterOutput = z.infer<typeof FilterOutputSchema>;

export const ResearcherOutputSchema = z.object({
  techniqueId: z.string(),
  resources: z.array(ResourceSchema).max(2),
});

export type ResearcherOutput = z.infer<typeof ResearcherOutputSchema>;

export const SyncActionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "update_mastery",
    "replace_technique",
    "decompose_technique",
    "update_daily_minutes",
    "create_plan",
  ]),
  payload: z.unknown(),
  timestamp: z.number(),
  synced: z.boolean(),
});

export type SyncAction = z.infer<typeof SyncActionSchema>;

export const UserPreferencesSchema = z.object({
  dailyMinutes: z.number().min(10).max(60),
  preferredDepth: DepthLevelSchema,
  sessionWarningMinutes: z.number().default(30),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
