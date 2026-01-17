"use client";

import { motion } from "framer-motion";
import { Play, CheckCircle2, RotateCcw, Layers, Clock, ChevronRight } from "lucide-react";
import type { Technique, MasteryState } from "@/types";
import { Button, Card, CardContent } from "@/components/ui";
import { cn, formatDuration } from "@/lib/utils";

interface TechniqueCardProps {
  technique: Technique;
  onStart: () => void;
  onUpdateMastery: (state: MasteryState) => void;
  onReplace: () => void;
  onDecompose: () => void;
  isActive?: boolean;
}

const masteryColors: Record<MasteryState, string> = {
  unstarted: "bg-foreground-subtle/20",
  learning: "bg-sky",
  practicing: "bg-peach",
  mastered: "bg-mint",
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
}: TechniqueCardProps) {
  const isMastered = technique.masteryState === "mastered";

  const handleProgressState = () => {
    const progression: Record<MasteryState, MasteryState> = {
      unstarted: "learning",
      learning: "practicing",
      practicing: "mastered",
      mastered: "mastered",
    };
    onUpdateMastery(progression[technique.masteryState]);
  };

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
          isActive && "ring-2 ring-accent ring-offset-2 shadow-lg",
          isMastered && "bg-mint/10"
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl",
            masteryColors[technique.masteryState]
          )}
        />

        <CardContent className="p-5 pl-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    masteryColors[technique.masteryState],
                    technique.masteryState === "mastered" && "text-foreground"
                  )}
                >
                  {masteryLabels[technique.masteryState]}
                </span>
                <span className="flex items-center gap-1 text-xs text-foreground-muted">
                  <Clock className="h-3 w-3" />
                  {formatDuration(technique.estimatedMinutes)}
                </span>
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {technique.name}
              </h3>

              <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                {technique.whyItMatters}
              </p>

              {technique.microSteps && technique.microSteps.length > 0 && (
                <div className="mb-3 p-3 bg-lavender/30 rounded-xl">
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
                {technique.masteryState === "unstarted" && (
                  <Button size="sm" onClick={onStart}>
                    <Play className="h-4 w-4" />
                    Start Learning
                  </Button>
                )}

                {technique.masteryState !== "unstarted" && !isMastered && (
                  <Button size="sm" variant="success" onClick={handleProgressState}>
                    <ChevronRight className="h-4 w-4" />
                    {technique.masteryState === "learning" ? "Mark Practicing" : "Mark Mastered"}
                  </Button>
                )}

                {isMastered && (
                  <Button size="sm" variant="success" disabled>
                    <CheckCircle2 className="h-4 w-4" />
                    Mastered
                  </Button>
                )}

                <Button size="sm" variant="ghost" onClick={onReplace}>
                  <RotateCcw className="h-4 w-4" />
                  Replace
                </Button>

                {!isMastered && technique.masteryState !== "unstarted" && (
                  <Button size="sm" variant="ghost" onClick={onDecompose}>
                    <Layers className="h-4 w-4" />
                    Too Hard
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
