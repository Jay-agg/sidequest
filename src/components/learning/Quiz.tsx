"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import type { QuizQuestion } from "@/types";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  techniqueName: string;
}

export function Quiz({ questions, onComplete, techniqueName }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-foreground-muted">No quiz questions available for this technique yet.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
  const score = Math.round((correctCount / questions.length) * 100);

  const handleAnswer = useCallback((index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    const correct = index === currentQuestion.correctIndex;
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }
    setAnswers((prev) => [...prev, correct]);
  }, [showResult, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      onComplete(Math.round((correctCount / questions.length) * 100));
    }
  }, [currentIndex, questions.length, correctCount, onComplete]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setCompleted(false);
    setAnswers([]);
  }, []);

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            score >= 80 ? "bg-mint/30" : score >= 50 ? "bg-warm-yellow/30" : "bg-peach/30"
          }`}
        >
          <Trophy className={`w-10 h-10 ${
            score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-orange-500"
          }`} />
        </motion.div>

        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          {score >= 80 ? "Excellent!" : score >= 50 ? "Good effort!" : "Keep practicing!"}
        </h3>
        
        <p className="text-foreground-muted mb-2">
          You scored <span className="font-bold text-foreground">{score}%</span> on {techniqueName}
        </p>
        
        <p className="text-sm text-foreground-subtle mb-6">
          {correctCount} out of {questions.length} correct
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          {answers.map((correct, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`w-3 h-3 rounded-full ${correct ? "bg-green-500" : "bg-red-400"}`}
            />
          ))}
        </div>

        {score < 80 && (
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-foreground-muted">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < currentIndex
                  ? answers[i]
                    ? "bg-green-500"
                    : "bg-red-400"
                  : i === currentIndex
                  ? "bg-accent"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4 className="text-lg font-medium text-foreground mb-6">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctIndex;
              
              let bgColor = "bg-card hover:bg-accent/5";
              let borderColor = "border-card-border";
              let textColor = "text-foreground";
              
              if (showResult) {
                if (isCorrectAnswer) {
                  bgColor = "bg-green-500/10";
                  borderColor = "border-green-500";
                  textColor = "text-green-400";
                } else if (isSelected && !isCorrectAnswer) {
                  bgColor = "bg-red-500/10";
                  borderColor = "border-red-500";
                  textColor = "text-red-400";
                }
              } else if (isSelected) {
                borderColor = "border-accent";
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bgColor} ${borderColor} ${textColor} ${
                    showResult ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      showResult && isCorrectAnswer
                        ? "bg-green-500 text-white"
                        : showResult && isSelected && !isCorrectAnswer
                        ? "bg-red-500 text-white"
                        : "bg-accent/20 text-foreground"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <Button onClick={handleNext} className="w-full gap-2">
            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
