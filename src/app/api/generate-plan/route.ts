import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateLearningPlan } from "@/lib/llm";

const RequestSchema = z.object({
  hobby: z.string().min(1).max(100),
  goal: z.string().min(1).max(500),
  dailyMinutes: z.number().min(10).max(60),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    const plan = await generateLearningPlan(
      validated.hobby,
      validated.goal,
      validated.dailyMinutes
    );

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error generating plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate learning plan" },
      { status: 500 }
    );
  }
}
