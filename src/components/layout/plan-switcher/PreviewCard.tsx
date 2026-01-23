"use client";

import { motion } from "framer-motion";
import type { LearningPlan } from "@/types";

interface PreviewCardProps {
  plan: LearningPlan;
  mastered: number;
  offset: number;
  onClick: () => void;
}

export function PreviewCard({ plan, mastered, offset, onClick }: PreviewCardProps) {
  const isLeft = offset < 0;
  const translateX = isLeft ? "calc(-100% - 16px)" : "calc(100% + 16px)";
  const scale = 0.85;
  const opacity = 0.6;

  return (
    <motion.div
      className="absolute top-0 w-full cursor-pointer"
      style={{
        transform: `translateX(${translateX}) scale(${scale})`,
        zIndex: isLeft ? 1 : 1,
        opacity,
      }}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -20 : 20 }}
      onClick={onClick}
      whileHover={{ opacity: 0.8, scale: 0.87 }}
      whileTap={{ scale: 0.83 }}
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
              Your hobby
            </p>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {plan.hobby}
            </h2>
            <p className="text-sm text-white/80 line-clamp-2">
              {plan.goal}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="font-display text-lg font-bold text-white">{mastered}</p>
              <p className="text-xs text-white/70">Mastered</p>
            </div>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="font-display text-lg font-bold text-white">{plan.streakDays || 0}</p>
              <p className="text-xs text-white/70">Streak</p>
            </div>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="font-display text-lg font-bold text-white">{plan.dailyMinutes}</p>
              <p className="text-xs text-white/70">min/day</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
