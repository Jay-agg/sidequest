"use client";

import { motion } from "framer-motion";
import { Brain, Trophy } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { Quiz } from "@/components/learning";
import type { Technique, QuizQuestion } from "@/types";

interface QuizTabProps {
  technique: Technique;
  quizQuestions: QuizQuestion[];
  onComplete: (score: number) => void;
  onNavigateToLearn: () => void;
  onNavigateToFlashcards: () => void;
}

export function QuizTab({
  technique,
  quizQuestions,
  onComplete,
  onNavigateToLearn,
  onNavigateToFlashcards,
}: QuizTabProps) {
  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            Test Your Knowledge
          </h2>

          {technique.quizCompleted && technique.quizScore !== undefined ? (
            <div className="text-center py-8">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  technique.quizScore >= 80 ? "bg-mint/30" : "bg-warm-yellow/30"
                }`}
              >
                <Trophy
                  className={`w-8 h-8 ${
                    technique.quizScore >= 80 ? "text-green-500" : "text-yellow-500"
                  }`}
                />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Previous Score: {technique.quizScore}%
              </h3>
              <p className="text-foreground-muted mb-6">
                {technique.quizScore >= 80
                  ? "Great job! You've demonstrated understanding of this technique."
                  : "Consider reviewing the material and trying again."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={onNavigateToLearn}
                  className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
                >
                  Review Material
                </Button>
                <Button
                  onClick={onNavigateToFlashcards}
                  className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
                >
                  Continue to Cards
                </Button>
              </div>
            </div>
          ) : (
            <Quiz
              questions={quizQuestions}
              onComplete={onComplete}
              techniqueName={technique.name}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
