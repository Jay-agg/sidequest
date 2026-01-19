"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLearningPlanStore } from "@/stores";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

type Mode = "view" | "edit";

export function PlanSwitcherDesktop() {
  const router = useRouter();
  const plans = useLearningPlanStore((s) => s.plans);
  const activePlanId = useLearningPlanStore((s) => s.activePlanId);
  const setActivePlan = useLearningPlanStore((s) => s.setActivePlan);
  const deletePlan = useLearningPlanStore((s) => s.deletePlan);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("view");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activePlan = useMemo(() => plans.find((p) => p.id === activePlanId) ?? null, [plans, activePlanId]);

  const handleAdd = () => {
    setOpen(false);
    router.push("/new-plan");
  };

  const handleDelete = (planId: string) => {
    setDeletingId(planId);
    deletePlan(planId);
    setTimeout(() => setDeletingId(null), 250);
    if (plans.length === 1) {
      setTimeout(() => setOpen(false), 300);
    }
  };

  return (
    <>
      <button
        type="button"
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
        onClick={() => setOpen(true)}
        aria-label="Manage hobbies"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">{activePlan?.hobby ?? "Add hobby"}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[92vw] max-h-[85vh] overflow-hidden flex flex-col" hideCloseButton>
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Your hobbies</DialogTitle>
                <DialogDescription>
                  Switch between plans, add new ones, or manage existing hobbies.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {plans.length > 0 && (
                  <button
                    type="button"
                    className={`w-9 h-9 rounded-full bg-card flex items-center justify-center border border-card-border active:scale-95 transition-all ${
                      mode === "edit" ? "text-accent border-accent" : "text-foreground"
                    }`}
                    onClick={() => setMode((m) => (m === "edit" ? "view" : "edit"))}
                    aria-label={mode === "edit" ? "Done editing" : "Edit hobbies"}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center border border-card-border text-foreground hover:text-destructive active:scale-95 transition-all"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between gap-3 mb-4 flex-shrink-0">
              <div className="text-sm text-foreground-muted">
                {plans.length} active plan{plans.length === 1 ? "" : "s"}
              </div>
              <Button
                className="h-10 px-4 text-sm gap-2"
                onClick={handleAdd}
              >
                <Plus className="w-4 h-4" />
                Add hobby
              </Button>
            </div>

            {plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Plus className="w-10 h-10 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Start your first hobby
                </h3>
                <p className="text-sm text-foreground-muted mb-6 max-w-md">
                  Create a focused learning plan to master any skill. Your progress is saved locally and you can switch between hobbies anytime.
                </p>
                <Button className="h-11 px-6 text-base gap-2" onClick={handleAdd}>
                  <Plus className="w-5 h-5" />
                  Create a plan
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {plans.map((p) => {
                    const mastered = p.techniques.filter((t) => t.masteryState === "mastered").length;
                    const isActive = p.id === activePlanId;
                    const isDeleting = deletingId === p.id;
                    return (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={cn(
                            "border-[3px] border-card-border hover:border-accent/40 transition-all cursor-pointer relative overflow-hidden",
                            isActive && "border-accent"
                          )}
                          onClick={() => {
                            if (mode === "view") {
                              setActivePlan(p.id);
                              setOpen(false);
                            }
                          }}
                        >
                          {p.hobbyImageUrl && (
                            <div className="relative h-32 overflow-hidden">
                              <img
                                src={p.hobbyImageUrl}
                                alt={p.hobby}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                          )}
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted mb-1">
                                  {isActive ? "Active" : "Saved"}
                                </p>
                                <h3 className="font-display text-xl font-bold text-foreground truncate">
                                  {p.hobby}
                                </h3>
                                <p className="text-sm text-foreground-muted line-clamp-2 mt-1">
                                  {p.goal}
                                </p>
                              </div>
                              {mode === "edit" && (
                                <button
                                  type="button"
                                  className="w-10 h-10 rounded-2xl border-2 border-card-border bg-card-bg flex items-center justify-center text-foreground-muted hover:text-destructive hover:border-destructive transition-colors active:scale-95 flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(p.id);
                                  }}
                                  aria-label="Delete hobby"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-xs text-foreground-muted">
                              <div className="p-2 rounded-xl bg-card-bg/80 border border-card-border">
                                <p className="font-display text-base font-semibold text-foreground">
                                  {mastered}
                                </p>
                                <p>Mastered</p>
                              </div>
                              <div className="p-2 rounded-xl bg-card-bg/80 border border-card-border">
                                <p className="font-display text-base font-semibold text-foreground">
                                  {p.streakDays || 0}
                                </p>
                                <p>Streak</p>
                              </div>
                              <div className="p-2 rounded-xl bg-card-bg/80 border border-card-border">
                                <p className="font-display text-base font-semibold text-foreground">
                                  {p.dailyMinutes}
                                </p>
                                <p>min/day</p>
                              </div>
                            </div>

                            {mode === "view" && (
                              <Button
                                className="w-full mt-4 h-10 text-sm"
                                variant={isActive ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePlan(p.id);
                                  setOpen(false);
                                }}
                              >
                                {isActive ? "Currently active" : "Switch to this hobby"}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
