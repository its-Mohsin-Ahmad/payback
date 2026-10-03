/**
 * Central navigation configuration for the three PAYBACK shells:
 * public marketing site, signed-in customer/business app, internal admin.
 */

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  badge?: string;
  end?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/* ------------------------------------------------------------------ */
/* Public website                                                      */
/* ------------------------------------------------------------------ */

export const publicNav: NavItem[] = [
  { label: 'Personal', to: '/', icon: 'home', end: true },
  { label: 'Business', to: '/business', icon: 'briefcase' },
  { label: 'Products', to: '/products', icon: 'package' },
  { label: 'Rates', to: '/rates', icon: 'chart' },
  { label: 'Security', to: '/security', icon: 'shield-check' },
  { label: 'Support', to: '/support', icon: 'message-circle' },
  { label: 'About', to: '/about', icon: 'info' },
];

/* ------------------------------------------------------------------ */
/* Customer / business app shell                                       */
/* ------------------------------------------------------------------ */

export const appNav: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/app', icon: 'dashboard', end: true },
      { label: 'Accounts', to: '/app/accounts', icon: 'wallet' },
      { label: 'Transactions', to: '/app/transactions', icon: 'arrow-left-right' },
      { label: 'Analytics', to: '/app/analytics', icon: 'chart' },
    ],
  },
  {
    title: 'Move money',
    items: [
      { label: 'Money Transfer', to: '/app/transfer', icon: 'send', badge: 'New' },
      { label: 'Bill Payments', to: '/app/bills', icon: 'receipt' },
      { label: 'Cards', to: '/app/cards', icon: 'credit-card' },
      { label: 'Beneficiaries', to: '/app/beneficiaries', icon: 'users' },
      { label: 'Limits', to: '/app/limits', icon: 'scale' },
    ],
  },
  {
    title: 'Grow & borrow',
    items: [
      { label: 'Loans', to: '/app/loans', icon: 'hand-coins' },
      { label: 'Investments', to: '/app/investments', icon: 'trending-up' },
      { label: 'Rewards', to: '/app/rewards', icon: 'gift' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Currency Exchange', to: '/app/exchange', icon: 'globe' },
      { label: 'Branches & ATMs', to: '/app/branches', icon: 'map-pin' },
      { label: 'Statements', to: '/app/statements', icon: 'file' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', to: '/app/profile', icon: 'user' },
      { label: 'Security Centre', to: '/app/security', icon: 'shield-check' },
      { label: 'Notifications', to: '/app/notifications', icon: 'bell', badge: '3' },
      { label: 'Settings', to: '/app/settings', icon: 'settings' },
      { label: 'Help & Support', to: '/app/support', icon: 'message-circle' },
    ],
  },
];

export const businessNav: NavGroup[] = [
  {
    title: 'Business overview',
    items: [
      { label: 'Business Dashboard', to: '/business/app', icon: 'dashboard', end: true },
      { label: 'Accounts', to: '/business/app/accounts', icon: 'wallet' },
      { label: 'Cash Flow', to: '/business/app/cashflow', icon: 'chart' },
    ],
  },
  {
    title: 'Pay & collect',
    items: [
      { label: 'Invoices', to: '/business/app/invoices', icon: 'file' },
      { label: 'Vendors & Payables', to: '/business/app/vendors', icon: 'store' },
      { label: 'Payroll', to: '/business/app/payroll', icon: 'users' },
      { label: 'Approvals', to: '/business/app/approvals', icon: 'shield-check', badge: '3' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Corporate Cards', to: '/business/app/cards', icon: 'credit-card' },
      { label: 'Team & Permissions', to: '/business/app/team', icon: 'user-cog' },
      { label: 'Integrations', to: '/business/app/integrations', icon: 'package' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Business Profile', to: '/business/app/profile', icon: 'building' },
      { label: 'Support', to: '/business/app/support', icon: 'message-circle' },
    ],
  },
];

export const bottomNav: NavItem[] = [
  { label: 'Home', to: '/app', icon: 'home', end: true },
  { label: 'Accounts', to: '/app/accounts', icon: 'wallet' },
  { label: 'Transfer', to: '/app/transfer', icon: 'send' },
  { label: 'Cards', to: '/app/cards', icon: 'credit-card' },
  { label: 'Profile', to: '/app/profile', icon: 'user' },
];

/* ------------------------------------------------------------------ */
/* Admin shell                                                         */
/* ------------------------------------------------------------------ */

export const adminNav: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: 'dashboard', end: true },
      { label: 'Analytics', to: '/admin/analytics', icon: 'chart' },
      { label: 'Reports', to: '/admin/reports', icon: 'file' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Users', to: '/admin/users', icon: 'users' },
      { label: 'Transactions', to: '/admin/transactions', icon: 'arrow-left-right' },
      { label: 'KYC & Onboarding', to: '/admin/kyc', icon: 'shield-check', badge: '186' },
      { label: 'Disputes', to: '/admin/disputes', icon: 'alert-triangle', badge: '42' },
      { label: 'Risk & Fraud', to: '/admin/risk', icon: 'target' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Fees & Limits', to: '/admin/fees', icon: 'scale' },
      { label: 'Roles & Access', to: '/admin/roles', icon: 'user-cog' },
      { label: 'Integrations', to: '/admin/integrations', icon: 'package' },
    ],
  },
  {
    title: 'Governance',
    items: [
      { label: 'Audit Log', to: '/admin/audit', icon: 'lock' },
      { label: 'Settings', to: '/admin/settings', icon: 'settings' },
    ],
  },
];

/** Quick-action grid used on the customer dashboard. */
export const quickActions = [
  { label: 'Send Money', to: '/app/transfer', icon: 'send', tone: '#10B981' },
  { label: 'Pay Bills', to: '/app/bills', icon: 'receipt', tone: '#38BDF8' },
  { label: 'Top Up', to: '/app/bills', icon: 'smartphone', tone: '#8B5CF6' },
  { label: 'Exchange', to: '/app/exchange', icon: 'globe', tone: '#0EA5E9' },
  { label: 'Rewards', to: '/app/rewards', icon: 'gift', tone: '#F59E0B' },
  { label: 'Cards', to: '/app/cards', icon: 'credit-card', tone: '#14B8A6' },
  { label: 'Loans', to: '/app/loans', icon: 'hand-coins', tone: '#EC4899' },
  { label: 'Invest', to: '/app/investments', icon: 'trending-up', tone: '#6366F1' },
];