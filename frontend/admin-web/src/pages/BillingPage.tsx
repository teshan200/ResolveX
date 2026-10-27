import { useState } from 'react'
import { Activity, CircleAlert, CircleCheck, CircleDot, CreditCard, Download, Layers, Mail, Pencil, RotateCw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AlertBanner, Button, IconButton, StatusPill, Tag } from '../components/ui'
import { cn } from '../components/ui/cn'
import { downloadCsv, exportFilename, reportToCsv } from '../features/export/csv'
import { invoices } from '../features/tenant-admin/mocks'
import type { Invoice } from '../features/tenant-admin/mocks'

const head =
  'flex h-10 items-center gap-1 border-b border-line bg-canvas px-4 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary'
const cell = 'flex h-14 items-center gap-2 overflow-hidden px-4'

function CardHeader({ icon: Icon, title, children }: { icon?: typeof Layers; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
      {Icon && <Icon size={18} className="shrink-0 text-content-brand" aria-hidden />}
      <h2 className="min-w-0 flex-1 text-base leading-6 font-semibold whitespace-nowrap">{title}</h2>
      {children}
    </div>
  )
}

function InvoiceStatus({ status }: { status: Invoice['status'] }) {
  if (status === 'Upcoming')
    return (
      <StatusPill tone="new" icon={CircleDot}>
        Upcoming
      </StatusPill>
    )
  if (status === 'Failed')
    return (
      <span className="inline-flex h-5 items-center gap-1 rounded-full px-2 text-xs leading-4 font-semibold text-danger-fg">
        <CircleAlert size={12} aria-hidden />
        Failed
      </span>
    )
  return (
    <StatusPill tone="resolved" icon={CircleCheck}>
      Paid
    </StatusPill>
  )
}

/**
 * Tenant admin "Billing & plan" tab (Figma nodes 46:10121 and 46:10597). Sample data, no payment gateway.
 * Open it with ?payment=failed to see the "Payment failed" state; "Update card" and "Retry payment" then simulate a fix.
 */
