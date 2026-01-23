"use client";

import type { Technique, LearningPlan, MasteryState } from "@/types";

const masteryLabels: Record<MasteryState, { label: string; color: string }> = {
  unstarted: { label: "Not Started", color: "bg-muted text-foreground-muted" },
  learning: { label: "Learning", color: "bg-sky-blue/30 text-sky-500" },
  practicing: { label: "Practicing", color: "bg-warm-yellow/30 text-yellow-500" },
  mastered: { label: "Mastered", color: "bg-mint/30 text-green-500" },
};

interface TechniqueHeaderProps {
  technique: Technique;
  plan: LearningPlan;
}

export function TechniqueHeader({ technique, plan }: TechniqueHeaderProps) {
  const masteryInfo = masteryLabels[technique.masteryState];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${masteryInfo.color}`}>
          {masteryInfo.label}
        </span>
        <span className="text-xs sm:text-sm text-foreground-muted">
          Technique {(technique.order || 0) + 1} of {plan.techniques.length}
        </span>
      </div>

      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2 leading-tight">
        {technique.name}
      </h1>
      <p className="text-sm sm:text-base text-foreground-muted">{technique.description}</p>
    </div>
  );
}
