import {
  Activity,
  Building2,
  ChartColumn,
  CircleArrowUp,
  CircleCheck,
  CreditCard,
  FileText,
  History,
  Layers,
  LayoutDashboard,
  Network,
  QrCode,
  Settings,
  Sparkles,
  Store,
  Ticket,
  Timer,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  // Shown in the top bar as "group / page".
  crumb: [string, string]
  count?: number
}

export interface NavSection {
  heading?: string
  items: NavItem[]
}

export interface NavArea {
  basePath: string
  workspace: { initials: string; name: string; subtitle: string; tone: 'dark' | 'light' }
  user: { initials: string; name: string; role: string }
  sections: NavSection[]
}

export const navItems = (area: NavArea) => area.sections.flatMap((section) => section.items)

export const superAdminArea: NavArea = {
  basePath: '/super-admin',
  workspace: {
    initials: 'RX',
    name: 'ResolveX Platform',
    subtitle: 'Super Admin console',
    tone: 'dark',
  },
  user: { initials: 'CG', name: 'Chamod Gunasekara', role: 'Platform admin' },
  sections: [
    {
      items: [
        {
          label: 'Platform overview',
          path: 'overview',
          icon: LayoutDashboard,
          crumb: ['Platform', 'Overview'],
        },
        {
          label: 'Analytics',
          path: 'analytics',
          icon: ChartColumn,
          crumb: ['Platform', 'Analytics'],
        },
      ],
    },
    {
      heading: 'Tenants',
      items: [
        {
          label: 'Companies',
          path: 'companies',
          icon: Building2,
          crumb: ['Tenants', 'Companies'],
          count: 128,
        },
        {
          label: 'Subscriptions',
          path: 'subscriptions',
          icon: CreditCard,
          crumb: ['Tenants', 'Subscriptions'],
        },
        { label: 'Plans', path: 'plans', icon: Layers, crumb: ['Tenants', 'Plans'] },
      ],
    },
    {
      heading: 'Platform',
      items: [
        {
          label: 'Platform audit log',
          path: 'audit-log',
          icon: History,
          crumb: ['Platform', 'Audit log'],
        },
        { label: 'Admin users', path: 'admin-users', icon: Users, crumb: ['Platform', 'Admin users'] },
      ],
    },
  ],
}

export const tenantAdminArea: NavArea = {
  basePath: '/tenant',
  workspace: {
    initials: 'SG',
    name: 'Spice Garden Holdings',
    subtitle: 'Enterprise · 32 outlets',
    tone: 'light',
  },
  user: { initials: 'MV', name: 'Marcus Vance', role: 'Company admin' },
  sections: [
    {
      items: [
        {
          label: 'Dashboard',
          path: 'dashboard',
          icon: LayoutDashboard,
          crumb: ['Overview', 'Dashboard'],
        },
      ],
    },
    {
      heading: 'Operations',
      items: [
        {
          label: 'Complaints overview',
          path: 'complaints',
          icon: Ticket,
          crumb: ['Operations', 'Complaints overview'],
        },
        {
          label: 'Escalated to me',
          path: 'escalated',
          icon: CircleArrowUp,
          crumb: ['Operations', 'Escalated to me'],
          count: 3,
        },
      ],
    },
    {
      heading: 'Feedback',
      items: [
        {
          label: 'Feedback forms',
          path: 'feedback-forms',
          icon: FileText,
          crumb: ['Feedback', 'Feedback forms'],
        },
        { label: 'QR codes', path: 'qr-codes', icon: QrCode, crumb: ['Feedback', 'QR codes'] },
      ],
    },
    {
      heading: 'Organization',
      items: [
        { label: 'Branches', path: 'branches', icon: Store, crumb: ['Organization', 'Branches'] },
        {
          label: 'Employees',
          path: 'employees',
          icon: Users,
          crumb: ['Organization', 'Employees'],
        },
        {
          label: 'Hierarchy',
          path: 'hierarchy',
          icon: Network,
          crumb: ['Organization', 'Hierarchy'],
        },
      ],
    },
    {
      heading: 'Configuration',
      items: [
        {
          label: 'SLA policies',
          path: 'sla-policies',
          icon: Timer,
          crumb: ['Configuration', 'SLA policies'],
        },
        {
          label: 'Billing & plan',
          path: 'billing',
          icon: CreditCard,
          crumb: ['Configuration', 'Billing & plan'],
        },
        {
          label: 'Settings',
          path: 'settings',
          icon: Settings,
          crumb: ['Configuration', 'Settings'],
        },
      ],
    },
    {
      heading: 'Insights',
      items: [
        {
          label: 'Analytics',
          path: 'analytics',
          icon: ChartColumn,
          crumb: ['Insights', 'Analytics'],
        },
        { label: 'Reports', path: 'reports', icon: FileText, crumb: ['Insights', 'Reports'] },
      ],
    },
  ],
}

export const branchManagerArea: NavArea = {
  basePath: '/branch',
  workspace: {
    initials: 'CB',
    name: 'Colombo Branch',
    subtitle: 'Spice Garden · Western',
    tone: 'light',
  },
  user: { initials: 'AP', name: 'Ayesha Perera', role: 'Branch manager' },
  sections: [
    {
      items: [
        {
          label: 'Branch overview',
          path: 'overview',
          icon: LayoutDashboard,
          crumb: ['Colombo Branch', 'Overview'],
        },
      ],
    },
    {
      heading: 'Operations',
      items: [
        {
          label: 'Tickets',
          path: 'tickets',
          icon: Ticket,
          crumb: ['Operations', 'Tickets'],
          count: 18,
        },
        {
          label: 'AI review queue',
          path: 'ai-review',
          icon: Sparkles,
          crumb: ['Operations', 'AI review queue'],
          count: 5,
        },
        {
          label: 'Resolution approvals',
          path: 'approvals',
          icon: CircleCheck,
          crumb: ['Operations', 'Resolution approvals'],
          count: 4,
        },
        {
          label: 'Escalations',
          path: 'escalations',
          icon: CircleArrowUp,
          crumb: ['Operations', 'Escalations'],
          count: 2,
        },
      ],
    },
    {
      heading: 'Team',
      items: [
        { label: 'Employees', path: 'employees', icon: Users, crumb: ['Team', 'Employees'] },
        {
          label: 'Staff & workload',
          path: 'staff',
          icon: Activity,
          crumb: ['Team', 'Staff & workload'],
        },
        {
          label: 'QR codes',
          path: 'qr-codes',
          icon: QrCode,
          crumb: ['Colombo Branch', 'QR codes'],
        },
      ],
    },
    {
      heading: 'Insights',
      items: [
        {
          label: 'Branch analytics',
          path: 'analytics',
          icon: ChartColumn,
          crumb: ['Insights', 'Branch analytics'],
        },
      ],
    },
  ],
}

export const areas: NavArea[] = [superAdminArea, tenantAdminArea, branchManagerArea]
