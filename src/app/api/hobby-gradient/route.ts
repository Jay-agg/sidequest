import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateHobbyGradient } from "@/lib/llm/pipeline";

const RequestSchema = z.object({
  hobby: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hobby } = RequestSchema.parse(body);

    const gradient = await generateHobbyGradient(hobby);

    return NextResponse.json(gradient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error generating hobby gradient:", error);
    return NextResponse.json(
      { error: "Failed to generate gradient" },
      { status: 500 }
    );
  }
}
