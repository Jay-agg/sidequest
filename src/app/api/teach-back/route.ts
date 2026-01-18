import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runTeachBackAnalysisStage } from "@/lib/llm/pipeline";

const RequestSchema = z.object({
  techniqueName: z.string(),
  techniqueDescription: z.string(),
  userExplanation: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { techniqueName, techniqueDescription, userExplanation } = RequestSchema.parse(body);

    const feedback = await runTeachBackAnalysisStage(
      techniqueName,
      techniqueDescription,
      userExplanation
    );

    return NextResponse.json({ feedback });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error analyzing teach-back:", error);
    return NextResponse.json(
      { error: "Failed to analyze explanation" },
      { status: 500 }
    );
  }
}
