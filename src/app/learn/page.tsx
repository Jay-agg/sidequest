"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  BookOpen,
  Brain,
  Timer,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Trophy,
  Target,
  Flame,
} from "lucide-react";
import { Button, Card, CardContent, CircularProgress } from "@/components/ui";
import { useLearningPlanStore } from "@/stores";
import { Quiz, VideoPlayer, PracticeTimer } from "@/components/learning";
import { CelebrationModal } from "@/components/modals";
import { FlashCards, TeachBackMode } from "@/components/gamification";
import type { MasteryState, QuizQuestion } from "@/types";

type Tab = "learn" | "practice" | "quiz" | "flashcards" | "teachback";

const masteryLabels: Record<MasteryState, { label: string; color: string }> = {
  unstarted: { label: "Not Started", color: "bg-muted text-foreground-muted" },
  learning: { label: "Learning", color: "bg-sky-blue/30 text-sky-500" },
  practicing: { label: "Practicing", color: "bg-warm-yellow/30 text-yellow-500" },
  mastered: { label: "Mastered", color: "bg-mint/30 text-green-500" },
};

const defaultQuizQuestions: QuizQuestion[] = [
  {
    question: "What is the most important aspect when learning a new skill?",
    options: ["Speed", "Consistency and proper form", "Natural talent", "Expensive equipment"],
    correctIndex: 1,
  },
  {
    question: "How should you approach practice sessions?",
    options: ["Practice randomly", "Focus on weaknesses systematically", "Only practice what you're good at", "Avoid practicing"],
    correctIndex: 1,
  },
  {
    question: "When should you move to the next technique?",
    options: ["Immediately", "When you feel comfortable with the current one", "After one try", "Never"],
    correctIndex: 1,
  },
];

