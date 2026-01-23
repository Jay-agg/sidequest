"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLearningPlanStore } from "@/stores";
import { usePlanSwitcherContext } from "./PlanSwitcherContext";
import {
  PlanCard,
  AddHobbyCard,
  PreviewCard,
  EmptyState,
  HeaderButtons,
  PaginationDots,
} from "./plan-switcher";

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

  const [viewedIndex, setViewedIndex] = useState(activeIndex);

  useEffect(() => {
    setViewedIndex(activeIndex);
  }, [activeIndex]);

  const handleClose = () => {
    setOpen(false);
    setMode("view");
    setDeletingId(null);
    setViewingAddCard(false);
    setViewedIndex(activeIndex);
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
    if (!swipe) {
      return;
    }
    
    if (viewingAddCard) {
      if (offsetX > 0) {
        setViewingAddCard(false);
        setViewedIndex(activeIndex);
      }
      return;
    }
    
    if (offsetX < 0) {
      if (viewedIndex === plans.length - 1) {
        setViewingAddCard(true);
      } else {
        const nextIndex = viewedIndex + 1;
        if (nextIndex < plans.length) {
          setViewedIndex(nextIndex);
        }
      }
    } else {
      const prevIndex = viewedIndex - 1;
      if (prevIndex >= 0) {
        setViewedIndex(prevIndex);
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
            <HeaderButtons
              mode={mode}
              hasPlans={plans.length > 0}
              onClose={handleClose}
              onToggleMode={() => setMode((m) => (m === "edit" ? "view" : "edit"))}
            />

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
                            const isViewed = idx === viewedIndex;
                            const mastered = p.techniques.filter((t) => t.masteryState === "mastered").length;
                            const canSwipeLeft = idx < plans.length - 1;
                            const canSwipeRight = idx > 0;
                            
                            if (isViewed) {
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
                                    setActivePlan(p.id, true);
                                    handleClose();
                                  }}
                                  onDelete={() => handleDelete(p.id)}
                                  isDeleting={deletingId === p.id}
                                  isActive={isActive}
                                />
                              );
                            }
                            
                            const offset = idx - viewedIndex;
                            if (Math.abs(offset) > 1) return null;
                            
                            return (
                              <PreviewCard
                                key={p.id}
                                plan={p}
                                mastered={mastered}
                                offset={offset}
                                onClick={() => {
                                  setViewedIndex(idx);
                                }}
                              />
                            );
                          })}
                          
                          {viewedIndex === plans.length - 1 && (
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


                {plans.length === 0 && <EmptyState onAdd={handleAdd} />}
              </div>
            </div>

            <PaginationDots
              plans={plans}
              viewedIndex={viewedIndex}
              viewingAddCard={viewingAddCard}
              deletingId={deletingId}
              onSelectPlan={(idx) => {
                setViewedIndex(idx);
                setViewingAddCard(false);
              }}
              onViewAddCard={() => setViewingAddCard(true)}
              onAdd={handleAdd}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

