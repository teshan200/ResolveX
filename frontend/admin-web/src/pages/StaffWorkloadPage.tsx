import { ArrowUpDown, Calendar } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StaffKpis } from '../features/staff/StaffKpis'
import { StaffSuggestionBanner } from '../features/staff/StaffSuggestionBanner'
import { TeamTable } from '../features/staff/TeamTable'

/** Branch manager "Staff & workload" screen (Figma node 48:2018). Sample data only. */
export function StaffWorkloadPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Staff &amp; workload</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Who is on shift, how loaded they are, and how quickly they respond.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" className="font-semibold!">
            <Calendar size={18} aria-hidden />
            Shift schedule
          </Button>
          <Button className="font-semibold!">
            <ArrowUpDown size={18} aria-hidden />
            Rebalance tickets
          </Button>
        </div>
      </header>
      <StaffKpis />
      <TeamTable />
      <StaffSuggestionBanner />
    </div>
  )
}
