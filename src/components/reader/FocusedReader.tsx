"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useUIStore } from "@/stores";
import { Button, Card, CardContent } from "@/components/ui";

export function FocusedReader() {
  const reader = useUIStore((state) => state.reader);
  const closeReader = useUIStore((state) => state.closeReader);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!reader.isOpen) {
      setSessionMinutes(0);
      setShowWarning(false);
      return;
    }

    const interval = setInterval(() => {
      setSessionMinutes((prev) => {
        const newValue = prev + 1;
        if (newValue >= 30 && !showWarning) {
          setShowWarning(true);
        }
        return newValue;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [reader.isOpen, showWarning]);

  const handleDone = () => {
    closeReader();
  };

  if (!reader.isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      <div className="h-full flex flex-col">
        <header className="flex-shrink-0 glass border-b border-card-border px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleDone}>
                <X className="h-5 w-5" />
              </Button>
              <div>
                <p className="font-display font-semibold text-foreground line-clamp-1">
                  {reader.resourceTitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <Clock className="h-3 w-3" />
                  {sessionMinutes} min in session
                </div>
              </div>
            </div>
            <Button size="sm" variant="success" onClick={handleDone}>
              <CheckCircle2 className="h-4 w-4" />
              I have learned enough
            </Button>
          </div>
        </header>

        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-shrink-0 bg-warning/20 border-b border-warning/30 px-4 py-3"
            >
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <p className="text-sm text-foreground">
                  You have been learning for {sessionMinutes} minutes. Remember, depth comes from practice, not just consumption.
                </p>
                <Button size="sm" variant="warning" onClick={handleDone}>
                  Take a break
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden">
          {reader.resourceUrl && (
            <iframe
              src={reader.resourceUrl}
              className="w-full h-full border-0"
              title={reader.resourceTitle || "Learning resource"}
              sandbox="allow-same-origin allow-scripts"
            />
          )}
        </main>

        <footer className="flex-shrink-0 glass border-t border-card-border px-4 py-4 sm:hidden">
          <div className="flex gap-3">
            <Button className="flex-1 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base" variant="success" onClick={handleDone}>
              <CheckCircle2 className="h-4 w-4" />
              Done Learning
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => reader.resourceUrl && window.open(reader.resourceUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
