/**
 * PAYBACK — demo product / provider catalogue.
 * All figures are synthetic illustrations, not real offers, rates or tariffs.
 */

export interface Provider {
  id: string;
  name: string;
  short: string;
  tagline: string;
  color: string;
  fee: string;
  eta: string;
  logo: string;
}

export const PROVIDERS: Provider[] = [
  { id: 'payback', name: 'PAYBACK Transfer', short: 'PAYBACK', tagline: 'Instant between PAYBACK accounts', color: '#10B981', fee: 'Free', eta: 'Instant', logo: 'PB' },
  { id: 'bank', name: 'Bank Transfer', short: 'Bank', tagline: 'Local bank accounts via IBAN', color: '#0F172A', fee: 'Free', eta: 'Within 24 hours', logo: 'BK' },
  { id: 'easypaisa', name: 'Easypaisa', short: 'Easypaisa', tagline: 'Mobile wallet transfer', color: '#16A34A', fee: 'Demo', eta: 'Demo Transfer', logo: 'EP' },
  { id: 'jazzcash', name: 'JazzCash', short: 'JazzCash', tagline: 'Mobile wallet transfer', color: '#DC2626', fee: 'Demo', eta: 'Demo Transfer', logo: 'JC' },
  { id: 'upaisa', name: 'UPaisa', short: 'UPaisa', tagline: 'Mobile wallet transfer', color: '#F97316', fee: 'Demo', eta: 'Demo Transfer', logo: 'UP' },
  { id: 'nayapay', name: 'NayaPay', short: 'NayaPay', tagline: 'Digital wallet transfer', color: '#7C3AED', fee: 'Demo', eta: 'Demo Transfer', logo: 'NP' },
  { id: 'swift', name: 'International Transfer', short: 'SWIFT', tagline: 'Cross-border wire transfer', color: '#0EA5E9', fee: 'From $12.00', eta: '1–3 business days', logo: 'SW' },
  { id: 'paypal', name: 'PayPal', short: 'PayPal', tagline: 'Send to a PayPal account', color: '#1D4ED8', fee: 'Integration Required', eta: 'Not connected', logo: 'PP' },
  { id: 'other', name: 'Other Provider', short: 'Other', tagline: 'Any other supported rail', color: '#64748B', fee: 'Varies', eta: 'Varies', logo: 'OT' },
];

export const transferMethods = [
  { id: 'payback', label: 'PAYBACK', detail: 'Instant • Free', icon: 'zap', badge: 'Instant' },
  { id: 'bank', label: 'Bank', detail: 'IBAN / Account', icon: 'landmark', badge: null },
  { id: 'easypaisa', label: 'Easypaisa', detail: 'Demo Transfer', icon: 'smartphone', badge: 'Demo' },
  { id: 'jazzcash', label: 'JazzCash', detail: 'Demo Transfer', icon: 'smartphone', badge: 'Demo' },
  { id: 'upaisa', label: 'UPaisa', detail: 'Demo Transfer', icon: 'smartphone', badge: 'Demo' },
  { id: 'nayapay', label: 'NayaPay', detail: 'Demo Transfer', icon: 'smartphone', badge: 'Demo' },
  { id: 'swift', label: 'International', detail: '1–3 business days', icon: 'globe', badge: null },
  { id: 'qr', label: 'QR / Request', detail: 'Scan or request money', icon: 'qr-code', badge: 'New' },
];

/* ------------------------------------------------------------------ */
/* Loans                                                               */
/* ------------------------------------------------------------------ */

export interface Loan {
  id: string;
  name: string;
  amount: number;
  outstanding: number;
  installment: number;
  paid: number;
  total: number;
  nextDue: string;
  status: 'Active' | 'Closed' | 'Processing' | 'Overdue';
  rate: string;
  tenure: string;
}

export const loans: Loan[] = [
  { id: 'loan-1', name: 'Personal Loan', amount: 15000, outstanding: 8200, installment: 420, paid: 16, total: 24, nextDue: 'May 05, 2025', status: 'Active', rate: 'Illustrative 14.5% p.a.', tenure: '24 months' },
  { id: 'loan-2', name: 'Auto Loan', amount: 28000, outstanding: 19400, installment: 690, paid: 22, total: 48, nextDue: 'May 12, 2025', status: 'Active', rate: 'Illustrative 11.2% p.a.', tenure: '48 months' },
  { id: 'loan-3', name: 'Home Finance', amount: 90000, outstanding: 72450, installment: 940, paid: 30, total: 120, nextDue: 'Jun 01, 2025', status: 'Active', rate: 'Illustrative 9.4% p.a.', tenure: '120 months' },
];

