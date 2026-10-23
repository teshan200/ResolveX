# ResolveX Admin Web

Administration dashboard for ResolveX (React + TypeScript + Vite + Tailwind CSS). It serves three roles: **Super Admin**, **Tenant Admin** and **Branch Manager**. The design is in the ResolveX Figma file, and the Figma screen names are used below.

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

## Project structure

```
src/
  components/ui/   Reusable components (Button, Input, Badge, Card, Modal)
  layout/          AppLayout, Sidebar, TopBar and navigation.ts (menu per role)
  pages/           Screens
  features/        Feature code (one folder per feature)
  routes/          AppRoutes.tsx (all routes)
  services/        API calls
  hooks/ types/ mocks/
```

- Colours, fonts and radii come from the Figma design tokens in `src/index.css`.
- The menu for each role is defined in `src/layout/navigation.ts`.
- There is no authentication yet. `/login` continues to the Super Admin area, and any area can be opened by its URL.

## Screens and API endpoints

All endpoints are under `/api/v1` and are **proposed**, to be agreed with the backend team. The tenant is taken from the login token, so the client never sends a tenant id. **Built** means the real screen exists. **Placeholder** means the route exists but shows an empty page. **Planned** means the route does not exist yet.

### Public and onboarding

| Figma screen | Route | Status | Endpoints |
|---|---|---|---|
| Landing Page | `/` | Planned | `GET /plans` |
| Company Registration | `/register` | Built | `POST /tenants/register` |
| Email Verification | `/verify-email` | Built | `POST /tenants/verify-email` |
| Sign up with Google, Connecting | `/signup/google` | Built | Handled by Asgardeo |
| Login | `/login` | Placeholder | Handled by Asgardeo, then `GET /me` |
| Sign in with Google, Connecting | `/signin/google` | Planned | Handled by Asgardeo |
| Forgot / Reset Password | `/forgot-password`, `/reset-password` | Planned | Handled by Asgardeo |
| Choose Plan | `/choose-plan` | Planned | `GET /plans` |
| Payment | `/payment` | Planned | `POST /subscription/checkout` (PayHere sandbox) |
| Onboarding Success | `/onboarding-success` | Planned | `POST /tenants/activate` |

Registration uses a mock service (`src/services/registrationService.ts`). To see the error state, register with the email `taken@example.com`.

### Super Admin (`/super-admin`)

| Figma screen | Route | Status | Endpoints |
|---|---|---|---|
| SA · Platform Overview | `/super-admin/overview` | Placeholder | `GET /admin/usage` |
| SA · Companies, Tenant Detail, Suspend Tenant | `/super-admin/companies` | Placeholder | `GET /admin/tenants`, `GET /admin/tenants/{id}`, `POST /admin/tenants/{id}/suspend`, `POST /admin/tenants/{id}/reactivate`, `POST /admin/tenants/{id}/deactivate` |
| SA · Subscriptions | `/super-admin/subscriptions` | Placeholder | `GET /admin/subscriptions` |
| SA · Plans & Pricing | `/super-admin/plans` | Placeholder | `GET /admin/plans`, `POST /admin/plans`, `PUT /admin/plans/{id}` |
| SA · Platform Audit Log | `/super-admin/audit-log` | Placeholder | `GET /admin/audit-logs` |

### Tenant Admin (`/tenant`)

| Figma screen | Route | Status | Endpoints |
|---|---|---|---|
| TA · Dashboard | `/tenant/dashboard` | Placeholder | `GET /analytics/overview` |
| TA · Complaints Overview, Complaint Detail | `/tenant/complaints` | Placeholder | `GET /tickets`, `GET /tickets/{id}`, `GET /tickets/{id}/history` |
| TA · Escalated to Me, Escalated Complaint | `/tenant/escalated` | Placeholder | `GET /escalations`, `GET /tickets/{id}/escalations` |
| TA · Branches, Add Branch, Branch Detail | `/tenant/branches` | Placeholder | `GET /branches`, `POST /branches`, `GET /branches/{id}`, `PUT /branches/{id}`, `DELETE /branches/{id}` |
| TA · Employees, Add / Edit / Remove Employee | `/tenant/employees` | Placeholder | `GET /employees`, `POST /employees`, `GET /employees/{id}`, `PUT /employees/{id}`, `DELETE /employees/{id}` |
| TA · Hierarchy | `/tenant/hierarchy` | Placeholder | `GET /hierarchy`, `PUT /hierarchy` |
| TA · Feedback Forms, Form Builder | `/tenant/feedback-forms` | Placeholder | `GET /forms`, `POST /forms`, `GET /forms/{id}`, `PUT /forms/{id}`, `POST /forms/{id}/publish`, `GET /forms/{id}/versions` |
| TA · QR Codes, QR Code Preview, Disable QR Code | `/tenant/qr-codes` | Placeholder | `GET /qr-codes`, `PATCH /qr-codes/{id}` |
| TA · SLA Policies | `/tenant/sla-policies` | Placeholder | `GET /sla-policies`, `PUT /sla-policies` |
| TA · Analytics | `/tenant/analytics` | Placeholder | `GET /analytics/overview`, `GET /analytics/branches`, `GET /analytics/staff` |
| TA · Reports | `/tenant/reports` | Placeholder | `GET /reports`, `GET /reports/{id}/export?format=pdf\|csv` |
| TA · Audit Log | `/tenant/audit-log` | Placeholder | `GET /audit-logs` |
| TA · Billing & Plan, Payment Failed | `/tenant/billing` | Placeholder | `GET /subscription`, `POST /subscription/checkout`, `POST /subscription/upgrade`, `POST /subscription/downgrade`, `POST /subscription/renew` |
| TA · Settings, Branding / Email Delivery | `/tenant/settings` | Placeholder | `GET /me`, `PATCH /me` |

### Branch Manager (`/branch`)

| Figma screen | Route | Status | Endpoints |
|---|---|---|---|
| BM · Branch Overview | `/branch/overview` | Placeholder | `GET /analytics/overview` |
| BM · Tickets, Ticket Detail | `/branch/tickets` | Placeholder | `GET /tickets`, `GET /tickets/{id}`, `POST /tickets/{id}/assign`, `POST /tickets/{id}/claim`, `POST /tickets/{id}/reopen`, `POST /tickets/{id}/cancel` |
| BM · AI Review Queue | `/branch/ai-review` | Placeholder | `GET /ai-reviews`, `PATCH /ai-reviews/{ticketId}` |
| BM · Resolution Approvals | `/branch/approvals` | Placeholder | `GET /approvals`, `POST /approvals/{id}/decision` |
| BM · Escalation Inbox | `/branch/escalations` | Placeholder | `GET /escalations` |
| BM · Staff & Workload | `/branch/staff` | Placeholder | `GET /analytics/staff` |
| BM · Employees, Add Employee, Employee Detail | `/branch/employees` | Placeholder | `GET /employees`, `POST /employees`, `GET /employees/{id}` |
| BM · QR Codes, Generate QR Codes, Rename QR Code | `/branch/qr-codes` | Placeholder | `GET /qr-codes`, `POST /qr-codes`, `PATCH /qr-codes/{id}` |

### Shared (all roles)

| Purpose | Endpoint |
|---|---|
| Current user | `GET /me`, `PATCH /me` |
| Notifications | `GET /notifications`, `PATCH /notifications/{id}/read` |
| Live ticket updates and dashboard events | `WS /ws` |

When a screen is built, change its **Status** to **Built** in this file.
