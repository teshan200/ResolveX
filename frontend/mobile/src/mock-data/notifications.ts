import type { Notification } from '@/types/notification';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

/** Development-only seed data, mirroring the Figma "Alerts" screen. Timestamps are relative to now. */
export function createMockNotifications(): Notification[] {
  return [
    {
      id: 'n-1042-sla',
      kind: 'slaWarning',
      title: 'SLA warning · #1042',
      message: 'Acknowledge within 4 minutes or it escalates to your supervisor.',
      createdAt: minutesAgo(2),
      read: false,
    },
    {
      id: 'n-1038-escalated',
      kind: 'escalated',
      title: 'Escalated · #1038',
      message: 'Wrong order delivered was escalated to Kavinda P. (Supervisor).',
      createdAt: minutesAgo(12),
      read: false,
    },
    {
      id: 'n-1049-assigned',
      kind: 'assigned',
      title: 'New ticket assigned · #1049',
      message: 'Extra cutlery requested · Table 19 · Normal priority.',
      createdAt: minutesAgo(18),
      read: false,
    },
    {
      id: 'n-1031-resolved',
      kind: 'resolved',
      title: 'Resolution approved · #1031',
      message: 'Kavinda P. approved your resolution. Guest survey sent.',
      createdAt: new Date(new Date().setHours(-4, 41, 0, 0)).toISOString(),
      read: true,
    },
  ];
}
