import { useState } from 'react'
import { Calendar, Check, CircleCheck, Clock, Image as ImageIcon, MapPin, Send, ShieldCheck, Star, Utensils } from 'lucide-react'
import { Button, Input, Toggle } from '../components/ui'
import { cn } from '../components/ui/cn'
import { brandSwatches, defaultSchedule } from '../features/tenant-admin/mocks'
import type { ScheduleDay } from '../features/tenant-admin/mocks'

type Tab = 'Branding' | 'General'
const tabs: Tab[] = ['Branding', 'General']

/** 12-hour times in half-hour steps, for example "09:00 AM". */
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const label = `${String(hour % 12 === 0 ? 12 : hour % 12).padStart(2, '0')}:${i % 2 ? '30' : '00'} ${hour < 12 ? 'AM' : 'PM'}`
  return label
})

/** WCAG contrast ratio of a #RRGGBB colour against white. */
function contrastAgainstWhite(hex: string): number {
  const channel = (offset: number) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const luminance = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
  return 1.05 / (luminance + 0.05)
}

const isHex = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value)

function TimeField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <label
      className={cn(
        'flex h-10 w-60 items-center gap-2 rounded-md border border-line px-3 focus-within:border-line-focus',
        disabled ? 'cursor-not-allowed bg-muted text-content-disabled' : 'bg-surface text-content',
      )}
    >
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-sm leading-5 outline-none disabled:cursor-not-allowed"
      >
        {timeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <Clock size={16} className="shrink-0" aria-hidden />
    </label>
  )
}

