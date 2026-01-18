"use client";

import { useMemo } from "react";
import { Sparkles, RotateCcw, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLearningPlanStore } from "@/stores";
import { CircularProgress } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const plan = useLearningPlanStore((state) => state.plan);
  const router = useRouter();
  
  const progress = useMemo(() => {
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.techniques.filter((t) => t.masteryState === "mastered").length;
    const total = plan.techniques.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full glass border-b border-card-border",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-semibold text-foreground">
                SideQuest
              </h1>
              {plan && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <p className="text-xs sm:text-sm text-foreground-muted truncate">
                    {plan.hobby}
                  </p>
                  <button
                    onClick={() => router.push("/settings")}
                    className="text-xs text-foreground-subtle hover:text-accent transition-colors flex-shrink-0 p-1"
                    title="Change hobby"
                  >
                    <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
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
          </div>
        </div>
      </div>
    </header>
  );
}
