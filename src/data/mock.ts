/**
 * PAYBACK — demo data layer.
 *
 * IMPORTANT: every value in this module is synthetic / illustrative test data.
 * Nothing here represents a real account, real customer, real provider
 * integration or a real settled payment. See the PAYBACK prototype security
 * boundary: no credentials, PINs, CVVs or OTPs are ever stored in this file.
 * When a flow is not connected to a live provider it is labelled
 * "Demo Transfer" / "Simulated" / "Integration Required" in the UI.
 */

export type AccountIcon = 'wallet' | 'piggy' | 'briefcase' | 'cap' | 'globe' | 'users';

export interface Account {
  id: string;
  name: string;
  type: string;
  number: string;
  balance: number;
  available: number;
  currency: string;
  changePct: number;
  status: 'Active' | 'Frozen' | 'Dormant' | 'Under review';
  isDefault?: boolean;
  interest?: string;
  equivalent?: string;
  icon: AccountIcon;
}

export type TxStatus = 'Completed' | 'Pending' | 'Failed' | 'Reversed' | 'Cancelled';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  currency: string;
  status: TxStatus;
  reference: string;
  method: string;
  note?: string;
  risk?: 'Low' | 'Medium' | 'High';
}

export interface Recipient {
  id: string;
  name: string;
  provider: string;
  identifier: string;
  favourite: boolean;
  verified: boolean;
  initialsColor: string;
}

export interface Card {
  id: string;
  label: string;
  scheme: 'VISA' | 'Mastercard';
  type: 'Debit' | 'Credit' | 'Virtual' | 'Premium' | 'Business';
  last4: string;
  expiry: string;
  status: 'Active' | 'Frozen' | 'Blocked' | 'Expired';
  limit: number;
  spent: number;
  currency: string;
  online: boolean;
  international: boolean;
  contactless: boolean;
  atm: boolean;
  gradient: string;
  isDefault?: boolean;
}

export interface Bill {
  id: string;
  biller: string;
  category: string;
  amount: number;
  due: string;
  autopay: boolean;
  status: 'Due' | 'Paid' | 'Scheduled' | 'Overdue';
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: 'Security' | 'Transactions' | 'Transfers' | 'Promotions' | 'Rewards' | 'System';
  time: string;
  read: boolean;
}

export interface RewardOffer {
  id: string;
  title: string;
  partner: string;
  category: string;
  points: number;
  cash: string;
  expiry: string;
  tone: string;
}

export interface ExchangeRate {
  pair: string;
  flag: string;
  buy: number;
  sell: number;
  change: number;
  updated: string;
  code: string;
}

export interface TransferRecord {
  id: string;
  date: string;
  recipient: string;
  provider: string;
  amount: number;
  currency: string;
  status: TxStatus;
  reference: string;
}

/* ------------------------------------------------------------------ */
/* Customer profile                                                    */
/* ------------------------------------------------------------------ */

export const customer = {
  name: 'Mohsin Ahmad',
  preferredName: 'Mohsin',
  tier: 'Premium Customer',
  email: 'mohsin.ahmad@example.com',
  phone: '+92 300 ••• 4471',
  iban: 'PK36 SCBL 0000 0011 2345 6702',
  memberSince: 'March 2019',
  avatarInitials: 'MA',
  address: 'House 42, Block C, Gulberg III, Lahore, Pakistan',
  dateOfBirth: '14 Aug 1991',
  nationalId: '•••••-•••••••-3',
};

export const totalBalance = {
  total: 12480.75,
  currency: 'USD',
  pkrEquivalent: 3462160,
  changePct: 2.4,
  available: 11830.4,
  lastLogin: 'Apr 25, 2025 • 9:42 AM',
};

/* ------------------------------------------------------------------ */
/* Accounts                                                            */
/* ------------------------------------------------------------------ */

