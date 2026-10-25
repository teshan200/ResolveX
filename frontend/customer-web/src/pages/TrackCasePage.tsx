import { ShieldCheckIcon } from '../components/icons'
import { TrackCaseForm } from '../features/tracking/TrackCaseForm'

export function TrackCasePage() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-6 pb-4">
      <div className="rounded-xl border border-line-subtle bg-surface px-5 py-6">
        <TrackCaseForm />
      </div>
      <p className="flex items-center gap-1.5 text-xs/4 text-content-tertiary">
        <ShieldCheckIcon className="size-3.5 shrink-0" />
        Visible only with the matching case ID and email
      </p>
    </div>
  )
}
