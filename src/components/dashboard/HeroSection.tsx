"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Button, TypingAnimation, FlickeringGrid } from "@/components/ui";
import { PlanSwitcherDesktop } from "@/components/layout";
import { useUIStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import type { LearningPlan } from "@/types";

interface HeroSectionProps {
  plan: LearningPlan;
}

export function HeroSection({ plan }: HeroSectionProps) {
  const isMobile = useIsMobile();
  const openReasoningModal = useUIStore((state) => state.openReasoningModal);

  if (plan.hobbyImageUrl) {
    return (
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
                  key={`hero-title-${plan.id}`}
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
                  key={`hero-count-${plan.id}`}
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
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
          <TypingAnimation
            key={`hero-title-fallback-${plan.id}`}
            children={`Your ${plan.hobby} Journey`}
            delay={0.3}
            duration={50}
            showCursor={false}
            as="span"
          />
        </h1>
        <p className="text-sm sm:text-base text-foreground-muted">
          <TypingAnimation
            key={`hero-count-fallback-${plan.id}`}
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
  );
}