export const accounts: Account[] = [
  {
    id: 'acc-current',
    name: 'Current Account',
    type: 'Current',
    number: '4827',
    balance: 5248.32,
    available: 5248.32,
    currency: 'USD',
    changePct: 2.4,
    status: 'Active',
    isDefault: true,
    interest: 'No profit accrual',
    icon: 'wallet',
  },
  {
    id: 'acc-savings',
    name: 'Savings Account',
    type: 'Savings',
    number: '6134',
    balance: 4320.75,
    available: 4320.75,
    currency: 'USD',
    changePct: 1.8,
    status: 'Active',
    interest: 'Illustrative 8.5% p.a. profit',
    icon: 'piggy',
  },
  {
    id: 'acc-business',
    name: 'Business Account',
    type: 'Business',
    number: '9281',
    balance: 2850.6,
    available: 2750.6,
    currency: 'USD',
    changePct: 3.2,
    status: 'Active',
    interest: 'No profit accrual',
    icon: 'briefcase',
  },
  {
    id: 'acc-student',
    name: 'Student Account',
    type: 'Student',
    number: '7542',
    balance: 860.4,
    available: 860.4,
    currency: 'USD',
    changePct: 1.2,
    status: 'Active',
    interest: 'No monthly fee',
    icon: 'cap',
  },
  {
    id: 'acc-fcy',
    name: 'Foreign Currency Account',
    type: 'Foreign Currency',
    number: '3378',
    balance: 1240.3,
    available: 1240.3,
    currency: 'EUR',
    changePct: 0.4,
    status: 'Active',
    equivalent: 'Equivalent to €1,134.22',
    icon: 'globe',
  },
  {
    id: 'acc-joint',
    name: 'Joint Account',
    type: 'Joint',
    number: '6621',
    balance: 765.18,
    available: 765.18,
    currency: 'USD',
    changePct: 0.6,
    status: 'Active',
    interest: 'Shared with 1 joint holder',
    icon: 'users',
  },
];

/* ------------------------------------------------------------------ */
/* Transactions                                                        */
/* ------------------------------------------------------------------ */

