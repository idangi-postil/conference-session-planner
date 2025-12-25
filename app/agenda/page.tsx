"use client"

import Link from "next/link"
import { useAgenda } from "@/lib/agenda-context"
import sessionsData from "@/data/sessions.json"
import type { Session } from "@/lib/types"
import { detectConflicts, formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgendaManager } from "@/components/agenda-manager"
import { AlertTriangle, ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"
import { ConflictIndicator } from "@/components/conflict-indicator"

export default function AgendaPage() {
  const { agendaSessionIds, clearAgenda } = useAgenda()
  const sessions = sessionsData as Session[]
  const agendaSessions = sessions.filter((s) => agendaSessionIds.includes(s.id))

  // Sort by start time
  const sortedSessions = [...agendaSessions].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  // Detect conflicts
  const conflicts = detectConflicts(sessions, agendaSessionIds)
  const hasConflicts = conflicts.length > 0

  const trackColors: Record<string, string> = {
    Frontend: "bg-chart-1 text-white",
    Backend: "bg-chart-2 text-white",
    DevOps: "bg-chart-3 text-white",
    AI: "bg-chart-4 text-white",
  }

  const getSessionConflicts = (sessionId: string): string[] => {
    const conflict = conflicts.find((c) => c.sessionId === sessionId)
    if (!conflict) return []

    return conflict.conflictsWith
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to Sessions
            </Link>
          </Button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Calendar className="size-8" />
                My Agenda
              </h1>
              <p className="text-muted-foreground mt-1">
                {agendaSessions.length} session{agendaSessions.length !== 1 ? "s" : ""} in your schedule
              </p>
            </div>
            {agendaSessions.length > 0 && (
              <Button variant="outline" onClick={clearAgenda}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {hasConflicts && (
          <div className="mb-6">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="size-5" />
                  Schedule Conflicts Detected
                </CardTitle>
                <CardDescription>
                  You have {conflicts.length} session{conflicts.length > 1 ? "s" : ""} with time conflicts. Consider
                  removing one of the overlapping sessions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {agendaSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your agenda is empty</p>
              <p className="text-muted-foreground mb-6">Start adding sessions to build your personalized schedule</p>
              <Button asChild>
                <Link href="/">Browse Sessions</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session) => {
              const sessionConflicts = getSessionConflicts(session.id)
              const hasConflict = sessionConflicts.length > 0

              return (
                <Card key={session.id} className={hasConflict ? "border-destructive/50" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={trackColors[session.track]}>{session.track}</Badge>
                          {hasConflict && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="size-3" />
                              Conflict
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">
                          <Link href={`/sessions/${session.id}`} className="hover:text-primary hover:underline">
                            {session.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-base">{session.speaker}</CardDescription>
                      </div>
                      <AgendaManager sessionId={session.id} />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{session.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        <span>
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        <span>{session.room}</span>
                      </div>
                    </div>

                    {hasConflict && <ConflictIndicator conflictingSessions={sessionConflicts} />}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
