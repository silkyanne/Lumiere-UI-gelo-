import { useMemo, useState } from 'react'
import { Grid2X2, List, Search, X } from 'lucide-react'
import { useCatalogAssets, type AssetCategory, type CatalogAsset } from '@/lib/warehouse-catalog'
import { cn } from '@/lib/utils'

const STATUS_TONE: Record<string, string> = {
  Available: 'text-emerald-700 dark:text-emerald-300',
  'Low Stock': 'text-amber-700 dark:text-amber-300',
  'Critical Deficit': 'text-red-700 dark:text-red-300',
  Deployed: 'text-sky-700 dark:text-sky-300',
  'Lost In Action': 'text-red-700 dark:text-red-300',
  'In Maintenance': 'text-amber-700 dark:text-amber-300',
}

function quantityLabel(asset: CatalogAsset) {
  if (asset.currentStock === undefined) return asset.status === 'Available' ? 'Available' : asset.status
  return `${asset.currentStock} ${asset.unit} available`
}

function availabilityPercent(asset: CatalogAsset) {
  if (asset.currentStock === undefined || !asset.threshold) return null
  return Math.min(100, Math.max(0, Math.round((asset.currentStock / asset.threshold) * 100)))
}

function ExecutiveAssetCard({ asset, onOpen }: { asset: CatalogAsset; onOpen: () => void }) {
  const percent = availabilityPercent(asset)
  return (
    <button type="button" onClick={onOpen} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
      <div className="relative m-1.5 mb-0 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img src={asset.image || '/placeholder.svg'} alt={asset.name} crossOrigin="anonymous" className="size-full object-cover transition duration-300 group-hover:scale-105" />
        <span className={cn('absolute left-2 top-2 rounded-full border border-background/30 bg-background/85 px-2 py-1 text-[0.52rem] font-bold uppercase tracking-[0.08em] backdrop-blur', STATUS_TONE[asset.status] ?? 'text-muted-foreground')}>{asset.status}</span>
      </div>
      <div className="flex min-h-[108px] flex-1 flex-col gap-1.5 px-3 py-3">
        <p className="truncate font-serif text-sm font-medium text-card-foreground group-hover:text-primary">{asset.name}</p>
        <p className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">{asset.subCategory || asset.category.replace(' Assets', '')}</p>
        <div className="mt-auto flex items-center justify-between gap-2 text-[0.62rem]"><span className="font-semibold text-card-foreground">{quantityLabel(asset)}</span><span className={STATUS_TONE[asset.status] ?? 'text-muted-foreground'}>{asset.assetId}</span></div>
        {percent !== null && <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div>}
      </div>
    </button>
  )
}

