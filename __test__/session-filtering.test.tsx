import { render, screen, fireEvent } from "@testing-library/react"
import { SessionList } from "@/components/session-list"
import { Session } from "@/lib/types"

jest.mock("@/components/agenda-manager", () => ({
  AgendaManager: () => <div data-testid="agenda-manager" />,
}))

const mockSessions: Session[] = [
  {
    id: "1",
    title: "React Basics",
    description: "Intro to React",
    speaker: "John Doe",
    track: "Frontend",
    startTime: "09:00",
    endTime: "10:00",
    room: "Room A",
    level: "Beginner",
  },
  {
    id: "2",
    title: "Node.js Advanced",
    description: "Deep dive into Node",
    speaker: "Jane Smith",
    track: "Backend",
    startTime: "14:00",
    endTime: "15:00",
    room: "Room B",
    level: "Advanced",
  },
  {
    id: "3",
    title: "DevOps Pipeline",
    description: "CI/CD",
    speaker: "Bob Wilson",
    track: "DevOps",
    startTime: "17:00",
    endTime: "18:00",
    room: "Room C",
    level: "Intermediate",
  },
]

describe("SessionList Filtering", () => {
  it("renders all sessions initially", () => {
    render(<SessionList sessions={mockSessions} />)
    expect(screen.getByText("React Basics")).toBeInTheDocument()
    expect(screen.getByText("Node.js Advanced")).toBeInTheDocument()
    expect(screen.getByText("DevOps Pipeline")).toBeInTheDocument()
  })

  it("filters sessions by track", () => {
    render(<SessionList sessions={mockSessions} />)
    
    // Click Frontend filter
    const frontendFilter = screen.getByRole("button", { name: /Filter by Frontend track/i })
    fireEvent.click(frontendFilter)

    expect(screen.getByText("React Basics")).toBeInTheDocument()
    expect(screen.queryByText("Node.js Advanced")).not.toBeInTheDocument()
    expect(screen.queryByText("DevOps Pipeline")).not.toBeInTheDocument()

    fireEvent.click(frontendFilter)
    expect(screen.getByText("Node.js Advanced")).toBeInTheDocument()
  })

  it("filters sessions by time slot", () => {
    render(<SessionList sessions={mockSessions} />)

    const afternoonFilter = screen.getByRole("button", { name: /Filter by afternoon sessions/i })
    fireEvent.click(afternoonFilter)

    expect(screen.queryByText("React Basics")).not.toBeInTheDocument() // Morning
    expect(screen.getByText("Node.js Advanced")).toBeInTheDocument() // Afternoon
    expect(screen.queryByText("DevOps Pipeline")).not.toBeInTheDocument() // Evening
  })

  it("filters by multiple criteria (Track AND Time)", () => {
    render(<SessionList sessions={mockSessions} />)

    const backendFilter = screen.getByRole("button", { name: /Filter by Backend track/i })
    fireEvent.click(backendFilter)

    // Filter by Afternoon
    const afternoonFilter = screen.getByRole("button", { name: /Filter by afternoon sessions/i })
    fireEvent.click(afternoonFilter)

    expect(screen.getByText("Node.js Advanced")).toBeInTheDocument()
    expect(screen.queryByText("React Basics")).not.toBeInTheDocument()
    expect(screen.queryByText("DevOps Pipeline")).not.toBeInTheDocument()
  })
  
  it("shows no sessions found message when no matches", () => {
    render(<SessionList sessions={mockSessions} />)

    // Filter by Frontend (Morning)
    const frontendFilter = screen.getByRole("button", { name: /Filter by Frontend track/i })
    fireEvent.click(frontendFilter)

    // Filter by Evening (DevOps is evening)
    const eveningFilter = screen.getByRole("button", { name: /Filter by evening sessions/i })
    fireEvent.click(eveningFilter)

    // Frontend + Evening -> No match in mock data
    expect(screen.getByText(/No sessions found matching your filters/i)).toBeInTheDocument()
    expect(screen.queryByText("React Basics")).not.toBeInTheDocument()
  })
})
