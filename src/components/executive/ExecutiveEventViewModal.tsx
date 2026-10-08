import { useEffect, useRef, useState } from 'react'
import { Download, X } from 'lucide-react'
import type { PortalEvent } from '@/lib/types'

type Tab = 'details' | 'assets'

function display(value?: string) {
  return value?.trim() || 'Not available'
}

function ReadOnlyField({ label, value, wide = false }: { label: string; value?: string; wide?: boolean }) {
  return <div className={wide ? 'sm:col-span-2' : ''}>
    <p className="mb-1.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
    <div className="min-h-9 rounded-md border border-border bg-background/40 px-3 py-2 text-xs text-foreground">{display(value)}</div>
  </div>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t border-border pt-4">
    <h3 className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">{title}</h3>
    {children}
  </section>
}

async function downloadEventPdf(event: PortalEvent) {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 42
  let y = 48
  doc.setFillColor(155, 107, 63)
  doc.rect(margin, y, 4, 38, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(39, 37, 34)
  doc.text('LUMIÈRE — EVENT VIEW', margin + 14, y + 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(117, 111, 103)
  doc.text(`Reference: ${event.refId}`, margin + 14, y + 31)
  y += 72
  const lines: Array<[string, string | undefined]> = [
    ['Event concept / title', event.title], ['Client / organizer name', event.client], ['Registry venue', event.venue],
    ['Event date', event.targetDate], ['Installation start', event.installationStart], ['Installation end', event.installationEnd],
    ['Event start time', event.eventStart], ['Event end time', event.eventEnd], ['Geographic scope', event.geoClass],
    ['Ingress date', event.ingressDate], ['Ingress time', event.ingressTime], ['Full stop time', event.fullStop],
    ['Egress / return date', event.returnDate], ['Styling essence', event.moodPlan],
  ]
  for (const [label, value] of lines) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(155, 107, 63); doc.text(label.toUpperCase(), margin, y)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(39, 37, 34); doc.text(display(value), margin, y + 14)
    y += 34
    if (y > 740) { doc.addPage(); y = 48 }
  }
  doc.save(`${event.refId || event.id}-event-view.pdf`)
}

export function ExecutiveEventViewModal({ event, onClose }: { event: PortalEvent; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('details')
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { closeRef.current?.focus() }, [])

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-2 backdrop-blur-sm sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="executive-view-event-title" className="flex max-h-[calc(100vh-1rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:max-h-[min(92vh,720px)]">
      <header className="shrink-0 border-b border-border px-4 pb-3 pt-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Lumière · Planning — Read-only view</p><h2 id="executive-view-event-title" className="mt-1 font-serif text-2xl font-medium">View Event</h2><p className="mt-1 font-mono text-[0.58rem] text-muted-foreground">REF ID: {event.refId}</p></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close event view" className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /></button>
        </div>
        <div className="mt-4 -mb-3 flex gap-6" role="tablist" aria-label="Event view sections">
          {([['details', 'Event Details'], ['assets', 'Assets']] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)} className={`border-b-2 px-3 pb-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] ${tab === value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{label}</button>)}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {tab === 'details' ? <div className="space-y-6">
          <Section title="Core Portfolio Characteristics"><div className="grid gap-4 sm:grid-cols-2"><ReadOnlyField label="Event concept / title" value={event.title} /><ReadOnlyField label="Client / organizer name" value={event.client} /></div></Section>
          <Section title="Venue & Timeline Matrices"><div className="grid gap-4 sm:grid-cols-2"><ReadOnlyField label="Bind to registry venue" value={event.venue} wide /><ReadOnlyField label="Event date" value={event.targetDate} /><ReadOnlyField label="Event start time" value={event.eventStart || event.installationStart} /><ReadOnlyField label="Event end time" value={event.eventEnd || event.installationEnd} /><ReadOnlyField label="Geographic scope" value={event.geoClass} wide /><ReadOnlyField label="Ingress date" value={event.ingressDate} /><ReadOnlyField label="Egress / return date" value={event.returnDate} /><ReadOnlyField label="Ingress time" value={event.ingressTime} /><ReadOnlyField label="Full stop time" value={event.fullStop} /></div></Section>
          {event.moodPlan && <Section title="Styling Essence"><ReadOnlyField label="Initial creative vision & design mood plan" value={event.moodPlan} wide /></Section>}
        </div> : <section><h3 className="text-sm font-semibold">Assigned event assets</h3><p className="mt-1 text-xs text-muted-foreground">Assets currently planned or reserved for this event.</p><div className="mt-5 rounded-lg border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">No assets assigned to this event.</div></section>}
      </div>
      <footer className="shrink-0 border-t border-border p-3 sm:p-4"><button type="button" onClick={() => void downloadEventPdf(event)} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Download className="size-3.5" aria-hidden="true" />Download PDF</button></footer>
    </section>
  </div>
}
