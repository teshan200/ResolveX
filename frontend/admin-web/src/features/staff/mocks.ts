// Sample data for the Staff & workload screen. No backend is connected.

export type ShiftStatus = 'On shift' | 'On break' | 'Off shift'
export type LoadTone = 'brand' | 'warning' | 'danger'

export interface StaffMember {
  id: string
  name: string
  initials: string
  role: string
  status: ShiftStatus
  open: number
  loadTone: LoadTone
  /** Share of the bar that is filled. The Figma frame shows every bar at the same length. */
  loadPercent: number
  avgAck: string
  slaMet: string
  slaTone: 'success' | 'danger' | 'none'
}

export const staffMembers: StaffMember[] = [
  { id: 'dk', name: 'Dinesh Kumara', initials: 'DK', role: 'Waiter / Waitress', status: 'On shift', open: 4, loadTone: 'warning', loadPercent: 100, avgAck: '4 min', slaMet: '97%', slaTone: 'success' },
  { id: 'rs', name: 'Ravi Silva', initials: 'RS', role: 'Head Chef / Kitchen Manager', status: 'On shift', open: 6, loadTone: 'danger', loadPercent: 100, avgAck: '11 min', slaMet: '82%', slaTone: 'danger' },
  { id: 'kp', name: 'Kavinda Perera', initials: 'KP', role: 'Floor Supervisor', status: 'On shift', open: 3, loadTone: 'brand', loadPercent: 100, avgAck: '3 min', slaMet: '95%', slaTone: 'success' },
  { id: 'nj', name: 'Nadeesha Jay', initials: 'NJ', role: 'Bartender', status: 'On break', open: 1, loadTone: 'brand', loadPercent: 100, avgAck: '5 min', slaMet: '94%', slaTone: 'success' },
  { id: 'aw', name: 'Amali Wije', initials: 'AW', role: 'Delivery Rider / Driver', status: 'On shift', open: 2, loadTone: 'brand', loadPercent: 100, avgAck: '7 min', slaMet: '90%', slaTone: 'success' },
  { id: 'cn', name: 'Chathura N.', initials: 'CN', role: 'Waiter / Waitress', status: 'Off shift', open: 0, loadTone: 'brand', loadPercent: 100, avgAck: '—', slaMet: '—', slaTone: 'none' },
]
