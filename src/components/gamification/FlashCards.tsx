"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { CheckCircle2, X, RotateCcw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import type { QuizQuestion } from "@/types";

interface FlashCardsProps {
  questions: QuizQuestion[];
  techniqueName: string;
  onComplete: (correctCount: number, totalCount: number) => void;
}

export function FlashCards({ questions, techniqueName, onComplete }: FlashCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [reviewCards, setReviewCards] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const currentQuestion = questions[currentIndex];

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      handleKnowIt();
    } else if (info.offset.x < -threshold) {
      handleReview();
    } else {
      x.set(0);
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
      x.set(0);
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
    x.set(0);
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
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Flash Cards Complete!
          </h3>
          <p className="text-foreground-muted mb-6">
            You knew {knownCards.length} out of {questions.length} cards
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-mint/20">
              <p className="text-2xl font-bold text-green-500">{knownCards.length}</p>
              <p className="text-xs text-foreground-muted">Know it</p>
            </div>
            <div className="p-4 rounded-xl bg-warm-yellow/20">
              <p className="text-2xl font-bold text-yellow-500">{reviewCards.length}</p>
              <p className="text-xs text-foreground-muted">Review</p>
            </div>
          </div>
          <Button onClick={handleRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Card {currentIndex + 1} of {questions.length}
        </p>
        <p className="text-xs text-foreground-muted">
          Swipe right if you know it, left to review
        </p>
      </div>

      <div className="relative h-80 flex items-center justify-center">
        <motion.div
          className="absolute w-full max-w-md cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 1.05 }}
        >
          <Card 
            className="h-80 border-2"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardContent className="h-full p-6 flex flex-col items-center justify-center">
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full h-full flex items-center justify-center"
              >
                {!isFlipped ? (
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground mb-4">
                      {currentQuestion.question}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      Tap to reveal answer
                    </p>
                  </div>
                ) : (
                  <div className="text-center" style={{ transform: "rotateY(180deg)" }}>
                    <p className="text-base text-foreground mb-4">
                      {currentQuestion.options[currentQuestion.correctIndex]}
                    </p>
                    {currentQuestion.explanation && (
                      <p className="text-sm text-foreground-muted">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 opacity-50">
          <div className="w-16 h-16 rounded-full bg-warm-yellow/30 flex items-center justify-center">
            <X className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-center mt-2 text-foreground-muted">Review</p>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 opacity-50">
          <div className="w-16 h-16 rounded-full bg-mint/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-center mt-2 text-foreground-muted">Know it</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleReview}
          className="gap-2 border-warm-yellow/30 hover:bg-warm-yellow/10"
        >
          <X className="w-5 h-5" />
          Review
        </Button>
        <Button
          size="lg"
          onClick={handleKnowIt}
          className="gap-2 bg-mint hover:bg-mint-dark"
        >
          <CheckCircle2 className="w-5 h-5" />
          Know it
        </Button>
      </div>
    </div>
  );
}
