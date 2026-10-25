export type Cell = string | number

export interface ExportSection {
  title: string
  columns: string[]
  rows: Cell[][]
}

export interface ExportReport {
  title: string
  /** Label and value pairs printed above the data, for example the period and branch. */
  meta: [string, string][]
  sections: ExportSection[]
}

/** Quotes a value when it contains a comma, quote or line break (RFC 4180). */
function escapeCell(value: Cell): string {
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const line = (cells: Cell[]) => cells.map(escapeCell).join(',')

/** Builds CSV text: the report title and meta lines, then each section as its own block. */
export function reportToCsv(report: ExportReport): string {
  const lines: string[] = [line([report.title])]
  for (const [label, value] of report.meta) lines.push(line([label, value]))
  for (const section of report.sections) {
    lines.push('', line([section.title]), line(section.columns))
    for (const row of section.rows) lines.push(line(row))
  }
  return lines.join('\r\n') + '\r\n'
}

/** Saves text as a file in the browser. The byte order mark lets Excel read UTF-8 correctly. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** "executive-summary-2026-10-25.csv" */
export function exportFilename(name: string, extension = 'csv'): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}-${new Date().toISOString().slice(0, 10)}.${extension}`
}
