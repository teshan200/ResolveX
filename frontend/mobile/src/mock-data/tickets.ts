import type { TicketSummary } from '@/types/ticket';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

/** Development-only sample tickets mirroring the Figma "Tickets" screen. Timestamps are relative to now. */
export function createMockTickets(): TicketSummary[] {
  return [
    {
      id: 't-1038',
      ticketNumber: '#1038',
      title: 'Wrong order delivered',
      priority: 'critical',
      status: 'escalated',
      branchName: 'Colombo Branch',
      servicePoint: 'Table 14',
      createdAt: minutesAgo(95),
      sla: { state: 'breached', label: '−05:28' },
    },
    {
      id: 't-1042',
      ticketNumber: '#1042',
      title: 'Food was cold',
      priority: 'high',
      status: 'assigned',
      branchName: 'Colombo Branch',
      servicePoint: 'Table 7',
      createdAt: minutesAgo(50),
      sla: { state: 'warning', label: '08:42 left' },
    },
    {
      id: 't-1045',
      ticketNumber: '#1045',
      title: 'Billing discrepancy on order',
      priority: 'medium',
      status: 'claimed',
      branchName: 'Colombo Branch',
      servicePoint: 'Counter 2',
      createdAt: minutesAgo(35),
      sla: { state: 'onTrack', label: '24:10 left' },
    },
    {
      id: 't-1036',
      ticketNumber: '#1036',
      title: 'Delivery missing naan',
      priority: 'medium',
      status: 'resolved',
      branchName: 'Colombo Branch',
      servicePoint: 'Online',
      createdAt: minutesAgo(26 * 60),
      sla: { state: 'met', label: 'SLA met' },
    },
    {
      id: 't-1047',
      ticketNumber: '#1047',
      title: 'Slow table service',
      priority: 'normal',
      status: 'inProgress',
      branchName: 'Colombo Branch',
      servicePoint: 'Table 3',
      createdAt: minutesAgo(20),
      sla: { state: 'onTrack', label: '31:05 left' },
    },
    {
      id: 't-1030',
      ticketNumber: '#1030',
      title: 'Cutlery not clean',
      priority: 'normal',
      status: 'closed',
      branchName: 'Colombo Branch',
      servicePoint: 'Table 9',
      createdAt: minutesAgo(3 * 24 * 60),
      sla: { state: 'met', label: 'SLA met' },
    },
  ];
}
