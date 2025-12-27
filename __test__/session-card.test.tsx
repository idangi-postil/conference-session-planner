import { describe, expect, it } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import type { Session } from "@/lib/types"
import { SessionCard } from "@/components/session-card"
import { AgendaProvider } from "@/lib/agenda-context"

describe("SessionCard", () => {
  const mockSession: Session = {
    id: "1",
    title: "React Server Components",
    description: "Learn about React Server Components and how they work",
    speaker: "Jane Doe",
    track: "Frontend",
    startTime: "09:00",
    endTime: "10:30",
    room: "Hall A",
    level: "Advanced",
  }

  const renderWithProvider = (ui: React.ReactNode) => {
    return render(<AgendaProvider>{ui}</AgendaProvider>)
  }

  it("should render session title", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText("React Server Components")).toBeInTheDocument()
  })

  it("should render speaker name", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText("Jane Doe")).toBeInTheDocument()
  })

  it("should render track badge", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText("Frontend")).toBeInTheDocument()
  })

  it("should render level badge", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText("Advanced")).toBeInTheDocument()
  })

  it("should render formatted time", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText(/9:00 AM/)).toBeInTheDocument()
    expect(screen.getByText(/10:30 AM/)).toBeInTheDocument()
  })

  it("should render room information", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText("Hall A")).toBeInTheDocument()
  })

  it("should render description", () => {
    renderWithProvider(<SessionCard session={mockSession} />)
    expect(screen.getByText(mockSession.description)).toBeInTheDocument()
  })
})
