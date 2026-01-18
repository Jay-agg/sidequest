import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runTeachBackAnalysisStage } from "@/lib/llm/pipeline";

const RequestSchema = z.object({
  techniqueName: z.string().min(1, "Technique name is required"),
  techniqueDescription: z.string().min(1, "Technique description is required"),
  userExplanation: z.string().min(30, "Explanation must be at least 30 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    const wordCount = validatedData.userExplanation.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 30) {
      return NextResponse.json(
        { error: "Your explanation is too short. Please provide at least 30 words to get meaningful feedback." },
        { status: 400 }
      );
    }

    const feedback = await runTeachBackAnalysisStage(
      validatedData.techniqueName,
      validatedData.techniqueDescription,
      validatedData.userExplanation
    );

    if (!feedback || typeof feedback.score !== "number") {
      throw new Error("Invalid feedback received from AI");
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Please check your input", 
          details: error.issues.map(issue => issue.message).join(", ")
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze your explanation. Please try again in a moment." },
      { status: 500 }
    );
  }
}