export const transactions: Transaction[] = [
  {
    id: 'tx-1001',
    date: '2025-04-25',
    description: 'Amazon',
    merchant: 'Amazon.com',
    category: 'Shopping',
    account: 'Current Account •••• 4827',
    amount: -126.45,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-88214',
    method: 'Card •••• 4287',
    risk: 'Low',
  },
  {
    id: 'tx-1002',
    date: '2025-04-24',
    description: 'Starbucks',
    merchant: 'Starbucks Coffee',
    category: 'Food & Dining',
    account: 'Current Account •••• 4827',
    amount: -8.76,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-88190',
    method: 'Contactless •••• 4287',
    risk: 'Low',
  },
  {
    id: 'tx-1003',
    date: '2025-04-24',
    description: 'Salary Deposit',
    merchant: 'Northwind Technologies',
    category: 'Income',
    account: 'Current Account •••• 4827',
    amount: 2500,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-88177',
    method: 'Incoming transfer',
    risk: 'Low',
  },
  {
    id: 'tx-1004',
    date: '2025-04-23',
    description: 'Transfer to Ahmed',
    merchant: 'Ahmed Khan',
    category: 'Transfer',
    account: 'Current Account •••• 4827',
    amount: -350,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-88102',
    method: 'PAYBACK transfer',
    risk: 'Low',
  },
  {
    id: 'tx-1005',
    date: '2025-04-22',
    description: 'Netflix',
    merchant: 'Netflix Inc.',
    category: 'Entertainment',
    account: 'Current Account •••• 4827',
    amount: -15.99,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-88044',
    method: 'Card •••• 4287',
    risk: 'Low',
  },
  {
    id: 'tx-1006',
    date: '2025-04-22',
    description: 'Electricity Bill',
    merchant: 'Lahore Electric Supply',
    category: 'Bills & Utilities',
    account: 'Current Account •••• 4827',
    amount: -120,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-88021',
    method: 'Bill payment',
    risk: 'Low',
  },
  {
    id: 'tx-1007',
    date: '2025-04-21',
    description: 'Easypaisa Top-up',
    merchant: 'Ali Raza',
    category: 'Transfer',
    account: 'Current Account •••• 4827',
    amount: -200,
    currency: 'USD',
    status: 'Pending',
    reference: 'PB-TX-87988',
    method: 'Demo Transfer — Easypaisa',
    risk: 'Medium',
  },
  {
    id: 'tx-1008',
    date: '2025-04-20',
    description: 'International Transfer',
    merchant: 'Sarah Johnson',
    category: 'Transfer',
    account: 'Current Account •••• 4827',
    amount: -850,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-87900',
    method: 'SWIFT transfer',
    risk: 'Low',
  },
  {
    id: 'tx-1009',
    date: '2025-04-19',
    description: 'Uber',
    merchant: 'Uber Technologies',
    category: 'Transport',
    account: 'Current Account •••• 4827',
    amount: -23.4,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-87845',
    method: 'Card •••• 4287',
    risk: 'Low',
  },
  {
    id: 'tx-1010',
    date: '2025-04-18',
    description: 'Business Payments Ltd',
    merchant: 'Business Payments Ltd',
    category: 'Transfer',
    account: 'Business Account •••• 9281',
    amount: -2500,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-87790',
    method: 'Local bank transfer',
    risk: 'Low',
  },
  {
    id: 'tx-1011',
    date: '2025-04-17',
    description: 'Spotify',
    merchant: 'Spotify AB',
    category: 'Entertainment',
    account: 'Current Account •••• 4827',
    amount: -9.99,
    currency: 'USD',
    status: 'Failed',
    reference: 'PB-TX-87701',
    method: 'Card •••• 4287',
    note: 'Declined in the simulation — the virtual card had insufficient available limit.',
    risk: 'Low',
  },
  {
    id: 'tx-1012',
    date: '2025-04-16',
    description: 'Refund — Amazon',
    merchant: 'Amazon.com',
    category: 'Shopping',
    account: 'Current Account •••• 4827',
    amount: 42.5,
    currency: 'USD',
    status: 'Reversed',
    reference: 'PB-TX-87655',
    method: 'Card •••• 4287',
    risk: 'Low',
  },
  {
    id: 'tx-1013',
    date: '2025-04-15',
    description: 'JazzCash Transfer',
    merchant: 'Ahmed Khan',
    category: 'Transfer',
    account: 'Current Account •••• 4827',
    amount: -150,
    currency: 'USD',
    status: 'Cancelled',
    reference: 'PB-TX-87610',
    method: 'Demo Transfer — JazzCash',
    risk: 'Low',
  },
  {
    id: 'tx-1014',
    date: '2025-04-14',
    description: 'NayaPay Transfer',
    merchant: 'Sara Malik',
    category: 'Transfer',
    account: 'Current Account •••• 4827',
    amount: -75,
    currency: 'USD',
    status: 'Completed',
    reference: 'PB-TX-87522',
    method: 'Demo Transfer — NayaPay',
    risk: 'Low',
  },
];

export const spendingBreakdown = [
  { label: 'Food & Dining', value: 1024, pct: 30, color: '#10B981' },
  { label: 'Shopping', value: 856, pct: 25, color: '#38BDF8' },
  { label: 'Transport', value: 513, pct: 15, color: '#8B5CF6' },
  { label: 'Bills & Utilities', value: 427, pct: 12, color: '#F59E0B' },
  { label: 'Other', value: 600, pct: 18, color: '#CBD5E1' },
];

export const monthlyTrend = [
  { label: 'Dec', income: 4200, spending: 3100 },
  { label: 'Jan', income: 4650, spending: 3420 },
  { label: 'Feb', income: 4100, spending: 2980 },
  { label: 'Mar', income: 4850, spending: 3260 },
  { label: 'Apr', income: 4850, spending: 3420 },
  { label: 'May', income: 5200, spending: 3180 },
];

export const balanceHistory = [
  { label: '1 Apr', value: 9800 },
  { label: '5 Apr', value: 10420 },
  { label: '9 Apr', value: 9910 },
  { label: '13 Apr', value: 11240 },
  { label: '17 Apr', value: 10880 },
  { label: '21 Apr', value: 11960 },
  { label: '25 Apr', value: 12480 },
];

