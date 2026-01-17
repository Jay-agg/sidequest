"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Loader2 } from "lucide-react";
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

export function DecompositionModal() {
  const isMobile = useUIStore((state) => state.isMobile);
  const { isOpen, techniqueId } = useUIStore((state) => state.modals.decompositionModal);
  const closeModal = useUIStore((state) => state.closeDecompositionModal);
  const technique = useLearningPlanStore((state) =>
    techniqueId ? state.getTechniqueById(techniqueId) : undefined
  );
  const decomposeTechnique = useLearningPlanStore((state) => state.decomposeTechnique);

  const [isDecomposing, setIsDecomposing] = useState(false);
  const [microSteps, setMicroSteps] = useState<string[]>([]);

  const handleDecompose = async () => {
    if (!techniqueId) return;

    setIsDecomposing(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const generatedSteps = [
      "Start with the most basic form of the technique",
      "Practice the core movement for 5 minutes daily",
      "Add one variation once comfortable",
      "Combine with related techniques gradually",
    ];

    setMicroSteps(generatedSteps);
    setIsDecomposing(false);
  };

  const handleConfirm = () => {
    if (!techniqueId || microSteps.length === 0) return;

    decomposeTechnique(techniqueId, microSteps);
    setMicroSteps([]);
    closeModal();
  };

  const handleCancel = () => {
    setMicroSteps([]);
    closeModal();
  };

  const DecompositionContent = () => (
    <div className="space-y-4">
      {technique && (
        <Card className="bg-lavender/20">
          <CardContent className="p-4">
            <p className="text-sm text-foreground-muted mb-1">Current technique</p>
            <p className="font-display font-semibold text-foreground">{technique.name}</p>
          </CardContent>
        </Card>
      )}

      {microSteps.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Layers className="h-8 w-8 text-accent" />
          </div>
          <p className="text-sm text-foreground-muted mb-4">
            Finding this technique too challenging? We can break it down into smaller, more manageable steps.
          </p>
          <Button onClick={handleDecompose} disabled={isDecomposing}>
            {isDecomposing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Breaking down...
              </>
            ) : (
              <>
                <Layers className="h-4 w-4" />
                Break it down
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          <div className="p-4 bg-mint/20 rounded-xl">
            <p className="text-sm font-medium text-foreground mb-3">
              Here are simpler steps to master this technique:
            </p>
            <ol className="space-y-3">
              {microSteps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success text-white text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Apply these steps
            </Button>
          </div>
        </>
      )}
    </div>
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Simplify This Technique</DialogTitle>
          <DialogDescription>
            Break down complex techniques into manageable steps
          </DialogDescription>
        </DialogHeader>
        <DecompositionContent />
      </DialogContent>
    </Dialog>
  );
}
