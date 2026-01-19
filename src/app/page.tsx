"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Lightbulb, Target, Trophy } from "lucide-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile, useScrollAnimation } from "@/hooks";
import { Header, MobileNav } from "@/components/layout";
import { PlanSwitcher, PlanSwitcherDesktop } from "@/components/layout";
import { TechniqueCard, MasteryPath } from "@/components/technique";
import { ReplaceModal, ReasoningModal, DecompositionModal } from "@/components/modals";
import { CommitmentDial } from "@/components/commitment";
import { OnboardingForm } from "@/components/onboarding";
import { FocusedReader } from "@/components/reader";
import { Button, Card, CardContent, CircularProgress, TypingAnimation, NumberTicker, TransitionAnimation, FlickeringGrid } from "@/components/ui";
import { Plus } from "lucide-react";
import type { MasteryState } from "@/types";

function LearningDashboard() {
  const plan = useLearningPlanStore((state) => state.plan);
  const updateTechniqueMastery = useLearningPlanStore((state) => state.updateTechniqueMastery);
  const isTechniqueLocked = useLearningPlanStore((state) => state.isTechniqueLocked);
  const isMobile = useIsMobile();
  
  const progress = useMemo(() => {
    if (!plan) return { completed: 0, total: 0, percentage: 0 };
    const completed = plan.techniques.filter((t) => t.masteryState === "mastered").length;
    const total = plan.techniques.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [plan?.techniques?.map((t) => `${t.id}:${t.masteryState}`).join(","), plan?.techniques?.length]);

  const confettiFiredRef = useRef(false);
  
  useEffect(() => {
    if (!plan || confettiFiredRef.current) return;
    
    const allMastered = progress.completed === progress.total && progress.total > 0;
    
    if (allMastered) {
      confettiFiredRef.current = true;
      setTimeout(() => {
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
      }, 500);
    }
  }, [plan, progress.completed, progress.total]);

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
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={!isMobile ? {
                scale: 1.01,
                transition: { duration: 0.3 }
              } : {}}
              className="mb-8 rounded-3xl overflow-hidden border-[3px] border-card-border"
            >
              <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/7]">
                <img
                  src={plan.hobbyImageUrl}
                  alt={`${plan.hobby} learning journey`}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute inset-0 opacity-30">
                  <FlickeringGrid
                    squareSize={3}
                    gridGap={4}
                    flickerChance={0.15}
                    color="rgb(255, 255, 255)"
                    maxOpacity={0.2}
                  />
                </div>
                
                <div className="absolute top-4 right-4 hidden sm:block">
                  <PlanSwitcherDesktop />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg leading-tight">
                      <TypingAnimation
                        children={`Your ${plan.hobby} Journey`}
                        className="text-white leading-tight"
                        delay={0.3}
                        duration={50}
                        showCursor={false}
                        as="span"
                      />
                    </h1>
                    <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md">
                      <TypingAnimation
                        children={`${plan.techniques.length} techniques to master`}
                        className="text-white/90"
                        delay={0.8}
                        duration={30}
                        showCursor={false}
                        as="span"
                      />
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
                  <TypingAnimation
                    children={`Your ${plan.hobby} Journey`}
                    delay={0.3}
                    duration={50}
                    showCursor={false}
                    as="span"
                  />
                </h1>
                <p className="text-sm sm:text-base text-foreground-muted">
                  <TypingAnimation
                    children={`${plan.techniques.length} techniques to master`}
                    delay={0.8}
                    duration={30}
                    showCursor={false}
                    as="span"
                  />
                </p>
              </div>
              <Button variant="outline" onClick={openReasoningModal} size="sm" className="w-full sm:w-auto">
                <Lightbulb className="h-4 w-4" />
                Why this plan?
              </Button>
            </div>
          )}

          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
            <StatCard index={0}>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <CircularProgress value={progress.percentage} size={48} strokeWidth={5} className="sm:w-14 sm:h-14" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    <NumberTicker value={progress.completed} delay={1} className="text-foreground" />/<NumberTicker value={progress.total} delay={1.1} className="text-foreground" />
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Mastered</p>
                </div>
              </CardContent>
            </StatCard>

            <StatCard index={1}>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <StreakIcon />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    <NumberTicker value={plan.streakDays || 0} delay={1.2} className="text-foreground" />
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Day streak</p>
                </div>
              </CardContent>
            </StatCard>

            <StatCard index={2}>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-blue/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground leading-tight">
                    {totalPracticeHours > 0 ? (
                      <>
                        <NumberTicker value={totalPracticeHours} delay={1.3} className="text-foreground" />h <NumberTicker value={totalPracticeMinutes} delay={1.4} className="text-foreground" />m
                      </>
                    ) : (
                      <><NumberTicker value={totalPracticeMinutes} delay={1.3} className="text-foreground" />m</>
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Practiced</p>
                </div>
              </CardContent>
            </StatCard>

            <StatCard index={3}>
              <CardContent className="p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-mint/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    <NumberTicker value={plan.techniques.filter((t) => t.quizCompleted && (t.quizScore || 0) >= 80).length} delay={1.5} className="text-foreground" />
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">Quiz passed</p>
                </div>
              </CardContent>
            </StatCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <CommitmentDial />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">
          <ScrollSection>
            <motion.h2 
              className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6"
              initial={!isMobile ? { opacity: 0, x: -20 } : {}}
              animate={!isMobile ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your Techniques
            </motion.h2>
            <div className="space-y-4">
              <AnimatePresence>
                {plan.techniques
                  .sort((a, b) => a.order - b.order)
                  .map((technique, index) => (
                    <TechniqueCardWrapper key={technique.id} index={index}>
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
                    </TechniqueCardWrapper>
                  ))}
              </AnimatePresence>
            </div>
          </ScrollSection>

          <div className="hidden lg:block">
            <ScrollSection>
              <motion.div 
                className="sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
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
              </motion.div>
            </ScrollSection>
          </div>
        </div>
      </main>
      <PlanSwitcher />
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
  const showTransition = useUIStore((state) => state.showTransition);
  const setShowTransition = useUIStore((state) => state.setShowTransition);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

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

function StatCard({ children, index }: { children: React.ReactNode; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 })
  const isMobile = useIsMobile()

  const gridColors = [
    "rgb(168, 235, 207)", // mint/green for Mastered
    "rgb(255, 203, 184)", // peach/orange for Day streak
    "rgb(168, 216, 255)", // sky/blue for Time Practiced
    "rgb(201, 191, 236)", // lavender/purple for Quiz passed
  ]

  return (
    <motion.div
      ref={ref}
      initial={isMobile ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 0, y: 30, scale: 0.9 }}
      animate={
        isMobile 
          ? (isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 })
          : { opacity: 1, y: 0, scale: 1 }
      }
      whileHover={!isMobile ? { 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay: isMobile ? index * 0.1 : index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="relative"
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FlickeringGrid
            squareSize={2}
            gridGap={3}
            flickerChance={0.3}
            color={gridColors[index]}
            maxOpacity={0.4}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </Card>
    </motion.div>
  )
}

function ScrollSection({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const isMobile = useIsMobile()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isMobile && isVisible && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isMobile, isVisible, hasAnimated])

  return (
    <motion.div
      ref={ref}
      initial={isMobile ? { opacity: 0, y: 30 } : { opacity: 0, y: 40 }}
      animate={
        isMobile 
          ? (isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 })
          : (hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 })
      }
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

function TechniqueCardWrapper({ children, index }: { children: React.ReactNode; index: number }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0, rootMargin: "150px" })
  const isMobile = useIsMobile()

  return (
    <motion.div
      ref={ref}
      initial={isMobile ? { opacity: 0, y: 50, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
      animate={
        isMobile 
          ? (isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 })
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ willChange: isMobile ? "opacity, transform" : "auto" }}
    >
      {children}
    </motion.div>
  )
}

function StreakIcon() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/streak.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load streak animation:", err));
  }, []);

  if (!animationData) {
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-warm-yellow/20 flex items-center justify-center flex-shrink-0" />
    );
  }

  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-warm-yellow/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <Lottie animationData={animationData} loop={true} className="w-full h-full" />
    </div>
  );
}
