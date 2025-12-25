import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Session, TimeConflict } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number)
  return hours * 60 + minutes
}

export function hasTimeConflict(session1: Session, session2: Session): boolean {
  const start1 = parseTime(session1.startTime)
  const end1 = parseTime(session1.endTime)
  const start2 = parseTime(session2.startTime)
  const end2 = parseTime(session2.endTime)

  return start1 < end2 && end1 > start2
}

export function getTimeSlot(startTime: string): "morning" | "afternoon" | "evening" {
  const hour = Number.parseInt(startTime.split(":")[0])
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

export function detectConflicts(sessions: Session[], agendaIds: string[]): TimeConflict[] {
  const agendaSessions = sessions.filter((s) => agendaIds.includes(s.id))
  const conflicts: TimeConflict[] = []

  agendaSessions.forEach((session, index) => {
    const conflictsWith: string[] = []

    for (let i = index + 1; i < agendaSessions.length; i++) {
      if (hasTimeConflict(session, agendaSessions[i])) {
        conflictsWith.push(agendaSessions[i].id)
      }
    }

    if (conflictsWith.length > 0) {
      conflicts.push({
        sessionId: session.id,
        conflictsWith,
      })
    }
  })

  return conflicts
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}