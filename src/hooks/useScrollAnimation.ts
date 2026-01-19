"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "./useMediaQuery"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", enabled = true } = options
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const shouldAnimate = enabled && isMobile

  useEffect(() => {
    if (!shouldAnimate || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [shouldAnimate, threshold, rootMargin])

  return { ref, isVisible: shouldAnimate ? isVisible : true }
}
