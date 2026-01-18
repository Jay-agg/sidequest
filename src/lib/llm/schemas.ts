import { z } from "zod";

export const ArchitectResponseSchema = z.object({
  hobby: z.string(),
  isTimerUseful: z.boolean(),
  timerRationale: z.string(),
  freeResourcesUrl: z.string().optional(),
  freeResourcesDescription: z.string().optional(),
  motivationalQuotes: z.array(z.string()).min(5).max(8),
  techniques: z.array(
    z.object({
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
      difficulty: z.number(),
      youtubeQuery: z.string().optional(),
      quizQuestions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()).min(2).max(4),
          correctIndex: z.number().min(0).max(3),
        })
      ).optional(),
      practiceResource: z.object({
        name: z.string(),
        url: z.string(),
        description: z.string(),
      }).optional(),
    })
  ),
  categoryBreakdown: z.record(z.string(), z.array(z.string())),
});

export const FilterResponseSchema = z.object({
  selectedTechniqueIds: z.array(z.string()),
  reasoning: z.string(),
  timeAllocation: z.string(),
  progressionPath: z.string(),
});

export const ResearcherResponseSchema = z.object({
  resources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      type: z.enum(["article", "video", "interactive", "documentation"]),
      estimatedMinutes: z.number(),
      description: z.string(),
    })
  ),
});

export const DecompositionResponseSchema = z.object({
  subTechniques: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      whyItMatters: z.string(),
      estimatedMinutes: z.number(),
      youtubeQuery: z.string(),
      practiceResource: z.object({
        name: z.string(),
        url: z.string(),
        description: z.string(),
      }).optional(),
    })
  ).min(2).max(4),
  reasoning: z.string(),
});

export const QuizGeneratorResponseSchema = z.object({
  quizQuestions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
      explanation: z.string().optional(),
    })
  ).min(3).max(5),
});

export const ReplacementSuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      techniqueId: z.string(),
      reason: z.string(),
      comparisonToOriginal: z.string(),
    })
  ),
});
