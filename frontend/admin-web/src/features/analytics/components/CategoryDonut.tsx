interface Slice {
  label: string
  percent: number
  color: string
}

const SIZE = 160
const STROKE = 34
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** Small gap between slices, in pixels of arc length. */
const GAP = 2

/** Donut with a legend, drawn as in the Figma plot. Slices start at 12 o'clock and run clockwise. */
export function CategoryDonut({ slices }: { slices: Slice[] }) {
  return (
    <>
      <svg
        role="img"
        aria-label={`Complaints by category: ${slices.map((s) => `${s.label} ${s.percent}%`).join(', ')}`}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute top-2.5 left-5"
      >
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {slices.map((slice, index) => {
            const length = (slice.percent / 100) * CIRCUMFERENCE
            const before = slices.slice(0, index).reduce((sum, s) => sum + s.percent, 0)
            const start = (before / 100) * CIRCUMFERENCE
            return (
              <circle
                key={slice.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={slice.color}
                strokeWidth={STROKE}
                strokeDasharray={`${length - GAP} ${CIRCUMFERENCE - length + GAP}`}
                strokeDashoffset={-start}
              />
            )
          })}
        </g>
      </svg>
      <ul className="absolute top-10 left-[210px] flex flex-col gap-2">
        {slices.map((slice) => (
          <li
            key={slice.label}
            className="flex items-center gap-2 text-xs leading-4 font-medium whitespace-nowrap text-content-secondary"
          >
            <span aria-hidden className="size-2 rounded-full" style={{ background: slice.color }} />
            {slice.label} · {slice.percent}%
          </li>
        ))}
      </ul>
    </>
  )
}
