"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function StreakIcon() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/streak.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load streak animation:", err));
  }, []);

  if (!animationData) {
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-warm-yellow/20 flex items-center justify-center flex-shrink-0" />
    );
  }

  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-warm-yellow/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <Lottie animationData={animationData} loop={true} className="w-full h-full" />
    </div>
  );
}
