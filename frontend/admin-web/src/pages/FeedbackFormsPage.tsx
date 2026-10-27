import { useMemo, useState } from 'react'
import { Ban, ChevronsUpDown, CircleCheck, CircleDot, Ellipsis, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FilterChip, IconButton, SearchField, StatusPill } from '../components/ui'
import { cn } from '../components/ui/cn'
import { feedbackForms } from '../features/tenant-admin/mocks'
import type { FeedbackForm, FormStatus } from '../features/tenant-admin/mocks'

type Chip = 'All' | FormStatus
type SortKey = 'name' | 'status' | 'responses' | 'completion' | 'updated'
interface Sort {
  key: SortKey
  direction: 'asc' | 'desc'
}

const chips: Chip[] = ['All', 'Published', 'Draft', 'Inactive']
const statusRank: Record<FormStatus, number> = { Published: 3, Draft: 2, Inactive: 1 }

const statusPill: Record<FormStatus, { tone: 'resolved' | 'new' | 'neutral'; icon: typeof Ban }> = {
  Published: { tone: 'resolved', icon: CircleCheck },
  Draft: { tone: 'new', icon: CircleDot },
  Inactive: { tone: 'neutral', icon: Ban },
}

const head =
  'flex h-10 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'
const cell = 'flex h-14 items-center gap-2 overflow-hidden px-4'

const responseCount = (f: FeedbackForm) => (f.responses ? Number(f.responses.replace(/,/g, '')) : -1)

function HeadCell({
  label,
  className,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  className?: string
  sortKey?: SortKey
  sort: Sort | null
  onSort: (key: SortKey) => void
}) {
  return (
    <div
      role="columnheader"
      aria-sort={sortKey && sort?.key === sortKey ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
      className={cn(head, className)}
    >
      {sortKey ? (
        <button type="button" onClick={() => onSort(sortKey)} className="flex cursor-pointer items-center gap-1 hover:text-content">
          {label}
          <ChevronsUpDown size={14} className="text-content-tertiary" aria-hidden />
        </button>
      ) : (
        label
      )}
    </div>
  )
}

/** Tenant admin "Feedback forms" tab (Figma node 42:4082). Sample data. "New form" and the v5 draft open the builder. */
export function FeedbackFormsPage() {
  const [chip, setChip] = useState<Chip>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort | null>(null)

  const count = (c: Chip) => (c === 'All' ? feedbackForms.length : feedbackForms.filter((f) => f.status === c).length)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = feedbackForms.filter(
      (f) =>
        (chip === 'All' || f.status === chip) &&
        (!q || f.name.toLowerCase().includes(q) || f.scope.toLowerCase().includes(q)),
    )
    if (!sort) return list
    const dir = sort.direction === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case 'name':
          return dir * a.name.localeCompare(b.name)
        case 'status':
          return dir * (statusRank[a.status] - statusRank[b.status])
        case 'responses':
          return dir * (responseCount(a) - responseCount(b))
        case 'completion':
          return dir * ((a.completion ?? -1) - (b.completion ?? -1))
        default:
          return dir * (a.updatedOrder - b.updatedOrder)
      }
    })
  }, [chip, search, sort])

  const onSort = (key: SortKey) =>
    setSort((s) => (s?.key === key && s.direction === 'asc' ? { key, direction: 'desc' } : { key, direction: 'asc' }))
  const h = { sort, onSort }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Feedback forms</h1>
          <p className="text-sm leading-5 text-content-secondary">
            Dynamic, versioned forms served by your QR codes. Publish per branch or service area.
          </p>
        </div>
        <Link
          to="/tenant/feedback-forms/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover active:bg-brand-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        >
          <Plus size={18} aria-hidden />
          New form
        </Link>
      </header>

      <div className="flex items-center gap-3">
        <div role="group" aria-label="Form status" className="flex min-w-0 flex-1 gap-2">
          {chips.map((c) => (
            <FilterChip key={c} label={c} count={count(c)} selected={chip === c} onClick={() => setChip(c)} />
          ))}
        </div>
        <SearchField
          className="w-[260px] shrink-0"
          placeholder="Search tickets, cases, branches…"
          aria-label="Search forms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
        <div role="table" aria-label="Feedback forms">
          <div role="row" className="flex w-full">
            <HeadCell label="Form" sortKey="name" className="min-w-0 flex-1" {...h} />
            <HeadCell label="Version" className="w-[110px] shrink-0" {...h} />
            <HeadCell label="Status" sortKey="status" className="w-[140px] shrink-0" {...h} />
            <HeadCell label="Responses (30d)" sortKey="responses" className="w-[150px] shrink-0" {...h} />
            <HeadCell label="Completion" sortKey="completion" className="w-[150px] shrink-0" {...h} />
            <HeadCell label="Updated" sortKey="updated" className="w-[130px] shrink-0" {...h} />
            <HeadCell label="" className="w-[52px] shrink-0" {...h} />
          </div>
          {rows.map((f) => {
            const pill = statusPill[f.status]
            return (
              <div key={f.id} role="row" className="flex w-full border-b border-line-subtle bg-surface last:border-b-0">
                <div className={cn(cell, 'min-w-0 flex-1')}>
                  <div className="min-w-0 flex-1 whitespace-nowrap">
                    {f.id === 'f4' ? (
                      <Link to={`/tenant/feedback-forms/${f.id}`} className="block truncate text-sm leading-5 font-medium hover:underline">
                        {f.name}
                      </Link>
                    ) : (
                      <p className="truncate text-sm leading-5 font-medium">{f.name}</p>
                    )}
                    <p className="truncate text-xs leading-4 text-content-tertiary">{f.scope}</p>
                  </div>
                </div>
                <div className={cn(cell, 'w-[110px] shrink-0')}>
                  <p className="min-w-0 flex-1 truncate font-mono text-[13px] leading-5 font-medium">{f.version}</p>
                </div>
                <div className={cn(cell, 'w-[140px] shrink-0')}>
                  <StatusPill tone={pill.tone} icon={pill.icon}>
                    {f.status}
                  </StatusPill>
                </div>
                <div className={cn(cell, 'w-[150px] shrink-0')}>
                  <p className="min-w-0 flex-1 truncate text-sm leading-5">{f.responses ?? '—'}</p>
                </div>
                <div className={cn(cell, 'w-[150px] shrink-0')}>
                  {f.completion === undefined ? (
                    <p className="text-[13px] leading-4.5 text-content-secondary">—</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        role="progressbar"
                        aria-label={`${f.name} completion`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={f.completion}
                        className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className={cn('h-full rounded-full', f.completion >= 70 ? 'bg-success-solid' : 'bg-warning-solid')}
                          style={{ width: `${f.completion}%` }}
                        />
                      </div>
                      <p className="text-[13px] leading-4.5 font-medium whitespace-nowrap">{f.completion}%</p>
                    </div>
                  )}
                </div>
                <div className={cn(cell, 'w-[130px] shrink-0')}>
                  <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{f.updated}</p>
                </div>
                <div className={cn(cell, 'w-[52px] shrink-0 justify-end')}>
                  <IconButton icon={Ellipsis} label={`${f.name} actions`} size="sm" />
                </div>
              </div>
            )
          })}
        </div>
        {rows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm leading-5 text-content-secondary">No forms match this filter.</p>
        )}
      </section>
    </div>
  )
}
