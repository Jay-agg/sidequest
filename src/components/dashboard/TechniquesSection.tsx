"use client";

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { TechniqueCard } from "@/components/technique";
import { TechniqueCardWrapper } from "./TechniqueCardWrapper";
import { ScrollSection } from "./ScrollSection";
import { useIsMobile } from "@/hooks";
import type { LearningPlan, Technique, MasteryState } from "@/types";

interface TechniquesSectionProps {
  plan: LearningPlan;
  nextTechnique: Technique | undefined;
  isTechniqueLocked: (techniqueId: string) => boolean;
  onStart: (techniqueId: string) => void;
  onUpdateMastery: (techniqueId: string, state: MasteryState) => void;
  onDecompose: (techniqueId: string) => void;
}

export function TechniquesSection({
  plan,
  nextTechnique,
  isTechniqueLocked,
  onStart,
  onUpdateMastery,
  onDecompose,
}: TechniquesSectionProps) {
  const isMobile = useIsMobile();

  return (
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
                  onStart={() => onStart(technique.id)}
                  onUpdateMastery={(state) => onUpdateMastery(technique.id, state)}
                  onDecompose={() => onDecompose(technique.id)}
                />
              </TechniqueCardWrapper>
            ))}
        </AnimatePresence>
      </div>
    </ScrollSection>
  );
}
