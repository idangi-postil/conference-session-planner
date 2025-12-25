import { notFound } from "next/navigation"
import Link from "next/link"
import sessionsData from "@/data/sessions.json"
import type { Session } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgendaManager } from "@/components/agenda-manager"
import { ArrowLeft, Clock, MapPin, Signal, User } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params
  const sessions = sessionsData as Session[]
  const session = sessions.find((s) => s.id === id)

  if (!session) {
    notFound()
  }

  const trackColors: Record<string, string> = {
    Frontend: "bg-chart-1 text-white",
    Backend: "bg-chart-2 text-white",
    DevOps: "bg-chart-3 text-white",
    AI: "bg-chart-4 text-white",
  }

  const levelColors: Record<string, string> = {
    Beginner: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge className={trackColors[session.track]}>{session.track}</Badge>
                <Badge variant="outline" className={levelColors[session.level]}>
                  <Signal className="mr-1 size-3" />
                  {session.level}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">{session.title}</h1>
            </div>
            <AgendaManager sessionId={session.id} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{session.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Speaker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="size-6" />
                  </div>
                  <div>
                    <p className="font-medium">{session.speaker}</p>
                    <p className="text-sm text-muted-foreground">Session Speaker</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{session.room}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Signal className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Level</p>
                    <p className="text-sm text-muted-foreground">{session.level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
                <CardDescription>Find assistance at the information desk</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
