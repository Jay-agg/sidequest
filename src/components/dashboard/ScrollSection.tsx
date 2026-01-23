"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile, useScrollAnimation } from "@/hooks";

interface ScrollSectionProps {
  children: React.ReactNode;
}

export function ScrollSection({ children }: ScrollSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const isMobile = useIsMobile();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isMobile && isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isMobile, isVisible, hasAnimated]);

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
  );
}
