"use client";

import { ArrowLeft, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@/components/ui";
import type { LearningPlan } from "@/types";

interface LearnPageHeaderProps {
  plan: LearningPlan;
  progress: number;
}

export function LearnPageHeader({ plan, progress }: LearnPageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-card-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Plan</span>
          </Button>

          <div className="flex items-center gap-4">
            {plan.streakDays && plan.streakDays > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-yellow/20 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-foreground">{plan.streakDays} day streak</span>
              </div>
            )}
            <CircularProgress value={progress} size={40} strokeWidth={4} />
          </div>
        </div>
      </div>
    </header>
  );
}
