/**
 * PAYBACK — demo data for Business Banking and the internal Admin platform.
 * All values synthetic. Admin views indicate "demo data" where applicable.
 */

/* ------------------------------------------------------------------ */
/* Business banking                                                    */
/* ------------------------------------------------------------------ */

export const businessProfile = {
  name: 'Northwind Technologies (Pvt) Ltd',
  legalName: 'Northwind Technologies Private Limited',
  registration: 'NTN •••• 4471-8',
  industry: 'Software & IT Services',
  since: 'Feb 2021',
  primaryContact: 'Mohsin Ahmad',
  role: 'Finance Director',
  address: 'Office 12, Arfa Software Technology Park, Lahore, Pakistan',
  employees: 48,
};

export const businessAccounts = [
  { id: 'ba-1', name: 'Business Current', number: '••→ 9281', balance: 2850.6, currency: 'USD', type: 'Current', status: 'Active' },
  { id: 'ba-2', name: 'Payroll Account', number: '••→ 1104', balance: 42000, currency: 'USD', type: 'Payroll', status: 'Active' },
  { id: 'ba-3', name: 'Tax Reserve', number: '••→ 3377', balance: 18600, currency: 'USD', type: 'Reserve', status: 'Active' },
  { id: 'ba-4', name: 'Business USD', number: '••→ 5520', balance: 12400, currency: 'USD', type: 'Foreign Currency', status: 'Under review' },
];

export const businessMetrics = {
  totalBalance: 75850.6,
  monthInflow: 128400,
  monthOutflow: 96320,
  netCash: 32080,
  pendingPayments: 4,
  pendingAmount: 18450,
  unpaidInvoices: 6,
  unpaidAmount: 42600,
  overdueInvoices: 2,
  payrollDue: 'May 01, 2025',
  payrollAmount: 41200,
};

export const cashflowSeries = [
  { label: 'Nov', inflow: 96200, outflow: 78800 },
  { label: 'Dec', inflow: 118400, outflow: 92100 },
  { label: 'Jan', inflow: 104300, outflow: 88400 },
  { label: 'Feb', inflow: 121800, outflow: 90200 },
  { label: 'Mar', inflow: 132600, outflow: 97600 },
  { label: 'Apr', inflow: 128400, outflow: 96320 },
];

export const invoices = [
  { id: 'INV-2041', customer: 'Aurora Retail Group', issue: 'Apr 02, 2025', due: 'May 02, 2025', amount: 12400, currency: 'USD', status: 'Sent' },
  { id: 'INV-2042', customer: 'Meridian Logistics', issue: 'Apr 05, 2025', due: 'May 05, 2025', amount: 8650, currency: 'USD', status: 'Paid' },
  { id: 'INV-2043', customer: 'Cedar Hospitality', issue: 'Apr 08, 2025', due: 'Apr 22, 2025', amount: 5200, currency: 'USD', status: 'Overdue' },
  { id: 'INV-2044', customer: 'Summit Manufacturing', issue: 'Apr 11, 2025', due: 'May 11, 2025', amount: 15800, currency: 'USD', status: 'Sent' },
  { id: 'INV-2045', customer: 'Pioneer Media', issue: 'Apr 14, 2025', due: 'May 14, 2025', amount: 3400, currency: 'USD', status: 'Draft' },
  { id: 'INV-2046', customer: 'Harbour Foods', issue: 'Apr 16, 2025', due: 'Apr 18, 2025', amount: 7150, currency: 'USD', status: 'Overdue' },
  { id: 'INV-2047', customer: 'Vertex Consulting', issue: 'Apr 20, 2025', due: 'May 20, 2025', amount: 4600, currency: 'USD', status: 'Sent' },
  { id: 'INV-2048', customer: 'Beacon Energy', issue: 'Apr 23, 2025', due: 'May 23, 2025', amount: 9200, currency: 'USD', status: 'Draft' },
];

export const vendors = [
  { id: 'v-1', name: 'Cloud Hosting Co.', category: 'Infrastructure', terms: 'Net 30', due: 3200, status: 'Scheduled', account: '••→ 7781' },
  { id: 'v-2', name: 'Office Supplies Ltd', category: 'Operations', terms: 'Net 15', due: 940, status: 'Due', account: '••→ 2210' },
  { id: 'v-3', name: 'Legal Advisors', category: 'Professional', terms: 'Net 45', due: 4800, status: 'Scheduled', account: '••→ 9942' },
  { id: 'v-4', name: 'Facilities Management', category: 'Operations', terms: 'Net 30', due: 2500, status: 'Due', account: '••→ 3320' },
  { id: 'v-5', name: 'Marketing Agency', category: 'Growth', terms: 'Net 30', due: 6100, status: 'Paid', account: '••→ 5518' },
  { id: 'v-6', name: 'Courier Services', category: 'Logistics', terms: 'Net 7', due: 910, status: 'Due', account: '••→ 7712' },
];

