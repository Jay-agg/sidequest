"use client";

import { PanInfo, useMotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import type { LearningPlan } from "@/types";

type Mode = "view" | "edit";

interface PlanCardProps {
  plan: LearningPlan;
  mastered: number;
  mode: Mode;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
  onDragEnd: (event: any, info: PanInfo) => void;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isActive: boolean;
}

export function PlanCard({
  plan,
  mastered,
  mode,
  canSwipeLeft,
  canSwipeRight,
  onDragEnd,
  onSelect,
  onDelete,
  isDeleting,
  isActive,
}: PlanCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-300, 0, 300], [0.2, 1, 0.2]);
  const scale = useTransform(x, [-300, 0, 300], [0.85, 1, 0.85]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const threshold = 80;
    const swipe = Math.abs(offsetX) > threshold || Math.abs(velocityX) > 500;

    if (!swipe) {
      x.set(0);
      return;
    }

    onDragEnd(event, info);
  };

  return (
    <motion.div
      drag={mode === "view" ? "x" : "y"}
      dragConstraints={mode === "view" ? { left: canSwipeRight ? -300 : 0, right: canSwipeLeft ? 300 : 0 } : { top: 0, bottom: 0 }}
      dragElastic={mode === "view" ? 0.2 : 0.2}
      onDragEnd={handleDragEnd}
      style={{ x, opacity, scale, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      className="w-full relative"
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-[3px] border-black bg-card">
        {plan.hobbyImageUrl && (
          <img
            src={plan.hobbyImageUrl}
            alt={plan.hobby}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-1">
              {mode === "edit" ? "Swipe up to delete" : "Your hobby"}
            </p>
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              {plan.hobby}
            </h2>
            <p className="text-sm text-white/80 line-clamp-2">
              {plan.goal}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="font-display text-xl font-bold text-white">{mastered}</p>
                <p className="text-xs text-white/70">Mastered</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="font-display text-xl font-bold text-white">{plan.streakDays || 0}</p>
                <p className="text-xs text-white/70">Streak</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="font-display text-xl font-bold text-white">{plan.dailyMinutes}</p>
                <p className="text-xs text-white/70">min/day</p>
              </div>
            </div>

            {mode === "edit" ? (
              <Button
                variant="outline"
                className="w-full h-12 text-base border-destructive text-destructive hover:bg-destructive/10 hover:border-destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete hobby
              </Button>
            ) : (
              <Button
                variant={isActive ? "default" : "outline"}
                className={isActive
                  ? "w-full h-12 text-base"
                  : "w-full h-12 text-base border-white/30 text-white bg-white/10 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
                }
                onClick={onSelect}
              >
                {isActive ? "Continue this hobby" : "Switch to this hobby"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
