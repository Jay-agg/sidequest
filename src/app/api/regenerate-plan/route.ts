import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateLearningPlan } from "@/lib/llm";
import { searchYouTubeVideos } from "@/lib/youtube";
import { generateId } from "@/lib/utils";
import type { LearningPlan, Resource } from "@/types";

const RequestSchema = z.object({
  hobby: z.string().min(1).max(100),
  goal: z.string().min(1).max(500),
  dailyMinutes: z.number().min(10).max(60),
  preserveImage: z.boolean().optional(),
  existingImageUrl: z.string().optional(),
  preserveStats: z.boolean().optional(),
  existingStats: z.object({
    totalPracticeMinutes: z.number().optional(),
    streakDays: z.number().optional(),
    lastPracticeDate: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  let validated: z.infer<typeof RequestSchema>;
  
  try {
    const body = await request.json();
    validated = RequestSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validation error:", error.issues);
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("❌ Error parsing request body:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not set");
    return NextResponse.json(
      { 
        error: "AI service is not configured",
        message: "Please set OPENAI_API_KEY environment variable to enable AI-powered learning plans."
      },
      { status: 500 }
    );
  }

  if (!process.env.YOUTUBE_API_KEY) {
    console.warn("⚠️ YOUTUBE_API_KEY not set - video resources will be unavailable");
  }

  try {
    console.log(`🔄 Regenerating AI-powered plan for: ${validated.hobby} with ${validated.dailyMinutes} min/day`);
    
    const plan = await generateLearningPlan(
      validated.hobby,
      validated.goal,
      validated.dailyMinutes
    );

    console.log(`✅ AI plan regenerated with ${plan.techniques.length} techniques`);

    const enrichedTechniques = await Promise.all(
      plan.techniques.map(async (technique) => {
        const videos = await searchYouTubeVideos(
          technique.youtubeQuery || `${technique.name} ${validated.hobby} tutorial beginner`,
          2
        );
        
        const resources: Resource[] = videos.map((video) => ({
          id: generateId(),
          title: video.title,
          url: video.embedUrl,
          type: "video" as const,
          estimatedMinutes: parseInt(video.duration.split(":")[0]) || 10,
          description: `${video.channelTitle} - ${video.viewCount}`,
        }));

        if (videos.length === 0) {
          console.warn(`⚠️ No YouTube videos found for: ${technique.name}`);
        }

        if (!technique.quizQuestions || technique.quizQuestions.length === 0) {
          console.warn(`⚠️ No quiz questions for: ${technique.name}`);
        }

        return {
          ...technique,
          resources,
          quizQuestions: technique.quizQuestions || [],
        };
      })
    );

    const enrichedPlan: LearningPlan = {
      ...plan,
      techniques: enrichedTechniques,
      hobbyImageUrl: validated.preserveImage && validated.existingImageUrl 
        ? validated.existingImageUrl 
        : plan.hobbyImageUrl,
      totalPracticeMinutes: validated.preserveStats && validated.existingStats?.totalPracticeMinutes !== undefined
        ? validated.existingStats.totalPracticeMinutes
        : 0,
      streakDays: validated.preserveStats && validated.existingStats?.streakDays !== undefined
        ? validated.existingStats.streakDays
        : 0,
      lastPracticeDate: validated.preserveStats && validated.existingStats?.lastPracticeDate
        ? validated.existingStats.lastPracticeDate
        : undefined,
    };

    console.log(`✅ Plan regeneration complete:`, {
      techniques: enrichedTechniques.length,
      withVideos: enrichedTechniques.filter(t => t.resources.length > 0).length,
      withQuizzes: enrichedTechniques.filter(t => t.quizQuestions && t.quizQuestions.length > 0).length,
      hasImage: !!enrichedPlan.hobbyImageUrl,
      imagePreserved: validated.preserveImage && !!validated.existingImageUrl,
    });

    return NextResponse.json(enrichedPlan);
  } catch (error) {
    console.error("❌ Error regenerating plan:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorType = error instanceof Error ? error.constructor.name : "Error";
    
    return NextResponse.json(
      { 
        error: "Failed to regenerate learning plan",
        message: "The AI service encountered an error. Please try again or check your API configuration.",
        details: {
          type: errorType,
          message: errorMessage,
        }
      },
      { status: 500 }
    );
  }
}