export default function LearnPage() {
  const router = useRouter();
  const plan = useLearningPlanStore((state) => state.plan);
  const activeTechniqueId = useLearningPlanStore((state) => state.activeTechniqueId);
  const setActiveTechnique = useLearningPlanStore((state) => state.setActiveTechnique);
  const updateTechniqueMastery = useLearningPlanStore((state) => state.updateTechniqueMastery);
  const updateQuizScore = useLearningPlanStore((state) => state.updateQuizScore);
  const logPractice = useLearningPlanStore((state) => state.logPractice);
  const isTechniqueLocked = useLearningPlanStore((state) => state.isTechniqueLocked);

  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedTechniqueName, setCelebratedTechniqueName] = useState("");

  const technique = useMemo(() => {
    if (!plan) return null;
    if (activeTechniqueId) {
      return plan.techniques.find((t) => t.id === activeTechniqueId) || null;
    }
    const sorted = [...plan.techniques].sort((a, b) => a.order - b.order);
    return sorted.find((t) => t.masteryState !== "mastered") || sorted[0];
  }, [plan, activeTechniqueId]);

  useEffect(() => {
    if (!plan) {
      router.push("/");
    }
  }, [plan, router]);

  useEffect(() => {
    if (technique && isTechniqueLocked(technique.id)) {
      router.push("/");
    }
  }, [technique, isTechniqueLocked, router]);

  useEffect(() => {
    if (technique && technique.masteryState === "unstarted") {
      updateTechniqueMastery(technique.id, "learning");
    }
  }, [technique?.id]);

  const handleQuizComplete = useCallback((score: number) => {
    if (!technique) return;
    updateQuizScore(technique.id, score);
    if (score >= 80) {
      setActiveTab("flashcards");
    }
  }, [technique, updateQuizScore]);

  const handlePracticeComplete = useCallback((minutes: number) => {
    if (!technique) return;
    logPractice(technique.id, minutes);
    updateTechniqueMastery(technique.id, "practicing");
  }, [technique, logPractice, updateTechniqueMastery]);

  const handleMarkMastered = useCallback(() => {
    if (!technique) return;
    
    setCelebratedTechniqueName(technique.name);
    setShowCelebration(true);
    updateTechniqueMastery(technique.id, "mastered");
  }, [technique, updateTechniqueMastery]);

  const handleCelebrationClose = useCallback(() => {
    setShowCelebration(false);
    
    if (plan && technique) {
      const sorted = [...plan.techniques].sort((a, b) => a.order - b.order);
      const nextTech = sorted.find((t) => t.id !== technique.id && t.masteryState !== "mastered");
      if (nextTech) {
        setActiveTechnique(nextTech.id);
        setActiveTab("learn");
      } else {
        router.push("/");
      }
    }
  }, [plan, technique, setActiveTechnique, router]);

  const progress = useMemo(() => {
    if (!plan) return 0;
    const completed = plan.techniques.filter((t) => t.masteryState === "mastered").length;
    return Math.round((completed / plan.techniques.length) * 100);
  }, [plan?.techniques.map((t) => t.masteryState).join(",")]);

  if (!plan || !technique) {
    return null;
  }

  const quizQuestions = technique.quizQuestions || defaultQuizQuestions;
  const youtubeQuery = technique.youtubeQuery || `${technique.name} ${plan.hobby} tutorial`;
  const masteryInfo = masteryLabels[technique.masteryState];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Plan</span>
            </Button>

            <div className="flex items-center gap-4">
              {plan.streakDays && plan.streakDays > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-yellow/20 text-sm">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-foreground">{plan.streakDays} day streak</span>
                </div>
              )}
              <CircularProgress value={progress} size={40} strokeWidth={4} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${masteryInfo.color}`}>
              {masteryInfo.label}
            </span>
            <span className="text-xs sm:text-sm text-foreground-muted">
              Technique {(technique.order || 0) + 1} of {plan.techniques.length}
            </span>
          </div>

          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5 sm:mb-2 leading-tight">
            {technique.name}
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted">{technique.description}</p>
        </div>

        <Card className="mb-4 sm:mb-6 bg-lavender/10 border-lavender/30">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-lavender/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-foreground mb-1">Why this matters</h3>
                <p className="text-xs sm:text-sm text-foreground-muted">{technique.whyItMatters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-5 gap-0.5 sm:gap-1 p-0.5 sm:p-1 mb-4 sm:mb-6 rounded-lg sm:rounded-xl bg-card border border-card-border overflow-x-auto">
          {[
            { id: "learn" as const, label: "Learn", icon: Play },
            { id: "quiz" as const, label: "Quiz", icon: Brain },
            { id: "flashcards" as const, label: "Cards", icon: Target },
            { id: "teachback" as const, label: "Teach", icon: Sparkles },
            { id: "practice" as const, label: "Practice", icon: Timer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 md:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[48px] ${
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground-muted hover:text-foreground hover:bg-accent/10"
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "learn" && (
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
                {/* <Button 
                  variant="outline" 
                  onClick={() => {
                    updateTechniqueMastery(technique.id, "practicing");
                    setActiveTab("practice");
                  }} 
                  className="gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I have learnt enough
                </Button> */}
                <Button onClick={() => setActiveTab("quiz")} className="gap-2">
                  Take the Quiz
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "quiz" && (
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
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        technique.quizScore >= 80 ? "bg-mint/30" : "bg-warm-yellow/30"
                      }`}>
                        <Trophy className={`w-8 h-8 ${
                          technique.quizScore >= 80 ? "text-green-500" : "text-yellow-500"
                        }`} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        Previous Score: {technique.quizScore}%
                      </h3>
                      <p className="text-foreground-muted mb-6">
                        {technique.quizScore >= 80 
                          ? "Great job! You've demonstrated understanding of this technique."
                          : "Consider reviewing the material and trying again."}
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="outline" onClick={() => setActiveTab("learn")}>
                          Review Material
                        </Button>
                        <Button onClick={() => setActiveTab("flashcards")}>
                          Continue to Cards
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Quiz
                      questions={quizQuestions}
                      onComplete={handleQuizComplete}
                      techniqueName={technique.name}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "flashcards" && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FlashCards
                questions={quizQuestions}
                techniqueName={technique.name}
                onComplete={(correct, total) => {
                  const score = Math.round((correct / total) * 100);
                  updateQuizScore(technique.id, score);
                }}
              />
            </motion.div>
          )}

          {activeTab === "teachback" && (
            <motion.div
              key="teachback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TeachBackMode
                technique={technique}
                onComplete={() => {
                  updateTechniqueMastery(technique.id, "practicing");
                  setActiveTab("practice");
                }}
              />
            </motion.div>
          )}

          {activeTab === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-accent" />
                    Practice Session
                  </h2>
                  
                  {plan.isTimerUseful === false && plan.timerRationale && (
                    <div className="mb-4 p-4 rounded-xl bg-warm-yellow/10 border border-warm-yellow/30">
                      <p className="text-sm text-foreground-muted">
                        <strong>Note:</strong> {plan.timerRationale}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-foreground-muted mb-6">
                    {plan.isTimerUseful !== false 
                      ? `Set a timer and practice ${technique.name.toLowerCase()}. Deliberate practice is the key to mastery.`
                      : `Practice ${technique.name.toLowerCase()} at your own pace. Focus on quality over timed sessions.`}
                  </p>

                  {technique.practiceResource && (
                    <div className="mb-6 p-4 rounded-xl bg-sky/10 border border-sky/30">
                      <h3 className="font-medium text-foreground mb-2">Free Practice Resource</h3>
                      <p className="text-sm text-foreground-muted mb-3">
                        {technique.practiceResource.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(technique.practiceResource!.url, '_blank')}
                        className="gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Visit {technique.practiceResource.name}
                      </Button>
                    </div>
                  )}

                  <PracticeTimer
                    targetMinutes={technique.estimatedMinutes}
                    onComplete={handlePracticeComplete}
                  />

                  <div className="mt-6 flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={handleMarkMastered}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Mastered
                    </Button>
                  </div>

                  {technique.practiceMinutes && technique.practiceMinutes > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-mint/10 border border-mint/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-mint/30 flex items-center justify-center">
                          <Target className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground-muted">Total practice time</p>
                          <p className="font-display font-bold text-foreground">
                            {technique.practiceMinutes} minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {technique.practiceMinutes && technique.practiceMinutes >= technique.estimatedMinutes && (
                <div className="mt-6">
                  <Card className="bg-accent/5 border-accent/30">
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        Ready to Master This?
                      </h3>
                      <p className="text-foreground-muted mb-4">
                        You've practiced enough to mark this technique as mastered and move on.
                      </p>
                      <Button onClick={handleMarkMastered} size="lg" className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Mastered
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-card-border lg:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {plan.techniques
              .sort((a, b) => a.order - b.order)
              .map((tech, index) => (
                <button
                  key={tech.id}
                  onClick={() => {
                    setActiveTechnique(tech.id);
                    setActiveTab("learn");
                  }}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    tech.id === technique.id
                      ? "bg-accent text-accent-foreground"
                      : tech.masteryState === "mastered"
                      ? "bg-mint/30 text-green-500"
                      : "bg-card text-foreground-muted hover:bg-accent/10"
                  }`}
                >
                  {tech.masteryState === "mastered" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        techniqueName={celebratedTechniqueName}
        motivationalQuotes={plan?.motivationalQuotes}
      />
    </div>
  );
}
