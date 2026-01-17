"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Check, X } from "lucide-react";
import { useUIStore, useLearningPlanStore } from "@/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetFooter,
  Button,
  Card,
  CardContent,
} from "@/components/ui";
import type { Technique } from "@/types";

interface ReplacementOption {
  id: string;
  name: string;
  description: string;
  whyItMatters: string;
  whyBetter: string;
}

const mockReplacements: ReplacementOption[] = [
  {
    id: "replacement-1",
    name: "Alternative Technique A",
    description: "A simpler approach that achieves similar results",
    whyItMatters: "Builds the same foundational skills with less complexity",
    whyBetter: "Easier to learn and practice consistently",
  },
  {
    id: "replacement-2",
    name: "Alternative Technique B",
    description: "A more focused version of the original technique",
    whyItMatters: "Targets the core skill without extra overhead",
    whyBetter: "Takes less time while delivering core value",
  },
];

interface ReplaceContentProps {
  technique: Technique | undefined;
  selectedReplacement: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function ReplaceContent({
  technique,
  selectedReplacement,
  onSelect,
  onConfirm,
  onCancel,
}: ReplaceContentProps) {
  if (!technique) return null;

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-foreground-muted">
          Current technique: <span className="font-medium text-foreground">{technique.name}</span>
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {mockReplacements.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedReplacement === option.id
                    ? "ring-2 ring-accent bg-accent/5"
                    : "hover:bg-lavender/20"
                }`}
                onClick={() => onSelect(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-foreground mb-1">
                        {option.name}
                      </h4>
                      <p className="text-sm text-foreground-muted mb-2">
                        {option.description}
                      </p>
                      <div className="p-2 bg-mint/30 rounded-lg">
                        <p className="text-xs font-medium text-success">
                          Why this is better: {option.whyBetter}
                        </p>
                      </div>
                    </div>
                    {selectedReplacement === option.id && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          className="flex-1"
          disabled={!selectedReplacement}
          onClick={onConfirm}
        >
          <RefreshCw className="h-4 w-4" />
          Replace Technique
        </Button>
      </div>
    </>
  );
}

export function ReplaceModal() {
  const isMobile = useUIStore((state) => state.isMobile);
  const { isOpen, techniqueId } = useUIStore((state) => state.modals.replaceModal);
  const closeModal = useUIStore((state) => state.closeReplaceModal);
  const technique = useLearningPlanStore((state) =>
    techniqueId ? state.getTechniqueById(techniqueId) : undefined
  );
  const replaceTechnique = useLearningPlanStore((state) => state.replaceTechnique);

  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!techniqueId || !selectedReplacement) return;

    const replacement = mockReplacements.find((r) => r.id === selectedReplacement);
    if (!replacement) return;

    replaceTechnique(techniqueId, {
      id: replacement.id,
      name: replacement.name,
      description: replacement.description,
      whyItMatters: replacement.whyItMatters,
      estimatedMinutes: 30,
      depthLevel: "intermediate",
      masteryState: "unstarted",
      resources: [],
      prerequisites: [],
      order: 0,
    });

    setSelectedReplacement(null);
    closeModal();
  };

  const handleCancel = () => {
    setSelectedReplacement(null);
    closeModal();
  };

  if (isMobile) {
    return (
      <BottomSheet open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Replace Technique</BottomSheetTitle>
            <BottomSheetDescription>
              Choose a replacement that better fits your learning style
            </BottomSheetDescription>
          </BottomSheetHeader>
          <ReplaceContent
            technique={technique}
            selectedReplacement={selectedReplacement}
            onSelect={setSelectedReplacement}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </BottomSheetContent>
      </BottomSheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Replace Technique</DialogTitle>
          <DialogDescription>
            Choose a replacement that better fits your learning style
          </DialogDescription>
        </DialogHeader>
        <ReplaceContent
          technique={technique}
          selectedReplacement={selectedReplacement}
          onSelect={setSelectedReplacement}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
