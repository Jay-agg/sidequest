"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { Header, MobileNav } from "@/components/layout";
import { Button, Card, CardContent, Progress } from "@/components/ui";
import { ReplaceModal, ReasoningModal, DecompositionModal } from "@/components/modals";
import { FocusedReader } from "@/components/reader";
import { OnboardingForm } from "@/components/onboarding";
import type { Technique, MasteryState } from "@/types";

function TechniqueDetail({ technique }: { technique: Technique }) {
  const updateTechniqueMastery = useLearningPlanStore((state) => state.updateTechniqueMastery);
  const openReader = useUIStore((state) => state.openReader);
  const openReplaceModal = useUIStore((state) => state.openReplaceModal);
  const openDecompositionModal = useUIStore((state) => state.openDecompositionModal);

  const handleProgressState = () => {
    const progression: Record<MasteryState, MasteryState> = {
      unstarted: "learning",
      learning: "practicing",
      practicing: "mastered",
      mastered: "mastered",
    };
    updateTechniqueMastery(technique.id, progression[technique.masteryState]);
  };

  const stateLabels: Record<MasteryState, string> = {
    unstarted: "Start Learning",
    learning: "Mark as Practicing",
    practicing: "Mark as Mastered",
    mastered: "Mastered",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          {technique.name}
        </h2>
        <p className="text-foreground-muted">{technique.description}</p>
      </div>

      <Card className="bg-lavender/20">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-1">Why this matters</h3>
          <p className="text-sm text-foreground-muted">{technique.whyItMatters}</p>
        </CardContent>
      </Card>

      {technique.microSteps && technique.microSteps.length > 0 && (
        <Card className="bg-mint/20">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-3">Simplified Steps</h3>
            <ol className="space-y-2">
              {technique.microSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success text-white text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {technique.resources.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">Resources</h3>
          <div className="space-y-3">
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
                    <p className="font-medium text-foreground">{resource.title}</p>
                    <p className="text-sm text-foreground-muted">{resource.description}</p>
                    <p className="text-xs text-foreground-subtle mt-1">
                      {resource.type} - {resource.estimatedMinutes} min
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-foreground-subtle" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1"
          variant={technique.masteryState === "mastered" ? "success" : "default"}
          onClick={handleProgressState}
          disabled={technique.masteryState === "mastered"}
        >
          {technique.masteryState === "mastered" && <CheckCircle2 className="h-4 w-4" />}
          {stateLabels[technique.masteryState]}
        </Button>

        {technique.masteryState !== "mastered" && technique.masteryState !== "unstarted" && (
          <Button variant="outline" onClick={() => openDecompositionModal(technique.id)}>
            Too Hard
          </Button>
        )}

        <Button variant="ghost" onClick={() => openReplaceModal(technique.id)}>
          Replace
        </Button>
      </div>
    </motion.div>
  );
}

function LearnContent() {
  const plan = useLearningPlanStore((state) => state.plan);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  if (!plan) return <OnboardingForm />;

  const sortedTechniques = [...plan.techniques].sort((a, b) => a.order - b.order);
  const currentTechnique = sortedTechniques[currentIndex];
  const progress = ((currentIndex + 1) / sortedTechniques.length) * 100;

  const goNext = () => {
    if (currentIndex < sortedTechniques.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">
              Technique {currentIndex + 1} of {sortedTechniques.length}
            </span>
            <span className="text-sm font-medium text-accent">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-1">
            {sortedTechniques.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-accent w-6"
                    : t.masteryState === "mastered"
                    ? "bg-mint"
                    : "bg-foreground-subtle/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goNext}
            disabled={currentIndex === sortedTechniques.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <TechniqueDetail key={currentTechnique.id} technique={currentTechnique} />
        </AnimatePresence>
      </main>

      <MobileNav />
      <ReplaceModal />
      <ReasoningModal />
      <DecompositionModal />
      <FocusedReader />
    </div>
  );
}

export default function LearnPage() {
  return <LearnContent />;
}
