"use client";

import { useEffect, useMemo } from "react";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { Header, MobileNav } from "@/components/layout";
import { PlanSwitcher } from "@/components/layout";
import { ReasoningModal, DecompositionModal } from "@/components/modals";
import { CommitmentDial } from "@/components/commitment";
import { OnboardingForm } from "@/components/onboarding";
import { TransitionAnimation } from "@/components/ui";
import {
  HeroSection,
  StatsGrid,
  TechniquesSection,
  ProgressPathSection,
  useConfettiEffect,
} from "@/components/dashboard";
import type { MasteryState } from "@/types";

function LearningDashboard() {
  const plan = useLearningPlanStore((state) => state.plan);
  const updateTechniqueMastery = useLearningPlanStore((state) => state.updateTechniqueMastery);
  const isTechniqueLocked = useLearningPlanStore((state) => state.isTechniqueLocked);
  const getProgress = useLearningPlanStore((state) => state.getProgress);
  const openDecompositionModal = useUIStore((state) => state.openDecompositionModal);

  const progress = useMemo(() => {
    return getProgress();
  }, [getProgress, plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);

  useConfettiEffect({
    completed: progress.completed,
    total: progress.total,
    enabled: !!plan,
  });

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

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <HeroSection plan={plan} />
          <StatsGrid plan={plan} progress={progress} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <CommitmentDial />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">
          <TechniquesSection
            plan={plan}
            nextTechnique={nextTechnique}
            isTechniqueLocked={isTechniqueLocked}
            onStart={handleStart}
            onUpdateMastery={handleUpdateMastery}
            onDecompose={openDecompositionModal}
          />
          <ProgressPathSection
            techniques={plan.techniques}
            selectedId={nextTechnique?.id}
            onSelectTechnique={(id) => {
              const element = document.getElementById(`technique-${id}`);
              element?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </div>
      </main>
      <PlanSwitcher />
      <MobileNav />
      <ReasoningModal />
      <DecompositionModal />
    </div>
  );
}

export default function HomePage() {
  const plan = useLearningPlanStore((state) => state.plan);
  const hasHydrated = useLearningPlanStore((state) => state.hasHydrated);
  const isMobile = useIsMobile();
  const setIsMobile = useUIStore((state) => state.setIsMobile);
  const showTransition = useUIStore((state) => state.showTransition);
  const setShowTransition = useUIStore((state) => state.setShowTransition);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-foreground-muted">Loading…</div>
      </div>
    );
  }

  if (!plan) {
    return <OnboardingForm />;
  }

  if (showTransition && isMobile) {
    return (
      <>
        <LearningDashboard />
        <TransitionAnimation
          onComplete={() => {
            setShowTransition(false);
          }}
        />
      </>
    );
  }

  return <LearningDashboard />;
}

