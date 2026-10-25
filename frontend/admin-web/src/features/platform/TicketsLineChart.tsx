// The plot is drawn on a fixed 634 × 180 canvas, the size of the Figma chart area.
const WIDTH = 634
const HEIGHT = 180
const STEP = 54
const GRID_LINES = [20, 65, 110, 155]

function linePath(values: number[], top: number, height: number) {
  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${index * STEP} ${top + (1 - value) * height}`)
    .join(' ')
}

interface TicketsLineChartProps {
  processed: number[]
  breached: number[]
}

export function TicketsLineChart({ processed, breached }: TicketsLineChartProps) {
  return (
    <svg
      role="img"
      aria-label="Tickets processed over the last 30 days"
      width="100%"
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMinYMin meet"
    >
      {GRID_LINES.map((y) => (
        <rect key={y} x={0} y={y} width={380} height={1} fill="var(--color-line-subtle)" />
      ))}
      <path
        d={linePath(processed, 40, 100)}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={2.5}
      />
      <path
        d={linePath(breached, 108, 42)}
        fill="none"
        stroke="var(--color-danger-solid)"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    </svg>
  )
}
