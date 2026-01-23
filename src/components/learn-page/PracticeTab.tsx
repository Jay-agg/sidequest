"use client";

import { motion } from "framer-motion";
import { Timer, CheckCircle2, Target, BookOpen } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { PracticeTimer } from "@/components/learning";
import type { Technique, LearningPlan } from "@/types";

interface PracticeTabProps {
  technique: Technique;
  plan: LearningPlan;
  onPracticeComplete: (minutes: number) => void;
  onMarkMastered: () => void;
}

export function PracticeTab({
  technique,
  plan,
  onPracticeComplete,
  onMarkMastered,
}: PracticeTabProps) {
  return (
    <motion.div
      key="practice"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Timer className="w-5 h-5 text-accent" />
            Practice Session
          </h2>

          {plan.isTimerUseful === false && plan.timerRationale && (
            <div className="mb-4 p-4 rounded-xl bg-warm-yellow/10 border border-warm-yellow/30">
              <p className="text-sm text-foreground-muted">
                <strong>Note:</strong> {plan.timerRationale}
              </p>
            </div>
          )}

          <p className="text-foreground-muted mb-6">
            {plan.isTimerUseful !== false
              ? `Set a timer and practice ${technique.name.toLowerCase()}. Deliberate practice is the key to mastery.`
              : `Practice ${technique.name.toLowerCase()} at your own pace. Focus on quality over timed sessions.`}
          </p>

          {technique.practiceResource && (
            <div className="mb-6 p-4 rounded-xl bg-sky/10 border border-sky/30">
              <h3 className="font-medium text-foreground mb-2">Free Practice Resource</h3>
              <p className="text-sm text-foreground-muted mb-3">
                {technique.practiceResource.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(technique.practiceResource!.url, "_blank")}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Visit {technique.practiceResource.name}
              </Button>
            </div>
          )}

          <PracticeTimer
            targetMinutes={technique.estimatedMinutes}
            onComplete={onPracticeComplete}
          />

          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={onMarkMastered}
              className="gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Mastered
            </Button>
          </div>

          {technique.practiceMinutes && technique.practiceMinutes > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-mint/10 border border-mint/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Total practice time</p>
                  <p className="font-display font-bold text-foreground">
                    {technique.practiceMinutes} minutes
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {technique.practiceMinutes && technique.practiceMinutes >= technique.estimatedMinutes && (
        <div className="mt-6">
          <Card className="bg-accent/5 border-accent/30">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Ready to Master This?
              </h3>
              <p className="text-foreground-muted mb-4">
                You've practiced enough to mark this technique as mastered and move on.
              </p>
              <Button
                onClick={onMarkMastered}
                className="gap-2 h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Mastered
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
