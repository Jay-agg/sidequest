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
    quizQuestions?: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }>;
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

  const subTechniquesWithQuizzes = await Promise.all(
    validated.subTechniques.map(async (subTechnique) => {
      let quizQuestions;
      try {
        quizQuestions = await runQuizGeneratorStage(
          subTechnique.name,
          subTechnique.description,
          subTechnique.whyItMatters
        );
      } catch (error) {
        console.warn(`Failed to generate quiz for sub-technique ${subTechnique.name}`);
        quizQuestions = undefined;
      }
      
      return {
        ...subTechnique,
        quizQuestions,
      };
    })
  );

  return {
    subTechniques: subTechniquesWithQuizzes,
    reasoning: validated.reasoning,
  };
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
        youtubeQuery: technique.youtubeQuery || `how to ${technique.name.toLowerCase()} ${hobby.toLowerCase()} tutorial for beginners`,
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

export async function runTeachBackAnalysisStage(
  techniqueName: string,
  techniqueDescription: string,
  userExplanation: string
): Promise<{
  score: number;
  strengths: string[];
  improvements: string[];
  overall: string;
}> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are an expert educator and mentor analyzing a student's explanation using the "teach-back" method.

The teach-back method is a powerful learning technique where students explain concepts in their own words to demonstrate understanding.

Your role is to:
1. Assess the depth and accuracy of their understanding
2. Identify what they explained particularly well
3. Point out missing concepts, misconceptions, or areas needing clarification
4. Provide encouraging, actionable feedback that motivates continued learning

Be specific, constructive, and supportive. Remember that teaching back is a learning process, not a test.`;

  const userPrompt = `The student is learning: ${techniqueName}

Official description: ${techniqueDescription}

Here is the student's teach-back explanation:
"${userExplanation}"

Analyze their explanation thoroughly and provide detailed feedback:

1. SCORE (1-10):
   - 1-3: Minimal understanding, significant gaps
   - 4-5: Basic grasp but major concepts missing
   - 6-7: Good understanding with some gaps
   - 8-9: Strong understanding, minor improvements possible
   - 10: Expert-level explanation

2. STRENGTHS (2-4 specific points):
   What concepts did they explain well? What teaching techniques did they use effectively?
   Be specific about what worked in their explanation.

3. AREAS TO ENHANCE (2-4 specific points):
   What key concepts are missing? What could be clarified or expanded?
   What analogies or examples could help? Be constructive and specific.

4. OVERALL ASSESSMENT (2-3 sentences):
   Give encouraging feedback that acknowledges their effort, highlights their progress,
   and motivates them to deepen their understanding.

Respond ONLY in valid JSON format:
{
  "score": <number between 1-10>,
  "strengths": ["specific strength 1", "specific strength 2", ...],
  "improvements": ["specific improvement 1", "specific improvement 2", ...],
  "overall": "encouraging overall assessment"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const feedback = JSON.parse(content);
  
  return {
    score: feedback.score || 5,
    strengths: feedback.strengths || [],
    improvements: feedback.improvements || [],
    overall: feedback.overall || "Good effort! Keep practicing to deepen your understanding.",
  };
}

export async function generateOnboardingQuotes(
  hobby: string
): Promise<string[]> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a motivational coach who generates inspiring, short quotes to encourage people while their learning plan is being created.`;

  const userPrompt = `Generate 5 short, inspiring quotes (max 15 words each) for someone who is about to start learning ${hobby}. 

Make them:
- Encouraging and positive
- Specific to ${hobby}
- Action-oriented
- Varied in tone (some playful, some profound)

Return as JSON:
{
  "quotes": ["quote 1", "quote 2", ...]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content);
  return parsed.quotes || [];
}

export async function generateHobbyGradient(
  hobby: string
): Promise<{ colors: string[]; animation: string }> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a design expert who creates beautiful color gradients based on activities and hobbies.`;

  const userPrompt = `Generate a beautiful gradient color palette for ${hobby}.

Choose 3-4 colors that:
- Represent the essence and mood of ${hobby}
- Work well together in a gradient
- Are vibrant but not overwhelming
- Use hex color codes

Also suggest an animation style (smooth, wave, pulse, or radial).

Return as JSON:
{
  "colors": ["#hex1", "#hex2", "#hex3"],
  "animation": "smooth"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return {
      colors: ["#6366f1", "#8b5cf6", "#d946ef"],
      animation: "smooth",
    };
  }

  const parsed = JSON.parse(content);
  return {
    colors: parsed.colors || ["#6366f1", "#8b5cf6", "#d946ef"],
    animation: parsed.animation || "smooth",
  };
}
