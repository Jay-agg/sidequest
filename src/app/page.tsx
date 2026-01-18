"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Flame, Target, Trophy } from "lucide-react";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { Header, MobileNav } from "@/components/layout";
import { TechniqueCard, MasteryPath } from "@/components/technique";
import { ReplaceModal, ReasoningModal, DecompositionModal } from "@/components/modals";
import { CommitmentDial } from "@/components/commitment";
import { OnboardingForm } from "@/components/onboarding";
import { FocusedReader } from "@/components/reader";
import { Button, Card, CardContent, CircularProgress } from "@/components/ui";
import type { MasteryState } from "@/types";

function LearningDashboard() {
  const plan = useLearningPlanStore((state) => state.plan);
  const updateTechniqueMastery = useLearningPlanStore((state) => state.updateTechniqueMastery);
  const isTechniqueLocked = useLearningPlanStore((state) => state.isTechniqueLocked);
  
  const progress = useMemo(() => {
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.techniques.filter((t) => t.masteryState === "mastered").length;
    const total = plan.techniques.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);

  const openReplaceModal = useUIStore((state) => state.openReplaceModal);
  const openReasoningModal = useUIStore((state) => state.openReasoningModal);
  const openDecompositionModal = useUIStore((state) => state.openDecompositionModal);
  const openReader = useUIStore((state) => state.openReader);

  const nextTechnique = useMemo(() => {
    if (!plan) return undefined;
    const sorted = [...plan.techniques].sort((a, b) => a.order - b.order);
    return sorted.find((t) => t.masteryState !== "mastered");
  }, [plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(",")]);

  if (!plan) return null;

  const handleStart = (techniqueId: string) => {
    updateTechniqueMastery(techniqueId, "learning");
  };

  const handleUpdateMastery = (techniqueId: string, state: MasteryState) => {
    updateTechniqueMastery(techniqueId, state);
  };

  const totalPracticeHours = Math.floor((plan.totalPracticeMinutes || 0) / 60);
  const totalPracticeMinutes = (plan.totalPracticeMinutes || 0) % 60;

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {plan.hobbyImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-3xl overflow-hidden border-[3px] border-card-border"
            >
              <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/7]">
                <img
                  src={plan.hobbyImageUrl}
                  alt={`${plan.hobby} learning journey`}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg leading-tight">
                      Your {plan.hobby} Journey
                    </h1>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md">
                      {plan.techniques.length} techniques to master
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={openReasoningModal}
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm flex-shrink-0"
                  >
                    <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Why this plan?</span>
                    <span className="sm:hidden">Why?</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {!plan.hobbyImageUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  Your {plan.hobby} Journey
                </h1>
                <p className="text-sm sm:text-base text-foreground-muted">
                  {plan.techniques.length} techniques to master
                </p>
              </div>
              <Button variant="outline" onClick={openReasoningModal} size="sm" className="w-full sm:w-auto">
                <Lightbulb className="h-4 w-4" />
                Why this plan?
              </Button>
            </div>
          )}

          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <CircularProgress value={progress.percentage} size={48} strokeWidth={5} className="sm:w-14 sm:h-14" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    {progress.completed}/{progress.total}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Mastered</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-warm-yellow/20 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    {plan.streakDays || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Day streak</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-blue/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground leading-tight">
                    {totalPracticeHours > 0 ? `${totalPracticeHours}h ${totalPracticeMinutes}m` : `${totalPracticeMinutes}m`}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Practiced</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-mint/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    {plan.techniques.filter((t) => t.quizCompleted && (t.quizScore || 0) >= 80).length}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Quiz passed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <CommitmentDial />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
              Your Techniques
            </h2>
            <div className="space-y-4">
              <AnimatePresence>
                {plan.techniques
                  .sort((a, b) => a.order - b.order)
                  .map((technique, index) => (
                    <motion.div
                      key={technique.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TechniqueCard
                        technique={technique}
                        isActive={technique.id === nextTechnique?.id}
                        isLocked={isTechniqueLocked(technique.id)}
                        onStart={() => handleStart(technique.id)}
                        onUpdateMastery={(state) =>
                          handleUpdateMastery(technique.id, state)
                        }
                        onReplace={() => openReplaceModal(technique.id)}
                        onDecompose={() => openDecompositionModal(technique.id)}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Progress Path
              </h2>
              <Card className="p-4">
                <MasteryPath
                  techniques={plan.techniques}
                  onSelectTechnique={(id) => {
                    const element = document.getElementById(`technique-${id}`);
                    element?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  selectedId={nextTechnique?.id}
                />
              </Card>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
      <ReplaceModal />
      <ReasoningModal />
      <DecompositionModal />
      <FocusedReader />
    </div>
  );
}

export default function HomePage() {
  const plan = useLearningPlanStore((state) => state.plan);
  const isMobile = useIsMobile();
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  if (!plan) {
    return <OnboardingForm />;
  }

  return <LearningDashboard />;
}
