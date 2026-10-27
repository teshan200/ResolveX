import { cn } from '../../../components/ui/cn'

const BASELINE = 160

/** Six bars on a baseline with branch names below, as in the Figma "Branch comparison" plot. The first bar is the highlight. */
export function BranchBars({ heights, labels }: { heights: number[]; labels: string[] }) {
  return (
    <div role="img" aria-label={`Complaints per 1,000 covers for ${labels.join(', ')}`}>
      {heights.map((height, i) => (
        <div
          key={labels[i]}
          className={cn('absolute w-9 rounded-t-sm', i === 0 ? 'bg-brand' : 'bg-brand-muted')}
          style={{ left: 12 + i * 60, top: BASELINE - height, height }}
        />
      ))}
      <div className="absolute left-0 w-[380px] bg-line" style={{ top: BASELINE, height: 1 }} />
      {labels.map((label, i) => (
        <p
          key={label}
          className="absolute w-[58px] -translate-x-1/2 text-center text-[11px] leading-[13px] text-content-tertiary"
          style={{ left: 30 + i * 60, top: BASELINE + 6 }}
        >
          {label}
        </p>
      ))}
    </div>
  )
}
