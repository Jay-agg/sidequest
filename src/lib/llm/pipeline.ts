import OpenAI from "openai";
import type { LearningPlan, Technique, GeneratedTechnique, Resource } from "@/types";
import { generateId } from "@/lib/utils";
import {
  ArchitectResponseSchema,
  FilterResponseSchema,
  ResearcherResponseSchema,
  DecompositionResponseSchema,
} from "./schemas";
import {
  ARCHITECT_SYSTEM_PROMPT,
  FILTER_SYSTEM_PROMPT,
  RESEARCHER_SYSTEM_PROMPT,
  DECOMPOSITION_SYSTEM_PROMPT,
  createArchitectPrompt,
  createFilterPrompt,
  createResearcherPrompt,
  createDecompositionPrompt,
} from "./prompts";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function runArchitectStage(
  hobby: string,
  goal: string
): Promise<GeneratedTechnique[]> {
  const prompt = createArchitectPrompt(hobby, goal);
  const response = await callLLM(ARCHITECT_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = ArchitectResponseSchema.parse(parsed);

  return validated.techniques;
}

export async function runFilterStage(
  hobby: string,
  goal: string,
  dailyMinutes: number,
  techniques: GeneratedTechnique[]
): Promise<{
  selectedTechniques: GeneratedTechnique[];
  reasoning: string;
  progressionPath: string;
}> {
  const techniquesJson = JSON.stringify(techniques, null, 2);
  const prompt = createFilterPrompt(hobby, goal, dailyMinutes, techniquesJson);
  const response = await callLLM(FILTER_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = FilterResponseSchema.parse(parsed);

  const selectedTechniques = validated.selectedTechniqueIds
    .map((id) => techniques.find((t) => t.id === id))
    .filter((t): t is GeneratedTechnique => t !== undefined);

  return {
    selectedTechniques,
    reasoning: validated.reasoning,
    progressionPath: validated.progressionPath,
  };
}

export async function runResearcherStage(
  technique: GeneratedTechnique
): Promise<Resource[]> {
  const prompt = createResearcherPrompt(technique.name, technique.description);
  const response = await callLLM(RESEARCHER_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = ResearcherResponseSchema.parse(parsed);

  return validated.resources.slice(0, 2);
}

export async function runDecompositionStage(
  technique: Technique
): Promise<string[]> {
  const prompt = createDecompositionPrompt(technique.name, technique.description);
  const response = await callLLM(DECOMPOSITION_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = DecompositionResponseSchema.parse(parsed);

  return validated.microSteps;
}

export async function generateLearningPlan(
  hobby: string,
  goal: string,
  dailyMinutes: number
): Promise<LearningPlan> {
  const allTechniques = await runArchitectStage(hobby, goal);

  const { selectedTechniques, reasoning, progressionPath } = await runFilterStage(
    hobby,
    goal,
    dailyMinutes,
    allTechniques
  );

  const techniquesWithResources = await Promise.all(
    selectedTechniques.map(async (technique, index) => {
      const resources = await runResearcherStage(technique);

      const depthLevel =
        dailyMinutes <= 20
          ? "basic"
          : dailyMinutes <= 40
          ? "intermediate"
          : "deep";

      const techWithResources: Technique = {
        id: generateId(),
        name: technique.name,
        description: technique.description,
        whyItMatters: technique.whyItMatters,
        estimatedMinutes: technique.depthLevels[depthLevel].estimatedMinutes,
        depthLevel,
        masteryState: "unstarted",
        resources,
        prerequisites: technique.prerequisites,
        order: index,
      };

      return techWithResources;
    })
  );

  const plan: LearningPlan = {
    id: generateId(),
    hobby,
    goal,
    dailyMinutes,
    techniques: techniquesWithResources,
    reasoning: `${reasoning}\n\nProgression: ${progressionPath}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return plan;
}
