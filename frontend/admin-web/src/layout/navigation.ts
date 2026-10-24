export interface NavItem {
  label: string
  path: string
}

export interface NavArea {
  basePath: string
  roleLabel: string
  items: NavItem[]
}

export const superAdminArea: NavArea = {
  basePath: '/super-admin',
  roleLabel: 'Super Admin',
  items: [
    { label: 'Platform Overview', path: 'overview' },
    { label: 'Companies', path: 'companies' },
    { label: 'Subscriptions', path: 'subscriptions' },
    { label: 'Plans & Pricing', path: 'plans' },
    { label: 'Audit Log', path: 'audit-log' },
  ],
}

export const tenantAdminArea: NavArea = {
  basePath: '/tenant',
  roleLabel: 'Tenant Admin',
  items: [
    { label: 'Dashboard', path: 'dashboard' },
    { label: 'Complaints', path: 'complaints' },
    { label: 'Escalated to Me', path: 'escalated' },
    { label: 'Branches', path: 'branches' },
    { label: 'Employees', path: 'employees' },
    { label: 'Hierarchy', path: 'hierarchy' },
    { label: 'Feedback Forms', path: 'feedback-forms' },
    { label: 'QR Codes', path: 'qr-codes' },
    { label: 'SLA Monitoring', path: 'sla-monitoring' },
    { label: 'SLA Policies', path: 'sla-policies' },
    { label: 'Analytics', path: 'analytics' },
    { label: 'Reports', path: 'reports' },
    { label: 'Audit Log', path: 'audit-log' },
    { label: 'Billing & Plan', path: 'billing' },
    { label: 'Settings', path: 'settings' },
  ],
}

export const branchManagerArea: NavArea = {
  basePath: '/branch',
  roleLabel: 'Branch Manager',
  items: [
    { label: 'Branch Overview', path: 'overview' },
    { label: 'Tickets', path: 'tickets' },
    { label: 'AI Review Queue', path: 'ai-review' },
    { label: 'Resolution Approvals', path: 'approvals' },
    { label: 'Escalation Inbox', path: 'escalations' },
    { label: 'Staff & Workload', path: 'staff' },
    { label: 'Employees', path: 'employees' },
    { label: 'QR Codes', path: 'qr-codes' },
  ],
}

export const areas: NavArea[] = [superAdminArea, tenantAdminArea, branchManagerArea]