/* ------------------------------------------------------------------ */
/* Recipients & saved beneficiaries                                    */
/* ------------------------------------------------------------------ */

export const recipients: Recipient[] = [
  {
    id: 'rcp-1',
    name: 'Ali Raza',
    provider: 'Easypaisa',
    identifier: '0300 ••• 1122',
    favourite: true,
    verified: true,
    initialsColor: '#10B981',
  },
  {
    id: 'rcp-2',
    name: 'Ahmed Khan',
    provider: 'JazzCash',
    identifier: '0321 ••• 8841',
    favourite: true,
    verified: true,
    initialsColor: '#38BDF8',
  },
  {
    id: 'rcp-3',
    name: 'Sara Malik',
    provider: 'NayaPay',
    identifier: 'nayapay ••• 3390',
    favourite: true,
    verified: true,
    initialsColor: '#8B5CF6',
  },
  {
    id: 'rcp-4',
    name: 'Fatima Ali',
    provider: 'PAYBACK',
    identifier: 'PAYBACK ••• 7714',
    favourite: false,
    verified: true,
    initialsColor: '#F59E0B',
  },
  {
    id: 'rcp-5',
    name: 'Sarah Johnson',
    provider: 'International Bank',
    identifier: 'GB29 ••• 4021',
    favourite: false,
    verified: true,
    initialsColor: '#0EA5E9',
  },
  {
    id: 'rcp-6',
    name: 'Business Payments Ltd',
    provider: 'Local Bank Transfer',
    identifier: 'PK36 ••• 6702',
    favourite: false,
    verified: true,
    initialsColor: '#64748B',
  },
  {
    id: 'rcp-7',
    name: 'Hassan Iqbal',
    provider: 'UPaisa',
    identifier: '0345 ••• 2201',
    favourite: false,
    verified: false,
    initialsColor: '#14B8A6',
  },
];

export const quickRecipients = [
  { id: 'rcp-1', name: 'Ali Raza', provider: 'Easypaisa', initials: 'AR', note: 'Recent' },
  { id: 'rcp-2', name: 'Ahmed Khan', provider: 'JazzCash', initials: 'AK', note: 'Recent' },
  { id: 'rcp-3', name: 'Sara Malik', provider: 'NayaPay', initials: 'SM', note: 'Recent' },
  { id: 'rcp-4', name: 'Fatima Ali', provider: 'PAYBACK', initials: 'FA', note: 'Recent' },
];

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export const cards: Card[] = [
  {
    id: 'card-1',
    label: 'PAYBACK Platinum Debit',
    scheme: 'VISA',
    type: 'Debit',
    last4: '4287',
    expiry: '09/28',
    status: 'Active',
    limit: 5000,
    spent: 1840,
    currency: 'USD',
    online: true,
    international: true,
    contactless: true,
    atm: true,
    gradient: 'linear-gradient(135deg, #0F172A 0%, #14304a 55%, #0b6b52 100%)',
    isDefault: true,
  },
  {
    id: 'card-2',
    label: 'PAYBACK Virtual',
    scheme: 'Mastercard',
    type: 'Virtual',
    last4: '7942',
    expiry: '04/27',
    status: 'Active',
    limit: 1500,
    spent: 320,
    currency: 'USD',
    online: true,
    international: false,
    contactless: false,
    atm: false,
    gradient: 'linear-gradient(135deg, #1E293B 0%, #334155 60%, #0f766e 100%)',
  },
  {
    id: 'card-3',
    label: 'PAYBACK Business Credit',
    scheme: 'VISA',
    type: 'Business',
    last4: '5510',
    expiry: '11/29',
    status: 'Frozen',
    limit: 20000,
    spent: 6450,
    currency: 'USD',
    online: true,
    international: true,
    contactless: true,
    atm: true,
    gradient: 'linear-gradient(135deg, #0f766e 0%, #10B981 60%, #38BDF8 130%)',
  },
];

