"use client"

import { useState } from "react"
import type { TrackType } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SessionFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  tracks: TrackType[]
  timeSlots: Array<"morning" | "afternoon" | "evening">
}

const tracks: TrackType[] = ["Frontend", "Backend", "DevOps", "AI"]
const timeSlots: Array<{ value: "morning" | "afternoon" | "evening"; label: string }> = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
]

export function SessionFilters({ onFilterChange }: SessionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tracks: [],
    timeSlots: [],
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  const toggleTrack = (track: TrackType) => {
    const newTracks = filters.tracks.includes(track)
      ? filters.tracks.filter((t) => t !== track)
      : [...filters.tracks, track]
    updateFilters({ tracks: newTracks })
  }

  const toggleTimeSlot = (slot: "morning" | "afternoon" | "evening") => {
    const newSlots = filters.timeSlots.includes(slot)
      ? filters.timeSlots.filter((s) => s !== slot)
      : [...filters.timeSlots, slot]
    updateFilters({ timeSlots: newSlots })
  }

  return (
    <div className="space-y-6 p-6 bg-card border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="search">Search Sessions</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by title, speaker, or description..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Filter by Track</Label>
        <div className="flex flex-wrap gap-2">
          {tracks.map((track) => {
            const isSelected = filters.tracks.includes(track)
            return (
              <Badge
                key={track}
                variant={isSelected ? "default" : "outline"}
                asChild
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTrack(track)}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${track} track${isSelected ? ", currently selected" : ""}`}
                  className="cursor-pointer hover:bg-primary/90 hover:text-white rounded-full px-2 py-0.5 h-auto text-xs font-medium"
                >
                  {track}
                </Button>
              </Badge>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Filter by Time</Label>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map((slot) => {
            const isSelected = filters.timeSlots.includes(slot.value)
            return (
              <Badge
                key={slot.value}
                variant={isSelected ? "default" : "outline"}
                asChild
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTimeSlot(slot.value)}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${slot.label.toLowerCase()} sessions${isSelected ? ", currently selected" : ""}`}
                  className="cursor-pointer hover:bg-primary/90 hover:text-white rounded-full px-2 py-0.5 h-auto text-xs font-medium"
                >
                  {slot.label}
                </Button>
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}
