import { CircleDot, Clock, Inbox, TriangleAlert } from 'lucide-react'
import type { SlaState, TicketPriority } from '../../components/ui'
import type { EscalationKpi } from '../escalation/components/EscalationKpiCards'

// Sample data for the tenant admin Dashboard, Feedback forms, QR codes, Billing & plan and Settings
// tabs, taken from the Figma frames. No backend is connected.

// ---- Dashboard -------------------------------------------------------------------------------

export const dashboardPeriods = ['Today', '7 days', '30 days'] as const
export type DashboardPeriod = (typeof dashboardPeriods)[number]

export const dashboardKpis: EscalationKpi[] = [
  { label: 'Total complaints', value: '412', icon: Inbox, tone: 'info', delta: '0.0%', note: 'vs 398 last week' },
  { label: 'Open complaints', value: '38', icon: CircleDot, tone: 'danger', delta: '8.1%', note: '12 fewer than last week' },
  { label: 'Avg. resolution time', value: '24 min', icon: Clock, tone: 'success', delta: '12.4%', note: 'down from 31 min' },
  { label: 'SLA violation rate', value: '4.2%', icon: TriangleAlert, tone: 'success', delta: '12.4%', note: 'down from 6.8%' },
]

/** Plot data for "Complaints vs SLA breaches" (same illustrative plot as Analytics). */
export const dashboardTrendComplaints = [139, 119, 127, 89, 98, 59, 69, 39]
export const dashboardTrendBreaches = [149, 145, 140, 131, 127, 118, 119, 108]

export const dashboardCategories = [
  { label: 'Food quality', percent: 38, color: 'var(--color-brand)' },
  { label: 'Wait time', percent: 24, color: 'var(--color-warning-solid)' },
  { label: 'Service', percent: 18, color: 'var(--color-info-solid)' },
  { label: 'Other', percent: 20, color: 'var(--color-neutral-400)' },
]

export const dashboardBranchBars = [127.5, 93, 72, 60, 45, 33]
export const dashboardBranchLabels = ['Colombo', 'Kandy', 'Galle Fort', 'Negombo Beach', 'Nuwara Eliya', 'Matara']

export interface AtRiskTicket {
  id: string
  title: string
  place: string
  priority: TicketPriority
  slaState: SlaState
  sla: string
}

export const atRiskTickets: AtRiskTicket[] = [
  { id: '#1042', title: 'Food was cold', place: 'Colombo · Table 7', priority: 'High', slaState: 'warning', sla: '08:42 left' },
  { id: '#1038', title: 'Wrong order delivered', place: 'Colombo · Table 14', priority: 'Critical', slaState: 'warning', sla: '02:15 left' },
  { id: '#1051', title: 'Long wait for bill', place: 'Kandy · Table 3', priority: 'Medium', slaState: 'warning', sla: '11:05 left' },
  { id: '#1047', title: 'Rude staff behaviour', place: 'Galle · Counter 1', priority: 'High', slaState: 'warning', sla: '13:40 left' },
]

export interface BranchPerformance {
  name: string
  meta: string
  open: number
  resolution: string
  breachRate: string
  breachTone: 'success' | 'warning' | 'danger'
  csat: string
}

export const branchPerformance: BranchPerformance[] = [
  { name: 'Colombo Branch', meta: 'Western · Manager A. Perera', open: 9, resolution: '18 min', breachRate: '2.1%', breachTone: 'success', csat: '4.6 / 5' },
  { name: 'Kandy Branch', meta: 'Central · Manager S. Bandara', open: 7, resolution: '27 min', breachRate: '5.4%', breachTone: 'warning', csat: '4.2 / 5' },
  { name: 'Galle Fort', meta: 'Southern · Manager R. Silva', open: 11, resolution: '41 min', breachRate: '11.8%', breachTone: 'danger', csat: '3.7 / 5' },
  { name: 'Negombo Beach', meta: 'Western · Manager T. Fernando', open: 4, resolution: '21 min', breachRate: '3.0%', breachTone: 'success', csat: '4.5 / 5' },
]

// ---- Feedback forms --------------------------------------------------------------------------

export type FormStatus = 'Published' | 'Draft' | 'Inactive'

export interface FeedbackForm {
  id: string
  name: string
  scope: string
  version: string
  status: FormStatus
  /** Responses in the last 30 days, empty for forms that have none. */
  responses?: string
  /** Completion rate in percent, empty for forms that have none. */
  completion?: number
  updated: string
  /** Larger is newer. Used for sorting. */
  updatedOrder: number
}

export const feedbackForms: FeedbackForm[] = [
  { id: 'f1', name: 'Guest feedback · Dine-in', scope: 'All 32 branches · Dining area', version: 'v4', status: 'Published', responses: '2,184', completion: 78, updated: '2 days ago', updatedOrder: 4 },
  { id: 'f2', name: 'Takeaway counter', scope: '24 branches · Counters', version: 'v2', status: 'Published', responses: '612', completion: 84, updated: '1 week ago', updatedOrder: 3 },
  { id: 'f3', name: 'Delivery experience', scope: 'Online orders · email link', version: 'v3', status: 'Published', responses: '431', completion: 61, updated: '3 weeks ago', updatedOrder: 2 },
  { id: 'f4', name: 'Guest feedback · Dine-in', scope: 'All branches · Dining area', version: 'v5 draft', status: 'Draft', updated: '2 min ago', updatedOrder: 6 },
  { id: 'f5', name: 'Banquet & events', scope: 'Colombo, Kandy · Halls', version: 'v1', status: 'Draft', updated: 'Yesterday', updatedOrder: 5 },
  { id: 'f6', name: 'Breakfast buffet (2025)', scope: 'Negombo · Buffet', version: 'v2', status: 'Inactive', updated: 'Mar 2026', updatedOrder: 1 },
]

