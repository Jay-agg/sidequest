"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { Slider, Card, CardContent, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
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
  const plan = useLearningPlanStore((state) => state.plan);
  const regeneratePlan = useLearningPlanStore((state) => state.regeneratePlan);
  const isGenerating = useLearningPlanStore((state) => state.isGenerating);
  const [localValue, setLocalValue] = useState([dailyMinutes]);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingMinutes, setPendingMinutes] = useState<number | null>(null);

  useEffect(() => {
    setLocalValue([dailyMinutes]);
  }, [dailyMinutes]);

  const currentDepth = timeToDepth(dailyMinutes);

  const handleValueChange = useCallback((value: number[]) => {
    setLocalValue(value);
  }, []);

  const handleValueCommit = useCallback((value: number[]) => {
    const newMinutes = value[0];
    
    if (newMinutes === dailyMinutes) {
      return;
    }

    if (plan) {
      setPendingMinutes(newMinutes);
      setShowWarning(true);
    } else {
      setDailyMinutes(newMinutes);
      setLocalValue([newMinutes]);
    }
  }, [dailyMinutes, plan, setDailyMinutes]);

  const handleConfirmRegenerate = useCallback(async () => {
    if (!pendingMinutes || !plan) return;

    setDailyMinutes(pendingMinutes);
    setLocalValue([pendingMinutes]);

    try {
      await regeneratePlan(pendingMinutes);
      setShowWarning(false);
      setPendingMinutes(null);
    } catch (error) {
      console.error("Failed to regenerate plan:", error);
      setLocalValue([dailyMinutes]);
      setDailyMinutes(dailyMinutes);
      setPendingMinutes(null);
    }
  }, [pendingMinutes, plan, regeneratePlan, dailyMinutes, setDailyMinutes]);

  const handleCancelRegenerate = useCallback(() => {
    setShowWarning(false);
    setLocalValue([dailyMinutes]);
    setPendingMinutes(null);
  }, [dailyMinutes]);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
                Daily Commitment
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted">
                Adjust your learning intensity
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl font-display font-bold text-accent tabular-nums">
                {formatDuration(localValue[0])}
              </span>
              <motion.span
                key={timeToDepth(localValue[0])}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2.5 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium capitalize"
              >
                {timeToDepth(localValue[0])}
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
              disabled={isGenerating}
            />

            <div className="flex justify-between text-xs text-foreground-muted">
              <span>10 min</span>
              <span>60 min</span>
            </div>
          </div>

          {isGenerating && (
            <div className="mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-lavender/30 border border-lavender/50">
              <p className="text-xs sm:text-sm text-foreground text-center">
                Regenerating your learning plan...
              </p>
            </div>
          )}

          <motion.div
            key={timeToDepth(localValue[0])}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-lavender/30"
          >
            <p className="text-xs sm:text-sm text-foreground">
              {depthDescriptions[timeToDepth(localValue[0])]}
            </p>
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={showWarning || isGenerating} onOpenChange={(open) => {
        if (!isGenerating) {
          setShowWarning(open);
        }
      }}>
        <DialogContent className="bg-card-bg border-[3px] border-card-border">
          {isGenerating ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">Regenerating Your Plan</DialogTitle>
                <DialogDescription className="text-center text-foreground-muted">
                  Creating a new learning plan based on {pendingMinutes ? formatDuration(pendingMinutes) : formatDuration(dailyMinutes)} per day...
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-6">
                <LoadingAnimation className="w-64 h-64 mx-auto" />
              </div>

              <div className="text-center">
                <p className="text-sm text-foreground-muted">
                  This may take a moment. Please don't close this window.
                </p>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-warm-yellow/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <DialogTitle>Regenerate Learning Plan?</DialogTitle>
                </div>
                <DialogDescription className="text-foreground-muted">
                  Changing your daily commitment from {formatDuration(dailyMinutes)} to {pendingMinutes ? formatDuration(pendingMinutes) : ''} will regenerate your entire learning plan.
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4 p-4 rounded-xl bg-warm-yellow/10 border border-warm-yellow/30">
                <p className="text-sm text-foreground font-medium mb-2">This will:</p>
                <ul className="text-sm text-foreground-muted space-y-1 list-disc list-inside">
                  <li>Regenerate all techniques based on your new time commitment</li>
                  <li>Adjust difficulty and depth levels ({timeToDepth(pendingMinutes || dailyMinutes)})</li>
                  <li>Reset technique progress (all techniques will be set to "Not Started")</li>
                </ul>
                <p className="text-sm text-foreground-muted mt-3">
                  <strong>Note:</strong> Your hobby image, total practice time, and day streak will be preserved.
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCancelRegenerate}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRegenerate}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  Regenerate Plan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
