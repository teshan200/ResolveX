import type { PeriodName } from '../../types/platform'

export const PERIODS: PeriodName[] = [
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'This month',
  'Last month',
]

// The mock treats 26 Oct 2026 as today.
export const PERIOD_RANGES: Record<PeriodName, string> = {
  'Last 7 days': '20–26 Oct 2026',
  'Last 30 days': '27 Sep – 26 Oct 2026',
  'Last 90 days': '29 Jul – 26 Oct 2026',
  'This month': '1–26 Oct 2026',
  'Last month': '1–30 Sep 2026',
}
