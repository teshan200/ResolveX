import { ArrowLeft, Calendar, CreditCard, Power, Shield, Store, Ticket, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertBanner, Button, KpiCard, Panel, PanelRow, Table, Tag } from '../components/ui'
import type { Column } from '../components/ui'
import { CompanyStatusBadge } from '../features/companies/CompanyStatusBadge'
import { SuspendTenantModal } from '../features/companies/SuspendTenantModal'
import { useBreadcrumb } from '../layout/breadcrumb'
import { getCompany, suspendCompany } from '../services/companyService'
import { formatLkr } from '../services/planService'
import type { CompanyDetail, SuspendRequest, TenantAdmin } from '../types/company'

const adminColumns: Column<TenantAdmin>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (admin) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm leading-5 font-medium">{admin.name}</span>
        <span className="truncate text-xs leading-4 text-content-tertiary">{admin.role}</span>
      </span>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    width: 260,
    render: (admin) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">{admin.email}</span>
    ),
  },
  {
    key: 'lastSignIn',
    header: 'Last sign-in',
    width: 240,
    render: (admin) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">
        {admin.lastSignIn}
      </span>
    ),
  },
]

export function TenantDetailPage() {
  const { companyId = '' } = useParams()
  // undefined while loading, null when the company does not exist.
  const [company, setCompany] = useState<CompanyDetail | null | undefined>()
  const [suspending, setSuspending] = useState(false)

  useEffect(() => {
    getCompany(companyId).then((result) => setCompany(result ?? null))
  }, [companyId])

  useBreadcrumb(company ? ['Companies', company.name] : null)

  if (company === undefined) {
    return <p className="text-sm leading-5 text-content-secondary">Loading company…</p>
  }

  if (company === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-2xl leading-8 font-semibold">Company not found</h1>
        <Link
          to="/super-admin/companies"
          className="text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
        >
          Back to all companies
        </Link>
      </div>
    )
  }

  const handleSuspend = async (request: SuspendRequest) => {
    await suspendCompany(company.id, request)
    setCompany({ ...company, status: 'Suspended' })
    setSuspending(false)
  }

  const { invoice } = company
  const capacity = company.planCapacity
  const pastDue = company.status === 'Past due' && invoice

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            to="/super-admin/companies"
            className="flex w-fit items-center gap-1.5 text-[13px] leading-4.5 font-semibold text-content-link hover:underline"
          >
            <ArrowLeft size={14} />
            All companies
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-muted text-[13px] leading-4.5 font-medium text-content-brand">
              {company.initials}
            </span>
            <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">{company.name}</h1>
            <CompanyStatusBadge status={company.status} />
            {company.plan && <Tag tone={company.planTone}>{company.plan}</Tag>}
          </div>
          <p className="text-sm leading-5 text-content-secondary">
            Tenant ID {company.tenantId} · created {company.createdAt} · {company.domain}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          {pastDue && (
            <Button variant="outline" className="font-semibold!">
              <Calendar size={18} />
              Extend grace period
            </Button>
          )}
          {company.status !== 'Suspended' && (
            <Button
              variant="destructive"
              className="font-semibold!"
              onClick={() => setSuspending(true)}
            >
              <Power size={18} />
              Suspend tenant
            </Button>
          )}
        </div>
      </div>

      {pastDue && (
        <AlertBanner
          title={`Payment failed on ${invoice.failedOn} · grace period ends ${invoice.graceEnds.replace(/ \d{4}$/, '')}`}
          description={`${invoice.retries.split(' ')[0]} automatic retries failed (${invoice.reason}). The tenant admin has been emailed ${invoice.emailsSent === 2 ? 'twice' : `${invoice.emailsSent} times`}.`}
          action="View invoice"
        />
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-3 items-start gap-4">
            <KpiCard
              label="Branches"
              value={String(company.branches ?? '—')}
              icon={Store}
              delta="0.0%"
              caption={capacity ? `${company.plan} · up to ${capacity}` : `${company.plan ?? 'No plan'}`}
            />
            <KpiCard
              label="Users"
              value={company.users.toLocaleString('en-US')}
              icon={Users}
            />
            <KpiCard
              label="Tickets (30d)"
              value={company.tickets30d}
              icon={Ticket}
              iconClassName="text-neutral-700"
              delta="0.0%"
              caption={`${company.slaBreach} SLA breach`}
            />
          </div>

          <Panel title="Tenant Admin" icon={Shield} flush>
            <Table columns={adminColumns} rows={[company.admin]} rowKey={(admin) => admin.email} />
          </Panel>
        </div>

        <Panel title="Subscription" icon={CreditCard}>
          <PanelRow label="Plan">{company.plan ?? 'No plan'}</PanelRow>
          <PanelRow label="Outlet capacity">
            {capacity
              ? `${company.branches ?? 0} of ${capacity} outlets`
              : `${company.branches ?? 0} outlets`}
          </PanelRow>
          {invoice ? (
            <>
              <PanelRow label="Invoice due" danger>
                {formatLkr(invoice.amount)}
              </PanelRow>
              <PanelRow label="Retries">{invoice.retries}</PanelRow>
              <PanelRow label="Grace period ends">{invoice.graceEnds}</PanelRow>
            </>
          ) : (
            <PanelRow label="Billing status">{company.status}</PanelRow>
          )}
        </Panel>
      </div>

      <SuspendTenantModal
        open={suspending}
        companyName={company.name}
        userCount={company.users}
        onClose={() => setSuspending(false)}
        onConfirm={handleSuspend}
      />
    </div>
  )
}
