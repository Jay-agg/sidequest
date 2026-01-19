"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useIsMobile } from "@/hooks"

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

interface CircleTransitionProps {
  onComplete: () => void
}

export function CircleTransition({ onComplete }: CircleTransitionProps) {
  const [animationData, setAnimationData] = useState<any>(null)
  const [isFading, setIsFading] = useState(false)
  const viewport = useViewportSize()
  const isMobile = useIsMobile()

  useEffect(() => {
    fetch("/CircleTransition.json")
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data)
      })
      .catch((err) => {
        console.error("Failed to load circle transition animation:", err)
        onComplete()
      })
  }, [onComplete])

  useEffect(() => {
    if (animationData) {
      const baseDuration = (animationData.op - animationData.ip) / animationData.fr * 1000
      const duration = baseDuration
      const fadeStartTime = duration - 200
      
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

  const animWidth = animationData.w || 1920
  const animHeight = animationData.h || 1080
  
  let scale: number
  let transform: string
  
  if (isMobile) {
    const rotatedWidth = animHeight
    const rotatedHeight = animWidth
    const scaleX = viewport.width / rotatedWidth
    const scaleY = viewport.height / rotatedHeight
    scale = Math.max(scaleX, scaleY)
    
    const scaledWidth = rotatedWidth * scale
    const scaledHeight = rotatedHeight * scale
    const offsetX = (scaledWidth - viewport.width) / 2
    const offsetY = (scaledHeight - viewport.height) / 2
    
    transform = `translate(calc(-50% - ${offsetX}px), calc(-50% - ${offsetY}px)) scale(${scale}) rotate(90deg)`
  } else {
    const scaleX = viewport.width / animWidth
    const scaleY = viewport.height / animHeight
    scale = Math.max(scaleX, scaleY)
    
    const scaledWidth = animWidth * scale
    const scaledHeight = animHeight * scale
    const offsetX = (scaledWidth - viewport.width) / 2
    const offsetY = (scaledHeight - viewport.height) / 2
    
    transform = `translate(calc(-50% - ${offsetX}px), calc(-50% - ${offsetY}px)) scale(${scale})`
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-background overflow-hidden transition-opacity duration-200 ${
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
          transform,
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