export const loanProducts = [
  { id: 'lp-1', name: 'Personal Loan', range: 'Up to $50,000', tenor: '12–60 months', rate: 'from 13.9%', tone: '#10B981', icon: 'wallet' },
  { id: 'lp-2', name: 'Auto Finance', range: 'Up to $120,000', tenor: '12–84 months', rate: 'from 10.5%', tone: '#38BDF8', icon: 'car' },
  { id: 'lp-3', name: 'Home Finance', range: 'Up to $500,000', tenor: '3–25 years', rate: 'from 9.1%', tone: '#8B5CF6', icon: 'home' },
  { id: 'lp-4', name: 'Business Loan', range: 'Up to $250,000', tenor: '6–60 months', rate: 'from 12.4%', tone: '#F59E0B', icon: 'briefcase' },
  { id: 'lp-5', name: 'Education Loan', range: 'Up to $80,000', tenor: '12–96 months', rate: 'from 8.8%', tone: '#14B8A6', icon: 'graduation-cap' },
  { id: 'lp-6', name: 'Islamic Finance', range: 'Shariah-compliant', tenor: 'Flexible', rate: 'Profit share', tone: '#0EA5E9', icon: 'moon' },
];

/* ------------------------------------------------------------------ */
/* Investments                                                         */
/* ------------------------------------------------------------------ */

export interface Investment {
  id: string;
  name: string;
  type: string;
  invested: number;
  value: number;
  changePct: number;
  risk: 'Low' | 'Medium' | 'High';
  horizon: string;
  liquidity: string;
  sparkline: number[];
}

export const investments: Investment[] = [
  { id: 'inv-1', name: 'PAYBACK Growth Fund', type: 'Mutual Fund', invested: 5000, value: 5840, changePct: 16.8, risk: 'Medium', horizon: '3–5 years', liquidity: 'T+2 settlement', sparkline: [10, 12, 11, 14, 16, 18, 22] },
  { id: 'inv-2', name: 'Government Bonds', type: 'Fixed Income', invested: 8000, value: 8460, changePct: 5.75, risk: 'Low', horizon: '2–3 years', liquidity: 'Limited', sparkline: [10, 10.3, 10.6, 11, 11.4, 11.8, 12.1] },
  { id: 'inv-3', name: 'Tech Equity Basket', type: 'Equities', invested: 4200, value: 3980, changePct: -5.24, risk: 'High', horizon: '5+ years', liquidity: 'T+2 settlement', sparkline: [12, 13, 11, 10.4, 9.8, 9.2, 9.5] },
  { id: 'inv-4', name: 'Money Market Fund', type: 'Cash Management', invested: 3000, value: 3180, changePct: 6.0, risk: 'Low', horizon: '0–12 months', liquidity: 'Same day', sparkline: [10, 10.2, 10.4, 10.6, 10.8, 11.5, 12] },
  { id: 'inv-5', name: 'Islamic Sukuk', type: 'Shariah-compliant', invested: 2500, value: 2665, changePct: 6.6, risk: 'Medium', horizon: '2–4 years', liquidity: 'Limited', sparkline: [10, 10.4, 10.3, 10.8, 11.2, 11.6, 12.2] },
];

export const investmentProducts = [
  { id: 'ip-1', name: 'Savings Certificates', rate: 'Up to 8.5% p.a.', risk: 'Low', term: '1–5 years', tone: '#10B981' },
  { id: 'ip-2', name: 'Mutual Funds', rate: 'Market-linked', risk: 'Medium', term: 'Open-ended', tone: '#38BDF8' },
  { id: 'ip-3', name: 'Government Bonds', rate: 'Up to 7.2% p.a.', risk: 'Low', term: '2–10 years', tone: '#8B5CF6' },
  { id: 'ip-4', name: 'Shariah-compliant Plans', rate: 'Profit share', risk: 'Low–Medium', term: '1–5 years', tone: '#14B8A6' },
  { id: 'ip-5', name: 'Retirement Plan', rate: 'Compounding', risk: 'Medium', term: '10+ years', tone: '#F59E0B' },
  { id: 'ip-6', name: 'Gold Savings', rate: 'Commodity-linked', risk: 'Medium–High', term: 'Open-ended', tone: '#0EA5E9' },
];

/* ------------------------------------------------------------------ */
/* Insurance                                                           */
/* ------------------------------------------------------------------ */

export const insuranceProducts = [
  { id: 'ins-1', name: 'Life & Family', cover: 'Up to $250,000', premium: 'from $18/mo', tone: '#10B981', icon: 'heart-pulse' },
  { id: 'ins-2', name: 'Health Plus', cover: 'Up to $80,000', premium: 'from $26/mo', tone: '#38BDF8', icon: 'shield-plus' },
  { id: 'ins-3', name: 'Motor Insurance', cover: 'Vehicle value', premium: 'from $22/mo', tone: '#8B5CF6', icon: 'car' },
  { id: 'ins-4', name: 'Travel Cover', cover: 'Up to $50,000', premium: 'from $9/trip', tone: '#F59E0B', icon: 'plane' },
  { id: 'ins-5', name: 'Home & Contents', cover: 'Up to $120,000', premium: 'from $14/mo', tone: '#14B8A6', icon: 'home' },
  { id: 'ins-6', name: 'Device Protection', cover: 'Up to $2,500', premium: 'from $4/mo', tone: '#0EA5E9', icon: 'smartphone' },
];

