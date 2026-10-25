import { Download, MoreHorizontal, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  FilterChip,
  IconButton,
  PageHeader,
  Pagination,
  SearchField,
  Table,
  Tag,
} from '../components/ui'
import type { Column, SortState } from '../components/ui'
import { CompanyStatusBadge } from '../features/companies/CompanyStatusBadge'
import { getCompanies } from '../services/companyService'
import { formatLkr } from '../services/planService'
import type { Company, CompanyFilter, CompanyList } from '../types/company'

const FILTERS: CompanyFilter[] = ['All', 'Active', 'Trial', 'Past due', 'Suspended', 'Pending']
const PAGE_SIZE = 10

const matchesFilter = (company: Company, filter: CompanyFilter) =>
  filter === 'All' ||
  company.status === filter ||
  (filter === 'Pending' && company.status === 'Pending verification')

const sortValue = (company: Company, key: string): string | number => {
  switch (key) {
    case 'company':
      return company.name.toLowerCase()
    case 'branches':
      return company.branches ?? -1
    case 'users':
      return company.users
    case 'status':
      return company.status
    case 'price':
      return company.planPrice ?? -1
    default:
      return 0
  }
}

const columns: Column<Company>[] = [
  {
    key: 'company',
    header: 'Company',
    sortable: true,
    render: (company) => (
      <>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
          {company.initials}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm leading-5 font-medium">{company.name}</span>
          <span className="truncate text-xs leading-4 text-content-tertiary">
            {company.domain} · {company.city}
          </span>
        </span>
      </>
    ),
  },
  {
    key: 'plan',
    header: 'Plan',
    width: 120,
    render: (company) => <Tag tone={company.planTone}>{company.plan ?? 'No plan'}</Tag>,
  },
  {
    key: 'branches',
    header: 'Branches',
    width: 96,
    sortable: true,
    render: (company) => <span className="truncate text-sm leading-5">{company.branches ?? '—'}</span>,
  },
  {
    key: 'users',
    header: 'Users',
    width: 90,
    sortable: true,
    render: (company) => (
      <span className="truncate text-sm leading-5">{company.users.toLocaleString('en-US')}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: 170,
    sortable: true,
    render: (company) => <CompanyStatusBadge status={company.status} />,
  },
  {
    key: 'price',
    header: 'Plan price',
    width: 100,
    sortable: true,
    render: (company) =>
      company.planPrice === null ? (
        <span className="font-mono text-xs leading-4 font-medium">—</span>
      ) : (
        <span className="truncate font-mono text-xs leading-4 font-medium">
          {formatLkr(company.planPrice)}
        </span>
      ),
  },
  {
    key: 'lastActivity',
    header: 'Last activity',
    width: 130,
    render: (company) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">
        {company.lastActivity}
      </span>
    ),
  },
  {
    key: 'actions',
    header: '',
    width: 52,
    render: (company) => (
      <IconButton
        icon={MoreHorizontal}
        label={`More actions for ${company.name}`}
        size="sm"
        onClick={(event) => event.preventDefault()}
      />
    ),
  },
]

export function CompaniesPage() {
  const [list, setList] = useState<CompanyList | null>(null)
  const [filter, setFilter] = useState<CompanyFilter>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | undefined>()
  const [page, setPage] = useState(1)

  useEffect(() => {
    getCompanies().then(setList)
  }, [])

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = (list?.companies ?? []).filter(
      (company) =>
        matchesFilter(company, filter) &&
        (!query ||
          [company.name, company.domain, company.id].some((value) =>
            value.toLowerCase().includes(query),
          )),
    )
    if (!sort) return filtered
    const direction = sort.direction === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const left = sortValue(a, sort.key)
      const right = sortValue(b, sort.key)
      return (left < right ? -1 : left > right ? 1 : 0) * direction
    })
  }, [list, filter, search, sort])

  const toggleSort = (key: string) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )

  const total = search.trim() ? rows.length : (list?.counts[filter] ?? 0)
  const start = (page - 1) * PAGE_SIZE + 1
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total} ${total === 1 ? 'company' : 'companies'}`
    : 'No companies to show'

  const changeFilter = (next: CompanyFilter) => {
    setFilter(next)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Companies"
        description="Every tenant on the platform. Data is isolated per tenant (SaaS-07…10)."
        actions={
          <>
            <Button variant="outline" className="font-semibold!">
              <Download size={18} />
              Export
            </Button>
            <Button className="font-semibold!">
              <Plus size={18} />
              Create tenant
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 gap-2">
          {FILTERS.map((item) => (
            <FilterChip
              key={item}
              label={item}
              count={list?.counts[item] ?? 0}
              selected={filter === item}
              onClick={() => changeFilter(item)}
            />
          ))}
        </div>
        <SearchField
          className="w-65"
          placeholder="Search company, domain, tenant ID…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <Table
          columns={columns}
          rows={rows}
          rowKey={(company) => company.id}
          rowHref={(company) => `/super-admin/companies/${company.id}`}
          rowClassName={(company) =>
            company.status === 'Past due' || company.status === 'Suspended'
              ? 'bg-danger-bg'
              : undefined
          }
          sort={sort}
          onSort={toggleSort}
          empty={
            <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
              {list ? 'No companies match these filters.' : 'Loading companies…'}
            </p>
          }
        />
        <div className="px-5 py-3">
          <Pagination
            summary={summary}
            page={page}
            pageCount={list?.pageCount ?? 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