function ExecutiveAssetList({ assets, onOpen }: { assets: CatalogAsset[]; onOpen: (asset: CatalogAsset) => void }) {
  return <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[680px] text-left"><thead><tr className="bg-muted/40">{['Asset', 'Classification', 'Status', 'Availability', ''].map((label) => <th key={label} className="px-4 py-3 text-[0.56rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</th>)}</tr></thead><tbody>{assets.map((asset) => <tr key={asset.id} className="border-t border-border/70 hover:bg-accent/30"><td className="px-4 py-3"><button type="button" onClick={() => onOpen(asset)} className="flex items-center gap-3 text-left"><img src={asset.image || '/placeholder.svg'} alt="" crossOrigin="anonymous" className="size-11 rounded-md object-cover" /><span className="font-serif text-sm text-card-foreground">{asset.name}</span></button></td><td className="px-4 py-3 text-xs text-muted-foreground">{asset.category}</td><td className={cn('px-4 py-3 text-xs font-semibold', STATUS_TONE[asset.status] ?? 'text-muted-foreground')}>{asset.status}</td><td className="px-4 py-3 text-xs text-muted-foreground">{quantityLabel(asset)}</td><td className="px-4 py-3 text-right"><button type="button" onClick={() => onOpen(asset)} className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-primary hover:underline">View</button></td></tr>)}</tbody></table></div>
}

function ExecutiveAssetDetails({ asset, onClose }: { asset: CatalogAsset; onClose: () => void }) {
  const details = [['Classification', asset.category], ['Asset ID', asset.assetId], ['Status', asset.status], ['Available', quantityLabel(asset)], ['Total quantity', asset.currentStock !== undefined ? `${asset.currentStock} ${asset.unit}` : 'Not specified'], ['Subtype', asset.subCategory || 'Not specified'], ['Material', asset.material || 'Not specified']]
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}><div role="dialog" aria-modal="true" aria-labelledby="executive-asset-details" onMouseDown={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-border p-5"><div><p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-primary">Asset details</p><h2 id="executive-asset-details" className="mt-1 font-serif text-2xl text-card-foreground">{asset.name}</h2></div><button type="button" onClick={onClose} aria-label="Close asset details" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button></div><div className="grid gap-5 p-5 sm:grid-cols-[180px_1fr]"><img src={asset.image || '/placeholder.svg'} alt={asset.name} crossOrigin="anonymous" className="aspect-square w-full rounded-xl object-cover" /><div className="grid content-start gap-3 sm:grid-cols-2">{details.map(([label, value]) => <div key={label} className="rounded-lg border border-border/70 bg-background/40 p-3"><p className="text-[0.56rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-1 text-sm text-card-foreground">{value}</p></div>)}{asset.description && <div className="sm:col-span-2"><p className="text-[0.56rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Description</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{asset.description}</p></div>}{asset.tags && asset.tags.length > 0 && <div className="sm:col-span-2"><p className="text-[0.56rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Tags</p><div className="mt-2 flex flex-wrap gap-1.5">{asset.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>)}</div></div>}</div></div></div></div>
}

export function ExecutiveAssetInventory() {
  const assets = useCatalogAssets()
  const [selectedClassification, setSelectedClassification] = useState<AssetCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAsset, setSelectedAsset] = useState<CatalogAsset | null>(null)
  const classifications = useMemo(() => Array.from(new Set(assets.map((asset) => asset.category))), [assets])
  const counts = useMemo(() => new Map(classifications.map((category) => [category, assets.filter((asset) => asset.category === category).length])), [assets, classifications])
  const filteredAssets = useMemo(() => { const query = searchQuery.trim().toLowerCase(); return assets.filter((asset) => (selectedClassification === 'All' || asset.category === selectedClassification) && (!query || [asset.name, asset.assetId, asset.subCategory, ...(asset.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(query))) }, [assets, searchQuery, selectedClassification])
  return <div className="overflow-hidden rounded-xl border border-border bg-card"><div className="border-b border-border p-4 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Asset catalog</p><p className="mt-1 text-sm text-muted-foreground">{filteredAssets.length} asset{filteredAssets.length === 1 ? '' : 's'} in view</p></div><div className="flex w-full items-center gap-2 lg:w-auto"><div className="relative min-w-0 flex-1 lg:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="Search assets" placeholder="Search by name, tag, classification..." className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" /></div><div className="inline-flex shrink-0 rounded-lg border border-border bg-background p-1" aria-label="Asset view"><button type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={cn('rounded-md p-2', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}><Grid2X2 className="size-4" /></button><button type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={cn('rounded-md p-2', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}><List className="size-4" /></button></div></div></div></div><div className="grid lg:grid-cols-[minmax(180px,22%)_minmax(0,1fr)]"><aside className="border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r"><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Classifications</p><div className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-1 lg:overflow-visible"><ClassificationButton label="All" count={assets.length} active={selectedClassification === 'All'} onClick={() => setSelectedClassification('All')} />{classifications.map((category) => <ClassificationButton key={category} label={category} count={counts.get(category) || 0} active={selectedClassification === category} onClick={() => setSelectedClassification(category)} />)}</div></aside><main className="min-w-0 p-4 sm:p-6"><div className="mb-5 flex items-center justify-between gap-4"><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{selectedClassification === 'All' ? 'All classifications' : selectedClassification}</p><span className="text-xs text-muted-foreground">{filteredAssets.length} result{filteredAssets.length === 1 ? '' : 's'}</span></div>{filteredAssets.length === 0 ? <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No assets match your search.</div> : viewMode === 'grid' ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filteredAssets.map((asset) => <ExecutiveAssetCard key={asset.id} asset={asset} onOpen={() => setSelectedAsset(asset)} />)}</div> : <ExecutiveAssetList assets={filteredAssets} onOpen={setSelectedAsset} />}</main></div>{selectedAsset && <ExecutiveAssetDetails asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}</div>
}

function ClassificationButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) { return <button type="button" onClick={onClick} aria-pressed={active} className={cn('flex min-w-[150px] items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition lg:w-full', active ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/40')}><span className="truncate">{label}</span><span className="shrink-0 text-[0.65rem] font-semibold text-muted-foreground">{count}</span></button> }

export { ExecutiveAssetCard, ExecutiveAssetDetails }
