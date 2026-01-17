import { z } from "zod";

export const ArchitectResponseSchema = z.object({
  hobby: z.string(),
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
  microSteps: z.array(z.string()),
  simplifiedApproach: z.string(),
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