// ---- QR codes --------------------------------------------------------------------------------

export interface QrCode {
  id: string
  name: string
  branch: string
  /** Name on the QR row, for example "Galle Fort". The branch filter uses the short name. */
  branchFull: string
  form: string
  createdBy: { name: string; initials: string }
  createdByRole: string
  created: string
  scans: number
  enabled: boolean
}

const ayesha = { name: 'Ayesha Perera', initials: 'AP' }
const sachini = { name: 'Sachini Bandara', initials: 'SB' }
const ruwan = { name: 'Ruwan Silva', initials: 'RS' }
const tharindu = { name: 'Tharindu Fernando', initials: 'TF' }

export const qrCodes: QrCode[] = [
  { id: 'QR-CMB-0001', name: 'Colombo - Dining Area', branch: 'Colombo', branchFull: 'Colombo', form: 'Guest feedback · Dine-in v4', createdBy: ayesha, createdByRole: 'Branch Manager', created: '14 Mar 2026', scans: 1204, enabled: true },
  { id: 'QR-CMB-0007', name: 'Colombo - Lobby', branch: 'Colombo', branchFull: 'Colombo', form: 'Guest feedback · Dine-in v4', createdBy: ayesha, createdByRole: 'Branch Manager', created: '18 Oct 2026', scans: 212, enabled: true },
  { id: 'QR-CMB-0005', name: 'Colombo - Delivery Desk', branch: 'Colombo', branchFull: 'Colombo', form: 'Delivery experience v3', createdBy: ayesha, createdByRole: 'Branch Manager', created: '20 May 2026', scans: 0, enabled: false },
  { id: 'QR-KDY-0001', name: 'Kandy - Dining Area', branch: 'Kandy', branchFull: 'Kandy', form: 'Guest feedback · Dine-in v4', createdBy: sachini, createdByRole: 'Branch Manager', created: '2 Apr 2026', scans: 903, enabled: true },
  { id: 'QR-KDY-0002', name: 'Kandy - Takeaway Counter', branch: 'Kandy', branchFull: 'Kandy', form: 'Takeaway counter v2', createdBy: sachini, createdByRole: 'Branch Manager', created: '2 Apr 2026', scans: 348, enabled: true },
  { id: 'QR-GAL-0001', name: 'Galle - Dining Area', branch: 'Galle Fort', branchFull: 'Galle Fort', form: 'Guest feedback · Dine-in v4', createdBy: ruwan, createdByRole: 'Branch Manager', created: '9 Apr 2026', scans: 684, enabled: true },
  { id: 'QR-GAL-0003', name: 'Galle - Washrooms', branch: 'Galle Fort', branchFull: 'Galle Fort', form: 'Guest feedback · Dine-in v4', createdBy: ruwan, createdByRole: 'Branch Manager', created: '9 Apr 2026', scans: 0, enabled: false },
  { id: 'QR-NGB-0001', name: 'Negombo - Dining Area', branch: 'Negombo', branchFull: 'Negombo', form: 'Guest feedback · Dine-in v4', createdBy: tharindu, createdByRole: 'Branch Manager', created: '21 Apr 2026', scans: 421, enabled: true },
]

export const qrBranchOptions = ['Branch: All branches', 'Colombo', 'Kandy', 'Galle Fort', 'Negombo']
export const qrFormOptions = [
  'Form: All forms',
  'Guest feedback · Dine-in v4',
  'Takeaway counter v2',
  'Delivery experience v3',
]
/** Counts across the whole company, as shown in the Figma chips (the table shows the first 8 of 46). */
export const qrChipCounts = { all: 46, enabled: 43, disabled: 3 }
export const qrPageCount = 13
export const totalQrCodes = 46

// ---- Billing & plan --------------------------------------------------------------------------

export interface Invoice {
  id: string
  date: string
  amount: string
  status: 'Upcoming' | 'Paid' | 'Failed'
}

export const invoices: Invoice[] = [
  { id: 'INV-2026-1102', date: '2 Nov 2026', amount: 'LKR 71,000', status: 'Upcoming' },
  { id: 'INV-2026-1002', date: '2 Oct 2026', amount: 'LKR 0 · trial', status: 'Paid' },
  { id: 'INV-2026-0918', date: '18 Sep 2026', amount: 'LKR 0 · trial', status: 'Paid' },
]

// ---- Settings --------------------------------------------------------------------------------

export interface ScheduleDay {
  day: string
  /** True when the branches are closed on this day. */
  holiday: boolean
  open: string
  close: string
}

export const defaultSchedule: ScheduleDay[] = [
  { day: 'Monday', holiday: false, open: '09:00 AM', close: '10:00 PM' },
  { day: 'Tuesday', holiday: false, open: '09:00 AM', close: '10:00 PM' },
  { day: 'Wednesday', holiday: false, open: '09:00 AM', close: '10:00 PM' },
  { day: 'Thursday', holiday: false, open: '09:00 AM', close: '10:00 PM' },
  { day: 'Friday', holiday: false, open: '09:00 AM', close: '10:00 PM' },
  { day: 'Saturday', holiday: false, open: '10:00 AM', close: '10:00 PM' },
  { day: 'Sunday', holiday: false, open: '10:00 AM', close: '10:00 PM' },
]

export const brandSwatches = [
  { hex: '#155E54', cssVar: 'var(--color-brand)' },
  { hex: '#C2410C', cssVar: 'var(--color-status-reopened-fg)' },
  { hex: '#6D28D9', cssVar: 'var(--color-status-assigned-fg)' },
  { hex: '#1D4ED8', cssVar: 'var(--color-status-new-fg)' },
  { hex: '#162120', cssVar: 'var(--color-content)' },
]
