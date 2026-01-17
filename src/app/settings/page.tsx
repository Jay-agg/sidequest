"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, Download, Upload, AlertTriangle } from "lucide-react";
import { useLearningPlanStore, useUIStore, useSyncStore } from "@/stores";
import { useIsMobile } from "@/hooks";
import { Header, MobileNav } from "@/components/layout";
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
  const clearPlan = useLearningPlanStore((state) => state.clearPlan);
  const pendingCount = useSyncStore((state) =>
    state.queue.filter((a) => !a.synced).length
  );
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
    a.download = `learn8-${plan.hobby.toLowerCase().replace(/\s+/g, "-")}-plan.json`;
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Settings
        </h1>

        <div className="space-y-6">
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CommitmentDial />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Sync Status
                </h2>
                <div className="flex items-center justify-between p-4 bg-lavender/20 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Pending Actions</p>
                    <p className="text-sm text-foreground-muted">
                      Actions waiting to be synced
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-accent/10 text-accent font-semibold">
                    {pendingCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {plan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Learning Plan
                </h2>
                <p className="text-sm text-foreground-muted mb-4">
                  Currently learning: <span className="font-medium text-foreground">{plan.hobby}</span>
                </p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4" />
                    Export Learning Plan
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
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
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  About Learn8
                </h2>
                <div className="space-y-4 text-sm text-foreground-muted">
                  <p>
                    Learn8 helps you master any hobby by focusing on the most impactful
                    5-8 techniques. No information overload, just focused learning.
                  </p>
                  <p>
                    Your data is stored locally on your device. No account required.
                  </p>
                  <div className="pt-4 border-t border-card-border">
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
              Start a New Learning Plan
            </DialogTitle>
            <DialogDescription>
              This will clear your current progress for {plan?.hobby || "your hobby"} and let you choose a different hobby to learn. Your current plan will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-lavender/20 rounded-xl mb-4">
            <p className="text-sm text-foreground">
              <span className="font-medium">Tip:</span> Export your current plan first if you want to save your progress.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClearPlan}>
              Start New Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}
