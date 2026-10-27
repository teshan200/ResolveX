import { TimerIcon } from '../../components/icons'
import { ProgressBar } from '../../components/ui'
import type { CaseDetail } from './types'

export function ExpectedResolutionCard({ expected }: { expected: CaseDetail['expected'] }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-4">
      <div className="flex items-center gap-2">
        <TimerIcon className="size-[18px] shrink-0 text-content" />
        <h2 className="flex-1 text-base font-semibold text-content">Expected resolution</h2>
        <span className="shrink-0 text-xs/4 font-medium text-content-tertiary">
          {expected.label}
        </span>
      </div>
      <ProgressBar value={expected.progress} label="Time elapsed towards the expected resolution" />
      <p className="text-[13px]/[18px] text-content-secondary">{expected.note}</p>
    </section>
  )
}
