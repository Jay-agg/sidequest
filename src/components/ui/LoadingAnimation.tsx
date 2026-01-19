"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LoadingAnimationProps {
  className?: string;
}

export function LoadingAnimation({ className = "w-48 h-48 mx-auto" }: LoadingAnimationProps) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/loading.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  if (!animationData) {
    return <div className={className} />;
  }

  return (
    <div className={`${className} flex items-center justify-center`}>
      <Lottie animationData={animationData} loop={true} className="w-full h-full" />
    </div>
  );
}
