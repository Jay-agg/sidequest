"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, CheckCircle2, RotateCcw, Layers, Clock, ChevronRight, Trophy, Brain, Lock } from "lucide-react";
import type { Technique, MasteryState } from "@/types";
import { Button, Card, CardContent, Progress } from "@/components/ui";
import { cn, formatDuration } from "@/lib/utils";
import { useLearningPlanStore } from "@/stores";

interface TechniqueCardProps {
  technique: Technique;
  onStart: () => void;
  onUpdateMastery: (state: MasteryState) => void;
  onReplace: () => void;
  onDecompose: () => void;
  isActive?: boolean;
  isLocked?: boolean;
}

const masteryColors: Record<MasteryState, string> = {
  unstarted: "bg-muted",
  learning: "bg-sky-blue/50",
  practicing: "bg-warm-yellow/50",
  mastered: "bg-mint/50",
};

const masteryLabels: Record<MasteryState, string> = {
  unstarted: "Not started",
  learning: "Learning",
  practicing: "Practicing",
  mastered: "Mastered",
};

export function TechniqueCard({
  technique,
  onStart,
  onUpdateMastery,
  onReplace,
  onDecompose,
  isActive = false,
  isLocked = false,
}: TechniqueCardProps) {
  const router = useRouter();
  const setActiveTechnique = useLearningPlanStore((state) => state.setActiveTechnique);
  const isMastered = technique.masteryState === "mastered";

  const handleProgressState = useCallback(() => {
    const progression: Record<MasteryState, MasteryState> = {
      unstarted: "learning",
      learning: "practicing",
      practicing: "mastered",
      mastered: "mastered",
    };
    onUpdateMastery(progression[technique.masteryState]);
  }, [technique.masteryState, onUpdateMastery]);

  const handleStartLearning = useCallback(() => {
    setActiveTechnique(technique.id);
    onStart();
    router.push("/learn");
  }, [technique.id, setActiveTechnique, onStart, router]);

  const handleContinueLearning = useCallback(() => {
    setActiveTechnique(technique.id);
    router.push("/learn");
  }, [technique.id, setActiveTechnique, router]);

  const practiceProgress = technique.estimatedMinutes > 0
    ? Math.min(((technique.practiceMinutes || 0) / technique.estimatedMinutes) * 100, 100)
    : 0;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      id={`technique-${technique.id}`}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all",
          isActive && "ring-2 ring-accent ring-offset-2 ring-offset-background",
          isMastered && "bg-mint/5",
          isLocked && "opacity-60"
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl",
            isLocked ? "bg-muted" : masteryColors[technique.masteryState]
          )}
        />

        <CardContent className="p-5 pl-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {isLocked ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                ) : (
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      masteryColors[technique.masteryState]
                    )}
                  >
                    {masteryLabels[technique.masteryState]}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-foreground-muted">
                  <Clock className="h-3 w-3" />
                  {formatDuration(technique.estimatedMinutes)}
                </span>
                {technique.quizCompleted && !isLocked && (
                  <span className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Brain className="h-3 w-3" />
                    Quiz: {technique.quizScore}%
                  </span>
                )}
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {technique.name}
              </h3>

              <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                {isLocked ? "Complete the previous technique to unlock this one." : technique.whyItMatters}
              </p>

              {!isLocked && technique.practiceMinutes && technique.practiceMinutes > 0 && !isMastered && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-foreground-muted mb-1">
                    <span>Practice progress</span>
                    <span>{technique.practiceMinutes} / {technique.estimatedMinutes} min</span>
                  </div>
                  <Progress value={practiceProgress} className="h-2" />
                </div>
              )}

              {technique.microSteps && technique.microSteps.length > 0 && (
                <div className="mb-3 p-3 bg-lavender/20 rounded-xl">
                  <p className="text-xs font-medium text-foreground-muted mb-2">
                    Simplified steps:
                  </p>
                  <ul className="space-y-1">
                    {technique.microSteps.map((step, index) => (
                      <li key={index} className="text-xs text-foreground flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {isLocked ? (
                  <Button size="sm" disabled>
                    <Lock className="h-4 w-4" />
                    Locked
                  </Button>
                ) : (
                  <>
                    {technique.masteryState === "unstarted" && (
                      <Button size="sm" onClick={handleStartLearning}>
                        <Play className="h-4 w-4" />
                        Start Learning
                      </Button>
                    )}

                    {technique.masteryState !== "unstarted" && !isMastered && (
                      <>
                        <Button size="sm" onClick={handleContinueLearning}>
                          <Play className="h-4 w-4" />
                          Continue
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleProgressState}>
                          <ChevronRight className="h-4 w-4" />
                          {technique.masteryState === "learning" ? "Mark Practicing" : "Mark Mastered"}
                        </Button>
                      </>
                    )}

                    {isMastered && (
                      <Button size="sm" variant="outline" className="text-green-500 border-green-500/30" disabled>
                        <Trophy className="h-4 w-4" />
                        Mastered
                      </Button>
                    )}

                    <Button size="sm" variant="ghost" onClick={onReplace}>
                      <RotateCcw className="h-4 w-4" />
                      <span className="hidden sm:inline">Replace</span>
                    </Button>

                    {!isMastered && technique.masteryState !== "unstarted" && (
                      <Button size="sm" variant="ghost" onClick={onDecompose}>
                        <Layers className="h-4 w-4" />
                        <span className="hidden sm:inline">Too Hard</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
