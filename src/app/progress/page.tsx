"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Clock, Target, TrendingUp } from "lucide-react";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile, useScrollAnimation } from "@/hooks";
import { Header, MobileNav, PlanSwitcher } from "@/components/layout";
import { Card, CardContent, CircularProgress, FlickeringGrid } from "@/components/ui";
import { OnboardingForm } from "@/components/onboarding";
import { cn, formatDuration } from "@/lib/utils";
import type { MasteryState } from "@/types";

function ProgressContent() {
  const plan = useLearningPlanStore((state) => state.plan);
  const hasHydrated = useLearningPlanStore((state) => state.hasHydrated);
  const getProgress = useLearningPlanStore((state) => state.getProgress);
  
  const progress = useMemo(() => {
    return getProgress();
  }, [getProgress, plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);
  const isMobile = useIsMobile();
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  const confettiFiredRef = useRef(false);
  
  useEffect(() => {
    if (!plan || confettiFiredRef.current) return;
    
    const allMastered = progress.completed === progress.total && progress.total > 0;
    
    if (allMastered) {
      confettiFiredRef.current = true;
      setTimeout(() => {
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
      }, 500);
    }
  }, [plan, progress.completed, progress.total]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-foreground-muted">Loading…</div>
      </div>
    );
  }

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

      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-8">
          Your Progress
        </h1>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-8">
          <StatCardWrapper index={0}>
            <CardContent className="p-3 sm:p-6 flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2 sm:mb-4">
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
              </div>
              <p className="text-xl sm:text-3xl font-display font-bold text-foreground">
                {progress.completed}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">Techniques Mastered</p>
            </CardContent>
          </StatCardWrapper>

          <StatCardWrapper index={1}>
            <CardContent className="p-3 sm:p-6 flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-peach/50 flex items-center justify-center mb-2 sm:mb-4">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-peach-dark" />
              </div>
              <p className="text-xl sm:text-3xl font-display font-bold text-foreground">
                {progress.total}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">Total Techniques</p>
            </CardContent>
          </StatCardWrapper>

          <StatCardWrapper index={2}>
            <CardContent className="p-3 sm:p-6 flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-sky/50 flex items-center justify-center mb-2 sm:mb-4">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-sky-dark" />
              </div>
              <p className="text-xl sm:text-3xl font-display font-bold text-foreground">
                {formatDuration(completedMinutes)}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">Time Invested</p>
            </CardContent>
          </StatCardWrapper>

          <StatCardWrapper index={3}>
            <CardContent className="p-3 sm:p-6 flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-mint/50 flex items-center justify-center mb-2 sm:mb-4">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-mint-dark" />
              </div>
              <p className="text-xl sm:text-3xl font-display font-bold text-foreground">
                {formatDuration(plan.dailyMinutes)}
              </p>
              <p className="text-xs sm:text-sm text-foreground-muted">Daily Goal</p>
            </CardContent>
          </StatCardWrapper>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <ScrollSectionWrapper index={0}>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
                  Overall Progress
                </h2>
                <div className="flex items-center justify-center">
                  <CircularProgress
                    value={progress.percentage}
                    size={isMobile ? 120 : 180}
                    strokeWidth={isMobile ? 8 : 12}
                  />
                </div>
                <p className="text-center text-xs sm:text-sm text-foreground-muted mt-3 sm:mt-4">
                  {progress.completed === progress.total
                    ? "Congratulations! You have mastered all techniques!"
                    : `${progress.total - progress.completed} techniques remaining`}
                </p>
              </CardContent>
            </Card>
          </ScrollSectionWrapper>

          <ScrollSectionWrapper index={1}>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
                  Status Breakdown
                </h2>
                <div className="space-y-3 sm:space-y-4">
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
                            <span className="text-xs sm:text-sm font-medium text-foreground">
                              {labels[state]}
                            </span>
                            <span className="text-xs sm:text-sm text-foreground-muted">{count}</span>
                          </div>
                          <div className="h-1.5 sm:h-2 bg-foreground-subtle/10 rounded-full overflow-hidden">
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
          </ScrollSectionWrapper>
        </div>

        <ScrollSectionWrapper index={2} className="mt-4 sm:mt-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Technique Journey
              </h2>
              <div className="space-y-2 sm:space-y-3">
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
                        className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-lavender/20 transition-all"
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-medium text-xs sm:text-sm ${stateColors[technique.masteryState]}`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base text-foreground truncate">{technique.name}</p>
                          <p className="text-xs text-foreground-muted capitalize">
                            {technique.masteryState.replace("_", " ")}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm text-foreground-subtle whitespace-nowrap">
                          {formatDuration(technique.estimatedMinutes)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </ScrollSectionWrapper>
      </main>

      <MobileNav />
      <PlanSwitcher />
    </div>
  );
}

function StatCardWrapper({ children, index }: { children: React.ReactNode; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const isMobile = useIsMobile()

  const gridColors = [
    "rgb(139, 127, 212)", // Techniques Mastered
    "rgb(255, 203, 184)", // Total Techniques
    "rgb(168, 216, 255)", //Time Invested
    "rgb(168, 235, 207)", // Daily Goal
  ]

  return (
    <motion.div
      ref={ref}
      initial={isMobile ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      animate={isMobile && isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="relative"
    >
      <Card className={cn("h-full relative overflow-hidden bg-card-bg/95")}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FlickeringGrid
            squareSize={2}
            gridGap={3}
            flickerChance={0.3}
            color={gridColors[index]}
            maxOpacity={0.4}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </Card>
    </motion.div>
  )
}

function ScrollSectionWrapper({ children, index, className }: { children: React.ReactNode; index: number; className?: string }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const isMobile = useIsMobile()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={isMobile ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
      animate={isMobile && isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

export default function ProgressPage() {
  return <ProgressContent />;
}
