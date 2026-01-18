"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ThinkingAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/brainstorm.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  if (!animationData) {
    return <div className="w-48 h-48 mx-auto" />;
  }

  return (
    <div className="w-48 h-48 mx-auto">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
