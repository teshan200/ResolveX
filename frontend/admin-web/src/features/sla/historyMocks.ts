import type { SlaAuditEntry, SlaTimelineEvent } from './types'

// Mock data only. "Opened", "warning reached" and "breached" events are not listed
// here: they are derived from each complaint's times and the simulated clock.
export const slaTimelineEvents: SlaTimelineEvent[] = [
  { id: 't1', complaintId: '#1042', at: '2026-10-23T09:30:00+05:30', kind: 'assigned', title: 'Assigned to Kasun Fernando', actor: 'System', note: 'Auto-assigned by branch routing rule' },
  { id: 't2', complaintId: '#1042', at: '2026-10-23T09:45:00+05:30', kind: 'claimed', title: 'Claimed by Kasun Fernando', actor: 'Kasun Fernando' },
  { id: 't3', complaintId: '#1042', at: '2026-10-24T09:20:00+05:30', kind: 'escalated', title: 'Escalated to Branch Manager', actor: 'System', note: 'Automatic escalation after SLA breach (simulated)' },
  { id: 't4', complaintId: '#1043', at: '2026-10-23T12:50:00+05:30', kind: 'assigned', title: 'Assigned to Dilini Jayawardena', actor: 'System' },
  { id: 't5', complaintId: '#1044', at: '2026-10-22T19:10:00+05:30', kind: 'assigned', title: 'Assigned to Tharindu Gunasekara', actor: 'System' },
  { id: 't6', complaintId: '#1044', at: '2026-10-23T07:10:00+05:30', kind: 'escalated', title: 'Escalated to Branch Manager', actor: 'System', note: 'Automatic escalation after SLA breach (simulated)' },
  { id: 't7', complaintId: '#1046', at: '2026-10-23T20:15:00+05:30', kind: 'assigned', title: 'Assigned to Chamara Bandara', actor: 'System' },
  { id: 't8', complaintId: '#1046', at: '2026-10-23T20:30:00+05:30', kind: 'claimed', title: 'Claimed by Chamara Bandara', actor: 'Chamara Bandara' },
  { id: 't9', complaintId: '#1047', at: '2026-10-21T13:05:00+05:30', kind: 'assigned', title: 'Assigned to Dilini Jayawardena', actor: 'System' },
  { id: 't10', complaintId: '#1047', at: '2026-10-23T13:10:00+05:30', kind: 'escalated', title: 'Escalated to Branch Manager', actor: 'System', note: 'Automatic escalation after SLA breach (simulated)' },
  { id: 't11', complaintId: '#1048', at: '2026-10-24T07:55:00+05:30', kind: 'assigned', title: 'Assigned to Kasun Fernando', actor: 'System' },
  { id: 't12', complaintId: '#1049', at: '2026-10-23T17:30:00+05:30', kind: 'assigned', title: 'Assigned to Nuwan Pathirana', actor: 'System' },
  { id: 't13', complaintId: '#1049', at: '2026-10-24T08:00:00+05:30', kind: 'paused', title: 'SLA clock paused', actor: 'Nuwan Pathirana', note: 'Waiting for the customer to confirm a new date' },
  { id: 't14', complaintId: '#1050', at: '2026-10-23T14:00:00+05:30', kind: 'reopened', title: 'Complaint reopened', actor: 'Lakmini Herath', note: 'Customer reported the issue was not fixed' },
  { id: 't15', complaintId: '#1051', at: '2026-10-23T15:50:00+05:30', kind: 'assigned', title: 'Assigned to Tharindu Gunasekara', actor: 'System' },
]

export const slaAuditLog: SlaAuditEntry[] = [
  { id: 'a1', complaintId: '#1042', at: '2026-10-23T10:10:00+05:30', actor: 'Marcus Vance', action: 'Priority changed', detail: 'Medium → High' },
  { id: 'a2', complaintId: '#1042', at: '2026-10-24T09:20:00+05:30', actor: 'System', action: 'Escalation triggered', detail: 'Rule: escalate on breach' },
  { id: 'a3', complaintId: '#1044', at: '2026-10-22T19:20:00+05:30', actor: 'Marcus Vance', action: 'Priority changed', detail: 'High → Critical' },
  { id: 'a4', complaintId: '#1044', at: '2026-10-23T07:10:00+05:30', actor: 'System', action: 'Escalation triggered', detail: 'Rule: escalate on breach' },
  { id: 'a5', complaintId: '#1047', at: '2026-10-22T09:00:00+05:30', actor: 'Marcus Vance', action: 'Assignee changed', detail: 'Chamara Bandara → Dilini Jayawardena' },
  { id: 'a6', complaintId: '#1047', at: '2026-10-23T13:10:00+05:30', actor: 'System', action: 'Escalation triggered', detail: 'Rule: escalate on breach' },
  { id: 'a7', complaintId: '#1049', at: '2026-10-24T08:00:00+05:30', actor: 'Nuwan Pathirana', action: 'SLA clock paused', detail: 'Reason: awaiting customer' },
  { id: 'a8', complaintId: '#1050', at: '2026-10-23T14:00:00+05:30', actor: 'System', action: 'Ticket reopened', detail: 'Due date recalculated from policy' },
  { id: 'a9', complaintId: '#1046', at: '2026-10-23T20:30:00+05:30', actor: 'Chamara Bandara', action: 'Ticket claimed' },
  { id: 'a10', complaintId: '#1051', at: '2026-10-23T16:05:00+05:30', actor: 'Marcus Vance', action: 'Category changed', detail: 'Cleanliness → Hygiene' },
]
