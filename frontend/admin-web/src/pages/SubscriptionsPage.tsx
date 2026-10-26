import {
  Banknote,
  CircleArrowUp,
  CircleCheck,
  CircleDot,
  CreditCard,
  Download,
  RotateCw,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, FilterChip, KpiCard, PageHeader, Panel, StatusPill, Table } from '../components/ui'
import type { Column, PillTone } from '../components/ui'
import { getSubscriptions } from '../services/platformService'
import type { SubscriptionEvent, SubscriptionEventType, SubscriptionsData } from '../types/platform'

type EventFilter = 'All events' | Exclude<SubscriptionEventType, 'Trials'>

const FILTERS: EventFilter[] = [
  'All events',
  'Renewals',
  'Upgrades',
  'Downgrades',
  'Failed payments',
  'Cancellations',
]

const kpiIcons: Record<string, LucideIcon> = {
  revenue: Banknote,
  trialToPaid: TrendingUp,
  churn: TrendingDown,
  grace: TriangleAlert,
}

const toneIcons: Record<PillTone, LucideIcon> = {
  resolved: CircleCheck,
  new: CircleDot,
  reopened: RotateCw,
  escalated: CircleArrowUp,
  assigned: User,
  neutral: CircleDot,
}

const columns: Column<SubscriptionEvent>[] = [
  {
    key: 'company',
    header: 'Company',
    render: (event) => <span className="truncate text-sm leading-5 font-medium">{event.company}</span>,
  },
  {
    key: 'event',
    header: 'Event',
    width: 170,
    render: (event) => (
      <span
        className={`truncate text-[13px] leading-4.5 ${event.failed ? 'text-danger-fg' : ''}`}
      >
        {event.event}
      </span>
    ),
  },
  {
    key: 'plan',
    header: 'Plan',
    width: 180,
    render: (event) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">{event.plan}</span>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    width: 140,
    render: (event) => (
      <span className="truncate font-mono text-xs leading-4 font-medium">{event.amount}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: 150,
    render: (event) => (
      <StatusPill tone={event.statusTone} icon={toneIcons[event.statusTone]}>
        {event.statusLabel}
      </StatusPill>
    ),
  },
  {
    key: 'when',
    header: 'When',
    width: 150,
    render: (event) => (
      <span className="truncate text-[13px] leading-4.5 text-content-secondary">{event.when}</span>
    ),
  },
]

export function SubscriptionsPage() {
  const [data, setData] = useState<SubscriptionsData | null>(null)
  const [filter, setFilter] = useState<EventFilter>('All events')

  useEffect(() => {
    getSubscriptions().then(setData)
  }, [])

  const rows = useMemo(
    () => (data?.events ?? []).filter((event) => filter === 'All events' || event.type === filter),
    [data, filter],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subscriptions"
        description="Activations, renewals, upgrades, downgrades and failed payments via the sandbox gateway."
        actions={
          <Button variant="outline" className="font-semibold!">
            <Download size={18} />
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {(data?.kpis ?? []).map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            icon={kpiIcons[kpi.id]}
            delta={kpi.delta}
            trend={kpi.trend}
            caption={kpi.caption}
          />
        ))}
      </div>

      <div className="flex gap-2">
        {FILTERS.map((item) => (
          <FilterChip
            key={item}
            label={item}
            selected={filter === item}
            onClick={() => setFilter(item)}
          />
        ))}
      </div>

      <Panel title="Subscription events" icon={CreditCard} flush>
        <Table
          columns={columns}
          rows={rows}
          rowKey={(event) => event.id}
          rowHeight={56}
          rowClassName={(event) => (event.failed ? 'bg-danger-bg' : undefined)}
          empty={
            <p className="px-4 py-10 text-center text-sm leading-5 text-content-secondary">
              {data ? 'No events match this filter.' : 'Loading events…'}
            </p>
          }
        />
      </Panel>
    </div>
  )
}
