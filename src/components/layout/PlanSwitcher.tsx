"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLearningPlanStore } from "@/stores";
import { Button } from "@/components/ui";
import { usePlanSwitcherContext } from "./PlanSwitcherContext";
import type { LearningPlan } from "@/types";

type Mode = "view" | "edit";

export function PlanSwitcher() {
  const router = useRouter();
  const plans = useLearningPlanStore((s) => s.plans);
  const activePlanId = useLearningPlanStore((s) => s.activePlanId);
  const setActivePlan = useLearningPlanStore((s) => s.setActivePlan);
  const deletePlan = useLearningPlanStore((s) => s.deletePlan);
  const { open, setOpen, isZooming } = usePlanSwitcherContext();
  const [mode, setMode] = useState<Mode>("view");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingAddCard, setViewingAddCard] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    const idx = plans.findIndex((p) => p.id === activePlanId);
    return idx >= 0 ? idx : 0;
  }, [plans, activePlanId]);

  const handleClose = () => {
    setOpen(false);
    setMode("view");
    setDeletingId(null);
    setViewingAddCard(false);
  };

  const handleAdd = () => {
    handleClose();
    router.push("/new-plan");
  };

  const handleDelete = (planId: string) => {
    setDeletingId(planId);
    deletePlan(planId);
    setTimeout(() => setDeletingId(null), 250);
    if (plans.length === 1) {
      setTimeout(() => handleClose(), 300);
    }
  };

  const onDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const threshold = 80;
    const swipe = Math.abs(offsetX) > threshold || Math.abs(velocityX) > 500;
    if (!swipe) return;
    
    if (viewingAddCard) {
      if (offsetX > 0) {
        setViewingAddCard(false);
      }
      return;
    }
    
    if (offsetX < 0) {
      if (activeIndex === plans.length - 1) {
        setViewingAddCard(true);
      } else {
        const nextIndex = activeIndex + 1;
        if (nextIndex < plans.length) {
          const next = plans[nextIndex];
          if (next) setActivePlan(next.id);
        }
      }
    } else {
      const prevIndex = activeIndex - 1;
      if (prevIndex >= 0) {
        const prev = plans[prevIndex];
        if (prev) setActivePlan(prev.id);
      }
    }
  };

  const onDragEndEdit = (planId: string, info: PanInfo) => {
    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;
    const threshold = 90;
    const swipeUp = offsetY < -threshold || velocityY < -700;
    if (!swipeUp) return;
    handleDelete(planId);
  };

  const activePlan = plans.find((p) => p.id === activePlanId);

  return (
    <>
      <AnimatePresence>
        {isZooming && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={containerRef}
            className="fixed inset-0 z-[60] bg-background"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-card-border text-foreground active:scale-95 transition-all"
                onClick={handleClose}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              {plans.length > 0 && (
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full bg-card/80 backdrop-blur-md flex items-center justify-center border border-card-border active:scale-95 transition-all ${
                    mode === "edit" ? "text-accent border-accent" : "text-foreground"
                  }`}
                  onClick={() => setMode((m) => (m === "edit" ? "view" : "edit"))}
                  aria-label={mode === "edit" ? "Done editing" : "Edit hobbies"}
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="h-full flex items-center justify-center px-4">
              <div className="w-full max-w-md relative">
                <div className="relative w-full" style={{ perspective: "1000px" }}>
                  {plans.length > 0 && (
                    <>
                      {viewingAddCard ? (
                        <AddHobbyCard 
                          onClick={handleAdd}
                          onSwipeLeft={() => setViewingAddCard(false)}
                          isActive={true}
                        />
                      ) : (
                        <>
                          {plans.map((p, idx) => {
                            const isActive = p.id === activePlanId;
                            const mastered = p.techniques.filter((t) => t.masteryState === "mastered").length;
                            const canSwipeLeft = idx < plans.length - 1;
                            const canSwipeRight = true;
                            
                            if (isActive) {
                              return (
                                <PlanCard
                                  key={p.id}
                                  plan={p}
                                  mastered={mastered}
                                  mode={mode}
                                  canSwipeLeft={canSwipeLeft}
                                  canSwipeRight={canSwipeRight}
                                  onDragEnd={mode === "view" ? onDragEnd : (_e, info) => onDragEndEdit(p.id, info)}
                                  onSelect={() => {
                                    setActivePlan(p.id);
                                    handleClose();
                                  }}
                                  onDelete={() => handleDelete(p.id)}
                                  isDeleting={deletingId === p.id}
                                  isActive={true}
                                />
                              );
                            }
                            
                            const offset = idx - activeIndex;
                            if (Math.abs(offset) > 1) return null;
                            
                            return (
                              <PreviewCard
                                key={p.id}
                                plan={p}
                                mastered={mastered}
                                offset={offset}
                                onClick={() => setActivePlan(p.id)}
                              />
                            );
                          })}
                          
                          {activeIndex === plans.length - 1 && (
                            <AddHobbyCard 
                              onClick={() => setViewingAddCard(true)}
                              isActive={false}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>


                {plans.length === 0 && (
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
                      <Button className="h-12 px-6 text-base gap-2" onClick={handleAdd}>
                        <Plus className="w-5 h-5" />
                        Create a plan
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2">
              {plans.map((p) => {
                const isActive = p.id === activePlanId && !viewingAddCard;
                const isDeleting = deletingId === p.id;
                return (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePlan(p.id);
                      setViewingAddCard(false);
                    }}
                    disabled={isDeleting}
                    className={`h-2 rounded-full transition-all ${
                      isActive ? "w-8 bg-accent" : "w-2 bg-muted"
                    }`}
                    aria-label={`Switch to ${p.hobby}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                );
              })}
              <motion.button
                type="button"
                onClick={() => {
                  if (viewingAddCard) {
                    handleAdd();
                  } else {
                    setViewingAddCard(true);
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface PlanCardProps {
  plan: LearningPlan;
  mastered: number;
  mode: Mode;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
  onDragEnd: (event: any, info: PanInfo) => void;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isActive: boolean;
}

interface PreviewCardProps {
  plan: LearningPlan;
  mastered: number;
  offset: number;
  onClick: () => void;
}

interface AddHobbyCardProps {
  onClick: () => void;
  onSwipeLeft?: () => void;
  isActive?: boolean;
}

function PlanCard({
  plan,
  mastered,
  mode,
  canSwipeLeft,
  canSwipeRight,
  onDragEnd,
  onSelect,
  onDelete,
  isDeleting,
  isActive,
}: PlanCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-300, 0, 300], [0.2, 1, 0.2]);
  const scale = useTransform(x, [-300, 0, 300], [0.85, 1, 0.85]);

  return (
    <motion.div
      drag={mode === "view" ? "x" : "y"}
      dragConstraints={mode === "view" ? { left: canSwipeRight ? -300 : 0, right: canSwipeLeft ? 300 : 0 } : { top: 0, bottom: 0 }}
      dragElastic={mode === "view" ? 0.2 : 0.2}
      onDragEnd={onDragEnd}
      style={{ x, opacity, scale, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      className="w-full relative"
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-[3px] border-black bg-card">
        {plan.hobbyImageUrl && (
          <img
            src={plan.hobbyImageUrl}
            alt={plan.hobby}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-1">
              {mode === "edit" ? "Swipe up to delete" : "Your hobby"}
            </p>
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              {plan.hobby}
            </h2>
            <p className="text-sm text-white/80 line-clamp-2">
              {plan.goal}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="font-display text-xl font-bold text-white">{mastered}</p>
                <p className="text-xs text-white/70">Mastered</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="font-display text-xl font-bold text-white">{plan.streakDays || 0}</p>
                <p className="text-xs text-white/70">Streak</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <p className="font-display text-xl font-bold text-white">{plan.dailyMinutes}</p>
                <p className="text-xs text-white/70">min/day</p>
              </div>
            </div>

            {mode === "edit" ? (
              <Button
                variant="outline"
                className="w-full h-12 text-base border-destructive text-destructive hover:bg-destructive/10 hover:border-destructive"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete hobby
              </Button>
            ) : (
              <Button
                className="w-full h-12 text-base"
                onClick={onSelect}
              >
                Continue this hobby
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddHobbyCard({ onClick, onSwipeLeft, isActive = false }: AddHobbyCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-300, 0, 300], isActive ? [1, 1, 0.2] : [0.2, 0.6, 0.2]);
  const scale = useTransform(x, [-300, 0, 300], isActive ? [1, 1, 0.85] : [0.85, 0.85, 0.85]);
  
  const translateX = isActive ? "0" : "calc(100% + 16px)";
  const baseOpacity = isActive ? 1 : 0.6;
  const baseScale = isActive ? 1 : 0.85;

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const threshold = 80;
    const swipe = Math.abs(offsetX) > threshold || Math.abs(velocityX) > 500;
    if (!swipe) return;
    
    if (offsetX > 0 && onSwipeLeft) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      drag={isActive ? "x" : false}
      dragConstraints={isActive ? { left: 0, right: 300 } : undefined}
      dragElastic={isActive ? 0.2 : 0}
      onDragEnd={isActive ? handleDragEnd : undefined}
      className={isActive ? "w-full relative" : "absolute top-0 w-full cursor-pointer"}
      style={{
        transform: isActive ? undefined : `translateX(${translateX}) scale(${baseScale})`,
        zIndex: isActive ? 10 : 1,
        x: isActive ? x : undefined,
        opacity: isActive ? opacity : baseOpacity,
        scale: isActive ? scale : baseScale,
      }}
      initial={{ opacity: 0, x: isActive ? 0 : 20 }}
      animate={{ opacity: baseOpacity, x: 0 }}
      exit={{ opacity: 0, x: isActive ? 0 : 20 }}
      onClick={onClick}
      whileTap={{ scale: isActive ? 0.98 : 0.83 }}
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-[3px] border-black border-dashed bg-card/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2 text-center">
            Add hobby
          </h2>
          <p className="text-sm text-white/80 text-center mb-4">
            Create a new learning plan
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewCard({ plan, mastered, offset, onClick }: PreviewCardProps) {
  const isLeft = offset < 0;
  const translateX = isLeft ? "calc(-100% - 16px)" : "calc(100% + 16px)";
  const scale = 0.85;
  const opacity = 0.6;

  return (
    <motion.div
      className="absolute top-0 w-full cursor-pointer"
      style={{
        transform: `translateX(${translateX}) scale(${scale})`,
        zIndex: isLeft ? 1 : 1,
        opacity,
      }}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -20 : 20 }}
      onClick={onClick}
      whileHover={{ opacity: 0.8, scale: 0.87 }}
      whileTap={{ scale: 0.83 }}
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-[3px] border-black bg-card">
        {plan.hobbyImageUrl && (
          <img
            src={plan.hobbyImageUrl}
            alt={plan.hobby}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70 mb-1">
              Your hobby
            </p>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {plan.hobby}
            </h2>
            <p className="text-sm text-white/80 line-clamp-2">
              {plan.goal}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="font-display text-lg font-bold text-white">{mastered}</p>
              <p className="text-xs text-white/70">Mastered</p>
            </div>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="font-display text-lg font-bold text-white">{plan.streakDays || 0}</p>
              <p className="text-xs text-white/70">Streak</p>
            </div>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <p className="font-display text-lg font-bold text-white">{plan.dailyMinutes}</p>
              <p className="text-xs text-white/70">min/day</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
