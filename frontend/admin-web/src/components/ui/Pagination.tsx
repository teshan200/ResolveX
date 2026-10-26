import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './cn'

interface PaginationProps {
  summary: string
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

function pageItems(page: number, count: number): (number | '…')[] {
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1)
  if (page <= 3) return [1, 2, 3, '…', count]
  if (page >= count - 2) return [1, '…', count - 2, count - 1, count]
  return [1, '…', page, '…', count]
}

const box = 'flex size-8 shrink-0 items-center justify-center rounded-md border text-[13px] leading-4.5 font-medium'

export function Pagination({ summary, page, pageCount, onPageChange }: PaginationProps) {
  return (
    <div className="flex h-10 items-center justify-between">
      <p className="text-[13px] leading-4.5 text-content-secondary">{summary}</p>
      <nav aria-label="Pagination" className="flex gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            box,
            'cursor-pointer border-line text-content-tertiary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <ChevronLeft size={16} />
        </button>
        {pageItems(page, pageCount).map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`} className={cn(box, 'border-line text-content')}>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                box,
                'cursor-pointer',
                item === page
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-line text-content hover:bg-muted',
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            box,
            'cursor-pointer border-line text-content-tertiary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}
