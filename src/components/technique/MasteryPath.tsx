"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import type { Technique, MasteryState } from "@/types";
import { cn } from "@/lib/utils";

interface MasteryPathProps {
  techniques: Technique[];
  onSelectTechnique: (techniqueId: string) => void;
  selectedId?: string;
}

const stateIcons: Record<MasteryState, typeof Circle> = {
  unstarted: Circle,
  learning: Circle,
  practicing: Circle,
  mastered: CheckCircle2,
};

const stateColors: Record<MasteryState, string> = {
  unstarted: "text-foreground-subtle bg-card-bg border-foreground-subtle/30",
  learning: "text-sky-dark bg-sky border-sky-dark",
  practicing: "text-peach-dark bg-peach border-peach-dark",
  mastered: "text-mint-dark bg-mint border-mint-dark",
};

export function MasteryPath({ techniques, onSelectTechnique, selectedId }: MasteryPathProps) {
  const sorted = [...techniques].sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      <div className="absolute left-6 lg:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lavender via-accent/30 to-mint" />

      <div className="space-y-3">
        {sorted.map((technique, index) => {
          const Icon = stateIcons[technique.masteryState];
          const isSelected = selectedId === technique.id;

          return (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                onClick={() => onSelectTechnique(technique.id)}
                className={cn(
                  "relative z-10 flex items-center gap-3 p-2 rounded-lg transition-all w-full text-left",
                  isSelected
                    ? "bg-accent/10"
                    : "hover:bg-lavender/20"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ml-1",
                    stateColors[technique.masteryState],
                    isSelected && "scale-110"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium line-clamp-1",
                    isSelected ? "text-accent" : "text-foreground"
                  )}>
                    {technique.name}
                  </p>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
