import { cn } from '../../../components/ui/cn'

const BASELINE = 160

/** Six bars on a baseline, as in the Figma "Branch comparison" plot. The first bar is the highlight. */
export function BranchBars({ heights }: { heights: number[] }) {
  return (
    <div
      role="img"
      aria-label={`Complaints per 1,000 covers for ${heights.length} branches, highest first`}
    >
      {heights.map((height, i) => (
        <div
          key={i}
          className={cn('absolute w-9 rounded-t-sm', i === 0 ? 'bg-brand' : 'bg-brand-muted')}
          style={{ left: 12 + i * 60, top: BASELINE - height, height }}
        />
      ))}
      <div className="absolute left-0 w-[380px] bg-line" style={{ top: BASELINE, height: 1 }} />
    </div>
  )
}
