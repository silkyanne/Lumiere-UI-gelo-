import { ExecutiveShell } from '@/components/executive/ExecutiveShell'
import { ExecutiveAssetInventory } from '@/components/executive/ExecutiveAssetInventory'
import { useNav } from '@/lib/nav'
import { useAuth } from '@/lib/auth'
import { ExecutiveLiteAssetAllocation } from '@/components/executive-lite/ExecutiveLiteAssetAllocation'
import type { ExecutiveDestinationId } from '@/lib/executive-destinations'

// Executive Asset Inventory & Allocation page.
// Reconciled to the client-presented kiosk: portfolio-level asset catalog,
// fixed-tier grouping, 4:3 cards with live status/glance, grid/list toggle,
// search filtering, and allocation oversight backed by real authority.
export function ExecutiveAssetInventoryPage() {
  const { navigate } = useNav()
  const { isExecutiveLite } = useAuth()

  if (isExecutiveLite) {
    return <ExecutiveLiteAssetAllocation />
  }

  const destination = (id: ExecutiveDestinationId) => navigate(id)

  const stickyHeader = (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-primary">Asset Inventory</span>
          <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Asset Inventory
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Browse and review available assets by classification.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <ExecutiveShell activeId="inventory" onSelect={destination} stickyHeader={stickyHeader}>
      <div className="mt-2">
        <ExecutiveAssetInventory />
      </div>
    </ExecutiveShell>
  )
}
