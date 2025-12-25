import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ConflictIndicatorProps {
  conflictingSessions: string[]
}

export function ConflictIndicator({ conflictingSessions }: ConflictIndicatorProps) {
  if (!conflictingSessions || conflictingSessions.length === 0) return null

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="size-4" />
      <AlertTitle>Time Conflict</AlertTitle>
      <AlertDescription>
        This session overlaps with {conflictingSessions.length} other session{conflictingSessions.length > 1 ? "s" : ""}{" "}
        in your agenda.
      </AlertDescription>
    </Alert>
  )
}
