"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLearningPlanStore } from "@/stores";
import { OnboardingForm } from "@/components/onboarding";

export default function NewPlanPage() {
  const router = useRouter();
  const clearPlan = useLearningPlanStore((state) => state.clearPlan);
  const plan = useLearningPlanStore((state) => state.plan);
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    if (!hasCleared) {
      clearPlan();
      setHasCleared(true);
    }
  }, [clearPlan, hasCleared]);

  useEffect(() => {
    if (plan && hasCleared) {
      router.push("/");
    }
  }, [plan, router, hasCleared]);

  if (!hasCleared) {
    return null;
  }

  return <OnboardingForm />;
}
