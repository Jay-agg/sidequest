"use client";

import { useMemo } from "react";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLearningPlanStore } from "@/stores";
import { CircularProgress } from "@/components/ui";
import { AnimatedThemeToggler } from "../theme/AnimatedThemeToggle";

export function Header() {
  const plan = useLearningPlanStore((state) => state.plan);
  const getProgress = useLearningPlanStore((state) => state.getProgress);
  const router = useRouter();
  
  const progress = useMemo(() => {
    return getProgress();
  }, [getProgress, plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);

  return (
    <header
      className="sticky top-0 z-40 w-full glass border-b border-card-border"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex flex-row gap-5">
              <button onClick={() => router.push("/")}>
              <h1 className="font-display text-lg sm:text-xl font-semibold text-foreground">
                SideQuest
              </h1>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />
            
            {plan && (
              <div className="hidden sm:flex items-center gap-3 md:gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-foreground">
                    {progress.completed} of {progress.total} mastered
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {plan.dailyMinutes} min/day
                  </p>
                </div>
                <CircularProgress value={progress.percentage} size={40} strokeWidth={4} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </div>
            )}
            <button
                    onClick={() => router.push("/settings")}
                    className="text-xs text-foreground-subtle hover:text-accent transition-colors flex-shrink-0 p-1"
                    title="Change hobby"
                  >
                    <Settings className="hidden md:block md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
