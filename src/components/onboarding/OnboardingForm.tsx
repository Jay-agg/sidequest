"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { Button, Input, Textarea, Slider, Card, CardContent, ThinkingAnimation } from "@/components/ui";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { formatDuration } from "@/lib/utils";

type Step = "hobby" | "goal" | "time" | "generating" | "error";

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("hobby");
  const [hobby, setHobby] = useState("");
  const [goal, setGoal] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [gradient, setGradient] = useState<{ colors: string[]; animation: string }>({
    colors: ["#6366f1", "#8b5cf6", "#d946ef"],
    animation: "smooth",
  });
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  
  const setPlan = useLearningPlanStore((state) => state.setPlan);
  const setIsGenerating = useLearningPlanStore((state) => state.setIsGenerating);
  const setUIDailyMinutes = useUIStore((state) => state.setDailyMinutes);

  useEffect(() => {
    if (step === "generating" && quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [step, quotes.length]);

  const fetchQuotesAndGradient = useCallback(async (hobbyValue: string) => {
    if (!hobbyValue.trim() || isLoadingQuotes) return;
    
    setIsLoadingQuotes(true);
    
    try {
      const [quotesRes, gradientRes] = await Promise.all([
        fetch("/api/onboarding-quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hobby: hobbyValue }),
        }),
        fetch("/api/hobby-gradient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hobby: hobbyValue }),
        }),
      ]);

      if (quotesRes.ok) {
        const data = await quotesRes.json();
        setQuotes(data.quotes || []);
      }

      if (gradientRes.ok) {
        const data = await gradientRes.json();
        setGradient(data);
      }
    } catch (error) {
      console.warn("Failed to fetch quotes or gradient:", error);
    } finally {
      setIsLoadingQuotes(false);
    }
  }, [isLoadingQuotes]);

  const handleHobbyChange = (value: string) => {
    setHobby(value);
  };

  const handleNext = () => {
    if (step === "hobby") {
      const value = hobby.trim();
      if (value.length >= 3 && !isLoadingQuotes && quotes.length === 0) {
        fetchQuotesAndGradient(value);
      }
      setStep("goal");
    } else if (step === "goal") {
      setStep("time");
    } else if (step === "time") {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step === "goal") setStep("hobby");
    else if (step === "time") setStep("goal");
    else if (step === "error") setStep("time");
  };

  const handleGenerate = async () => {
    setStep("generating");
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hobby, goal, dailyMinutes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }

      const plan = await response.json();
      setPlan(plan);
      setUIDailyMinutes(plan.dailyMinutes);
      setIsGenerating(false);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsGenerating(false);
      setStep("error");
    }
  };

  const canProceed = () => {
    if (step === "hobby") return hobby.trim().length > 0;
    if (step === "goal") return goal.trim().length > 0;
    return true;
  };

  const getGradientStyle = () => {
    const colorsStr = gradient.colors.join(", ");
    
    if (gradient.animation === "wave") {
      return {
        background: `linear-gradient(45deg, ${colorsStr})`,
        backgroundSize: "400% 400%",
        animation: "gradient-wave 15s ease infinite",
      };
    } else if (gradient.animation === "pulse") {
      return {
        background: `radial-gradient(circle, ${colorsStr})`,
        backgroundSize: "200% 200%",
        animation: "gradient-pulse 10s ease infinite",
      };
    } else if (gradient.animation === "radial") {
      return {
        background: `radial-gradient(circle at center, ${colorsStr})`,
        backgroundSize: "150% 150%",
        animation: "gradient-radial 12s ease infinite",
      };
    }
    
    return {
      background: `linear-gradient(135deg, ${colorsStr})`,
      backgroundSize: "300% 300%",
      animation: "gradient-smooth 20s ease infinite",
    };
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradient-smooth {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-wave {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 50% 100%; }
          75% { background-position: 50% 0%; }
        }
        @keyframes gradient-pulse {
          0%, 100% { background-position: center; opacity: 0.8; }
          50% { background-position: center; opacity: 1; }
        }
        @keyframes gradient-radial {
          0%, 100% { background-size: 150% 150%; }
          50% { background-size: 200% 200%; }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {step === "generating" && (
          <motion.div
            className="fixed inset-0 opacity-20 -z-10"
            style={getGradientStyle()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          />
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {step === "generating" ? (
            <div className="p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center text-center py-8 sm:py-12 min-h-[400px] sm:min-h-[500px]"
                >
                  <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8 flex-shrink-0 flex items-center justify-center">
                    <ThinkingAnimation />
                  </div>
                  <motion.h2
                    className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Creating your learning path
                  </motion.h2>
                  
                  <AnimatePresence mode="wait">
                    {quotes.length > 0 && (
                      <motion.div
                        key={currentQuoteIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="px-4 sm:px-6 max-w-2xl mt-0"
                      >
                        <p className="text-base sm:text-lg text-foreground-muted italic">
                          "{quotes[currentQuoteIndex]}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {quotes.length === 0 && (
                    <p className="text-sm sm:text-base text-foreground-muted px-4 max-w-2xl mt-0">
                      Selecting the most impactful techniques for {hobby}...
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {step === "hobby" && (
                    <motion.div
                      key="hobby"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="text-center mb-6 sm:mb-8">
                        <motion.div
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-accent/10 flex items-center justify-center"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-accent" />
                        </motion.div>
                        <motion.h2
                          className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          What do you want to learn?
                        </motion.h2>
                        <motion.p
                          className="text-sm sm:text-base text-foreground-muted mb-3 sm:mb-4 px-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          We will create a focused plan with just 5-8 essential techniques
                        </motion.p>
                        <motion.div
                          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-accent/10 text-xs sm:text-sm text-foreground"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-accent"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          Pick one hobby to focus on 
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Choose ONE hobby or skill to master
                        </label>
                        <Input
                          placeholder="e.g., Guitar, Swimming, Chess, Poker..."
                          value={hobby}
                          onChange={(e) => handleHobbyChange(e.target.value)}
                          autoFocus
                        />
                        <p className="text-xs text-foreground-muted mt-2">
                          SideQuest focuses on mastery over breadth - one skill at a time
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          className="w-full h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg"
                          onClick={handleNext}
                          disabled={!canProceed()}
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}

                  {step === "goal" && (
                    <motion.div
                      key="goal"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="text-center mb-6 sm:mb-8">
                        <motion.div
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-accent/10 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Zap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-accent" />
                        </motion.div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                          What is your goal?
                        </h2>
                        <p className="text-sm sm:text-base text-foreground-muted px-2">
                          This helps us choose the most relevant techniques for you
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your learning goal
                        </label>
                        <Textarea
                          placeholder="e.g., Swim comfortably in a pool, play songs at parties, win local chess tournaments..."
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg" onClick={handleBack}>
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          className="flex-1 h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg"
                          onClick={handleNext}
                          disabled={!canProceed()}
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === "time" && (
                    <motion.div
                      key="time"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="text-center mb-6 sm:mb-8">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                          How much time can you commit?
                        </h2>
                        <p className="text-sm sm:text-base text-foreground-muted px-2">
                          We will adjust the depth of each technique to fit your schedule
                        </p>
                      </div>

                      <motion.div
                        className="p-4 sm:p-6 bg-accent/10 rounded-xl sm:rounded-2xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-center mb-4 sm:mb-6">
                          <motion.span
                            key={dailyMinutes}
                            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-accent block"
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            {formatDuration(dailyMinutes)}
                          </motion.span>
                          <p className="text-xs sm:text-sm text-foreground-muted mt-1">per day</p>
                        </div>

                        <Slider
                          value={[dailyMinutes]}
                          onValueChange={(value) => setDailyMinutes(value[0])}
                          min={10}
                          max={60}
                          step={5}
                          className="mb-4"
                        />

                        <div className="flex justify-between text-xs text-foreground-muted">
                          <span>10 min (Quick)</span>
                          <span>60 min (Deep)</span>
                        </div>
                      </motion.div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg" onClick={handleBack}>
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                        <Button className="flex-1 h-10 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg" onClick={handleNext}>
                          Create My Plan
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-2xl">⚠️</span>
                      </motion.div>
                      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                        Something went wrong
                      </h2>
                      <p className="text-foreground-muted mb-6">
                        {error || "Failed to create your plan. Please try again."}
                      </p>
                      <Button onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
}
