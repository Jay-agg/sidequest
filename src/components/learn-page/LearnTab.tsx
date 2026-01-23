"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { VideoPlayer } from "@/components/learning";
import type { Technique, LearningPlan } from "@/types";

interface LearnTabProps {
  technique: Technique;
  plan: LearningPlan;
  onNavigateToQuiz: () => void;
}

export function LearnTab({ technique, plan, onNavigateToQuiz }: LearnTabProps) {
  const youtubeQuery = technique.youtubeQuery || `${technique.name} ${plan.hobby} tutorial`;

  return (
    <motion.div
      key="learn"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Video Tutorials
          </h2>
          <VideoPlayer query={youtubeQuery} techniqueName={technique.name} />
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <Button onClick={onNavigateToQuiz} className="gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
          Take the Quiz
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
