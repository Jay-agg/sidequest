"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLearningPlanStore } from "@/stores";
import { CelebrationModal } from "@/components/modals";
import { FlashCards, TeachBackMode } from "@/components/gamification";
import { PlanSwitcher } from "@/components/layout";
import {
  LearnPageHeader,
  TechniqueHeader,
  WhyItMattersCard,
  TabNavigation,
  LearnTab,
  QuizTab,
  PracticeTab,
  useConfettiOnMastery,
} from "@/components/learn-page";
import type { QuizQuestion } from "@/types";

type Tab = "learn" | "practice" | "quiz" | "flashcards" | "teachback";

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
  const hasHydrated = useLearningPlanStore((state) => state.hasHydrated);
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
    if (hasHydrated && !plan) {
      router.push("/");
    }
  }, [hasHydrated, plan, router]);

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

  const masteredCount = useMemo(() => {
    if (!plan) return 0;
    return plan.techniques.filter((t) => t.masteryState === "mastered").length;
  }, [plan]);

  const willBeAllMastered = useMemo(() => {
    if (!plan || !technique) return false;
    return masteredCount + 1 === plan.techniques.length;
  }, [plan, technique, masteredCount]);

  const handleMarkMastered = useCallback(() => {
    if (!technique || !plan) return;

    setCelebratedTechniqueName(technique.name);
    setShowCelebration(true);
    updateTechniqueMastery(technique.id, "mastered");
  }, [technique, plan, updateTechniqueMastery]);

  useConfettiOnMastery({
    enabled: !!technique && !!plan,
    willBeAllMastered,
  });

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

  const getProgress = useLearningPlanStore((state) => state.getProgress);
  const progress = useMemo(() => {
    return getProgress().percentage;
  }, [getProgress, plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);

  if (!plan || !technique) {
    return null;
  }

  const quizQuestions = technique.quizQuestions || defaultQuizQuestions;

  return (
    <div className="min-h-screen bg-background">
      <LearnPageHeader plan={plan} progress={progress} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24">
        <TechniqueHeader technique={technique} plan={plan} />
        <WhyItMattersCard technique={technique} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === "learn" && (
            <LearnTab
              technique={technique}
              plan={plan}
              onNavigateToQuiz={() => setActiveTab("quiz")}
            />
          )}

          {activeTab === "quiz" && (
            <QuizTab
              technique={technique}
              quizQuestions={quizQuestions}
              onComplete={handleQuizComplete}
              onNavigateToLearn={() => setActiveTab("learn")}
              onNavigateToFlashcards={() => setActiveTab("flashcards")}
            />
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
            <PracticeTab
              technique={technique}
              plan={plan}
              onPracticeComplete={handlePracticeComplete}
              onMarkMastered={handleMarkMastered}
            />
          )}
        </AnimatePresence>
      </main>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        techniqueName={celebratedTechniqueName}
        motivationalQuotes={plan?.motivationalQuotes}
      />
      <PlanSwitcher />
    </div>
  );
}
