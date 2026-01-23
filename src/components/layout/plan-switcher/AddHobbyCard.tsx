"use client";

import { PanInfo, useMotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddHobbyCardProps {
  onClick: () => void;
  onSwipeLeft?: () => void;
  isActive?: boolean;
}

export function AddHobbyCard({ onClick, onSwipeLeft, isActive = false }: AddHobbyCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-300, 0, 300], isActive ? [1, 1, 0.2] : [0.2, 0.6, 0.2]);
  const scale = useTransform(x, [-300, 0, 300], isActive ? [1, 1, 0.85] : [0.85, 0.85, 0.85]);

  const translateX = isActive ? "0" : "calc(100% + 16px)";
  const baseOpacity = isActive ? 1 : 0.6;
  const baseScale = isActive ? 1 : 0.85;

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const threshold = 80;
    const swipe = Math.abs(offsetX) > threshold || Math.abs(velocityX) > 500;
    if (!swipe) return;

    if (offsetX > 0 && onSwipeLeft) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      drag={isActive ? "x" : false}
      dragConstraints={isActive ? { left: 0, right: 300 } : undefined}
      dragElastic={isActive ? 0.2 : 0}
      onDragEnd={isActive ? handleDragEnd : undefined}
      className={isActive ? "w-full relative" : "absolute top-0 w-full cursor-pointer"}
      style={{
        transform: isActive ? undefined : `translateX(${translateX}) scale(${baseScale})`,
        zIndex: isActive ? 10 : 1,
        x: isActive ? x : undefined,
        opacity: isActive ? opacity : baseOpacity,
        scale: isActive ? scale : baseScale,
      }}
      initial={{ opacity: 0, x: isActive ? 0 : 20 }}
      animate={{ opacity: baseOpacity, x: 0 }}
      exit={{ opacity: 0, x: isActive ? 0 : 20 }}
      onClick={onClick}
      whileTap={{ scale: isActive ? 0.98 : 0.83 }}
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-[3px] border-black border-dashed bg-card/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2 text-center">
            Add hobby
          </h2>
          <p className="text-sm text-white/80 text-center mb-4">
            Create a new learning plan
          </p>
        </div>
      </div>
    </motion.div>
  );
}
