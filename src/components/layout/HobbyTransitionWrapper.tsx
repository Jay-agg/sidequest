"use client"

import { CircleTransition } from "@/components/ui"
import { useUIStore } from "@/stores"

export function HobbyTransitionWrapper({ children }: { children: React.ReactNode }) {
  const showHobbyTransition = useUIStore((state) => state.showHobbyTransition)
  const setShowHobbyTransition = useUIStore((state) => state.setShowHobbyTransition)

  return (
    <>
      {children}
      {showHobbyTransition && (
        <CircleTransition
          onComplete={() => {
            setShowHobbyTransition(false)
          }}
        />
      )}
    </>
  )
}