function GeneralTab() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(defaultSchedule)
  const update = (day: string, patch: Partial<ScheduleDay>) =>
    setSchedule((rows) => rows.map((r) => (r.day === day ? { ...r, ...patch } : r)))

  return (
    <section aria-label="Working schedule" className="flex flex-col rounded-2xl border border-line bg-surface">
      <div className="flex items-center gap-3 overflow-hidden border-b border-line-subtle px-5 py-4">
        <Calendar size={18} className="shrink-0 text-content-brand" aria-hidden />
        <div className="min-w-0 flex-1 whitespace-nowrap">
          <h2 className="text-base leading-6 font-semibold">Working schedule</h2>
          <p className="text-xs leading-4 text-content-tertiary">
            Opening and closing times per day. Turn on Holiday for days your branches are closed — times are not
            required on holidays.
          </p>
        </div>
      </div>
      <div className="flex h-10 items-center bg-canvas px-5 text-xs font-semibold text-content-secondary">
        <p className="w-60 shrink-0">Day</p>
        <p className="w-[180px] shrink-0">Holiday</p>
        <p className="w-[326px] shrink-0">Working Day Opening Time</p>
        <p className="w-[326px] shrink-0">Working Day Closing Time</p>
      </div>
      <div>
        {schedule.map((row, i) => (
          <div
            key={row.day}
            className={cn('flex h-16 items-start bg-surface px-5 py-3', i < schedule.length - 1 && 'border-b border-line-subtle', i === schedule.length - 1 && 'rounded-b-2xl')}
          >
            <div className="flex min-h-10 w-60 shrink-0 flex-col justify-center">
              <p className="text-sm font-medium">{row.day}</p>
            </div>
            <div className="flex min-h-10 w-[180px] shrink-0 flex-col justify-center">
              <Toggle
                checked={row.holiday}
                onChange={(holiday) => update(row.day, { holiday })}
                label={row.holiday ? 'Holiday' : 'Working day'}
              />
            </div>
            <div className="w-[326px] shrink-0">
              <TimeField
                label={`${row.day} opening time`}
                value={row.open}
                disabled={row.holiday}
                onChange={(open) => update(row.day, { open })}
              />
            </div>
            <div className="w-[326px] shrink-0">
              <TimeField
                label={`${row.day} closing time`}
                value={row.close}
                disabled={row.holiday}
                onChange={(close) => update(row.day, { close })}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BrandingTab() {
  const [name, setName] = useState('Spice Garden')
  const [hex, setHex] = useState('#155E54')
  const [badge, setBadge] = useState(true)
  const [brandButtons, setBrandButtons] = useState(true)

  const valid = isHex(hex)
  const ratio = valid ? contrastAgainstWhite(hex) : 0
  const accent = valid ? hex : '#155E54'

  return (
    <div className="flex items-start gap-6">
      <section aria-label="Guest-facing brand" className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line-subtle px-5 py-4">
          <ImageIcon size={18} className="shrink-0 text-content-brand" aria-hidden />
          <div className="min-w-0 flex-1 whitespace-nowrap">
            <h2 className="text-base leading-6 font-semibold">Guest-facing brand</h2>
            <p className="text-xs leading-4 text-content-tertiary">
              Shown on feedback forms, case tracking and resolution emails (FORM-19, SaaS-12)
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] leading-4.5 font-medium">Logo</p>
            <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-content-secondary">
                <ImageIcon size={20} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm leading-5 font-medium whitespace-nowrap">spice-garden-logo.svg</p>
                <p className="text-xs leading-4 text-content-tertiary">3.3 MB · Uploaded · scanned clean</p>
              </div>
              <CircleCheck size={18} className="shrink-0 text-success-fg" aria-label="Uploaded and scanned clean" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[13px] leading-4.5 font-medium">Brand color</p>
            <div role="group" aria-label="Brand color" className="flex gap-2">
              {brandSwatches.map((s) => {
                const selected = hex.toUpperCase() === s.hex
                return (
                  <button
                    key={s.hex}
                    type="button"
                    aria-label={s.hex}
                    aria-pressed={selected}
                    onClick={() => setHex(s.hex)}
                    className={cn(
                      'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md',
                      selected && 'border-3 border-line-focus',
                    )}
                    style={{ background: s.cssVar }}
                  >
                    {selected && <Check size={16} className="text-on-brand" aria-hidden />}
                  </button>
                )
              })}
            </div>
            <Input
              label="Custom hex"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              error={valid ? undefined : 'Enter a colour like #155E54'}
              helper={valid ? `Contrast against white: ${ratio.toFixed(1)} : 1 · ${ratio >= 4.5 ? 'AA ✓' : 'below AA'}` : undefined}
            />
          </div>

          <Toggle checked={badge} onChange={setBadge} label="Show “Powered by ResolveX” badge" />
          <Toggle checked={brandButtons} onChange={setBrandButtons} label="Use brand color for buttons on guest forms" />
        </div>
      </section>

      <div className="flex w-[390px] shrink-0 flex-col gap-3">
        <p className="text-[11px] leading-4 font-semibold tracking-[0.66px] text-content-tertiary uppercase">Live preview</p>
        <div className="flex flex-col overflow-hidden rounded-3xl border-6 border-line-strong bg-canvas shadow-[0_4px_8px_-4px_rgba(11,19,18,0.05),0_12px_24px_-4px_rgba(11,19,18,0.1)]">
          <div className="flex items-center gap-3 border-b border-line-subtle bg-surface p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-content-brand">
              <Utensils size={22} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg leading-6.5 font-semibold">{name || ' '}</p>
              <p className="flex items-center gap-1 text-[13px] leading-4.5 whitespace-nowrap text-content-secondary">
                <MapPin size={14} aria-hidden />
                Colombo - Dining Area
              </p>
            </div>
            {badge && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap text-content-secondary">
                <ShieldCheck size={12} aria-hidden />
                ResolveX
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-3 rounded-xl bg-surface p-4">
              <p className="text-base leading-6 font-semibold">How was your visit today?</p>
              <div className="flex justify-between">
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="flex size-10 items-center justify-center">
                    <Star
                      size={32}
                      aria-hidden
                      className={n < 4 ? 'fill-warning-solid text-warning-solid' : 'text-content-tertiary'}
                    />
                  </span>
                ))}
              </div>
            </div>
            <div
              className="flex h-12 items-center justify-center gap-2 rounded-md px-5 text-base leading-6 font-medium text-on-brand"
              style={{ background: brandButtons ? accent : 'var(--color-brand)' }}
            >
              Submit feedback
              <Send size={20} aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Tenant admin "Settings" tab (Figma nodes 46:11079 Branding and 989:14742 General). Saving is simulated. */
export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('Branding')

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold tracking-[-0.12px]">Settings</h1>
          <p className="text-sm leading-5 text-content-secondary">
            {tab === 'Branding'
              ? 'Guest-facing branding for Spice Garden Holdings.'
              : 'Working schedule for Spice Garden Holdings branches.'}
          </p>
        </div>
        <Button className="font-semibold!">
          {tab === 'Branding' && <Check size={18} aria-hidden />}
          Save changes
        </Button>
      </header>

      <div role="tablist" aria-label="Settings sections" className="flex items-start gap-6 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className="flex cursor-pointer flex-col items-center gap-2 pt-3"
          >
            <span
              className={cn(
                'px-1 text-sm leading-5 font-medium whitespace-nowrap',
                tab === t ? 'text-content-brand' : 'text-content-secondary',
              )}
            >
              {t}
            </span>
            <span className={cn('h-0.5 w-full', tab === t && 'bg-brand')} />
          </button>
        ))}
      </div>

      {tab === 'Branding' ? <BrandingTab /> : <GeneralTab />}
    </div>
  )
}
