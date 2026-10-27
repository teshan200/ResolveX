import type { PeriodName } from './platform'

export type AnalyticsPeriod = PeriodName | 'Custom range'

export interface AnalyticsBar {
  label: string
  value: number
  // What is printed above the bar, e.g. "3" or "1.01M".
  valueLabel: string
}

export interface AnalyticsChart {
  id: 'subscriptions' | 'trials' | 'churn' | 'pastDue' | 'revenue'
  title: string
  subtitle: string
  yTitle: string
  xTitle: string
  // Axis labels for the bottom line, the middle line and the top line.
  yTicks: [string, string, string]
  yMax: number
  bars: AnalyticsBar[]
}

export interface AnalyticsData {
  period: AnalyticsPeriod
  range: string
  days: number
  grouping: string
  usage: {
    aiClassifications: string
    aiPerDay: string
    apiCalls: string
    apiPerDay: string
  }
  charts: AnalyticsChart[]
  // Rows of the CSV and PDF report preview.
  summary: { label: string; value: string }[]
}

export interface CustomRange {
  start: string
  end: string
}

export type ReportFormat = 'CSV' | 'PDF'