/* ------------------------------------------------------------------ */
/* Branches & ATMs (approximate demo locations)                        */
/* ------------------------------------------------------------------ */

export const branches = [
  { id: 'b-1', name: 'PAYBACK Gulberg Branch', address: 'Main Boulevard, Gulberg III, Lahore', city: 'Lahore', hours: '09:00 – 17:00', phone: '+92 42 ••• 1120', open: true },
  { id: 'b-2', name: 'PAYBACK DHA Phase 5', address: 'Commercial Area, DHA Phase 5, Lahore', city: 'Lahore', hours: '09:00 – 17:00', phone: '+92 42 ••• 3391', open: true },
  { id: 'b-3', name: 'PAYBACK Clifton', address: 'Block 5, Clifton, Karachi', city: 'Karachi', hours: '09:00 – 17:00', phone: '+92 21 ••• 7788', open: false },
  { id: 'b-4', name: 'PAYBACK Blue Area', address: 'Jinnah Avenue, Blue Area, Islamabad', city: 'Islamabad', hours: '09:00 – 17:00', phone: '+92 51 ••• 4402', open: true },
];

export const atms = [
  { id: 'atm-1', name: 'Gulberg ATM', address: 'Main Boulevard, Lahore', distance: '0.4 km', type: 'Cash • Deposit', status: 'Available' },
  { id: 'atm-2', name: 'Liberty Market ATM', address: 'Liberty Roundabout, Lahore', distance: '1.2 km', type: 'Cash only', status: 'Available' },
  { id: 'atm-3', name: 'MM Alam Road ATM', address: 'MM Alam Road, Lahore', distance: '1.9 km', type: 'Cash • Deposit', status: 'Limited' },
  { id: 'atm-4', name: 'DHA Phase 3 ATM', address: 'Y-Block, DHA, Lahore', distance: '3.1 km', type: 'Cash only', status: 'Available' },
];

/* ------------------------------------------------------------------ */
/* Support                                                             */
/* ------------------------------------------------------------------ */

export const supportFaqs = [
  { q: 'How long does a money transfer take?', a: 'Transfers within PAYBACK are instant. Local bank transfers usually settle within 24 hours, while international transfers typically take 1–3 business days depending on the destination bank.' },
  { q: 'Is this app connected to real banking rails?', a: 'No. This is a demonstration prototype. Balances, cards, transfers and provider logos are simulated and clearly labelled as Demo or Integration Required. No real money moves.' },
  { q: 'What are the transfer limits?', a: 'Limits depend on your account tier and the rail you choose. You can review your current daily, monthly and international limits under Transfer Limits in your profile.' },
  { q: 'How do I secure my account?', a: 'Enable two-factor authentication and biometric sign-in, review your trusted devices regularly, and keep transaction alerts on. Your Security Centre shows a personalised security score.' },
  { q: 'What if a transfer fails?', a: 'Failed transfers return to your account. Open the transaction, review the reason shown in the timeline, and retry or contact support if the issue continues.' },
  { q: 'How do I report a fraudulent transaction?', a: 'Open the transaction, choose Report a problem, and select the reason. You can also freeze the related card instantly from Card Controls.' },
];

export const supportChannels = [
  { id: 'c-1', name: 'Live Chat', detail: 'Average reply under 2 minutes', icon: 'message-circle', tone: '#10B981', action: 'Start chat' },
  { id: 'c-2', name: 'Call Support', detail: '24/7 helpline • +92 21 ••• 0100', icon: 'phone', tone: '#38BDF8', action: 'Request callback' },
  { id: 'c-3', name: 'Email Us', detail: 'help@payback.example • replies in 24h', icon: 'mail', tone: '#8B5CF6', action: 'Compose email' },
  { id: 'c-4', name: 'Submit a Ticket', detail: 'Track a complaint end to end', icon: 'ticket', tone: '#F59E0B', action: 'Create ticket' },
];

export const supportTickets = [
  { id: 'TK-4821', subject: 'Card not working at ATM', category: 'Cards', status: 'In progress', updated: 'Apr 24, 2025', priority: 'High' },
  { id: 'TK-4710', subject: 'International transfer delayed', category: 'Transfers', status: 'Awaiting info', updated: 'Apr 21, 2025', priority: 'Medium' },
  { id: 'TK-4655', subject: 'Statement request for March', category: 'Accounts', status: 'Resolved', updated: 'Apr 12, 2025', priority: 'Low' },
];