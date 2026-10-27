import { useEffect, useMemo, useState } from 'react'
import { PageHeader, Pagination, SearchField, Table } from '../components/ui'
import type { Column, SortState } from '../components/ui'
import { getAdminUsers } from '../services/companyService'
import type { AdminUserList, AdminUserRow } from '../types/company'

const PAGE_SIZE = 10

const columns: Column<AdminUserRow>[] = [
  {
    key: 'name',
    header: 'Tenant Admin Name',
    sortable: true,
    render: (admin) => (
      <>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-muted text-xs leading-4 font-semibold text-content-brand">
          {admin.initials}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm leading-5 font-medium">{admin.name}</span>
          <span className="truncate text-xs leading-4 text-content-tertiary">{admin.role}</span>
        </span>
      </>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    width: 310,
    render: (admin) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">{admin.email}</span>
    ),
  },
  {
    key: 'company',
    header: 'Company Name',
    width: 290,
    sortable: true,
    render: (admin) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">
        {admin.companyName}
      </span>
    ),
  },
  {
    key: 'tenantId',
    header: 'Tenant / Company ID',
    width: 210,
    render: (admin) => (
      <span className="truncate font-mono text-xs leading-4 font-medium">{admin.tenantId}</span>
    ),
  },
]

const sortValue = (admin: AdminUserRow, key: string) =>
  (key === 'company' ? admin.companyName : admin.name).toLowerCase()

export function AdminUsersPage() {
  const [data, setData] = useState<AdminUserList | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | undefined>()
  const [page, setPage] = useState(1)

  useEffect(() => {
    getAdminUsers().then(setData)
  }, [])

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = (data?.admins ?? []).filter(
      (admin) =>
        !query ||
        [admin.name, admin.email, admin.companyName, admin.tenantId].some((value) =>
          value.toLowerCase().includes(query),
        ),
    )
    if (!sort) return filtered
    const direction = sort.direction === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const left = sortValue(a, sort.key)
      const right = sortValue(b, sort.key)
      return (left < right ? -1 : left > right ? 1 : 0) * direction
    })
  }, [data, search, sort])

  const toggleSort = (key: string) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )

  const total = search.trim() ? rows.length : (data?.total ?? 0)
  const start = (page - 1) * PAGE_SIZE + 1
  const summary = rows.length
    ? `Showing ${start}–${start + rows.length - 1} of ${total} tenant ${total === 1 ? 'admin' : 'admins'}`
    : 'No tenant admins to show'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Admin users"
        description="Every tenant administrator across all companies: one row per tenant admin."
      />

      <SearchField
        className="w-65"
        placeholder="Search name, email, company or ID…"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(1)
        }}
      />

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <Table
          columns={columns}
          rows={rows}
          rowKey={(admin) => admin.tenantId}
          sort={sort}
          onSort={toggleSort}
          empty={
            <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
              {data ? 'No tenant admins match this search.' : 'Loading tenant admins…'}
            </p>
          }
        />
        <div className="px-5 py-3">
          <Pagination
            summary={summary}
            page={page}
            pageCount={data?.pageCount ?? 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
