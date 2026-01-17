"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, BookOpen, ExternalLink } from "lucide-react";
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
  const isMobile = useIsMobile();

  const nextTechnique = useLearningPlanStore((state) => {
    if (!state.plan) return undefined;
    const sorted = [...state.plan.techniques].sort((a, b) => a.order - b.order);
    return sorted.find((t) => t.masteryState !== "mastered");
  });

  if (!plan) return null;

  const handleStart = (techniqueId: string) => {
    updateTechniqueMastery(techniqueId, "learning");
    const technique = plan.techniques.find((t) => t.id === techniqueId);
    if (technique && technique.resources.length > 0) {
      openReader(technique.resources[0].url, technique.resources[0].title);
    }
  };

  const handleUpdateMastery = (techniqueId: string, state: MasteryState) => {
    updateTechniqueMastery(techniqueId, state);
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                Your Learning Path
              </h1>
              <p className="text-foreground-muted">
                {plan.techniques.length} techniques to master {plan.hobby}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={openReasoningModal}>
                <Lightbulb className="h-4 w-4" />
                Why this plan?
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">Progress</h2>
                  <CircularProgress value={progress.percentage} size={64} strokeWidth={4} />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {["unstarted", "learning", "practicing", "mastered"].map((state) => {
                    const count = plan.techniques.filter(
                      (t) => t.masteryState === state
                    ).length;
                    const colors: Record<string, string> = {
                      unstarted: "bg-foreground-subtle/20",
                      learning: "bg-sky",
                      practicing: "bg-peach",
                      mastered: "bg-mint",
                    };
                    return (
                      <div key={state} className="text-center">
                        <div
                          className={`w-8 h-8 mx-auto mb-2 rounded-full ${colors[state]} flex items-center justify-center`}
                        >
                          <span className="text-sm font-semibold">{count}</span>
                        </div>
                        <p className="text-xs text-foreground-muted capitalize">{state}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <CommitmentDial />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Your Learning Journey
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
                        onStart={() => handleStart(technique.id)}
                        onUpdateMastery={(state) =>
                          handleUpdateMastery(technique.id, state)
                        }
                        onReplace={() => openReplaceModal(technique.id)}
                        onDecompose={() => openDecompositionModal(technique.id)}
                      />
                      
                      {technique.id === nextTechnique?.id && technique.resources.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 grid gap-3 sm:grid-cols-2"
                        >
                          {technique.resources.map((resource) => (
                            <Card
                              key={resource.id}
                              className="cursor-pointer hover:bg-lavender/20 transition-all"
                              onClick={() => openReader(resource.url, resource.title)}
                            >
                              <CardContent className="p-4 flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                  <BookOpen className="h-5 w-5 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground line-clamp-1">
                                    {resource.title}
                                  </p>
                                  <p className="text-xs text-foreground-muted">
                                    {resource.type} - {resource.estimatedMinutes} min
                                  </p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-foreground-subtle" />
                              </CardContent>
                            </Card>
                          ))}
                        </motion.div>
                      )}
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
