"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTitle } from "@/components/ui";
import { useMemo } from "react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  techniqueName: string;
  motivationalQuotes?: string[];
}

export function CelebrationModal({
  isOpen,
  onClose,
  techniqueName,
  motivationalQuotes = [],
}: CelebrationModalProps) {
  const randomQuote = useMemo(() => {
    if (motivationalQuotes.length === 0) {
      return "Every master was once a beginner. Keep going!";
    }
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }, [motivationalQuotes, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg overflow-hidden">
        <DialogTitle className="sr-only">
          Technique Mastered - {techniqueName}
        </DialogTitle>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 text-center py-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="mb-6 inline-block"
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
                    />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center">
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-display text-3xl font-bold text-foreground mb-3"
                >
                  Technique Mastered!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-foreground-muted mb-6"
                >
                  {techniqueName}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative mx-auto max-w-md mb-8"
                >
                  <div className="absolute -left-2 -top-2 text-4xl text-accent/30 font-serif">"</div>
                  <div className="absolute -right-2 -bottom-2 text-4xl text-accent/30 font-serif">"</div>
                  <p className="text-foreground italic text-lg leading-relaxed px-6 py-4">
                    {randomQuote}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button onClick={onClose} size="lg" className="gap-2">
                    Continue Learning
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
