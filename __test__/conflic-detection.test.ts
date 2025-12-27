import { describe, expect, it } from "@jest/globals"
import type { Session } from "@/lib/types"
import { hasTimeConflict, detectConflicts, getTimeSlot, parseTime } from "@/lib/utils"

describe("Time Utilities", () => {
  describe("parseTime", () => {
    it("should correctly parse time strings", () => {
      expect(parseTime("09:00")).toBe(540) // 9 * 60
      expect(parseTime("14:30")).toBe(870) // 14 * 60 + 30
      expect(parseTime("18:45")).toBe(1125) // 18 * 60 + 45
    })
  })

  describe("getTimeSlot", () => {
    it("should categorize morning times", () => {
      expect(getTimeSlot("09:00")).toBe("morning")
      expect(getTimeSlot("11:30")).toBe("morning")
    })

    it("should categorize afternoon times", () => {
      expect(getTimeSlot("12:00")).toBe("afternoon")
      expect(getTimeSlot("16:30")).toBe("afternoon")
    })

    it("should categorize evening times", () => {
      expect(getTimeSlot("17:00")).toBe("evening")
      expect(getTimeSlot("19:00")).toBe("evening")
    })
  })
})

describe("Conflict Detection", () => {
  const mockSession1: Session = {
    id: "1",
    title: "Session 1",
    description: "Test session",
    speaker: "Speaker 1",
    track: "Frontend",
    startTime: "09:00",
    endTime: "10:30",
    room: "Hall A",
    level: "Beginner",
  }

  const mockSession2: Session = {
    id: "2",
    title: "Session 2",
    description: "Test session",
    speaker: "Speaker 2",
    track: "Backend",
    startTime: "10:00",
    endTime: "11:30",
    room: "Hall B",
    level: "Intermediate",
  }

  const mockSession3: Session = {
    id: "3",
    title: "Session 3",
    description: "Test session",
    speaker: "Speaker 3",
    track: "DevOps",
    startTime: "11:00",
    endTime: "12:30",
    room: "Hall C",
    level: "Advanced",
  }

  describe("hasTimeConflict", () => {
    it("should detect overlapping sessions", () => {
      expect(hasTimeConflict(mockSession1, mockSession2)).toBe(true)
    })

    it("should not detect conflict for non-overlapping sessions", () => {
      expect(hasTimeConflict(mockSession1, mockSession3)).toBe(false)
    })

    it("should detect conflict when one session is fully contained in another", () => {
      const containerSession: Session = {
        ...mockSession1,
        startTime: "09:00",
        endTime: "12:00",
      }
      expect(hasTimeConflict(containerSession, mockSession2)).toBe(true)
    })
  })

  describe("detectConflicts", () => {
    const allSessions = [mockSession1, mockSession2, mockSession3]

    it("should detect conflicts in agenda", () => {
      const agendaIds = ["1", "2"] // Sessions 1 and 2 overlap
      const conflicts = detectConflicts(allSessions, agendaIds)

      expect(conflicts.length).toBe(1)
      expect(conflicts[0].sessionId).toBe("1")
      expect(conflicts[0].conflictsWith).toContain("2")
    })

    it("should return empty array for non-conflicting agenda", () => {
      const agendaIds = ["1", "3"] // Sessions 1 and 3 don't overlap
      const conflicts = detectConflicts(allSessions, agendaIds)

      expect(conflicts.length).toBe(0)
    })

    it("should detect multiple conflicts", () => {
      const agendaIds = ["1", "2", "3"]
      const conflicts = detectConflicts(allSessions, agendaIds)

      expect(conflicts.length).toBeGreaterThan(0)
    })
  })
})