export const payroll = [
  { id: 'p-1', name: 'Engineering', people: 18, gross: 21400, tax: 1820, net: 19580 },
  { id: 'p-2', name: 'Sales', people: 12, gross: 9800, tax: 760, net: 9040 },
  { id: 'p-3', name: 'Operations', people: 9, gross: 6600, tax: 480, net: 6120 },
  { id: 'p-4', name: 'Support', people: 6, gross: 3900, tax: 260, net: 3640 },
  { id: 'p-5', name: 'Finance & Admin', people: 3, gross: 2500, tax: 180, net: 2320 },
];

export const teamMembers = [
  { id: 't-1', name: 'Mohsin Ahmad', role: 'Finance Director', permission: 'Administrator', status: 'Active', email: 'mohsin.ahmad@example.com' },
  { id: 't-2', name: 'Nadia Rehman', role: 'Accountant', permission: 'Maker', status: 'Active', email: 'nadia.rehman@example.com' },
  { id: 't-3', name: 'Bilal Sheikh', role: 'Operations Lead', permission: 'Maker', status: 'Active', email: 'bilal.sheikh@example.com' },
  { id: 't-4', name: 'Hina Qureshi', role: 'Compliance Officer', permission: 'Approver', status: 'Active', email: 'hina.qureshi@example.com' },
  { id: 't-5', name: 'Omar Farooq', role: 'Auditor (external)', permission: 'View only', status: 'Invited', email: 'omar.farooq@example.com' },
];

export const approvals = [
  { id: 'ap-1', title: 'Vendor payment — Cloud Hosting Co.', amount: 3200, requestedBy: 'Nadia Rehman', requestedOn: 'Apr 24, 2025', approvers: '1 of 2 approved', status: 'Pending', risk: 'Low' },
  { id: 'ap-2', title: 'Payroll run — April 2025', amount: 41200, requestedBy: 'Mohsin Ahmad', requestedOn: 'Apr 23, 2025', approvers: '2 of 2 approved', status: 'Approved', risk: 'Low' },
  { id: 'ap-3', title: 'Marketing Agency retainer', amount: 6100, requestedBy: 'Bilal Sheikh', requestedOn: 'Apr 22, 2025', approvers: '1 of 2 approved', status: 'Pending', risk: 'Medium' },
  { id: 'ap-4', title: 'New beneficiary — Legal Advisors', amount: 4800, requestedBy: 'Nadia Rehman', requestedOn: 'Apr 21, 2025', approvers: '0 of 2 approved', status: 'Pending', risk: 'High' },
  { id: 'ap-5', title: 'Tax reserve top-up', amount: 15000, requestedBy: 'Mohsin Ahmad', requestedOn: 'Apr 18, 2025', approvers: '2 of 2 approved', status: 'Approved', risk: 'Low' },
];

export const corporateCards = [
  { id: 'cc-1', holder: 'Mohsin Ahmad', label: 'Executive •••• 1120', limit: 15000, spent: 4820, status: 'Active' },
  { id: 'cc-2', holder: 'Bilal Sheikh', label: 'Operations •••• 3390', limit: 8000, spent: 3140, status: 'Active' },
  { id: 'cc-3', holder: 'Nadia Rehman', label: 'Finance •••• 7745', limit: 6000, spent: 1280, status: 'Active' },
  { id: 'cc-4', holder: 'Marketing Team', label: 'Shared •••• 5561', limit: 10000, spent: 9260, status: 'Frozen' },
];

export const businessIntegrations = [
  { id: 'i-1', name: 'Accounting Sync', detail: 'Export ledgers and invoices', status: 'Available', logo: 'AS' },
  { id: 'i-2', name: 'Payroll Automation', detail: 'Schedule monthly payroll runs', status: 'Connected', logo: 'PA' },
  { id: 'i-3', name: 'Bulk Payouts API', detail: 'Send up to 5,000 transfers per file', status: 'Integration Required', logo: 'BP' },
  { id: 'i-4', name: 'Tax Filing Export', detail: 'FBR-ready statements and summaries', status: 'Available', logo: 'TF' },
];

/* ------------------------------------------------------------------ */
/* Admin platform                                                      */
/* ------------------------------------------------------------------ */

export const adminMetrics = {
  totalUsers: 48210,
  activeToday: 12840,
  newThisMonth: 2140,
  totalVolume: 186400000,
  transactions24h: 96420,
  pendingKyc: 186,
  openDisputes: 42,
  fraudFlagged: 17,
  uptime: 99.98,
  supportQueue: 63,
};

