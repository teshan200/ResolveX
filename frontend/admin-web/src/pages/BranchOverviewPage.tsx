import { FileText } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { BranchKpis } from '../features/branch/BranchKpis'
import { NeedsDecisionCard, OnShiftCard } from '../features/branch/BranchSidePanels'
import { LiveQueue } from '../features/branch/LiveQueue'

/** Branch manager "Branch overview" screen (Figma node 47:22). Sample data only. */
export function BranchOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Colombo Branch</h1>
          <p className="text-sm leading-5 text-content-secondary">Live operations for today · Sunday 19 Oct</p>
        </div>
        <div className="flex shrink-0 items-start gap-3">
          <span className="flex items-center gap-2 rounded-full bg-success-bg px-3 py-2 text-xs leading-4 font-semibold whitespace-nowrap text-success-fg">
            <span className="size-2 rounded-full bg-success-solid" aria-hidden />
            Open · 12 staff on shift
          </span>
          <Button variant="outline" className="font-semibold!">
            <FileText size={18} aria-hidden />
            Branch report
          </Button>
        </div>
      </header>
      <BranchKpis />
      <div className="flex items-stretch gap-6">
        <LiveQueue />
        <div className="flex w-[360px] shrink-0 flex-col gap-6">
          <NeedsDecisionCard />
          <OnShiftCard />
        </div>
      </div>
    </div>
  )
}
