"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return size
}

interface TransitionAnimationProps {
  onComplete: () => void
}

export function TransitionAnimation({ onComplete }: TransitionAnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null)
  const [isFading, setIsFading] = useState(false)
  const viewport = useViewportSize()

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const res = await fetch("/transition.json");
        const data = await res.json();
        setAnimationData(data);
      } catch (err) {
        console.error("Failed to load transition animation:", err);
        onComplete();
      }
    };
    loadAnimation();
  }, [onComplete]);

  useEffect(() => {
    if (animationData) {
      const duration = (animationData.op - animationData.ip) / animationData.fr * 1000 * 2
      const fadeStartTime = duration - 300
      
      const fadeTimer = setTimeout(() => {
        setIsFading(true)
      }, fadeStartTime)
      
      const completeTimer = setTimeout(() => {
        onComplete()
      }, duration)
      
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(completeTimer)
      }
    }
  }, [animationData, onComplete])

  if (!animationData || viewport.width === 0 || viewport.height === 0) {
    return null
  }

  const animWidth = animationData.w || 1200
  const animHeight = animationData.h || 1200
  const scaleX = viewport.width / animWidth
  const scaleY = viewport.height / animHeight
  const scale = Math.max(scaleX, scaleY)
  
  const scaledWidth = animWidth * scale
  const scaledHeight = animHeight * scale
  const offsetX = (scaledWidth - viewport.width) / 2
  const offsetY = (scaledHeight - viewport.height) / 2

  return (
    <div 
      className={`fixed inset-0 z-50 bg-background overflow-hidden transition-opacity duration-300 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div 
        className="absolute"
        style={{
          width: `${animWidth}px`,
          height: `${animHeight}px`,
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% - ${offsetX}px), calc(-50% - ${offsetY}px)) scale(${scale})`,
          transformOrigin: "center center"
        }}
      >
        <Lottie 
          animationData={animationData} 
          loop={false}
          style={{ 
            width: "100%",
            height: "100%"
          }}
        />
      </div>
    </div>
  )
}
