"use client";

import { Lightbulb } from "lucide-react";
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
} from "@/components/ui";

export function ReasoningModal() {
  const isMobile = useUIStore((state) => state.isMobile);
  const isOpen = useUIStore((state) => state.modals.reasoningModal.isOpen);
  const closeModal = useUIStore((state) => state.closeReasoningModal);
  const plan = useLearningPlanStore((state) => state.plan);

  if (!plan) return null;

  const ReasoningContent = () => (
    <>
      <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] pr-1 sm:pr-2">
        <div className="p-3 sm:p-4 bg-lavender/30 rounded-lg sm:rounded-xl">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display text-sm sm:text-base font-semibold text-foreground mb-1">
                Why this plan?
              </h4>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                {plan.reasoning}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
          <div className="p-3 sm:p-4 bg-mint/20 rounded-lg sm:rounded-xl">
            <p className="text-xs font-medium text-foreground-muted mb-1">Your Goal</p>
            <p className="text-xs sm:text-sm font-medium text-foreground break-words">{plan.goal}</p>
          </div>
          <div className="p-3 sm:p-4 bg-peach/20 rounded-lg sm:rounded-xl">
            <p className="text-xs font-medium text-foreground-muted mb-1">Daily Commitment</p>
            <p className="text-xs sm:text-sm font-medium text-foreground">{plan.dailyMinutes} minutes</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-sky/20 rounded-lg sm:rounded-xl">
          <p className="text-xs font-medium text-foreground-muted mb-2">Techniques in order</p>
          <ol className="space-y-1.5 sm:space-y-2">
            {plan.techniques
              .sort((a, b) => a.order - b.order)
              .map((technique, index) => (
                <li key={technique.id} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground break-words">{technique.name}</span>
                </li>
              ))}
          </ol>
        </div>
      </div>

      <Button className="w-full mt-4 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base" onClick={closeModal}>
        Got it
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <BottomSheet open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Your Learning Plan</BottomSheetTitle>
            <BottomSheetDescription>
              Understanding why these techniques were chosen for you
            </BottomSheetDescription>
          </BottomSheetHeader>
          <ReasoningContent />
        </BottomSheetContent>
      </BottomSheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-3xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Your Learning Plan</DialogTitle>
          <DialogDescription>
            Understanding why these techniques were chosen for you
          </DialogDescription>
        </DialogHeader>
        <ReasoningContent />
      </DialogContent>
    </Dialog>
  );
}
