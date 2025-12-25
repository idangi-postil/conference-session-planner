import Link from "next/link"
import { SessionList } from "@/components/session-list"
import { Button } from "@/components/ui/button"
import sessionsData from "@/data/sessions.json"
import { Calendar } from "lucide-react"
import { Session } from "@/lib/types"

export default function HomePage() {
  const sessions = sessionsData as Session[]

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tech Conference 2024</h1>
              <p className="text-muted-foreground mt-1">Browse and plan your conference schedule</p>
            </div>
            <Button asChild>
              <Link href="/agenda">
                <Calendar className="mr-2 size-4" />
                My Agenda
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SessionList sessions={sessions} />
      </main>
    </div>
  )
}
