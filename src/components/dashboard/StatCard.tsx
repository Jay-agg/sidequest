"use client";

import { motion } from "framer-motion";
import { Card, FlickeringGrid } from "@/components/ui";
import { useIsMobile, useScrollAnimation } from "@/hooks";

interface StatCardProps {
  children: React.ReactNode;
  index: number;
}

export function StatCard({ children, index }: StatCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const isMobile = useIsMobile();

  const gridColors = [
    "rgb(168, 235, 207)", // mint/green for Mastered
    "rgb(255, 203, 184)", // peach/orange for Day streak
    "rgb(168, 216, 255)", // sky/blue for Time Practiced
    "rgb(201, 191, 236)", // lavender/purple for Quiz passed
  ];

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
  );
}
