"use client";

import { X, Pencil } from "lucide-react";

type Mode = "view" | "edit";

interface HeaderButtonsProps {
  mode: Mode;
  hasPlans: boolean;
  onClose: () => void;
  onToggleMode: () => void;
}

export function HeaderButtons({ mode, hasPlans, onClose, onToggleMode }: HeaderButtonsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-card-border text-foreground active:scale-95 transition-all"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      {hasPlans && (
        <button
          type="button"
          className={`w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-card-border active:scale-95 transition-all ${
            mode === "edit" ? "text-accent border-accent" : "text-foreground"
          }`}
          onClick={onToggleMode}
          aria-label={mode === "edit" ? "Done editing" : "Edit hobbies"}
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
