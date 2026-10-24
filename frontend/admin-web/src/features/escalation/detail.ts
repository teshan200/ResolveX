export type TimelineKind = 'escalated' | 'response' | 'assigned' | 'received'

export interface TimelineEntry {
  id: string
  kind: TimelineKind
  title: string
  time: string
  actor: string
  description: string
}

export interface EscalationDetail {
  /** Matches an Escalation id, for example "#1055". */
  id: string
  guestComplaint: string
  reasonLabel: string
  /** Sample confidence score, shown as a percentage. */
  confidence: number
  managerLine: string
  escalatedAt: string
  bannerDescription: string
  customerCase: string
  /** Newest first. */
  timeline: TimelineEntry[]
}

// Mock data only. #1055 is the only escalation with a detail screen in the Figma design.
const details: EscalationDetail[] = [
  {
    id: '#1055',
    guestComplaint:
      '“My order was wrong again. When I asked for a replacement, the manager told me it was my mistake and walked away.”',
    reasonLabel: 'Complaint about the Branch Manager’s handling',
    confidence: 92,
    managerLine: 'Ayesha Perera · Colombo Branch',
    escalatedAt: '19 Oct, 12:41 PM',
    bannerDescription:
      'ResolveX AI flagged it as a complaint against Colombo Branch’s Branch Manager, so it bypassed branch handling.',
    customerCase: 'RX-1055',
    timeline: [
      {
        id: 'e1',
        kind: 'escalated',
        title: 'AI escalated to Tenant Admin',
        time: '12:41 PM',
        actor: 'by ResolveX AI',
        description: 'Complaint concerns the Branch Manager — routed outside branch handling.',
      },
      {
        id: 'e2',
        kind: 'response',
        title: 'Branch response recorded',
        time: '12:36 PM',
        actor: 'Colombo Branch',
        description: 'Replacement declined at the counter.',
      },
      {
        id: 'e3',
        kind: 'assigned',
        title: 'Assigned to Dinesh Kumara',
        time: '12:15 PM',
        actor: 'Colombo Branch',
        description: 'Waiter / Waitress · priority Critical.',
      },
      {
        id: 'e4',
        kind: 'received',
        title: 'Complaint received',
        time: '12:14 PM',
        actor: 'by guest via QR · Colombo - Dining Area',
        description: 'Table 14 · rating 1/5.',
      },
    ],
  },
]

export const getEscalationDetail = (id: string) => details.find((d) => d.id === id)
export const hasEscalationDetail = (id: string) => details.some((d) => d.id === id)
