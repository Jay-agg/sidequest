"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, Lightbulb, RefreshCw } from "lucide-react";
import { Button, Card, CardContent, Textarea } from "@/components/ui";
import type { Technique } from "@/types";

interface TeachBackModeProps {
  technique: Technique;
  onComplete: () => void;
}

export function TeachBackMode({ technique, onComplete }: TeachBackModeProps) {
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    overall: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const finalText = explanation.trim();
    if (!finalText) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch("/api/teach-back", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          techniqueName: technique.name,
          techniqueDescription: technique.description,
          userExplanation: finalText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze explanation");
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setExplanation(finalText);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to analyze your explanation. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setExplanation("");
    setFeedback(null);
    setError(null);
  };

  if (feedback) {
    const scoreColor = 
      feedback.score >= 8 ? "text-green-500 border-green-500/30 bg-green-500/10" :
      feedback.score >= 6 ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" :
      "text-orange-500 border-orange-500/30 bg-orange-500/10";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="border-[3px] border-accent overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${scoreColor}`}
              >
                <span className="text-xl sm:text-2xl font-bold">{feedback.score}</span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2"
                >
                  {feedback.score >= 8 ? "Excellent Understanding! 🎉" :
                   feedback.score >= 6 ? "Good Progress! 👍" :
                   "Keep Learning! 💪"}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs sm:text-sm text-foreground-muted"
                >
                  {feedback.overall}
                </motion.p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {feedback.strengths.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-mint/10 border border-mint/30"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <h4 className="text-sm sm:text-base font-medium text-foreground">What You Did Well</h4>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="text-xs sm:text-sm text-foreground-muted flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {feedback.improvements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-warm-yellow/10 border border-warm-yellow/30"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <h4 className="text-sm sm:text-base font-medium text-foreground">Areas to Enhance</h4>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-xs sm:text-sm text-foreground-muted flex items-start gap-2"
                      >
                        <span className="text-yellow-500 mt-0.5 flex-shrink-0">💡</span>
                        <span>{improvement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-lavender/10 border border-lavender/30"
            >
              <p className="text-xs sm:text-sm text-foreground-muted text-center">
                <strong>Your explanation:</strong> {explanation.slice(0, 150)}{explanation.length > 150 ? "..." : ""}
              </p>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-4"
        >
          <Button variant="outline" onClick={handleReset} className="flex-1 gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button onClick={onComplete} className="flex-1 gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
            <CheckCircle2 className="w-4 h-4" />
            Continue Learning
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const wordCount = explanation.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 30;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                Teach Back: {technique.name}
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted">
                Teaching is one of the best ways to learn! Explain this technique as if you're teaching someone who has never heard of it before.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-lavender/10 border border-lavender/30 mb-3 sm:mb-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-foreground mb-1.5 sm:mb-2 font-medium">Try to cover these points:</p>
                <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-foreground-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>What is {technique.name} and why does it matter?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>How would you explain it to a complete beginner?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>What are the key steps or principles?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>What common mistakes should they avoid?</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={`Example: "${technique.name} is a fundamental technique that involves... It's important because... To practice it, you should... A common mistake beginners make is..."`}
              className="min-h-[200px] sm:min-h-[240px] resize-none pr-16 sm:pr-24 text-sm sm:text-base"
              disabled={isAnalyzing}
            />
            
            <div className="absolute top-3 right-3 flex flex-col gap-2">
            </div>

            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-2 sm:gap-3">
              <span className={`text-[10px] sm:text-xs font-medium ${
                wordCount >= minWords ? "text-green-500" : "text-foreground-muted"
              }`}>
                {wordCount} / {minWords} words
              </span>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-foreground mb-2">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="gap-2 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={!explanation.trim() || isAnalyzing || wordCount < minWords}
        className="w-full gap-2 h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg"
      >
        {isAnalyzing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            AI is analyzing your explanation...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Get AI Feedback
            {wordCount < minWords && (
              <span className="text-xs opacity-70">
                ({minWords - wordCount} more words)
              </span>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
