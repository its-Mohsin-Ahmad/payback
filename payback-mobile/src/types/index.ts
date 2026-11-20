export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  accountTier: 'Standard' | 'Premium Elite' | 'Business';
  isBiometricEnabled: boolean;
  memberSince: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  currency: string;
  currencySymbol: string;
  isBalanceHidden: boolean;
  status: 'active' | 'frozen' | 'restricted';
}

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 'transfer' | 'bill' | 'shopping' | 'salary' | 'deposit' | 'topup';

export interface Transaction {
  id: string;
  title: string;
  counterparty: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId: string;
  fee: number;
  note?: string;
}

export interface VirtualCard {
  id: string;
  cardholderName: string;
  cardNumberMasked: string;
  cardNumberFull: string;
  expiryDate: string;
  cvv: string;
  cardBrand: 'VISA' | 'MasterCard';
  cardType: 'Debit' | 'Credit';
  isFrozen: boolean;
  dailyLimit: number;
  currentSpend: number;
  internationalPayments: boolean;
  onlinePayments: boolean;
  atmWithdrawals: boolean;
}

export interface BillCategory {
  id: string;
  name: string;
  iconName: 'zap' | 'droplet' | 'wifi' | 'flame' | 'phone' | 'more-horizontal';
  color: string;
}

export interface BillItem {
  id: string;
  categoryId: string;
  providerName: string;
  consumerNumber: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'transaction' | 'security' | 'promo' | 'system';
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
