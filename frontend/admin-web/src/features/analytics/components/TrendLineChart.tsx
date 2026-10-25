const WIDTH = 378
const gridLines = [20, 65, 110, 155]

/** x positions of evenly spaced points across the plot. */
function points(values: number[]): string {
  const step = WIDTH / (values.length - 1)
  return values.map((y, i) => `${Math.round(i * step * 10) / 10},${y}`).join(' ')
}

interface TrendLineChartProps {
  /** Solid line (complaints). */
  complaints: number[]
  /** Dotted line (SLA breaches). */
  breaches: number[]
}

/** Complaint trend (solid green) against SLA breaches (dotted red), drawn as in the Figma plot. */
export function TrendLineChart({ complaints, breaches }: TrendLineChartProps) {
  return (
    <svg
      role="img"
      aria-label="Daily complaints rising over the period, with SLA breaches also rising but more slowly"
      width="380"
      height="180"
      viewBox="0 0 380 180"
      className="absolute top-0 left-0"
    >
      {gridLines.map((y) => (
        <line key={y} x1="0" x2="380" y1={y + 0.5} y2={y + 0.5} stroke="var(--color-line-subtle)" />
      ))}
      <polyline
        points={points(complaints)}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={points(breaches)}
        fill="none"
        stroke="var(--color-danger-solid)"
        strokeWidth="2"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />
    </svg>
  )
}
