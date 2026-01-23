"use client";

import { Play, Brain, Target, Sparkles, Timer } from "lucide-react";

type Tab = "learn" | "practice" | "quiz" | "flashcards" | "teachback";

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: "learn" as const, label: "Learn", icon: Play },
  { id: "quiz" as const, label: "Quiz", icon: Brain },
  { id: "flashcards" as const, label: "Cards", icon: Target },
  { id: "teachback" as const, label: "Teach", icon: Sparkles },
  { id: "practice" as const, label: "Practice", icon: Timer },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="grid grid-cols-5 gap-0.5 sm:gap-1 p-0.5 sm:p-1 mb-4 sm:mb-6 rounded-lg sm:rounded-xl bg-card border border-card-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 md:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[48px] ${
            activeTab === tab.id
              ? "bg-accent text-accent-foreground"
              : "text-foreground-muted hover:text-foreground hover:bg-accent/10"
          }`}
        >
          <tab.icon className="w-4 h-4 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