export const adminKpis = [
  { id: 'k-1', label: 'Total Users', value: '48,210', delta: 4.4, tone: '#10B981', icon: 'users' },
  { id: 'k-2', label: 'Transactions (24h)', value: '96,420', delta: 2.1, tone: '#38BDF8', icon: 'arrow-left-right' },
  { id: 'k-3', label: 'Payment Volume (30d)', value: '$186.4M', delta: 6.8, tone: '#8B5CF6', icon: 'trending-up' },
  { id: 'k-4', label: 'Pending KYC', value: '186', delta: -3.2, tone: '#F59E0B', icon: 'shield-check' },
  { id: 'k-5', label: 'Open Disputes', value: '42', delta: -1.4, tone: '#EF4444', icon: 'alert-triangle' },
  { id: 'k-6', label: 'Platform Uptime', value: '99.98%', delta: 0.02, tone: '#14B8A6', icon: 'activity' },
];

export const adminVolumeSeries = [
  { label: 'Mon', inflow: 18400000, outflow: 16200000 },
  { label: 'Tue', inflow: 21200000, outflow: 17900000 },
  { label: 'Wed', inflow: 19600000, outflow: 18800000 },
  { label: 'Thu', inflow: 24800000, outflow: 20400000 },
  { label: 'Fri', inflow: 28400000, outflow: 23100000 },
  { label: 'Sat', inflow: 16200000, outflow: 14800000 },
  { label: 'Sun', inflow: 12800000, outflow: 11600000 },
];

export const adminUsers = [
  { id: 'U-48210', name: 'Mohsin Ahmad', email: 'mohsin.ahmad@example.com', type: 'Individual', tier: 'Premium', kyc: 'Verified', status: 'Active', joined: 'Mar 2019' },
  { id: 'U-48211', name: 'Northwind Technologies', email: 'finance@northwind.example', type: 'Business', tier: 'Business', kyc: 'Verified', status: 'Active', joined: 'Feb 2021' },
  { id: 'U-48212', name: 'Ali Raza', email: 'ali.raza@example.com', type: 'Individual', tier: 'Standard', kyc: 'Pending', status: 'Restricted', joined: 'Apr 2025' },
  { id: 'U-48213', name: 'Sara Malik', email: 'sara.malik@example.com', type: 'Individual', tier: 'Standard', kyc: 'Verified', status: 'Active', joined: 'Jan 2024' },
  { id: 'U-48214', name: 'Beacon Energy Ltd', email: 'accounts@beacon.example', type: 'Business', tier: 'Business', kyc: 'In review', status: 'Active', joined: 'Nov 2023' },
  { id: 'U-48215', name: 'Hassan Iqbal', email: 'hassan.iqbal@example.com', type: 'Individual', tier: 'Student', kyc: 'Pending', status: 'Suspended', joined: 'Apr 2025' },
  { id: 'U-48216', name: 'Aurora Retail Group', email: 'ap@aurora.example', type: 'Business', tier: 'Enterprise', kyc: 'Verified', status: 'Active', joined: 'Jun 2020' },
];

export const adminTransactions = [
  { id: 'ATX-99001', user: 'U-48210', rail: 'PAYBACK', amount: 250, currency: 'USD', status: 'Completed', risk: 'Low', time: '09:42 AM' },
  { id: 'ATX-99002', user: 'U-48211', rail: 'Local Bank', amount: 18450, currency: 'USD', status: 'Pending', risk: 'Low', time: '09:38 AM' },
  { id: 'ATX-99003', user: 'U-48212', rail: 'Easypaisa', amount: 340, currency: 'USD', status: 'Failed', risk: 'Medium', time: '09:31 AM' },
  { id: 'ATX-99004', user: 'U-48213', rail: 'PAYBACK', amount: 75, currency: 'USD', status: 'Completed', risk: 'Low', time: '09:25 AM' },
  { id: 'ATX-99005', user: 'U-48215', rail: 'International', amount: 4200, currency: 'USD', status: 'Flagged', risk: 'High', time: '09:12 AM' },
  { id: 'ATX-99006', user: 'U-48211', rail: 'Payroll Batch', amount: 41200, currency: 'USD', status: 'Processing', risk: 'Low', time: '08:58 AM' },
  { id: 'ATX-99007', user: 'U-48216', rail: 'Local Bank', amount: 12400, currency: 'USD', status: 'Completed', risk: 'Low', time: '08:44 AM' },
  { id: 'ATX-99008', user: 'U-48214', rail: 'Local Bank', amount: 9200, currency: 'USD', status: 'Reversed', risk: 'Medium', time: '08:30 AM' },
];

