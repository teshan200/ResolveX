import type { HomeSummary } from '@/types/home';

/** Development-only data mirroring the Figma "Home" screen. */
export function createMockHomeSummary(): HomeSummary {
  const shiftEnd = new Date();
  shiftEnd.setHours(18, 0, 0, 0);

  return {
    staff: {
      firstName: 'Dinesh',
      branchName: 'Colombo Branch',
      roleTitle: 'Waiter / Waitress',
    },
    shift: { onShift: true, endsAt: shiftEnd.toISOString() },
    stats: { myOpen: 6, slaAtRisk: 2, escalated: 1 },
    urgentTickets: [
      {
        id: 't-1038',
        ticketNumber: '#1038',
        title: 'Wrong order delivered',
        priority: 'critical',
        status: 'escalated',
        branchName: 'Colombo Branch',
        servicePoint: 'Table 14',
        sla: { state: 'warning', label: '08:42 left' },
      },
      {
        id: 't-1042',
        ticketNumber: '#1042',
        title: 'Food was cold',
        priority: 'high',
        status: 'inProgress',
        branchName: 'Colombo Branch',
        servicePoint: 'Table 7',
        sla: { state: 'breached', label: 'Breached −05:20' },
      },
      {
        id: 't-1045',
        ticketNumber: '#1045',
        title: 'Billing discrepancy on order',
        priority: 'medium',
        status: 'assigned',
        branchName: 'Colombo Branch',
        servicePoint: 'Counter 2',
        sla: { state: 'onTrack', label: '24:10 left' },
      },
    ],
  };
}
