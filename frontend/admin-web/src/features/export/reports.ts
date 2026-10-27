import { analyticsKpis, categorySlices, recoveryMetrics, staffPerformance } from '../analytics/mocks'
import type { AnalyticsFilters } from '../analytics/mocks'
import type { ExportReport, ExportSection } from './csv'

// Builds export data from the same mock data the screens show. No backend is connected.

const kpiSection = (only?: string[]): ExportSection => ({
  title: 'Key figures',
  columns: ['Metric', 'Value', 'Change', 'Compared with prior period'],
  rows: analyticsKpis
    .filter((k) => !only || only.includes(k.label))
    .map((k) => [k.label, String(k.value), k.delta, k.note]),
})

const categorySection = (): ExportSection => ({
  title: 'Complaints by category',
  columns: ['Category', 'Share (%)'],
  rows: categorySlices.map((c) => [c.label, c.percent]),
})

const recoverySection = (): ExportSection => ({
  title: 'Service recovery',
  columns: ['Metric', 'Value'],
  rows: recoveryMetrics.map((m) => [m.label, m.display]),
})

const staffSection = (): ExportSection => ({
  title: 'Staff response performance',
  columns: ['Staff', 'Branch and designation', 'Tickets', 'Avg. ack', 'Avg. resolution', 'SLA met (%)', 'Post-resolution CSAT'],
  rows: staffPerformance.map((s) => [s.name, s.role, s.tickets, s.avgAck, s.avgResolution, s.slaMet, s.csat]),
})

const generated = () => new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

/** Everything on the Analytics page, with the filters that were selected. */
export function analyticsReport(filters: AnalyticsFilters): ExportReport {
  return {
    title: 'Analytics',
    meta: [
      ['Period', filters.period],
      ['Branch', filters.branch],
      ['Category', filters.category],
      ['Priority', filters.priority],
      ['Generated', generated()],
    ],
    sections: [kpiSection(), categorySection()],
  }
}

export interface ReportOptions {
  range: string
  branches: string
}

/** Sections available for each report template. Templates with no sample data return null. */
const templateSections: Record<string, (() => ExportSection[]) | null> = {
  sla: () => [kpiSection(['Avg. response', 'Avg. resolution', 'SLA violation rate', 'Critical rate'])],
  branch: null,
  staff: () => [staffSection()],
  recovery: () => [recoverySection()],
  ai: null,
}

export function hasReportData(templateId: string): boolean {
  return Boolean(templateSections[templateId])
}

export function templateReport(templateId: string, title: string, options: ReportOptions): ExportReport | null {
  const build = templateSections[templateId]
  if (!build) return null
  return {
    title,
    meta: [
      ['Date range', options.range],
      ['Branches', options.branches],
      ['Generated', generated()],
    ],
    sections: build(),
  }
}