export const adminKycQueue = [
  { id: 'KYC-771', user: 'Ali Raza', type: 'Individual', submitted: 'Apr 25, 2025', documents: 'ID + Selfie', risk: 'Medium', status: 'Pending review' },
  { id: 'KYC-772', user: 'Hassan Iqbal', type: 'Individual', submitted: 'Apr 24, 2025', documents: 'ID only', risk: 'High', status: 'Pending review' },
  { id: 'KYC-773', user: 'Beacon Energy Ltd', type: 'Business', submitted: 'Apr 24, 2025', documents: 'Registration + UBO', risk: 'Low', status: 'In review' },
  { id: 'KYC-774', user: 'Fatima Ali', type: 'Individual', submitted: 'Apr 23, 2025', documents: 'ID + Proof of address', risk: 'Low', status: 'Pending review' },
  { id: 'KYC-775', user: 'Cedar Hospitality', type: 'Business', submitted: 'Apr 22, 2025', documents: 'Registration', risk: 'Medium', status: 'Additional info needed' },
];

export const adminDisputes = [
  { id: 'DSP-3310', user: 'U-48212', subject: 'Unauthorised card charge', amount: 340, opened: 'Apr 22, 2025', sla: '2 days left', status: 'Investigating', priority: 'High' },
  { id: 'DSP-3311', user: 'U-48214', subject: 'Duplicate debit', amount: 9200, opened: 'Apr 21, 2025', sla: '4 days left', status: 'Awaiting merchant', priority: 'Medium' },
  { id: 'DSP-3312', user: 'U-48213', subject: 'Failed top-up not refunded', amount: 75, opened: 'Apr 20, 2025', sla: '1 day left', status: 'Investigating', priority: 'High' },
  { id: 'DSP-3313', user: 'U-48216', subject: 'Invoice payment mismatch', amount: 12400, opened: 'Apr 18, 2025', sla: '6 days left', status: 'Resolved', priority: 'Low' },
];

export const adminAuditLog = [
  { id: 'LOG-9001', actor: 'admin.hina', action: 'Approved KYC — U-48213', target: 'U-48213', time: 'Apr 25, 09:51 AM', ip: '203.0.113.•••' },
  { id: 'LOG-9002', actor: 'admin.saad', action: 'Froze account — U-48215', target: 'U-48215', time: 'Apr 25, 09:33 AM', ip: '203.0.113.•••' },
  { id: 'LOG-9003', actor: 'system.risk', action: 'Flagged transaction — ATX-99005', target: 'ATX-99005', time: 'Apr 25, 09:12 AM', ip: 'internal' },
  { id: 'LOG-9004', actor: 'admin.farah', action: 'Updated fee schedule — International', target: 'Config', time: 'Apr 24, 05:20 PM', ip: '198.51.100.•••' },
  { id: 'LOG-9005', actor: 'admin.saad', action: 'Resolved dispute — DSP-3313', target: 'DSP-3313', time: 'Apr 24, 03:04 PM', ip: '203.0.113.•••' },
  { id: 'LOG-9006', actor: 'system', action: 'Scheduled maintenance window', target: 'Platform', time: 'Apr 23, 07:00 PM', ip: 'internal' },
];

export const adminRoles = [
  { id: 'r-1', name: 'Super Admin', members: 3, permissions: 'Full platform access', scope: 'Global' },
  { id: 'r-2', name: 'Compliance Officer', members: 8, permissions: 'KYC, disputes, audit log', scope: 'Global' },
  { id: 'r-3', name: 'Support Agent', members: 42, permissions: 'Users (read), tickets', scope: 'Regional' },
  { id: 'r-4', name: 'Finance Ops', members: 11, permissions: 'Reconciliation, payouts', scope: 'Global' },
  { id: 'r-5', name: 'Risk Analyst', members: 6, permissions: 'Fraud rules, transaction holds', scope: 'Global' },
  { id: 'r-6', name: 'Read-only Analyst', members: 14, permissions: 'Dashboard and reports', scope: 'Global' },
];

export const adminIntegrationHealth = [
  { id: 'ih-1', name: 'Core Ledger', status: 'Operational', latency: '42 ms', uptime: '99.99%' },
  { id: 'ih-2', name: 'PAYBACK Transfers', status: 'Operational', latency: '68 ms', uptime: '99.98%' },
  { id: 'ih-3', name: 'Local Bank Rail', status: 'Degraded', latency: '420 ms', uptime: '99.41%' },
  { id: 'ih-4', name: 'International Rail', status: 'Operational', latency: '180 ms', uptime: '99.92%' },
  { id: 'ih-5', name: 'Wallet Providers (demo)', status: 'Simulated', latency: '—', uptime: 'n/a' },
  { id: 'ih-6', name: 'Notification Service', status: 'Operational', latency: '55 ms', uptime: '99.97%' },
];