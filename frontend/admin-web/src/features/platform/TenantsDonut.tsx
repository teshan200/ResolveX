import type { PlanSlice } from '../../types/platform'

// The ring is drawn on the Figma canvas: 160px across, centred at (100, 90), inner radius 62%.
const CENTER = { x: 100, y: 90 }
const OUTER = 80
const INNER = OUTER * 0.62
const START = -Math.PI / 2

const point = (radius: number, angle: number) =>
  `${CENTER.x + radius * Math.cos(angle)} ${CENTER.y + radius * Math.sin(angle)}`

function slicePath(from: number, to: number) {
  const large = to - from > Math.PI ? 1 : 0
  return [
    `M ${point(OUTER, from)}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${point(OUTER, to)}`,
    `L ${point(INNER, to)}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${point(INNER, from)}`,
    'Z',
  ].join(' ')
}

export function TenantsDonut({ slices }: { slices: PlanSlice[] }) {
  const paths = slices.map((slice, index) => {
    const sharedBefore = slices.slice(0, index).reduce((sum, item) => sum + item.arcShare, 0)
    const from = START + sharedBefore * Math.PI * 2
    return { slice, d: slicePath(from, from + slice.arcShare * Math.PI * 2) }
  })

  return (
    <div className="relative h-45">
      <svg
        role="img"
        aria-label="Tenants by plan"
        width="100%"
        height="180"
        viewBox="0 0 378 180"
        preserveAspectRatio="xMinYMin meet"
      >
        {paths.map(({ slice, d }) => (
          <path key={slice.label} d={d} fill={slice.color} />
        ))}
      </svg>
      <ul className="absolute top-10 left-52.5 flex flex-col gap-2">
        {slices.map((slice) => (
          <li
            key={slice.label}
            className="flex items-center gap-2 text-xs leading-4 font-medium text-content-secondary"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            {slice.label} · {slice.percent}%
          </li>
        ))}
      </ul>
    </div>
  )
}
