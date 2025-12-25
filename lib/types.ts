export type TrackType = "Frontend" | "Backend" | "DevOps" | "AI"
export type TimeSlot = "morning" | "afternoon" | "evening"

export interface Session {
  id: string
  title: string
  description: string
  speaker: string
  track: TrackType
  startTime: string // Format: "HH:MM"
  endTime: string // Format: "HH:MM"
  room: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

export interface TimeConflict {
  sessionId: string
  conflictsWith: string[]
}
