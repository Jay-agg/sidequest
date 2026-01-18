"use client";

import { useState } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, RotateCcw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import type { QuizQuestion } from "@/types";

interface FlashCardsProps {
  questions: QuizQuestion[];
  techniqueName: string;
  onComplete: (correctCount: number, totalCount: number) => void;
}

const cardColors = [
  "from-blue-500/20 to-purple-500/20 border-blue-500/30",
  "from-green-500/20 to-teal-500/20 border-green-500/30",
  "from-orange-500/20 to-pink-500/20 border-orange-500/30",
  "from-indigo-500/20 to-cyan-500/20 border-indigo-500/30",
  "from-rose-500/20 to-red-500/20 border-rose-500/30",
];

export function FlashCards({ questions, techniqueName, onComplete }: FlashCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [reviewCards, setReviewCards] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentColor = cardColors[currentIndex % cardColors.length];

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      setSwipeDirection("right");
      setIsExiting(true);
      setTimeout(() => handleKnowIt(), 300);
    } else if (info.offset.x < -threshold) {
      setSwipeDirection("left");
      setIsExiting(true);
      setTimeout(() => handleReview(), 300);
    } else {
      setSwipeDirection(null);
    }
  };

  const handleKnowIt = () => {
    setKnownCards([...knownCards, currentIndex]);
    moveToNext();
  };

  const handleReview = () => {
    setReviewCards([...reviewCards, currentIndex]);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setSwipeDirection(null);
      setIsExiting(false);
    } else {
      setShowResults(true);
      onComplete(knownCards.length + 1, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setReviewCards([]);
    setShowResults(false);
    setSwipeDirection(null);
    setIsExiting(false);
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-foreground-muted">No quiz questions available for this technique.</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mint/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
            Flash Cards Complete!
          </h3>
          <p className="text-sm sm:text-base text-foreground-muted mb-4 sm:mb-6">
            You knew {knownCards.length} out of {questions.length} cards
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-mint/20">
              <p className="text-xl sm:text-2xl font-bold text-green-500">{knownCards.length}</p>
              <p className="text-xs text-foreground-muted">Know it</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-warm-yellow/20">
              <p className="text-xl sm:text-2xl font-bold text-yellow-500">{reviewCards.length}</p>
              <p className="text-xs text-foreground-muted">Review</p>
            </div>
          </div>
          <Button onClick={handleRestart} className="gap-2" size="sm">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <p className="text-xs sm:text-sm text-foreground-muted">
          Card {currentIndex + 1} of {questions.length}
        </p>
        <p className="text-xs text-foreground-muted">
          Swipe right if you know it, left to review
        </p>
      </div>

      <div className="relative h-64 sm:h-72 md:h-80 flex items-center justify-center">
        {!isExiting && currentIndex < questions.length - 1 && (
          <motion.div
            key={`next-${currentIndex + 1}`}
            className="absolute w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0.5, y: 10 }}
            animate={{ scale: 0.95, opacity: 0.7, y: 0 }}
            style={{ zIndex: 0 }}
          >
            <Card className={`h-64 sm:h-72 md:h-80 border-2 bg-gradient-to-br ${cardColors[(currentIndex + 1) % cardColors.length]}`}>
              <CardContent className="h-full p-4 sm:p-6 flex items-center justify-center">
                <div className="text-center blur-sm">
                  <p className="text-sm sm:text-base md:text-lg font-medium text-foreground">
                    Next Question
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <AnimatePresence mode="wait" onExitComplete={() => setIsExiting(false)}>
          {!isExiting && (
            <motion.div
              key={`card-${currentIndex}`}
              className="absolute w-full max-w-md cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              whileTap={{ scale: 1.05 }}
              initial={{ scale: 0, opacity: 0, x: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: 0,
                rotate: 0
              }}
              exit={{ 
                x: swipeDirection === "right" ? 500 : swipeDirection === "left" ? -500 : 0,
                opacity: 0,
                rotate: swipeDirection === "right" ? 25 : swipeDirection === "left" ? -25 : 0,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ zIndex: 10 }}
            >
              <Card 
                className={`h-64 sm:h-72 md:h-80 border-[3px] bg-gradient-to-br ${currentColor} transition-all duration-200 ${
                  swipeDirection === "right" 
                    ? "border-green-500 shadow-green-500/50 shadow-xl" 
                    : swipeDirection === "left" 
                    ? "border-yellow-500 shadow-yellow-500/50 shadow-xl"
                    : ""
                }`}
                onClick={() => !isExiting && setIsFlipped(!isFlipped)}
              >
                <CardContent className="h-full p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center relative">
                  <AnimatePresence>
                    {swipeDirection === "right" && (
                      <motion.div
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-green-500"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1.5, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                      </motion.div>
                    )}
                    {swipeDirection === "left" && (
                      <motion.div
                        className="absolute top-2 left-2 sm:top-4 sm:left-4 text-yellow-500"
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1.5, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <X className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {!isFlipped ? (
                      <div className="text-center px-2">
                        <p className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">
                          {currentQuestion.question}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          Tap to reveal answer
                        </p>
                      </div>
                    ) : (
                      <div className="text-center px-2" style={{ transform: "rotateY(180deg)" }}>
                        <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
                          {currentQuestion.options[currentQuestion.correctIndex]}
                        </p>
                        {currentQuestion.explanation && (
                          <p className="text-xs sm:text-sm text-foreground-muted">
                            {currentQuestion.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20"
          animate={{ 
            scale: swipeDirection === "left" ? 1.2 : 1,
            opacity: swipeDirection === "left" ? 1 : 0.5 
          }}
        >
          <div className="w-16 h-16 rounded-full bg-warm-yellow/30 flex items-center justify-center border-2 border-yellow-500/50">
            <X className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-center mt-2 text-foreground-muted font-medium">Review</p>
        </motion.div>

        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20"
          animate={{ 
            scale: swipeDirection === "right" ? 1.2 : 1,
            opacity: swipeDirection === "right" ? 1 : 0.5 
          }}
        >
          <div className="w-16 h-16 rounded-full bg-mint/30 flex items-center justify-center border-2 border-green-500/50">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-center mt-2 text-foreground-muted font-medium">Know it</p>
        </motion.div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (!isExiting) {
              setSwipeDirection("left");
              setIsExiting(true);
              setTimeout(() => handleReview(), 300);
            }
          }}
          disabled={isExiting}
          className="gap-2 border-warm-yellow/30 hover:bg-warm-yellow/10"
        >
          <X className="w-5 h-5" />
          Review
        </Button>
        <Button
          size="lg"
          onClick={() => {
            if (!isExiting) {
              setSwipeDirection("right");
              setIsExiting(true);
              setTimeout(() => handleKnowIt(), 300);
            }
          }}
          disabled={isExiting}
          className="gap-2 bg-mint hover:bg-mint-dark"
        >
          <CheckCircle2 className="w-5 h-5" />
          Know it
        </Button>
      </div>
    </div>
  );
}
