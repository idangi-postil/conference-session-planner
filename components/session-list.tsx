"use client"

import { useState } from "react"
import type { Session } from "@/lib/types"
import { getTimeSlot } from "@/lib/utils"
import { SessionCard } from "./session-card"
import { FilterState, SessionFilters } from "./session-filters"

interface SessionListProps {
  sessions: Session[]
}

export function SessionList({ sessions }: SessionListProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tracks: [],
    timeSlots: [],
  })

  const filteredSessions = sessions.filter((session) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        session.title.toLowerCase().includes(searchLower) ||
        session.description.toLowerCase().includes(searchLower) ||
        session.speaker.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Track filter
    if (filters.tracks.length > 0 && !filters.tracks.includes(session.track)) {
      return false
    }

    // Time slot filter
    if (filters.timeSlots.length > 0) {
      const sessionSlot = getTimeSlot(session.startTime)
      if (!filters.timeSlots.includes(sessionSlot)) {
        return false
      }
    }

    return true
  })

  return (
    <div className="space-y-6">
      <SessionFilters onFilterChange={setFilters} />

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSessions.length} of {sessions.length} sessions
        </p>

        {filteredSessions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">No sessions found matching your filters.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
