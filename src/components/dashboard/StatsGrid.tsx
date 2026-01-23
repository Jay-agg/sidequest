"use client";

import { Target, Trophy } from "lucide-react";
import { CardContent, CircularProgress, NumberTicker } from "@/components/ui";
import { StatCard } from "./StatCard";
import { StreakIcon } from "./StreakIcon";
import type { LearningPlan } from "@/types";

interface StatsGridProps {
  plan: LearningPlan;
  progress: { completed: number; total: number; percentage: number };
}

export function StatsGrid({ plan, progress }: StatsGridProps) {
  const totalPracticeHours = Math.floor((plan.totalPracticeMinutes || 0) / 60);
  const totalPracticeMinutes = (plan.totalPracticeMinutes || 0) % 60;

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
      <StatCard index={0}>
        <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
          <CircularProgress value={progress.percentage} size={48} strokeWidth={5} className="sm:w-14 sm:h-14" />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
              <NumberTicker value={progress.completed} delay={1} className="text-foreground" />/<NumberTicker value={progress.total} delay={1.1} className="text-foreground" />
            </p>
            <p className="text-xs sm:text-sm text-foreground-muted">Mastered</p>
          </div>
        </CardContent>
      </StatCard>

      <StatCard index={1}>
        <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
          <StreakIcon />
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
              <NumberTicker value={plan.streakDays || 0} delay={1.2} className="text-foreground" />
            </p>
            <p className="text-xs sm:text-sm text-foreground-muted">Day streak</p>
          </div>
        </CardContent>
      </StatCard>

      <StatCard index={2}>
        <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-blue/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground leading-tight">
              {totalPracticeHours > 0 ? (
                <>
                  <NumberTicker value={totalPracticeHours} delay={1.3} className="text-foreground" />h <NumberTicker value={totalPracticeMinutes} delay={1.4} className="text-foreground" />m
                </>
              ) : (
                <><NumberTicker value={totalPracticeMinutes} delay={1.3} className="text-foreground" />m</>
              )}
            </p>
            <p className="text-xs sm:text-sm text-foreground-muted">Practiced</p>
          </div>
        </CardContent>
      </StatCard>

      <StatCard index={3}>
        <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-mint/20 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
              <NumberTicker value={plan.techniques.filter((t) => t.quizCompleted && (t.quizScore || 0) >= 80).length} delay={1.5} className="text-foreground" />
            </p>
            <p className="text-xs sm:text-sm text-foreground-muted">Quiz passed</p>
          </div>
        </CardContent>
      </StatCard>
    </div>
  );
}
