"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Loader2, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { useUIStore, useLearningPlanStore } from "@/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  Button,
  Card,
  CardContent,
} from "@/components/ui";

interface SubTechnique {
  name: string;
  description: string;
  whyItMatters: string;
  estimatedMinutes: number;
  youtubeQuery: string;
  practiceResource?: {
    name: string;
    url: string;
    description: string;
  };
}

export function DecompositionModal() {
  const isMobile = useUIStore((state) => state.isMobile);
  const { isOpen, techniqueId } = useUIStore((state) => state.modals.decompositionModal);
  const closeModal = useUIStore((state) => state.closeDecompositionModal);
  const plan = useLearningPlanStore((state) => state.plan);
  const technique = useLearningPlanStore((state) =>
    techniqueId ? state.getTechniqueById(techniqueId) : undefined
  );
  const addSubTechniques = useLearningPlanStore((state) => state.addSubTechniques);

  const [isDecomposing, setIsDecomposing] = useState(false);
  const [subTechniques, setSubTechniques] = useState<SubTechnique[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDecompose = async () => {
    if (!technique || !plan) return;

    setIsDecomposing(true);
    setError(null);

    try {
      const response = await fetch("/api/decompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technique,
          hobby: plan.hobby,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to decompose technique");
      }

      setSubTechniques(data.subTechniques);
      setReasoning(data.reasoning);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to break down technique");
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleConfirm = () => {
    if (!techniqueId || subTechniques.length === 0) return;

    addSubTechniques(techniqueId, subTechniques);
    setSubTechniques([]);
    setReasoning("");
    closeModal();
  };

  const handleCancel = () => {
    setSubTechniques([]);
    setReasoning("");
    setError(null);
    closeModal();
  };

  const DecompositionContent = () => (
    <>
      <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] pr-1 sm:pr-2">
        {technique && (
          <Card className="bg-lavender/20 border-lavender/30">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-foreground-muted mb-1">Current technique</p>
              <p className="font-display text-sm sm:text-base font-semibold text-foreground break-words">{technique.name}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-destructive mb-3">{error}</p>
              <Button size="sm" variant="outline" onClick={handleDecompose} className="w-full sm:w-auto">
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {subTechniques.length === 0 && !error ? (
          <div className="text-center py-6 sm:py-8 px-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Layers className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-accent" />
            </div>
            <p className="text-xs sm:text-sm text-foreground-muted mb-4">
              Finding this technique too challenging? Our AI can break it down into smaller, easier sub-techniques that you can learn one at a time.
            </p>
            <Button onClick={handleDecompose} disabled={isDecomposing} className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
              {isDecomposing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  Break it down
                </>
              )}
            </Button>
          </div>
        ) : subTechniques.length > 0 ? (
          <>
            {reasoning && (
              <Card className="bg-sky/10 border-sky/30">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-foreground-muted">{reasoning}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Suggested sub-techniques to learn first:
              </p>
              {subTechniques.map((subTech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-card-border hover:border-accent/30 transition-colors">
                    <CardContent className="p-2.5 sm:p-3">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-xs sm:text-sm font-semibold text-foreground mb-1 break-words">
                            {subTech.name}
                          </h4>
                          <p className="text-xs text-foreground-muted mb-2 line-clamp-2">
                            {subTech.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-foreground-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {subTech.estimatedMinutes} min
                            </span>
                            {subTech.practiceResource && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                Resource
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="bg-mint/10 border-mint/30">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground">
                    These will be added to your plan after the current technique.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {subTechniques.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="outline" className="flex-1 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="flex-1 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base" onClick={handleConfirm}>
            Add to my plan
          </Button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <BottomSheet open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Simplify This Technique</BottomSheetTitle>
            <BottomSheetDescription>
              Break down complex techniques into manageable steps
            </BottomSheetDescription>
          </BottomSheetHeader>
          <DecompositionContent />
        </BottomSheetContent>
      </BottomSheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Simplify This Technique</DialogTitle>
          <DialogDescription>
            Break down complex techniques into manageable sub-techniques
          </DialogDescription>
        </DialogHeader>
        <DecompositionContent />
      </DialogContent>
    </Dialog>
  );
}
