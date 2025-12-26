"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { usePersistentState } from "./usePersistentState"

interface AgendaContextType {
  agendaSessionIds: string[]
  addToAgenda: (sessionId: string) => void
  removeFromAgenda: (sessionId: string) => void
  isInAgenda: (sessionId: string) => boolean
  clearAgenda: () => void
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined)

const STORAGE_KEY = "conference-agenda"

export function AgendaProvider({ children }: { children: React.ReactNode }) {
    const [agendaSessionIds, setAgendaSessionIds, isHydrated] = usePersistentState<string[]>(STORAGE_KEY, [])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAgendaSessionIds(parsed)
      } catch (error) {
        console.error("Failed to parse stored agenda:", error)
      }
    }
  }, [])

  // Save to localStorage whenever agenda changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agendaSessionIds))
    }
  }, [agendaSessionIds, isHydrated])

  const addToAgenda = (sessionId: string) => {
    setAgendaSessionIds((prev) => {
      if (prev.includes(sessionId)) return prev
      return [...prev, sessionId]
    })
  }

  const removeFromAgenda = (sessionId: string) => {
    setAgendaSessionIds((prev) => prev.filter((id) => id !== sessionId))
  }

  const isInAgenda = (sessionId: string) => {
    return agendaSessionIds.includes(sessionId)
  }

  const clearAgenda = () => {
    setAgendaSessionIds([])
  }

  return (
    <AgendaContext.Provider
      value={{
        agendaSessionIds,
        addToAgenda,
        removeFromAgenda,
        isInAgenda,
        clearAgenda,
      }}
    >
      {children}
    </AgendaContext.Provider>
  )
}

export function useAgenda() {
  const context = useContext(AgendaContext)
  if (context === undefined) {
    throw new Error("useAgenda must be used within an AgendaProvider")
  }
  return context
}
