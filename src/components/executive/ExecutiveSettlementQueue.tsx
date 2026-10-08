import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import type { PortalEvent } from '@/lib/types'

interface ExecutiveSettlementQueueProps {
  events: PortalEvent[]
  onReview: (eventId: string) => void
}

export function ExecutiveSettlementQueue({ events, onReview }: ExecutiveSettlementQueueProps) {
  const queue = events.filter((event) => event.status === 'Completed')

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm" aria-labelledby="settlement-queue-title">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 id="settlement-queue-title" className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Settlement Queue</h2>
          <p className="mt-1 text-xs text-muted-foreground">Completed events awaiting executive review.</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-[0.6rem] font-semibold text-primary">{queue.length} Pending</span>
      </div>
      {queue.length === 0 ? (
        <div className="flex items-center gap-2 border-t border-border py-5 text-xs text-muted-foreground">
          <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
          Settlement queue is clear.
        </div>
      ) : (
        <div className="max-h-64 space-y-2 overflow-y-auto border-t border-border pt-3">
          {queue.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
              <span className="w-8 shrink-0 rounded border border-border px-1 py-1 text-center text-[0.55rem] font-semibold leading-tight">
                <b className="block text-primary">{new Date(event.targetDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</b>
                {new Date(event.targetDate).getDate()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{event.title}</p>
                <p className="mt-0.5 truncate font-mono text-[0.58rem] text-muted-foreground">{event.refId} · {event.client}</p>
              </div>
              <button type="button" onClick={() => onReview(event.id)} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1.5 text-[0.58rem] font-semibold uppercase tracking-wider hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Review <ArrowUpRight className="size-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
