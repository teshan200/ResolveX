import { Calendar, Download, FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, PageHeader, PeriodSelector } from '../components/ui'
import { cn } from '../components/ui/cn'
import { BarChart } from '../features/analytics/BarChart'
import { CustomRangePicker } from '../features/analytics/CustomRangePicker'
import { ReportPreview } from '../features/analytics/ReportPreview'
import { PERIODS } from '../features/platform/periods'
import { DEFAULT_CUSTOM_RANGE, getAnalytics } from '../services/analyticsService'
import type {
  AnalyticsChart,
  AnalyticsData,
  AnalyticsPeriod,
  CustomRange,
  ReportFormat,
} from '../types/analytics'

const ANALYTICS_PERIODS: AnalyticsPeriod[] = [...PERIODS, 'Custom range']

function ChartCard({ chart, className }: { chart: AnalyticsChart; className?: string }) {
  return (
    <section
      className={cn('flex flex-col gap-3 rounded-xl border border-line bg-surface p-5', className)}
    >
      <header className="flex flex-col gap-0.5">
        <h2 className="text-base leading-[19px] font-semibold">{chart.title}</h2>
        <p className="text-xs leading-[15px] text-content-secondary">{chart.subtitle}</p>
      </header>
      <BarChart chart={chart} wide={chart.id === 'revenue'} />
    </section>
  )
}

export function PlatformAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('Last 30 days')
  const [custom, setCustom] = useState<CustomRange>(DEFAULT_CUSTOM_RANGE)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [report, setReport] = useState<ReportFormat | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    getAnalytics(period, custom).then((result) => {
      if (!cancelled) setData(result)
    })
    return () => {
      cancelled = true
    }
  }, [period, custom])

  // Close the range picker with Escape or a click outside it.
  useEffect(() => {
    if (!pickerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPickerOpen(false)
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [pickerOpen])

  const choosePeriod = (next: AnalyticsPeriod) => {
    setReport(null)
    if (next === 'Custom range') {
      setPickerOpen(true)
      return
    }
    setPickerOpen(false)
    setPeriod(next)
  }

  const applyCustom = (range: CustomRange) => {
    setCustom(range)
    setPeriod('Custom range')
    setPickerOpen(false)
  }

  const [chartsTop, chartsBottom] = [data?.charts.slice(0, 3) ?? [], data?.charts.slice(3) ?? []]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Platform-wide subscriptions, revenue and usage across all tenants. Pick a period to update every chart."
      />

      <div className="flex flex-col gap-5">
        <div className="flex h-10 items-center justify-between gap-4">
          <div ref={pickerRef} className="relative">
            <PeriodSelector
              periods={ANALYTICS_PERIODS}
              value={period}
              onChange={choosePeriod}
            />
            {pickerOpen && (
              <div className="absolute top-full left-0 z-20 mt-2">
                <CustomRangePicker
                  key={`${custom.start}-${custom.end}`}
                  value={custom}
                  onApply={applyCustom}
                  onCancel={() => setPickerOpen(false)}
                />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="font-semibold!"
              disabled={!data}
              onClick={() => setReport('CSV')}
            >
              <Download size={18} />
              Generate CSV
            </Button>
            <Button className="font-semibold!" disabled={!data} onClick={() => setReport('PDF')}>
              <FileText size={18} />
              Generate PDF
            </Button>
          </div>
        </div>

        {data && (
          <>
            <p className="flex items-center gap-2 text-[13px] leading-4 text-content-secondary">
              <Calendar size={16} className="shrink-0 text-neutral-700" />
              <span>
                Showing {data.period}:{' '}
                <span className="font-semibold text-content">{data.range}</span> ({data.days}{' '}
                {data.days === 1 ? 'day' : 'days'}) · charts grouped by {data.grouping}
              </span>
            </p>

            {report && <ReportPreview format={report} data={data} onClose={() => setReport(null)} />}

            <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
              <header className="flex flex-col gap-0.5">
                <h2 className="text-base leading-[19px] font-semibold">Usage this cycle</h2>
                <p className="text-xs leading-[15px] text-content-secondary">
                  Platform-wide across all tenants · {data.period} · {data.range}
                </p>
              </header>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'AI Classifications', value: data.usage.aiClassifications, perDay: data.usage.aiPerDay },
                  { label: 'API Calls', value: data.usage.apiCalls, perDay: data.usage.apiPerDay },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1 rounded-lg bg-canvas p-4">
                    <p className="text-[13px] leading-4 font-medium text-content-secondary">
                      {stat.label}
                    </p>
                    <p className="text-[28px] leading-[34px] font-semibold">{stat.value}</p>
                    <p className="text-xs leading-[15px] text-content-disabled">
                      avg {stat.perDay} per day
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-3 gap-4">
              {chartsTop.map((chart) => (
                <ChartCard key={chart.id} chart={chart} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {chartsBottom.map((chart) => (
                <ChartCard
                  key={chart.id}
                  chart={chart}
                  className={chart.id === 'revenue' ? 'col-span-2' : undefined}
                />
              ))}
            </div>
          </>
        )}

        {!data && (
          <p className="text-sm leading-5 text-content-secondary">Loading analytics…</p>
        )}
      </div>
    </div>
  )
}
