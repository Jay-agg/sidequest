"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button, Input, Textarea, Slider, Card, CardContent, LoadingPulse } from "@/components/ui";
import { useLearningPlanStore } from "@/stores";
import { formatDuration } from "@/lib/utils";

type Step = "hobby" | "goal" | "time" | "generating" | "error";

export function OnboardingForm() {
  const [step, setStep] = useState<Step>("hobby");
  const [hobby, setHobby] = useState("");
  const [goal, setGoal] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const setPlan = useLearningPlanStore((state) => state.setPlan);
  const setIsGenerating = useLearningPlanStore((state) => state.setIsGenerating);

  const handleNext = () => {
    if (step === "hobby") setStep("goal");
    else if (step === "goal") setStep("time");
    else if (step === "time") handleGenerate();
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
      setIsGenerating(false);
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {step === "hobby" && (
              <motion.div
                key="hobby"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    What do you want to learn?
                  </h2>
                  <p className="text-foreground-muted mb-3">
                    We will create a focused plan with just 5-8 essential techniques
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky/30 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Pick one hobby to focus on 
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Choose ONE hobby or skill to master
                  </label>
                  <Input
                    placeholder="e.g., Guitar, Swimming, Chess, Poker..."
                    value={hobby}
                    onChange={(e) => setHobby(e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-foreground-subtle mt-2">
                    Learn8 focuses on mastery over breadth - one skill at a time
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === "goal" && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    What is your goal?
                  </h2>
                  <p className="text-foreground-muted">
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
                  <Button variant="outline" className="flex-1" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    How much time can you commit?
                  </h2>
                  <p className="text-foreground-muted">
                    We will adjust the depth of each technique to fit your schedule
                  </p>
                </div>

                <div className="p-6 bg-lavender/20 rounded-2xl">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-display font-bold text-accent">
                      {formatDuration(dailyMinutes)}
                    </span>
                    <p className="text-sm text-foreground-muted mt-1">per day</p>
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
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button className="flex-1" size="lg" onClick={handleNext}>
                    Create My Plan
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <LoadingPulse />
                <h2 className="font-display text-2xl font-bold text-foreground mb-2 mt-6">
                  Creating your learning path
                </h2>
                <p className="text-foreground-muted">
                  Selecting the most impactful techniques for {hobby}...
                </p>
              </motion.div>
            )}

            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="text-2xl">!</span>
                </div>
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
    </div>
  );
}
