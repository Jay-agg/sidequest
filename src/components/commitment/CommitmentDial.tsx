"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Slider, Card, CardContent } from "@/components/ui";
import { useUIStore, useLearningPlanStore } from "@/stores";
import { formatDuration } from "@/lib/utils";
import type { DepthLevel } from "@/types";

const depthDescriptions: Record<DepthLevel, string> = {
  basic: "Core concepts only - quick daily practice",
  intermediate: "Concepts with exercises - balanced approach",
  deep: "Full mastery with variations - comprehensive learning",
};

const timeToDepth = (minutes: number): DepthLevel => {
  if (minutes <= 20) return "basic";
  if (minutes <= 40) return "intermediate";
  return "deep";
};

export function CommitmentDial() {
  const dailyMinutes = useUIStore((state) => state.dailyMinutes);
  const setDailyMinutes = useUIStore((state) => state.setDailyMinutes);
  const updatePlanDailyMinutes = useLearningPlanStore((state) => state.updateDailyMinutes);
  const plan = useLearningPlanStore((state) => state.plan);
  const [localValue, setLocalValue] = useState([dailyMinutes]);

  useEffect(() => {
    setLocalValue([dailyMinutes]);
  }, [dailyMinutes]);

  const currentDepth = timeToDepth(dailyMinutes);

  const handleValueChange = useCallback((value: number[]) => {
    setLocalValue(value);
  }, []);

  const handleValueCommit = useCallback((value: number[]) => {
    const newMinutes = value[0];
    setDailyMinutes(newMinutes);
    if (plan) {
      updatePlanDailyMinutes(newMinutes);
    }
  }, [setDailyMinutes, updatePlanDailyMinutes, plan]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Daily Commitment
            </h3>
            <p className="text-sm text-foreground-muted">
              Adjust your learning intensity
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-display font-bold text-accent">
              {formatDuration(dailyMinutes)}
            </span>
            <motion.span
              key={currentDepth}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium capitalize"
            >
              {currentDepth}
            </motion.span>
          </div>

          <Slider
            value={localValue}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            min={10}
            max={60}
            step={5}
            className="mb-4"
          />

          <div className="flex justify-between text-xs text-foreground-muted">
            <span>10 min</span>
            <span>60 min</span>
          </div>
        </div>

        <motion.div
          key={currentDepth}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-lavender/30"
        >
          <p className="text-sm text-foreground">
            {depthDescriptions[currentDepth]}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
