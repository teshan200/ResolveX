import type { TicketDetailContent, TicketSummary } from '@/types/ticket';

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
    {
      id: 't-1049',
      ticketNumber: '#1049',
      title: 'Extra cutlery requested',
      priority: 'normal',
      status: 'assigned',
      branchName: 'Colombo Branch',
      servicePoint: 'Table 19',
      createdAt: minutesAgo(18),
      sla: { state: 'onTrack', label: '41:20 left' },
    },
    {
      id: 't-1031',
      ticketNumber: '#1031',
      title: 'Dessert served late',
      priority: 'normal',
      status: 'closed',
      branchName: 'Colombo Branch',
      servicePoint: 'Table 5',
      createdAt: minutesAgo(26 * 60),
      sla: { state: 'met', label: 'SLA met' },
    },
  ];
}

/** Development-only detail content for the sample tickets, keyed by ticket id. */
export function createMockTicketDetails(): Record<string, TicketDetailContent> {
  return {
    't-1038': {
      description: '“Ordered the seafood kottu, got chicken. Second time this month.”',
      escalation: {
        escalatedTo: 'Kavinda P.',
        escalatedToRole: 'Supervisor',
        escalatedAt: minutesAgo(5),
        reason: 'Resolution SLA breached',
      },
      timeline: [
        {
          id: 'e-1038-3',
          kind: 'escalated',
          actor: 'SLA engine',
          at: minutesAgo(5),
          detail: 'Resolution SLA (30 min) breached.',
        },
        {
          id: 'e-1038-2',
          kind: 'progress',
          actor: 'you',
          at: minutesAgo(16),
          detail: 'Kitchen re-preparing seafood kottu.',
        },
        {
          id: 'e-1038-1',
          kind: 'claimed',
          actor: 'you',
          at: minutesAgo(23),
          detail: 'Acknowledged in 2 min.',
        },
      ],
    },
    't-1042': {
      description:
        '“The chicken biryani and garlic naan arrived barely lukewarm after a 35-minute wait. Server was handling another section.”',
      category: 'Food quality',
      aiConfidence: 92,
      guest: { name: 'Nimal P.', notification: 'emailed when resolved', photoCount: 1 },
      orderRef: '#ORD-8821',
      assignedTo: 'Dinesh K. (you)',
      slaDetail: {
        phase: 'Acknowledge within',
        elapsedSeconds: 6 * 60 + 18,
        totalSeconds: 15 * 60,
        escalatesTo: 'Supervisor',
        policy: 'High · 15m ack / 45m fix',
      },
      timeline: [],
    },
    't-1045': {
      description: '“The bill doesn’t match what we ordered.”',
      timeline: [{ id: 'e-1045-1', kind: 'claimed', actor: 'you', at: minutesAgo(30) }],
    },
    't-1036': {
      description: '“The naan was missing from our delivery.”',
      timeline: [
        { id: 'e-1036-2', kind: 'progress', actor: 'you', at: minutesAgo(26 * 60 - 20) },
        { id: 'e-1036-1', kind: 'claimed', actor: 'you', at: minutesAgo(26 * 60 - 5) },
      ],
    },
    't-1047': {
      description: '“We’ve been waiting a long time for our table to be served.”',
      timeline: [
        { id: 'e-1047-2', kind: 'progress', actor: 'you', at: minutesAgo(10) },
        { id: 'e-1047-1', kind: 'claimed', actor: 'you', at: minutesAgo(15) },
      ],
    },
    't-1030': {
      description: '“The cutlery on our table was not clean.”',
      timeline: [
        { id: 'e-1030-2', kind: 'progress', actor: 'you', at: minutesAgo(3 * 24 * 60 - 15) },
        { id: 'e-1030-1', kind: 'claimed', actor: 'you', at: minutesAgo(3 * 24 * 60 - 5) },
      ],
    },
  };
}