/* ------------------------------------------------------------------ */
/* Bills                                                               */
/* ------------------------------------------------------------------ */

export const bills: Bill[] = [
  { id: 'bill-1', biller: 'Electricity', category: 'Utilities', amount: 120, due: '2025-04-28', autopay: true, status: 'Due', icon: 'zap' },
  { id: 'bill-2', biller: 'Internet', category: 'Utilities', amount: 65, due: '2025-04-30', autopay: true, status: 'Due', icon: 'wifi' },
  { id: 'bill-3', biller: 'Mobile Phone', category: 'Telecom', amount: 45, due: '2025-05-02', autopay: false, status: 'Due', icon: 'smartphone' },
  { id: 'bill-4', biller: 'Gas', category: 'Utilities', amount: 38, due: '2025-05-06', autopay: false, status: 'Scheduled', icon: 'flame' },
  { id: 'bill-5', biller: 'School Fees', category: 'Education', amount: 320, due: '2025-05-10', autopay: false, status: 'Due', icon: 'graduation-cap' },
  { id: 'bill-6', biller: 'Streaming Bundle', category: 'Subscriptions', amount: 15.99, due: '2025-04-12', autopay: true, status: 'Paid', icon: 'tv' },
  { id: 'bill-7', biller: 'Health Insurance', category: 'Insurance', amount: 210, due: '2025-04-05', autopay: true, status: 'Paid', icon: 'shield-plus' },
  { id: 'bill-8', biller: 'Water', category: 'Utilities', amount: 22, due: '2025-04-01', autopay: false, status: 'Overdue', icon: 'droplets' },
];

