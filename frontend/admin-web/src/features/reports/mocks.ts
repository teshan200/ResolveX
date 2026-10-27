import { Gift, Sparkles, Store, Timer, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Mock data only, taken from the Figma "Reports & exports" frame. No backend is connected.
export interface ReportTemplate {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'sla',
    title: 'SLA performance',
    description: 'Breaches, response and resolution times by priority',
    icon: Timer,
  },
  {
    id: 'branch',
    title: 'Branch comparison',
    description: 'Complaints, SLA and CSAT side by side',
    icon: Store,
  },
  {
    id: 'staff',
    title: 'Staff performance',
    description: 'Ack/resolution times and SLA met per person',
    icon: Users,
  },
  {
    id: 'recovery',
    title: 'Follow-ups & satisfaction',
    description: 'Follow-up completion and post-resolution CSAT',
    icon: Gift,
  },
  {
    id: 'ai',
    title: 'AI accuracy',
    description: 'AI vs human-final category & priority agreement',
    icon: Sparkles,
  },
]

export type ReportFormat = 'PDF' | 'CSV'

export interface RecentExport {
  title: string
  scope: string
  format: ReportFormat
  generatedBy: string
  date: string
  size: string
}

export const recentExports: RecentExport[] = [
  {
    title: 'Branch comparison · Sep 2026',
    scope: 'All branches',
    format: 'PDF',
    generatedBy: 'Marcus Vance',
    date: '1 Oct 2026, 9:02 AM',
    size: '1.8 MB',
  },
  {
    title: 'SLA performance · Q3 2026',
    scope: 'Western region',
    format: 'CSV',
    generatedBy: 'Ayesha Perera',
    date: '28 Sep 2026, 4:40 PM',
    size: '624 KB',
  },
  {
    title: 'Staff performance · Week 41',
    scope: 'Colombo Branch',
    format: 'PDF',
    generatedBy: 'Ayesha Perera',
    date: '12 Oct 2026, 8:15 AM',
    size: '940 KB',
  },
]

export const dateRangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days']
export const branchScopeOptions = ['All 32 branches', 'Colombo Branch', 'Kandy Branch', 'Galle Fort']
