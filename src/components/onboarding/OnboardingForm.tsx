"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button, Input, Textarea, Slider, Card, CardContent } from "@/components/ui";
import { useLearningPlanStore } from "@/stores";
import { formatDuration } from "@/lib/utils";
import type { LearningPlan, Technique } from "@/types";
import { generateId } from "@/lib/utils";

type Step = "hobby" | "goal" | "time" | "generating";

const sampleTechniques: Technique[] = [
  {
    id: generateId(),
    name: "Basic Chord Progressions",
    description: "Learn the fundamental chord shapes and transitions that form the backbone of most songs",
    whyItMatters: "85% of popular songs use just 4 basic chords - master these and you can play thousands of songs",
    estimatedMinutes: 25,
    depthLevel: "intermediate",
    masteryState: "unstarted",
    resources: [
      {
        id: generateId(),
        title: "Beginner Guitar Chords Guide",
        url: "https://example.com/chords",
        type: "article",
        estimatedMinutes: 15,
        description: "Visual guide to essential guitar chords",
      },
    ],
    prerequisites: [],
    order: 0,
  },
  {
    id: generateId(),
    name: "Strumming Patterns",
    description: "Develop rhythm through essential strumming techniques",
    whyItMatters: "Good rhythm is what makes music sound musical - even simple chords sound great with solid rhythm",
    estimatedMinutes: 20,
    depthLevel: "intermediate",
    masteryState: "unstarted",
    resources: [],
    prerequisites: [],
    order: 1,
  },
  {
    id: generateId(),
    name: "Finger Positioning",
    description: "Learn proper hand placement to reduce fatigue and increase speed",
    whyItMatters: "Correct technique prevents injury and makes playing easier as you advance",
    estimatedMinutes: 15,
    depthLevel: "intermediate",
    masteryState: "unstarted",
    resources: [],
    prerequisites: [],
    order: 2,
  },
  {
    id: generateId(),
    name: "Simple Melodies",
    description: "Play recognizable tunes using single notes",
    whyItMatters: "Builds finger independence and ear training while keeping practice fun",
    estimatedMinutes: 20,
    depthLevel: "intermediate",
    masteryState: "unstarted",
    resources: [],
    prerequisites: [],
    order: 3,
  },
  {
    id: generateId(),
    name: "Chord Transitions",
    description: "Practice smooth movement between chords",
    whyItMatters: "Seamless transitions are what separate beginners from intermediate players",
    estimatedMinutes: 25,
    depthLevel: "intermediate",
    masteryState: "unstarted",
    resources: [],
    prerequisites: [],
    order: 4,
  },
  {
    id: generateId(),
    name: "Reading Tablature",
    description: "Understand guitar tabs to learn any song",
    whyItMatters: "Tabs let you learn thousands of songs without reading traditional sheet music",
    estimatedMinutes: 15,
    depthLevel: "intermediate",
    masteryState: "unstarted",
    resources: [],
    prerequisites: [],
    order: 5,
  },
];

export function OnboardingForm() {
  const [step, setStep] = useState<Step>("hobby");
  const [hobby, setHobby] = useState("");
  const [goal, setGoal] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
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
  };

  const handleGenerate = async () => {
    setStep("generating");
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const actualTechniques = sampleTechniques.map((tech, index) => ({
      ...tech,
      id: generateId(),
      name: `${hobby} Technique ${index + 1}`,
      description: `Learn essential ${hobby} skills - technique ${index + 1}`,
      whyItMatters: `This technique helps you progress in ${hobby}`,
      order: index,
    }));

    const plan: LearningPlan = {
      id: generateId(),
      hobby: hobby || "Your Hobby",
      goal: goal || "Master the fundamentals",
      dailyMinutes,
      techniques: actualTechniques,
      reasoning: `This plan focuses on the most impactful techniques for learning ${hobby}. The techniques are ordered to build on each other, starting with fundamentals and progressing to more advanced skills. With ${dailyMinutes} minutes per day, you'll make steady progress toward: ${goal}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setPlan(plan);
    setIsGenerating(false);
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
                    placeholder="e.g., Guitar, Watercolor painting, Chess..."
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
                    placeholder="e.g., Play my favorite songs at campfires, paint landscapes for my apartment..."
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center"
                >
                  <Loader2 className="h-10 w-10 text-accent" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Creating your plan
                </h2>
                <p className="text-foreground-muted">
                  Analyzing techniques and selecting the most impactful ones...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
