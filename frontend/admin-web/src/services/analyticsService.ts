import type {
  AnalyticsBar,
  AnalyticsChart,
  AnalyticsData,
  AnalyticsPeriod,
  CustomRange,
} from '../types/analytics'

// Mock implementation. Replace the body with a real call when the backend is ready.

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type ChartId = AnalyticsChart['id']

const CHART_DEFS: { id: ChartId; title: string; yTitle: string }[] = [
  { id: 'subscriptions', title: 'New subscriptions', yTitle: 'Subscriptions' },
  { id: 'trials', title: 'New trials', yTitle: 'Trials' },
  { id: 'churn', title: 'Churn', yTitle: 'Churned subscriptions' },
  { id: 'pastDue', title: 'Past due', yTitle: 'Past-due subscriptions' },
  { id: 'revenue', title: 'Subscription revenue (LKR)', yTitle: 'Revenue (LKR)' },
]

interface ChartSpec {
  // Middle and top axis labels; the bottom one is always 0.
  ticks: [string, string]
  values: string[]
}

interface PeriodSpec {
  range: string
  days: number
  // "day", "6-day period", "week" …
  grouping: string
  xTitle: string
  labels: string[]
  ai: [total: string, perDay: string]
  api: [total: string, perDay: string]
  revenueTotal: string
  charts: Record<ChartId, ChartSpec>
}

// The figures below are the ones shown in the Figma designs. 26 Oct 2026 is "today".
const SPECS: Record<AnalyticsPeriod, PeriodSpec> = {
  'Last 7 days': {
    range: '20–26 Oct 2026',
    days: 7,
    grouping: 'day',
    xTitle: 'Day',
    labels: ['Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25', 'Mon 26'],
    ai: ['42,159', '6,023'],
    api: ['381,020', '54,431'],
    revenueTotal: 'LKR 1.09M',
    charts: {
      subscriptions: { ticks: ['1', '2'], values: ['0', '1', '0', '0', '2', '0', '0'] },
      trials: { ticks: ['3', '5'], values: ['1', '0', '0', '3', '1', '1', '1'] },
      churn: { ticks: ['1', '2'], values: ['0', '0', '0', '0', '0', '0', '0'] },
      pastDue: { ticks: ['1', '2'], values: ['1', '0', '0', '0', '0', '0', '0'] },
      revenue: {
        ticks: ['100k', '200k'],
        values: ['157k', '159k', '156k', '168k', '149k', '167k', '134k'],
      },
    },
  },
  'Last 30 days': {
    range: '27 Sep – 26 Oct 2026',
    days: 30,
    grouping: '6-day period',
    xTitle: '6-day period',
    labels: ['27 Sep–2 Oct', '3–8 Oct', '9–14 Oct', '15–20 Oct', '21–26 Oct'],
    ai: ['169,884', '5,663'],
    api: ['1,523,660', '50,789'],
    revenueTotal: 'LKR 4.59M',
    charts: {
      subscriptions: { ticks: ['3', '5'], values: ['3', '2', '1', '3', '3'] },
      trials: { ticks: ['5', '10'], values: ['3', '2', '3', '3', '6'] },
      churn: { ticks: ['1', '2'], values: ['2', '0', '1', '1', '0'] },
      pastDue: { ticks: ['1', '2'], values: ['2', '0', '2', '2', '0'] },
      revenue: { ticks: ['1M', '2M'], values: ['780k', '1.01M', '961k', '909k', '933k'] },
    },
  },
  'Last 90 days': {
    range: '29 Jul – 26 Oct 2026',
    days: 90,
    grouping: '30-day period',
    xTitle: '30-day period',
    labels: ['29 Jul–27 Aug', '28 Aug–26 Sep', '27 Sep–26 Oct'],
    ai: ['471,576', '5,240'],
    api: ['4,245,276', '47,170'],
    revenueTotal: 'LKR 12.1M',
    charts: {
      subscriptions: { ticks: ['10', '20'], values: ['11', '11', '12'] },
      trials: { ticks: ['10', '20'], values: ['13', '17', '17'] },
      churn: { ticks: ['3', '5'], values: ['3', '0', '4'] },
      pastDue: { ticks: ['5', '10'], values: ['3', '3', '6'] },
      revenue: { ticks: ['2.5M', '5M'], values: ['3.61M', '3.92M', '4.59M'] },
    },
  },
  'This month': {
    range: '1–26 Oct 2026',
    days: 26,
    grouping: 'week',
    xTitle: 'Week',
    labels: ['1–7 Oct', '8–14 Oct', '15–21 Oct', '22–26 Oct'],
    ai: ['149,095', '5,734'],
    api: ['1,337,042', '51,425'],
    revenueTotal: 'LKR 4.1M',
    charts: {
      subscriptions: { ticks: ['3', '5'], values: ['4', '1', '4', '2'] },
      trials: { ticks: ['5', '10'], values: ['2', '3', '3', '6'] },
      churn: { ticks: ['1', '2'], values: ['0', '1', '1', '0'] },
      pastDue: { ticks: ['1', '2'], values: ['0', '2', '2', '0'] },
      revenue: { ticks: ['1M', '2M'], values: ['1.16M', '1.1M', '1.07M', '774k'] },
    },
  },
  'Last month': {
    range: '1–30 Sep 2026',
    days: 30,
    grouping: 'week',
    xTitle: 'Week',
    labels: ['1–7 Sep', '8–14 Sep', '15–21 Sep', '22–30 Sep'],
    ai: ['159,551', '5,318'],
    api: ['1,445,002', '48,167'],
    revenueTotal: 'LKR 3.9M',
    charts: {
      subscriptions: { ticks: ['3', '5'], values: ['0', '5', '5', '2'] },
      trials: { ticks: ['5', '10'], values: ['7', '2', '2', '5'] },
      churn: { ticks: ['1', '2'], values: ['0', '0', '0', '2'] },
      pastDue: { ticks: ['3', '5'], values: ['1', '1', '0', '3'] },
      revenue: { ticks: ['1M', '2M'], values: ['881k', '922k', '939k', '1.16M'] },
    },
  },
  'Custom range': {
    range: '1–15 Oct 2026',
    days: 15,
    grouping: '5-day period',
    xTitle: '5-day period',
    labels: ['1–5 Oct', '6–10 Oct', '11–15 Oct'],
    ai: ['82,664', '5,511'],
    api: ['741,460', '49,431'],
    revenueTotal: 'LKR 2.41M',
    charts: {
      subscriptions: { ticks: ['3', '5'], values: ['4', '0', '1'] },
      trials: { ticks: ['3', '5'], values: ['0', '2', '4'] },
      churn: { ticks: ['1', '2'], values: ['0', '1', '0'] },
      pastDue: { ticks: ['1', '2'], values: ['0', '1', '1'] },
      revenue: { ticks: ['500k', '1M'], values: ['808k', '792k', '814k'] },
    },
  },
}

