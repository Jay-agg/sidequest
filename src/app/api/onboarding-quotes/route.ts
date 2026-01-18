import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateOnboardingQuotes } from "@/lib/llm/pipeline";

const RequestSchema = z.object({
  hobby: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hobby } = RequestSchema.parse(body);

    const quotes = await generateOnboardingQuotes(hobby);

    return NextResponse.json({ quotes });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error generating onboarding quotes:", error);
    return NextResponse.json(
      { error: "Failed to generate quotes" },
      { status: 500 }
    );
  }
}
