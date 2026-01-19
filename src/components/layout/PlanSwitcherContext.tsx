"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface PlanSwitcherContextType {
  open: boolean
  setOpen: (open: boolean) => void
  handleOpen: () => void
  isZooming: boolean
  setIsZooming: (isZooming: boolean) => void
}

const PlanSwitcherContext = createContext<PlanSwitcherContextType | undefined>(undefined)

export function PlanSwitcherProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isZooming, setIsZooming] = useState(false)

  const handleOpen = () => {
    setIsZooming(true)
    setTimeout(() => {
      setOpen(true)
      setIsZooming(false)
    }, 300)
  }

  return (
    <PlanSwitcherContext.Provider value={{ open, setOpen, handleOpen, isZooming, setIsZooming }}>
      {children}
    </PlanSwitcherContext.Provider>
  )
}

export function usePlanSwitcherContext() {
  const context = useContext(PlanSwitcherContext)
  if (!context) {
    throw new Error("usePlanSwitcherContext must be used within PlanSwitcherProvider")
  }
  return context
}
