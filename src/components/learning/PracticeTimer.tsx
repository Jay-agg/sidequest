"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";

interface PracticeTimerProps {
  targetMinutes: number;
  onComplete: (minutesPracticed: number) => void;
}

export function PracticeTimer({ targetMinutes, onComplete }: PracticeTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const targetSeconds = targetMinutes * 60;
  const progress = Math.min((seconds / targetSeconds) * 100, 100);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (seconds >= targetSeconds && !isCompleted) {
      setIsCompleted(true);
      setIsRunning(false);
    }
  }, [seconds, targetSeconds, isCompleted]);

  const handleToggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
    setIsCompleted(false);
  }, []);

  const handleFinish = useCallback(() => {
    const minutesPracticed = Math.max(1, Math.round(seconds / 60));
    onComplete(minutesPracticed);
  }, [seconds, onComplete]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--lavender))" />
              <stop offset="100%" stopColor="hsl(var(--mint))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-foreground tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-foreground-muted">
            / {targetMinutes} min
          </span>
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 mx-auto mb-3 rounded-full bg-mint/30 flex items-center justify-center"
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
          </motion.div>
          <p className="text-foreground mb-4">Great practice session!</p>
          <Button onClick={handleFinish} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Log {minutes} minutes
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            disabled={seconds === 0}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            onClick={handleToggle}
            className="w-32 gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {seconds > 0 ? "Resume" : "Start"}
              </>
            )}
          </Button>
          {seconds > 60 && (
            <Button
              variant="outline"
              onClick={handleFinish}
            >
              Finish Early
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
