"use client"

import { useEffect, useRef } from "react"
import { CircleTransition } from "@/components/ui"
import { useUIStore } from "@/stores"

export function HobbyTransitionWrapper({ children }: { children: React.ReactNode }) {
  const showHobbyTransition = useUIStore((state) => state.showHobbyTransition)
  const setShowHobbyTransition = useUIStore((state) => state.setShowHobbyTransition)
  const isTransitioningRef = useRef(false)

  useEffect(() => {
    if (showHobbyTransition) {
      isTransitioningRef.current = true
    } else {
      isTransitioningRef.current = false
    }
  }, [showHobbyTransition])

  const handleComplete = () => {
    if (isTransitioningRef.current) {
      isTransitioningRef.current = false
      setShowHobbyTransition(false)
    }
  }

  return (
    <>
      {children}
      {showHobbyTransition && (
        <CircleTransition onComplete={handleComplete} />
      )}
    </>
  )
}