const SAMPLE_CUSTOM: CustomRange = { start: '2026-10-01', end: '2026-10-15' }

// "1.01M" → 1010000, "780k" → 780000, "12" → 12.
function parseValue(label: string) {
  const match = /^([\d.]+)([kM]?)$/.exec(label)
  if (!match) return 0
  return Number(match[1]) * (match[2] === 'M' ? 1_000_000 : match[2] === 'k' ? 1_000 : 1)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_MS = 86_400_000

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`)
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS)
const dayCount = (start: Date, end: Date) => Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1

function rangeLabel(start: Date, end: Date, spaced: boolean) {
  const [s, e] = [start, end]
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear()
  const dash = spaced ? ' – ' : '–'
  if (sameMonth) {
    const days = s.getUTCDate() === e.getUTCDate() ? `${s.getUTCDate()}` : `${s.getUTCDate()}–${e.getUTCDate()}`
    return `${days} ${MONTHS[s.getUTCMonth()]}${spaced ? ` ${s.getUTCFullYear()}` : ''}`
  }
  return `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]}${dash}${e.getUTCDate()} ${MONTHS[e.getUTCMonth()]}${spaced ? ` ${e.getUTCFullYear()}` : ''}`
}

const formatShort = (value: number) =>
  value >= 1_000_000 ? `${Math.round(value / 10_000) / 100}M` : `${Math.round(value / 1_000)}k`

// Small deterministic pseudo-random number so a custom range always shows the same figures.
const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function buildCustomSpec(start: Date, end: Date): PeriodSpec {
  const days = dayCount(start, end)
  const size = days <= 7 ? 1 : days <= 21 ? 5 : days <= 40 ? 7 : 30
  const grouping = size === 1 ? 'day' : size === 7 ? 'week' : `${size}-day period`
  const xTitle = size === 1 ? 'Day' : size === 7 ? 'Week' : `${size}-day period`
  const labels: string[] = []
  const buckets: number[] = []
  for (let offset = 0; offset < days; offset += size) {
    const from = addDays(start, offset)
    const to = addDays(start, Math.min(offset + size, days) - 1)
    labels.push(
      size === 1
        ? `${WEEKDAYS[from.getUTCDay()]} ${from.getUTCDate()}`
        : rangeLabel(from, to, false),
    )
    buckets.push(Math.min(offset + size, days) - offset)
  }
  const base = start.getTime() / DAY_MS
  const counts = (scale: number) =>
    buckets.map((length, index) => String(Math.round(seeded(base + index) * scale * Math.sqrt(length))))
  const revenue = buckets.map((length, index) =>
    formatShort(length * (30_000 + seeded(base + index + 99) * 8_000)),
  )
  const revenueSum = revenue.reduce((sum, label) => sum + parseValue(label), 0)
  const ticks = (values: string[], steps: number[]): [string, string] => {
    const max = Math.max(...values.map(Number))
    const top = steps.find((step) => step >= max) ?? steps[steps.length - 1]
    return [String(Math.ceil(top / 2)), String(top)]
  }
  const subscriptions = counts(3)
  const trials = counts(5)
  const churn = counts(1.4)
  const pastDue = counts(2)
  const aiTotal = days * 5_300 + Math.round(seeded(base) * 4_000)
  const apiTotal = days * 49_000 + Math.round(seeded(base + 1) * 30_000)
  const steps = [2, 5, 10, 20, 50, 100]
  const revenueTop = [200_000, 500_000, 1_000_000, 2_000_000, 5_000_000].find(
    (step) => step >= Math.max(...revenue.map(parseValue)),
  ) ?? 5_000_000
  return {
    range: rangeLabel(start, end, true),
    days,
    grouping,
    xTitle,
    labels,
    ai: [aiTotal.toLocaleString('en-US'), Math.round(aiTotal / days).toLocaleString('en-US')],
    api: [apiTotal.toLocaleString('en-US'), Math.round(apiTotal / days).toLocaleString('en-US')],
    revenueTotal: `LKR ${formatShort(revenueSum).replace(/k$/, 'k')}`,
    charts: {
      subscriptions: { ticks: ticks(subscriptions, steps), values: subscriptions },
      trials: { ticks: ticks(trials, steps), values: trials },
      churn: { ticks: ticks(churn, steps), values: churn },
      pastDue: { ticks: ticks(pastDue, steps), values: pastDue },
      revenue: { ticks: [formatShort(revenueTop / 2), formatShort(revenueTop)], values: revenue },
    },
  }
}

function toData(period: AnalyticsPeriod, spec: PeriodSpec): AnalyticsData {
  const charts = CHART_DEFS.map((def): AnalyticsChart => {
    const chart = spec.charts[def.id]
    const bars: AnalyticsBar[] = chart.values.map((valueLabel, index) => ({
      label: spec.labels[index],
      value: parseValue(valueLabel),
      valueLabel,
    }))
    const total = bars.reduce((sum, bar) => sum + bar.value, 0)
    const totalLabel = def.id === 'revenue' ? spec.revenueTotal : `Total ${total}`
    return {
      id: def.id,
      title: def.title,
      subtitle: `${totalLabel} · ${period} · ${spec.range}`,
      yTitle: def.yTitle,
      xTitle: spec.xTitle,
      yTicks: ['0', chart.ticks[0], chart.ticks[1]],
      yMax: parseValue(chart.ticks[1]),
      bars,
    }
  })
  const total = (id: ChartId) =>
    charts.find((chart) => chart.id === id)?.bars.reduce((sum, bar) => sum + bar.value, 0) ?? 0
  return {
    period,
    range: spec.range,
    days: spec.days,
    grouping: spec.grouping,
    usage: {
      aiClassifications: spec.ai[0],
      aiPerDay: spec.ai[1],
      apiCalls: spec.api[0],
      apiPerDay: spec.api[1],
    },
    charts,
    summary: [
      { label: 'Report period', value: `${period} · ${spec.range} (${spec.days} days)` },
      { label: 'New subscriptions', value: String(total('subscriptions')) },
      { label: 'New trials', value: String(total('trials')) },
      { label: 'Churned subscriptions', value: String(total('churn')) },
      { label: 'Past due', value: String(total('pastDue')) },
      { label: 'Subscription revenue', value: `LKR ${total('revenue').toLocaleString('en-US')}` },
      { label: 'AI classifications', value: spec.ai[0] },
      { label: 'API calls', value: spec.api[0] },
    ],
  }
}

// GET /admin/analytics?from=…&to=…
export async function getAnalytics(
  period: AnalyticsPeriod,
  custom: CustomRange = SAMPLE_CUSTOM,
): Promise<AnalyticsData> {
  await delay()
  if (period === 'Custom range' && (custom.start !== SAMPLE_CUSTOM.start || custom.end !== SAMPLE_CUSTOM.end)) {
    return toData(period, buildCustomSpec(toDate(custom.start), toDate(custom.end)))
  }
  return toData(period, SPECS[period])
}

export const DEFAULT_CUSTOM_RANGE = SAMPLE_CUSTOM

export { dayCount, rangeLabel, toDate }