export function BillingPage() {
  const [params] = useSearchParams()
  const [failed, setFailed] = useState(params.get('payment') === 'failed')

  const shown = invoices.map((i) => (failed && i.status === 'Upcoming' ? { ...i, status: 'Failed' as const } : i))
  const fix = () => setFailed(false)

  const downloadInvoice = (i: Invoice) =>
    downloadCsv(
      exportFilename(i.id),
      reportToCsv({
        title: `Invoice ${i.id}`,
        meta: [['Company', 'Spice Garden Holdings']],
        sections: [{ title: 'Invoice', columns: ['Invoice', 'Date', 'Amount', 'Status'], rows: [[i.id, i.date, i.amount, i.status]] }],
      }),
    )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Billing &amp; plan</h1>
          <p className="text-sm leading-5 text-content-secondary">Manage your subscription, usage and invoices.</p>
        </div>
        <Button variant="outline" className="font-semibold!">
          <Layers size={18} aria-hidden />
          Compare plans
        </Button>
      </header>

      {failed && (
        <AlertBanner
          title="Payment failed — your grace period ends in 5 days"
          description="We couldn’t charge Visa •••• 4242 for LKR 71,000 on 2 Nov. Update your card before 7 Nov to keep SLA alerts and escalations running."
          action="Update card"
          onAction={fix}
        />
      )}

      <div className="flex items-start gap-6">
        <section aria-label="Current plan" className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <CardHeader icon={Layers} title="Current plan">
            {failed ? (
              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-danger-bg px-2 text-xs leading-4 font-semibold whitespace-nowrap text-danger-fg">
                <CircleAlert size={12} aria-hidden />
                Past due · grace period
              </span>
            ) : (
              <StatusPill tone="resolved" icon={CircleCheck}>
                Active
              </StatusPill>
            )}
          </CardHeader>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <p className="text-[30px] leading-[38px] font-semibold tracking-[-0.3px]">Enterprise</p>
              <p className="text-sm leading-5 text-content-secondary">LKR 71,000 · 25 outlets included + 7 additional</p>
            </div>
            <div className="flex text-[13px] leading-4.5">
              <p className="flex-1 text-content-secondary">Next invoice</p>
              <p className={cn('font-semibold whitespace-nowrap', failed && 'text-danger-fg')}>
                {failed ? 'LKR 71,000 · overdue since 2 Nov' : 'LKR 71,000 on 2 Dec 2026'}
              </p>
            </div>
            <div className="flex text-[13px] leading-4.5">
              <p className="flex-1 text-content-secondary">Trial</p>
              <p className="font-semibold whitespace-nowrap">Ended 2 Nov 2026</p>
            </div>
            <div className="flex gap-2">
              {failed ? (
                <Button className="font-semibold!" onClick={fix}>
                  <RotateCw size={18} aria-hidden />
                  Retry payment
                </Button>
              ) : (
                <Button className="font-semibold!">
                  <Layers size={18} aria-hidden />
                  Change plan
                </Button>
              )}
              <Button variant="ghost" className="font-semibold! text-content-secondary!">
                Downgrade
              </Button>
              <Button variant="ghost" className="font-semibold! text-content-secondary!">
                Cancel subscription
              </Button>
            </div>
          </div>
        </section>

        <section aria-label="Usage this cycle" className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <CardHeader icon={Activity} title="Usage this cycle" />
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[13px] leading-4.5 whitespace-nowrap">
                <p className="font-medium">Outlets</p>
                <p className="text-content-secondary">32 · 25 included + 7 additional</p>
              </div>
              <div
                role="progressbar"
                aria-label="Outlets used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={40}
                className="h-2 overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full rounded-full bg-brand" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-start gap-6">
        <section
          aria-label="Payment method"
          className={cn(
            'flex w-[380px] shrink-0 flex-col overflow-hidden rounded-xl border bg-surface',
            failed ? 'border-danger-solid' : 'border-line',
          )}
        >
          <CardHeader icon={CreditCard} title="Payment method" />
          <div className="flex flex-col gap-4 p-5">
            <div className={cn('flex items-center gap-3 rounded-lg p-4', failed ? 'bg-danger-bg' : 'bg-canvas')}>
              <span className="flex h-[30px] w-11 shrink-0 items-center justify-center rounded-sm bg-inverse text-xs leading-4 font-semibold text-content-inverse">
                VISA
              </span>
              <div className="min-w-0 flex-1 whitespace-nowrap">
                <p className="text-sm leading-5 font-semibold">Visa •••• 4242</p>
                {failed ? (
                  <p className="text-xs leading-4 text-danger-fg">Declined · insufficient funds</p>
                ) : (
                  <p className="text-xs leading-4 text-content-tertiary">Expires 12/28</p>
                )}
              </div>
            </div>
            <div className="flex">
              <Tag tone="info">Sandbox gateway · test mode</Tag>
            </div>
            <Button variant="outline" className="w-full font-semibold!" onClick={fix}>
              <Pencil size={18} aria-hidden />
              Update card
            </Button>
          </div>
        </section>

        <section aria-label="Invoices" className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <CardHeader title="Invoices">
            <Button variant="ghost" size="sm" className="text-content-secondary!">
              <Mail size={16} aria-hidden />
              Billing email
            </Button>
          </CardHeader>
          <div role="table" aria-label="Invoices">
            <div role="row" className="flex w-full">
              <div role="columnheader" className={cn(head, 'w-[170px] shrink-0')}>Invoice</div>
              <div role="columnheader" className={cn(head, 'w-[150px] shrink-0')}>Date</div>
              <div role="columnheader" className={cn(head, 'min-w-0 flex-1')}>Amount</div>
              <div role="columnheader" className={cn(head, 'w-[130px] shrink-0')}>Status</div>
              <div role="columnheader" className={cn(head, 'w-14 shrink-0')} />
            </div>
            {shown.map((i) => (
              <div
                key={i.id}
                role="row"
                className={cn(
                  'flex w-full border-b border-line-subtle last:border-b-0',
                  i.status === 'Failed' ? 'bg-danger-bg' : 'bg-surface',
                )}
              >
                <div className={cn(cell, 'w-[170px] shrink-0')}>
                  <p className="min-w-0 flex-1 truncate font-mono text-xs leading-4 font-medium">{i.id}</p>
                </div>
                <div className={cn(cell, 'w-[150px] shrink-0')}>
                  <p className="min-w-0 flex-1 truncate text-[13px] leading-4.5 text-content-secondary">{i.date}</p>
                </div>
                <div className={cn(cell, 'min-w-0 flex-1')}>
                  <p className="min-w-0 flex-1 truncate text-sm leading-5">{i.amount}</p>
                </div>
                <div className={cn(cell, 'w-[130px] shrink-0')}>
                  <InvoiceStatus status={i.status} />
                </div>
                <div className={cn(cell, 'w-14 shrink-0')}>
                  <IconButton icon={Download} label={`Download ${i.id}`} size="sm" onClick={() => downloadInvoice(i)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
