"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, Download, Upload, AlertTriangle } from "lucide-react";
import { useLearningPlanStore, useUIStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { Header, MobileNav, PlanSwitcher } from "@/components/layout";
import { CommitmentDial } from "@/components/commitment";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";

function SettingsContent() {
  const plan = useLearningPlanStore((state) => state.plan);
  const isMobile = useIsMobile();
  const setIsMobile = useUIStore((state) => state.setIsMobile);
  const router = useRouter();

  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile, setIsMobile]);

  const handleExport = () => {
    if (!plan) return;

    const data = JSON.stringify(plan, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sidequest-${plan.hobby.toLowerCase().replace(/\s+/g, "-")}-plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearPlan = () => {
    setShowClearDialog(false);
    router.push("/new-plan");
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          Settings
        </h1>

        <div className="space-y-4 sm:space-y-6">
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CommitmentDial />
            </motion.div>
          )}

          {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">
                  Learning Plan
                </h2>
                <p className="text-xs sm:text-sm text-foreground-muted mb-3 sm:mb-4">
                  Currently learning: <span className="font-medium text-foreground">{plan.hobby}</span>
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4" />
                    Export Learning Plan
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => setShowClearDialog(true)}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start a New Learning Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  About SideQuest
                </h2>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-foreground-muted">
                  <p>
                    SideQuest helps you master any hobby by focusing on the most impactful
                    5-8 techniques. No information overload, just focused learning.
                  </p>
                  <p>
                    Your data is stored locally on your device. No account required.
                  </p>
                  <div className="pt-3 sm:pt-4 border-t border-card-border">
                    <p className="text-xs text-foreground-subtle">Version 1.0.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <MobileNav />

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-accent" />
              Add Another Hobby
            </DialogTitle>
            <DialogDescription>
              Create another plan to learn in parallel. Your existing hobbies stay saved locally.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-lavender/20 rounded-xl mb-4">
            <p className="text-sm text-foreground">
              <span className="font-medium">Tip:</span> You can switch between hobbies anytime from the header (desktop) or the plus button (mobile).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)} className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
              Cancel
            </Button>
            <Button onClick={handleClearPlan} className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base">
              Create New Hobby
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PlanSwitcher />
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
