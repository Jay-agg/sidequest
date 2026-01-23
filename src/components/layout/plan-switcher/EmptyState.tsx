"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <Plus className="w-12 h-12 text-accent" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Start your first hobby
        </h2>
        <p className="text-sm text-foreground-muted mb-6">
          Create a focused learning plan to master any skill.
        </p>
        <Button className="h-12 px-6 text-base gap-2" onClick={onAdd}>
          <Plus className="w-5 h-5" />
          Create a plan
        </Button>
      </div>
    </motion.div>
  );
}
