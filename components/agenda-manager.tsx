"use client"

import { useAgenda } from "@/lib/agenda-context"
import { Button } from "@/components/ui/button"
import { Check, Plus } from "lucide-react"

interface AgendaManagerProps {
  sessionId: string
}

export function AgendaManager({ sessionId }: AgendaManagerProps) {
  const { isInAgenda, addToAgenda, removeFromAgenda } = useAgenda()
  const inAgenda = isInAgenda(sessionId)

  const handleToggle = () => {
    if (inAgenda) {
      removeFromAgenda(sessionId)
    } else {
      addToAgenda(sessionId)
    }
  }

  return (
    <Button size="sm" variant={inAgenda ? "default" : "outline"} onClick={handleToggle} className="shrink-0">
      {inAgenda ? (
        <>
          <Check className="mr-1.5 size-4" />
          Added
        </>
      ) : (
        <>
          <Plus className="mr-1.5 size-4" />
          Add
        </>
      )}
    </Button>
  )
}
