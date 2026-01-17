"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Target, TrendingUp } from "lucide-react";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { Header, MobileNav } from "@/components/layout";
import { Card, CardContent, CircularProgress } from "@/components/ui";
import { OnboardingForm } from "@/components/onboarding";
import { formatDuration } from "@/lib/utils";
import type { MasteryState } from "@/types";

function ProgressContent() {
  const plan = useLearningPlanStore((state) => state.plan);
  
  const progress = useMemo(() => {
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.techniques.filter((t) => t.masteryState === "mastered").length;
    const total = plan.techniques.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);
  const isMobile = useIsMobile();
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  if (!plan) return <OnboardingForm />;

  const techniquesByState = plan.techniques.reduce((acc, t) => {
    acc[t.masteryState] = (acc[t.masteryState] || 0) + 1;
    return acc;
  }, {} as Record<MasteryState, number>);

  const totalEstimatedMinutes = plan.techniques.reduce(
    (acc, t) => acc + t.estimatedMinutes,
    0
  );

  const completedMinutes = plan.techniques
    .filter((t) => t.masteryState === "mastered")
    .reduce((acc, t) => acc + t.estimatedMinutes, 0);

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Your Progress
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {progress.completed}
                </p>
                <p className="text-sm text-foreground-muted">Techniques Mastered</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-peach/50 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-peach-dark" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {progress.total}
                </p>
                <p className="text-sm text-foreground-muted">Total Techniques</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-sky-dark" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {formatDuration(completedMinutes)}
                </p>
                <p className="text-sm text-foreground-muted">Time Invested</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-mint/50 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-mint-dark" />
                </div>
                <p className="text-3xl font-display font-bold text-foreground">
                  {formatDuration(plan.dailyMinutes)}
                </p>
                <p className="text-sm text-foreground-muted">Daily Goal</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Overall Progress
                </h2>
                <div className="flex items-center justify-center">
                  <CircularProgress
                    value={progress.percentage}
                    size={180}
                    strokeWidth={12}
                  />
                </div>
                <p className="text-center text-foreground-muted mt-4">
                  {progress.completed === progress.total
                    ? "Congratulations! You have mastered all techniques!"
                    : `${progress.total - progress.completed} techniques remaining`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Status Breakdown
                </h2>
                <div className="space-y-4">
                  {(["mastered", "practicing", "learning", "unstarted"] as MasteryState[]).map(
                    (state) => {
                      const count = techniquesByState[state] || 0;
                      const percentage = (count / progress.total) * 100;
                      const colors: Record<MasteryState, string> = {
                        unstarted: "bg-foreground-subtle/30",
                        learning: "bg-sky",
                        practicing: "bg-peach",
                        mastered: "bg-mint",
                      };
                      const labels: Record<MasteryState, string> = {
                        unstarted: "Not Started",
                        learning: "Learning",
                        practicing: "Practicing",
                        mastered: "Mastered",
                      };

                      return (
                        <div key={state}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {labels[state]}
                            </span>
                            <span className="text-sm text-foreground-muted">{count}</span>
                          </div>
                          <div className="h-2 bg-foreground-subtle/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.6 }}
                              className={`h-full rounded-full ${colors[state]}`}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Technique Journey
              </h2>
              <div className="space-y-3">
                {plan.techniques
                  .sort((a, b) => a.order - b.order)
                  .map((technique, index) => {
                    const stateColors: Record<MasteryState, string> = {
                      unstarted: "border-foreground-subtle/30 bg-white",
                      learning: "border-sky-dark bg-sky",
                      practicing: "border-peach-dark bg-peach",
                      mastered: "border-mint-dark bg-mint",
                    };

                    return (
                      <div
                        key={technique.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-lavender/20 transition-all"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-sm ${stateColors[technique.masteryState]}`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{technique.name}</p>
                          <p className="text-xs text-foreground-muted capitalize">
                            {technique.masteryState.replace("_", " ")}
                          </p>
                        </div>
                        <span className="text-sm text-foreground-subtle">
                          {formatDuration(technique.estimatedMinutes)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <MobileNav />
    </div>
  );
}

export default function ProgressPage() {
  return <ProgressContent />;
}
