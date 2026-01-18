import OpenAI from "openai";
import { z } from "zod";
import type { LearningPlan, Technique, GeneratedTechnique, Resource, DepthLevel } from "@/types";
import { generateId } from "@/lib/utils";
import {
  ArchitectResponseSchema,
  FilterResponseSchema,
  ResearcherResponseSchema,
  DecompositionResponseSchema,
  QuizGeneratorResponseSchema,
} from "./schemas";
import {
  ARCHITECT_SYSTEM_PROMPT,
  FILTER_SYSTEM_PROMPT,
  RESEARCHER_SYSTEM_PROMPT,
  DECOMPOSITION_SYSTEM_PROMPT,
  QUIZ_GENERATOR_SYSTEM_PROMPT,
  createArchitectPrompt,
  createFilterPrompt,
  createResearcherPrompt,
  createDecompositionPrompt,
  createQuizPrompt,
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
): Promise<z.infer<typeof ArchitectResponseSchema>> {
  const prompt = createArchitectPrompt(hobby, goal);
  const response = await callLLM(ARCHITECT_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = ArchitectResponseSchema.parse(parsed);

  return validated;
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
  technique: Technique,
  hobby: string
): Promise<{
  subTechniques: Array<{
    name: string;
    description: string;
    whyItMatters: string;
    estimatedMinutes: number;
    youtubeQuery: string;
    practiceResource?: {
      name: string;
      url: string;
      description: string;
    };
  }>;
  reasoning: string;
}> {
  const prompt = createDecompositionPrompt(
    technique.name,
    technique.description,
    technique.whyItMatters,
    hobby
  );
  const response = await callLLM(DECOMPOSITION_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = DecompositionResponseSchema.parse(parsed);

  return validated;
}

export async function runQuizGeneratorStage(
  techniqueName: string,
  techniqueDescription: string,
  whyItMatters: string
): Promise<Array<{ question: string; options: string[]; correctIndex: number; explanation?: string }>> {
  const prompt = createQuizPrompt(techniqueName, techniqueDescription, whyItMatters);
  const response = await callLLM(QUIZ_GENERATOR_SYSTEM_PROMPT, prompt);

  const parsed = JSON.parse(response);
  const validated = QuizGeneratorResponseSchema.parse(parsed);

  return validated.quizQuestions;
}

export async function generateHobbyImage(hobby: string): Promise<string | undefined> {
  try {
    const client = getOpenAIClient();
    const imagePrompt = `A tasteful, surrealist editorial illustration representing ${hobby}. Style: soft pastel colors, rounded forms, dreamlike atmosphere, subtle textures, clean lines, no harsh shadows, no text, abstract and symbolic elements. The image should be calming and visually appealing.`;
    
    console.log(`🎨 Generating hobby image for: ${hobby}`);
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      console.warn(`⚠️ No image URL returned from DALL-E`);
      return undefined;
    }

    console.log(`📥 Downloading image and converting to base64...`);
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    // Convert to base64
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log(`✅ Image converted to base64 (${(base64.length / 1024).toFixed(1)}KB)`);
    return dataUrl;
  } catch (error) {
    console.warn(`⚠️ Failed to generate hobby image for ${hobby}:`, error);
    return undefined;
  }
}

export async function generateLearningPlan(
  hobby: string,
  goal: string,
  dailyMinutes: number
): Promise<LearningPlan> {
  const architectResponse = await runArchitectStage(hobby, goal);

  const { selectedTechniques, reasoning, progressionPath } = await runFilterStage(
    hobby,
    goal,
    dailyMinutes,
    architectResponse.techniques
  );

  const depthLevel: DepthLevel =
    dailyMinutes <= 20
      ? "basic"
      : dailyMinutes <= 40
      ? "intermediate"
      : "deep";

  const techniquesWithQuizzes = await Promise.all(
    selectedTechniques.map(async (technique, index) => {
      let quizQuestions;
      try {
        quizQuestions = await runQuizGeneratorStage(
          technique.name,
          technique.description,
          technique.whyItMatters
        );
      } catch (error) {
        console.warn(`Failed to generate quiz for ${technique.name}, using fallback`);
        quizQuestions = undefined;
      }

      return {
        id: generateId(),
        name: technique.name,
        description: technique.description,
        whyItMatters: technique.whyItMatters,
        estimatedMinutes: technique.depthLevels[depthLevel].estimatedMinutes,
        depthLevel,
        masteryState: "unstarted" as const,
        resources: [],
        prerequisites: technique.prerequisites,
        order: index,
        youtubeQuery: technique.youtubeQuery || `${technique.name} ${hobby} tutorial beginner`,
        quizQuestions,
        practiceResource: technique.practiceResource,
      };
    })
  );

  const hobbyImageUrl = await generateHobbyImage(hobby);

  const plan: LearningPlan = {
    id: generateId(),
    hobby,
    goal,
    dailyMinutes,
    techniques: techniquesWithQuizzes,
    reasoning: `${reasoning}\n\nProgression: ${progressionPath}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isTimerUseful: architectResponse.isTimerUseful,
    timerRationale: architectResponse.timerRationale,
    freeResourcesUrl: architectResponse.freeResourcesUrl,
    freeResourcesDescription: architectResponse.freeResourcesDescription,
    hobbyImageUrl,
    motivationalQuotes: architectResponse.motivationalQuotes,
  };

  return plan;
}
