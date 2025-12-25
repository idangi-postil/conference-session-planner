import Link from "next/link"
import type { Session } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Signal } from "lucide-react"
import { AgendaManager } from "./agenda-manager"

interface SessionCardProps {
  session: Session
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

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              <Link href={`/sessions/${session.id}`} className="hover:underline">
                {session.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm">{session.speaker}</CardDescription>
          </div>
          <AgendaManager sessionId={session.id} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={trackColors[session.track] || "bg-muted"}>{session.track}</Badge>
          <Badge variant="outline" className={levelColors[session.level]}>
            <Signal className="mr-1 size-3" />
            {session.level}
          </Badge>
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
      </CardContent>
    </Card>
  )
}
