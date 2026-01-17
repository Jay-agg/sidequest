import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runDecompositionStage } from "@/lib/llm";
import type { Technique } from "@/types";

const RequestSchema = z.object({
  technique: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    whyItMatters: z.string(),
    estimatedMinutes: z.number(),
    depthLevel: z.enum(["basic", "intermediate", "deep"]),
    masteryState: z.enum(["unstarted", "learning", "practicing", "mastered"]),
    resources: z.array(z.any()),
    prerequisites: z.array(z.string()),
    order: z.number(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    const microSteps = await runDecompositionStage(validated.technique as Technique);

    return NextResponse.json({ success: true, microSteps });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error decomposing technique:", error);
    return NextResponse.json(
      { success: false, error: "Failed to decompose technique" },
      { status: 500 }
    );
  }
}
