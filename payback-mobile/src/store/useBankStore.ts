import { create } from 'zustand';
import { BankAccount, Transaction, VirtualCard, BillItem, NotificationItem } from '../types';

interface BankState {
  account: BankAccount;
  card: VirtualCard;
  transactions: Transaction[];
  bills: BillItem[];
  notifications: NotificationItem[];
  
  // Actions
  toggleHideBalance: () => void;
  toggleFreezeCard: () => void;
  updateCardLimit: (newLimit: number) => void;
  updateCardPin: (newPin: string) => boolean;
  
  sendMoney: (params: {
    recipientName: string;
    accountNumber: string;
    amount: number;
    note?: string;
  }) => { success: boolean; message: string; transactionId?: string };
  
  payBill: (billId: string) => { success: boolean; message: string };
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useBankStore = create<BankState>((set, get) => ({
  account: {
    id: 'acc_01',
    accountNumber: 'PK82PAYB0001928471928',
    maskedNumber: 'PK82••••••••1928',
    balance: 125750.00,
    currency: 'PKR',
    currencySymbol: 'PKR',
    isBalanceHidden: false,
    status: 'active',
  },
  
  card: {
    id: 'crd_payback_01',
    cardholderName: 'MOHSIN AHMAD',
    cardNumberMasked: '•••• •••• •••• 1234',
    cardNumberFull: '4532 8920 1829 1234',
    expiryDate: '08/29',
    cvv: '842',
    cardBrand: 'VISA',
    cardType: 'Debit',
    isFrozen: false,
    dailyLimit: 250000,
    currentSpend: 42500,
    internationalPayments: true,
    onlinePayments: true,
    atmWithdrawals: true,
  },
  
  transactions: [
    {
      id: 'tx_01',
      title: 'Money Received',
      counterparty: 'Syed Enterprise Corp',
      amount: 25000,
      type: 'credit',
      category: 'transfer',
      date: 'Today',
      time: '10:24 AM',
      status: 'completed',
      referenceId: 'PAYB-TX-984210',
      fee: 0,
      note: 'Freelance Design Milestone',
    },
    {
      id: 'tx_02',
      title: 'Bill Payment',
      counterparty: 'LESCO Electricity Board',
      amount: 5500,
      type: 'debit',
      category: 'bill',
      date: 'Yesterday',
      time: '6:30 PM',
      status: 'completed',
      referenceId: 'PAYB-TX-984209',
      fee: 15,
      note: 'Residential electricity bill',
    },
    {
      id: 'tx_03',
      title: 'Salary Deposit',
      counterparty: 'Fintech Technologies Ltd',
      amount: 180000,
      type: 'credit',
      category: 'salary',
      date: '15 Nov 2025',
      time: '09:00 AM',
      status: 'completed',
      referenceId: 'PAYB-TX-984185',
      fee: 0,
      note: 'Monthly salary credit',
    },
    {
      id: 'tx_04',
      title: 'Transfer to Ali Khan',
      counterparty: 'Ali Khan (HBL)',
      amount: 12000,
      type: 'debit',
      category: 'transfer',
      date: '12 Nov 2025',
      time: '02:15 PM',
      status: 'completed',
      referenceId: 'PAYB-TX-984112',
      fee: 0,
      note: 'Dinner & groceries share',
    },
    {
      id: 'tx_05',
      title: 'Netflix Subscription',
      counterparty: 'Netflix International',
      amount: 1500,
      type: 'debit',
      category: 'shopping',
      date: '08 Nov 2025',
      time: '11:45 PM',
      status: 'completed',
      referenceId: 'PAYB-TX-983990',
      fee: 45,
      note: 'Premium 4K monthly',
    },
  ],
  
  bills: [
    {
      id: 'bill_01',
      categoryId: 'electricity',
      providerName: 'Electricity Bill',
      consumerNumber: '04-129481-9120',
      amount: 4500,
      dueDate: 'Nov 15, 2025',
      status: 'unpaid',
      icon: 'zap',
    },
    {
      id: 'bill_02',
      categoryId: 'water',
      providerName: 'WASA Water Supply',
      consumerNumber: 'WS-8849-10',
      amount: 1250,
      dueDate: 'Nov 20, 2025',
      status: 'unpaid',
      icon: 'droplet',
    },
    {
      id: 'bill_03',
      categoryId: 'internet',
      providerName: 'PTCL Flash Fiber 100Mbps',
      consumerNumber: '042-35891240',
      amount: 3850,
      dueDate: 'Nov 22, 2025',
      status: 'unpaid',
      icon: 'wifi',
    },
    {
      id: 'bill_04',
      categoryId: 'gas',
      providerName: 'SNGPL Gas Utility',
      consumerNumber: '839210-4819',
      amount: 2100,
      dueDate: 'Nov 25, 2025',
      status: 'unpaid',
      icon: 'flame',
    },
  ],
  
  notifications: [
    {
      id: 'notif_01',
      title: 'Payment Received',
      description: 'You received PKR 25,000 from Syed Enterprise Corp.',
      timestamp: '10:24 AM',
      isRead: false,
      type: 'transaction',
    },
    {
      id: 'notif_02',
      title: 'Bill Paid Successfully',
      description: 'PKR 5,500 has been paid to LESCO Electricity.',
      timestamp: 'Yesterday',
      isRead: true,
      type: 'transaction',
    },
    {
      id: 'notif_03',
      title: 'Security Alert: Biometric Verified',
      description: 'Fingerprint sign-in was used on your Galaxy device.',
      timestamp: '2 days ago',
      isRead: true,
      type: 'security',
    },
  ],
  
  toggleHideBalance: () => {
    set(state => ({
      account: { ...state.account, isBalanceHidden: !state.account.isBalanceHidden }
    }));
  },
  
  toggleFreezeCard: () => {
    set(state => ({
      card: { ...state.card, isFrozen: !state.card.isFrozen }
    }));
  },
  
  updateCardLimit: (newLimit: number) => {
    set(state => ({
      card: { ...state.card, dailyLimit: newLimit }
    }));
  },
  
  updateCardPin: (newPin: string) => {
    if (newPin.length === 4) {
      return true;
    }
    return false;
  },
  
  sendMoney: ({ recipientName, accountNumber, amount, note }) => {
    const currentBalance = get().account.balance;
    if (amount <= 0) {
      return { success: false, message: 'Please enter a valid transfer amount.' };
    }
    if (amount > currentBalance) {
      return { success: false, message: 'Insufficient balance for this transfer.' };
    }
    
    const newTxId = `PAYB-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Transfer to ${recipientName}`,
      counterparty: `${recipientName} (${accountNumber})`,
      amount,
      type: 'debit',
      category: 'transfer',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: newTxId,
      fee: 0,
      note: note || 'Instant Transfer',
    };
    
    set(state => ({
      account: { ...state.account, balance: state.account.balance - amount },
      transactions: [newTx, ...state.transactions],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'Money Sent Successfully',
          description: `PKR ${amount.toLocaleString()} sent to ${recipientName}.`,
          timestamp: 'Just now',
          isRead: false,
          type: 'transaction',
        },
        ...state.notifications
      ]
    }));
    
    return { success: true, message: 'Transfer successful!', transactionId: newTxId };
  },
  
  payBill: (billId: string) => {
    const bill = get().bills.find(b => b.id === billId);
    if (!bill) {
      return { success: false, message: 'Bill not found.' };
    }
    if (bill.amount > get().account.balance) {
      return { success: false, message: 'Insufficient funds to pay bill.' };
    }
    
    const txId = `PAYB-BILL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title: `Bill Payment`,
      counterparty: bill.providerName,
      amount: bill.amount,
      type: 'debit',
      category: 'bill',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceId: txId,
      fee: 0,
      note: `Consumer: ${bill.consumerNumber}`,
    };
    
    set(state => ({
      account: { ...state.account, balance: state.account.balance - bill.amount },
      bills: state.bills.map(b => b.id === billId ? { ...b, status: 'paid' } : b),
      transactions: [newTx, ...state.transactions],
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'Bill Paid',
          description: `PKR ${bill.amount.toLocaleString()} paid for ${bill.providerName}.`,
          timestamp: 'Just now',
          isRead: false,
          type: 'transaction',
        },
        ...state.notifications
      ]
    }));
    
    return { success: true, message: 'Bill paid successfully!' };
  },
  
  markNotificationAsRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  },
  
  clearAllNotifications: () => {
    set({ notifications: [] });
  }
}));
