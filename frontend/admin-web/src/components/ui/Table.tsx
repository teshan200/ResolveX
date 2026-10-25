import { ChevronsUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from './cn'

export type SortDirection = 'asc' | 'desc'

export interface Column<T> {
  key: string
  header: string
  // Fixed width in px. A column without one takes the remaining space.
  width?: number
  sortable?: boolean
  render: (row: T) => ReactNode
}

export interface SortState {
  key: string
  direction: SortDirection
}

interface TableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  rowHref?: (row: T) => string
  rowClassName?: (row: T) => string | undefined
  sort?: SortState
  onSort?: (key: string) => void
  empty?: ReactNode
}

const cellWidth = (width?: number) => (width ? { width, flex: 'none' } : { flex: '1 1 0%' })

export function Table<T>({
  columns,
  rows,
  rowKey,
  rowHref,
  rowClassName,
  sort,
  onSort,
  empty,
}: TableProps<T>) {
  return (
    <div role="table">
      <div role="row" className="flex">
        {columns.map((column) => {
          const sorted = sort?.key === column.key ? sort.direction : undefined
          return (
            <div
              key={column.key}
              role="columnheader"
              aria-sort={
                sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined
              }
              style={cellWidth(column.width)}
              className="flex h-10 min-w-0 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold text-content-secondary"
            >
              {column.sortable ? (
                <button
                  type="button"
                  onClick={() => onSort?.(column.key)}
                  className="flex cursor-pointer items-center gap-1 hover:text-content"
                >
                  {column.header}
                  <ChevronsUpDown size={14} className="text-content-tertiary" />
                </button>
              ) : (
                column.header
              )}
            </div>
          )
        })}
      </div>

      {rows.length === 0 && empty}

      {rows.map((row) => {
        // A row can bring its own background (e.g. a tinted warning row).
        const tint = rowClassName?.(row)
        const className = cn(
          'flex border-b border-line-subtle',
          tint ?? 'bg-surface',
          rowHref && 'cursor-pointer transition-colors',
          rowHref && !tint && 'hover:bg-canvas',
        )
        const cells = columns.map((column) => (
          <div
            key={column.key}
            role="cell"
            style={cellWidth(column.width)}
            className="flex h-14.5 min-w-0 items-center gap-2 overflow-hidden px-4 text-left"
          >
            {column.render(row)}
          </div>
        ))

        return rowHref ? (
          <Link key={rowKey(row)} role="row" to={rowHref(row)} className={className}>
            {cells}
          </Link>
        ) : (
          <div key={rowKey(row)} role="row" className={className}>
            {cells}
          </div>
        )
      })}
    </div>
  )
}
