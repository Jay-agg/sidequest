"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { LearningPlan } from "@/types";

interface PaginationDotsProps {
  plans: LearningPlan[];
  viewedIndex: number;
  viewingAddCard: boolean;
  deletingId: string | null;
  onSelectPlan: (index: number) => void;
  onViewAddCard: () => void;
  onAdd: () => void;
}

export function PaginationDots({
  plans,
  viewedIndex,
  viewingAddCard,
  deletingId,
  onSelectPlan,
  onViewAddCard,
  onAdd,
}: PaginationDotsProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2">
      {plans.map((p, idx) => {
        const isViewed = idx === viewedIndex && !viewingAddCard;
        const isDeleting = deletingId === p.id;
        return (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => {
              onSelectPlan(idx);
            }}
            disabled={isDeleting}
            className={`h-2 rounded-full transition-all ${
              isViewed ? "w-8 bg-accent" : "w-2 bg-muted"
            }`}
            aria-label={`View ${p.hobby}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        );
      })}
      <motion.button
        type="button"
        onClick={() => {
          if (viewingAddCard) {
            onAdd();
          } else {
            onViewAddCard();
          }
        }}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border-2 ${
          viewingAddCard
            ? "border-accent bg-accent/10 text-accent"
            : "border-muted hover:border-accent text-muted-foreground hover:text-accent hover:bg-accent/10"
        } active:scale-95`}
        aria-label="Add new hobby"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-3 h-3" />
      </motion.button>
    </div>
  );
}
