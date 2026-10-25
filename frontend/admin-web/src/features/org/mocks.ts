// Sample data for the Branches, Employees and Hierarchy screens. No backend is connected.
import type { Branch, Employee, Hierarchy } from './types'

export const BRANCH_MANAGER_DESIGNATION = 'Branch Manager'

export const branchTotals = { all: 32, active: 31, inactive: 1, noManager: 1 }

export const employeeTotals = { all: 486, active: 471, inactive: 15 }

export const colomboEmployeeTotals = { all: 38, active: 36, inactive: 2 }

export const branches: Branch[] = [
  { id: 'colombo', name: 'Colombo Branch', address: '42 Galle Rd, Colombo 03', phone: '+94 11 234 5678', email: 'colombo@spicegarden.lk', managerId: 'ayesha', staffCount: 38, status: 'Active' },
  { id: 'negombo', name: 'Negombo Beach', address: 'Lewis Pl, Negombo', phone: '+94 31 222 1100', email: 'negombo@spicegarden.lk', managerId: 'tharindu', staffCount: 22, status: 'Active' },
  { id: 'kandy', name: 'Kandy Branch', address: 'Dalada Veediya, Kandy', phone: '+94 81 222 3344', email: 'kandy@spicegarden.lk', managerId: 'sachini', staffCount: 31, status: 'Active' },
  { id: 'galle', name: 'Galle Fort', address: 'Church St, Galle', phone: '+94 91 222 4455', email: 'galle@spicegarden.lk', managerId: 'ruwan', staffCount: 27, status: 'Active' },
  { id: 'nuwara-eliya', name: 'Nuwara Eliya', address: 'Grand Hotel Rd, Nuwara Eliya', phone: '+94 52 222 5566', email: 'nuwaraeliya@spicegarden.lk', managerId: 'ishara', staffCount: 14, status: 'Active' },
  { id: 'matara', name: 'Matara', address: 'Beach Rd, Matara', phone: '+94 41 222 6677', email: 'matara@spicegarden.lk', managerId: null, staffCount: 0, status: 'Inactive' },
]

export const employees: Employee[] = [
  { id: 'ayesha', name: 'Ayesha Perera', initials: 'AP', email: 'ayesha@spicegarden.lk', designation: 'Branch Manager', branchId: 'colombo', status: 'Active', lastActive: 'Now', openTickets: 0 },
  { id: 'kavinda', name: 'Kavinda Perera', initials: 'KP', email: 'kavinda@spicegarden.lk', designation: 'Floor Supervisor', branchId: 'colombo', status: 'Active', lastActive: '5 min ago', openTickets: 3 },
  { id: 'nimal', name: 'Nimal Perera', initials: 'NP', email: 'nimal.p@spicegarden.lk', designation: 'Cleaning Supervisor', branchId: 'colombo', status: 'Active', lastActive: 'Today, 2:14 PM', openTickets: 1 },
  { id: 'namal', name: 'Namal Silva', initials: 'NS', email: 'namal.s@spicegarden.lk', designation: 'Cleaner / Housekeeper', branchId: 'colombo', status: 'Active', lastActive: 'Today, 1:52 PM', openTickets: 2 },
  { id: 'dinesh', name: 'Dinesh Kumara', initials: 'DK', email: 'dinesh@spicegarden.lk', designation: 'Waiter / Waitress', branchId: 'colombo', status: 'Active', lastActive: '2 min ago', openTickets: 4 },
  { id: 'ravi', name: 'Ravi Silva', initials: 'RS', email: 'ravi@spicegarden.lk', designation: 'Head Chef / Kitchen Manager', branchId: 'colombo', status: 'Active', lastActive: '1 h ago', openTickets: 2 },
  { id: 'amali', name: 'Amali Wije', initials: 'AW', email: 'amali@spicegarden.lk', designation: 'Delivery Rider / Driver', branchId: 'colombo', status: 'Active', lastActive: '25 min ago', openTickets: 1 },
  { id: 'chathura', name: 'Chathura Nanayakkara', initials: 'CN', email: 'chathura@spicegarden.lk', designation: 'Busser / Table Cleaner', branchId: 'colombo', status: 'Inactive', lastActive: '3 Oct 2026', openTickets: 0 },
  { id: 'sachini', name: 'Sachini Bandara', initials: 'SB', email: 'sachini@spicegarden.lk', designation: 'Branch Manager', branchId: 'kandy', status: 'Active', lastActive: '20 min ago', openTickets: 0 },
  { id: 'dilan', name: 'Dilan Jayawardena', initials: 'DJ', email: 'dilan@spicegarden.lk', designation: 'Floor Supervisor', branchId: 'matara', status: 'Active', lastActive: 'Yesterday', openTickets: 0 },
  // Host / Hostess is not in the hierarchy, so this employee has no level and is flagged.
  { id: 'hasini', name: 'Hasini Wijeratne', initials: 'HW', email: 'hasini@spicegarden.lk', designation: 'Host / Hostess', branchId: 'kandy', status: 'Inactive', lastActive: '12 Sep 2026', openTickets: 0 },
  // Managers of the remaining branches, listed so branch.managerId always resolves.
  { id: 'tharindu', name: 'Tharindu Fernando', initials: 'TF', email: 'tharindu@spicegarden.lk', designation: 'Branch Manager', branchId: 'negombo', status: 'Active', lastActive: '10 min ago', openTickets: 0 },
  { id: 'ruwan', name: 'Ruwan Silva', initials: 'RS', email: 'ruwan@spicegarden.lk', designation: 'Branch Manager', branchId: 'galle', status: 'Active', lastActive: '35 min ago', openTickets: 0 },
  { id: 'ishara', name: 'Ishara Gamage', initials: 'IG', email: 'ishara@spicegarden.lk', designation: 'Branch Manager', branchId: 'nuwara-eliya', status: 'Active', lastActive: '1 h ago', openTickets: 0 },
]

export const hierarchy: Hierarchy = {
  levels: [
    { level: 5, name: 'Tenant Admin', reserved: true, designations: [] },
    { level: 4, name: 'Branch Manager', reserved: true, designations: [BRANCH_MANAGER_DESIGNATION] },
    { level: 3, name: 'Supervisors', reserved: false, designations: ['Floor Supervisor'] },
    {
      level: 2,
      name: 'Team Leads',
      reserved: false,
      designations: ['Head Waiter', 'Head Chef / Kitchen Manager', 'Cleaning Supervisor', 'Delivery Supervisor'],
    },
    {
      level: 1,
      name: 'Team Members',
      reserved: false,
      designations: [
        'Waiter / Waitress',
        'Busser / Table Cleaner',
        'Cashier / POS Operator',
        'Cleaner / Housekeeper',
        'Delivery Rider / Driver',
        'General Chef / Line Cook',
      ],
    },
  ],
  unused: [
    'Host / Hostess',
    'Bartender',
    'Barista',
    'Security Guard',
    'Bar Supervisor',
    'Assistant Branch Manager',
    'Security Supervisor / Chief Security Officer',
  ],
}

/** Level of a designation, or null when it is not placed in the hierarchy. */
export function levelOfDesignation(designation: string, h: Hierarchy = hierarchy): number | null {
  const found = h.levels.find((l) => l.designations.includes(designation))
  return found ? found.level : null
}
