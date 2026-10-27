import { cn } from '../../components/ui/cn'
import type { AnalyticsChart } from '../../types/analytics'

// Positions follow the Figma chart: a 214px tall plot, the zero line at 144px and the
// top line at 14px, so the bars have 130px of height to share.
const PLOT_HEIGHT = 214
const ZERO_LINE = 144
const MID_LINE = 79
const TOP_LINE = 14
const BAR_SPAN = ZERO_LINE - TOP_LINE

interface BarChartProps {
  chart: AnalyticsChart
  // The revenue chart is wider and needs more room for its axis labels.
  wide?: boolean
}

export function BarChart({ chart, wide = false }: BarChartProps) {
  const axisWidth = wide ? 70 : 44
  const lines = [
    { top: ZERO_LINE, label: chart.yTicks[0], style: 'bg-line' },
    { top: MID_LINE, label: chart.yTicks[1], style: 'bg-line-subtle' },
    { top: TOP_LINE, label: chart.yTicks[2], style: 'bg-line-subtle' },
  ]

  return (
    <div
      role="img"
      aria-label={`${chart.title}: ${chart.bars.map((bar) => `${bar.label} ${bar.valueLabel}`).join(', ')}`}
      className="relative"
      style={{ height: PLOT_HEIGHT }}
    >
      <span
        className="absolute text-[11px] leading-[13px] font-medium whitespace-nowrap text-content-disabled"
        style={{ left: 6.5, top: MID_LINE, transform: 'translate(-50%, -50%) rotate(-90deg)' }}
      >
        {chart.yTitle}
      </span>

      {lines.map((line) => (
        <div key={line.top}>
          <div
            className={cn('absolute right-0 h-px', line.style)}
            style={{ left: axisWidth, top: line.top }}
          />
          <span
            className="absolute text-right text-[10px] leading-3 text-content-disabled"
            style={{ left: 0, width: axisWidth - 6, top: line.top - 6 }}
          >
            {line.label}
          </span>
        </div>
      ))}

      <div className="absolute inset-y-0 right-0 flex" style={{ left: axisWidth }}>
        {chart.bars.map((bar) => {
          const height = (bar.value / chart.yMax) * BAR_SPAN
          const baseline = PLOT_HEIGHT - ZERO_LINE
          return (
            <div key={bar.label} className="relative flex-1">
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-brand"
                style={{ bottom: baseline, height, width: 'min(36px, 50%)' }}
              />
              <span
                className="absolute inset-x-0 text-center text-[10px] leading-3 font-medium text-content-secondary"
                style={{ bottom: baseline + height + 3 }}
              >
                {bar.valueLabel}
              </span>
              <span
                className="absolute left-1/2 -translate-x-1/2 text-center text-[10px] leading-3 text-content-secondary"
                style={{ top: 150, width: 'calc(100% - 6px)' }}
              >
                {bar.label}
              </span>
            </div>
          )
        })}
      </div>

      <span
        className="absolute right-0 text-center text-[11px] leading-[13px] font-medium text-content-disabled"
        style={{ left: axisWidth, top: 200 }}
      >
        {chart.xTitle}
      </span>
    </div>
  )
}
