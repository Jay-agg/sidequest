"use client";

import { motion } from "framer-motion";
import { useIsMobile, useScrollAnimation } from "@/hooks";

interface TechniqueCardWrapperProps {
  children: React.ReactNode;
  index: number;
}

export function TechniqueCardWrapper({ children, index }: TechniqueCardWrapperProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0, rootMargin: "150px" });
  const isMobile = useIsMobile();

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
  );
}