export const billCategories = [
  { name: 'Electricity', icon: 'zap' },
  { name: 'Gas', icon: 'flame' },
  { name: 'Water', icon: 'droplets' },
  { name: 'Internet', icon: 'wifi' },
  { name: 'Mobile', icon: 'smartphone' },
  { name: 'Education', icon: 'graduation-cap' },
  { name: 'Government', icon: 'landmark' },
  { name: 'Credit Cards', icon: 'credit-card' },
  { name: 'Insurance', icon: 'shield-plus' },
  { name: 'Subscriptions', icon: 'tv' },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const notifications: Notification[] = [
  { id: 'n-1', title: 'New device signed in', body: 'Chrome on Windows was used to sign in from Lahore, PK. If this was not you, secure your account.', category: 'Security', time: '2 hours ago', read: false },
  { id: 'n-2', title: 'Transfer completed', body: 'Your transfer of $350.00 to Ahmed Khan was completed.', category: 'Transfers', time: 'Yesterday', read: false },
  { id: 'n-3', title: 'Salary received', body: 'You received $2,500.00 from Northwind Technologies.', category: 'Transactions', time: 'Apr 24, 2025', read: false },
  { id: 'n-4', title: 'Electricity bill due', body: 'Your electricity bill of $120.00 is due on Apr 28, 2025.', category: 'Transactions', time: 'Apr 24, 2025', read: true },
  { id: 'n-5', title: 'You earned 1,240 points', body: 'Rewards points from your recent card spend have been added.', category: 'Rewards', time: 'Apr 23, 2025', read: true },
  { id: 'n-6', title: 'Spring travel offers', body: 'Save up to 15% on selected hotel bookings with PAYBACK Rewards.', category: 'Promotions', time: 'Apr 21, 2025', read: true },
  { id: 'n-7', title: 'Scheduled maintenance', body: 'International transfers may be briefly unavailable on May 2, 02:00–03:00 PKT.', category: 'System', time: 'Apr 20, 2025', read: true },
  { id: 'n-8', title: 'Card frozen', body: 'You froze PAYBACK Business Credit •••• 5510.', category: 'Security', time: 'Apr 18, 2025', read: true },
];

/* ------------------------------------------------------------------ */
/* Rewards                                                             */
/* ------------------------------------------------------------------ */

export const rewardsSummary = {
  points: 24850,
  tier: 'Gold',
  nextTierPoints: 30000,
  expiringPoints: 1200,
  expiringOn: 'Jun 30, 2025',
  cashValue: '≈ $248.50',
};

export const rewardOffers: RewardOffer[] = [
  { id: 'o-1', title: '15% off hotel stays', partner: 'Global Stays', category: 'Hotels', points: 5000, cash: '$75', expiry: 'May 31, 2025', tone: '#10B981' },
  { id: 'o-2', title: '$50 flight voucher', partner: 'SkyLink Air', category: 'Travel', points: 8000, cash: '$50', expiry: 'Jun 15, 2025', tone: '#38BDF8' },
  { id: 'o-3', title: 'Dining cashback', partner: 'Local Eats', category: 'Dining', points: 3000, cash: '$30', expiry: 'May 20, 2025', tone: '#F59E0B' },
  { id: 'o-4', title: 'Electronics discount', partner: 'TechWorld', category: 'Electronics', points: 6000, cash: '$60', expiry: 'Jul 01, 2025', tone: '#8B5CF6' },
  { id: 'o-5', title: 'Lifestyle voucher', partner: 'Urban Living', category: 'Lifestyle', points: 4000, cash: '$40', expiry: 'Jun 05, 2025', tone: '#14B8A6' },
  { id: 'o-6', title: 'Shopping weekend', partner: 'Mega Mall', category: 'Shopping', points: 2500, cash: '$25', expiry: 'May 12, 2025', tone: '#0EA5E9' },
];

export const redemptionHistory = [
  { id: 'r-1', item: 'Amazon voucher', points: -4000, date: 'Apr 10, 2025', status: 'Completed' },
  { id: 'r-2', item: 'Coffee reward', points: -800, date: 'Mar 28, 2025', status: 'Completed' },
  { id: 'r-3', item: 'Flight voucher', points: -8000, date: 'Mar 02, 2025', status: 'Completed' },
  { id: 'r-4', item: 'Points earned — card spend', points: 1240, date: 'Apr 23, 2025', status: 'Completed' },
];

/* ------------------------------------------------------------------ */
/* Exchange rates                                                      */
/* ------------------------------------------------------------------ */

export const exchangeRates: ExchangeRate[] = [
  { pair: 'USD / PKR', code: 'USD', flag: '🇺🇸', buy: 277.5, sell: 278.4, change: 0.12, updated: 'Apr 25, 2025 • 9:40 AM' },
  { pair: 'EUR / PKR', code: 'EUR', flag: '🇪🇺', buy: 298.3, sell: 299.6, change: 0.08, updated: 'Apr 25, 2025 • 9:40 AM' },
  { pair: 'GBP / PKR', code: 'GBP', flag: '🇬🇧', buy: 352.4, sell: 353.9, change: 0.15, updated: 'Apr 25, 2025 • 9:40 AM' },
  { pair: 'AED / PKR', code: 'AED', flag: '🇦🇪', buy: 75.6, sell: 76.1, change: 0.1, updated: 'Apr 25, 2025 • 9:40 AM' },
  { pair: 'SAR / PKR', code: 'SAR', flag: '🇸🇦', buy: 73.9, sell: 74.5, change: -0.05, updated: 'Apr 25, 2025 • 9:40 AM' },
  { pair: 'USD / EUR', code: 'EUR', flag: '🇪🇺', buy: 0.92, sell: 0.94, change: 0.02, updated: 'Apr 25, 2025 • 9:40 AM' },
];

export const rateHistory = [
  { label: 'Apr 1', value: 276.1 },
  { label: 'Apr 6', value: 276.8 },
  { label: 'Apr 11', value: 277.2 },
  { label: 'Apr 16', value: 276.9 },
  { label: 'Apr 21', value: 277.4 },
  { label: 'Apr 25', value: 277.5 },
];

/* ------------------------------------------------------------------ */
/* Transfers                                                           */
/* ------------------------------------------------------------------ */

export const recentTransfers: TransferRecord[] = [
  { id: 'tr-1', date: '2025-04-24', recipient: 'Ahmed Khan', provider: 'Within PAYBACK', amount: -250, currency: 'USD', status: 'Completed', reference: 'PB-TR-44120' },
  { id: 'tr-2', date: '2025-04-22', recipient: 'Fatima Ali', provider: 'Local Bank Transfer', amount: -1200, currency: 'USD', status: 'Completed', reference: 'PB-TR-44018' },
  { id: 'tr-3', date: '2025-04-20', recipient: 'Sarah Johnson', provider: 'International Transfer', amount: -850, currency: 'USD', status: 'Pending', reference: 'PB-TR-43905' },
  { id: 'tr-4', date: '2025-04-18', recipient: 'Business Payments Ltd', provider: 'Local Bank Transfer', amount: -2500, currency: 'USD', status: 'Completed', reference: 'PB-TR-43771' },
  { id: 'tr-5', date: '2025-04-15', recipient: 'Ali Raza', provider: 'Easypaisa', amount: -200, currency: 'USD', status: 'Failed', reference: 'PB-TR-43610' },
  { id: 'tr-6', date: '2025-04-14', recipient: 'Sara Malik', provider: 'NayaPay', amount: -75, currency: 'USD', status: 'Completed', reference: 'PB-TR-43522' },
];

export const transferLimits = [
  { label: 'Daily Transfer Limit', used: 5000, max: 10000 },
  { label: 'Monthly Transfer Limit', used: 15000, max: 50000 },
  { label: 'International Transfer Limit', used: 10000, max: 50000 },
];

/* ------------------------------------------------------------------ */
/* Security                                                            */
/* ------------------------------------------------------------------ */

export const securitySessions = [
  { id: 's-1', device: 'Chrome on Windows 11', location: 'Lahore, PK (approx.)', lastActive: 'Active now', current: true, ip: '203.0.113.•••' },
  { id: 's-2', device: 'PAYBACK Mobile — iPhone 15', location: 'Lahore, PK (approx.)', lastActive: '2 hours ago', current: false, ip: '203.0.113.•••' },
  { id: 's-3', device: 'Safari on macOS', location: 'Karachi, PK (approx.)', lastActive: 'Apr 21, 2025', current: false, ip: '198.51.100.•••' },
];

export const loginActivity = [
  { id: 'l-1', action: 'Successful sign-in', device: 'Chrome on Windows 11', time: 'Apr 25, 2025 • 9:42 AM', location: 'Lahore, PK', result: 'Success' },
  { id: 'l-2', action: 'Two-factor verification', device: 'PAYBACK Mobile', time: 'Apr 25, 2025 • 9:42 AM', location: 'Lahore, PK', result: 'Success' },
  { id: 'l-3', action: 'Failed sign-in attempt', device: 'Unknown browser', time: 'Apr 22, 2025 • 11:08 PM', location: 'Unrecognised', result: 'Blocked' },
  { id: 'l-4', action: 'Successful sign-in', device: 'Safari on macOS', time: 'Apr 21, 2025 • 4:15 PM', location: 'Karachi, PK', result: 'Success' },
];

export const securityAlerts = [
  { id: 'a-1', title: 'Unusual sign-in attempt blocked', level: 'Resolved', time: 'Apr 22, 2025', detail: 'A sign-in attempt from an unrecognised device was blocked automatically.' },
  { id: 'a-2', title: 'Card frozen by you', level: 'Resolved', time: 'Apr 18, 2025', detail: 'Business Credit •••• 5510 was frozen and can be unfrozen at any time.' },
  { id: 'a-3', title: 'International payments enabled', level: 'Review', time: 'Apr 10, 2025', detail: 'International card payments were enabled on your Platinum Debit card.' },
];

export const securityScore = {
  score: 86,
  label: 'Strong',
  checks: [
    { label: 'Two-factor authentication', done: true },
    { label: 'Biometric sign-in', done: true },
    { label: 'Trusted devices reviewed', done: true },
    { label: 'Transaction alerts enabled', done: true },
    { label: 'Recovery email verified', done: false },
    { label: 'Card controls configured', done: true },
  ],
};
