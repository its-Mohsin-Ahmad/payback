import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { AccountCard } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  DemoBanner,
  PageHeader,
  SegmentedControl,
  StatCard,
  useToast,
} from '@/components/ui';
import { PageWrap } from '@/components/blocks';
import { accounts } from '@/data/mock';
import { money } from '@/lib/utils';

type Filter = 'all' | 'Current' | 'Savings' | 'Business' | 'Other';

export default function AccountsPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>('all');

  const usdTotal = accounts.filter((a) => a.currency === 'USD').reduce((sum, a) => sum + a.balance, 0);
  const eurAccounts = accounts.filter((a) => a.currency === 'EUR');
  const eurTotal = eurAccounts.reduce((sum, a) => sum + a.balance, 0);
  const available = accounts.reduce((sum, a) => sum + (a.currency === 'USD' ? a.available : 0), 0);

  const visible = accounts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'Other') return !['Current', 'Savings', 'Business'].includes(a.type);
    return a.type === filter;
  });

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Overview"
        title="Accounts"
        description="Every account you hold with PAYBACK in one place — balances, status and quick actions."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" aria-hidden />}
              onClick={() => toast.info('Demo only', 'Opening new accounts is not part of this prototype.')}
            >
              Open new account
            </Button>
          </>
        }
      />

      <DemoBanner label="Demo balances" text="All balances, interest rates and account numbers below are synthetic illustrations." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total (USD accounts)" value={money(usdTotal)} delta={2.4} icon={<Wallet className="h-5 w-5" aria-hidden />} />
        <StatCard label="Available to spend" value={money(available)} icon={<Wallet className="h-5 w-5" aria-hidden />} tone="#38BDF8" />
        <StatCard label="Foreign currency" value={money(eurTotal, 'EUR')} icon={<Wallet className="h-5 w-5" aria-hidden />} tone="#8B5CF6" footer="EUR account •••• 3378" />
        <StatCard label="Open accounts" value={String(accounts.length)} delta={0} icon={<Wallet className="h-5 w-5" aria-hidden />} tone="#F59E0B" footer="All active • no dormant accounts" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All', count: accounts.length },
            { value: 'Current', label: 'Current' },
            { value: 'Savings', label: 'Savings' },
            { value: 'Business', label: 'Business' },
            { value: 'Other', label: 'Other' },
          ]}
        />
        <div className="flex items-center gap-2">
          <Badge tone="emerald">All accounts active</Badge>
          <Badge tone="sky">Interest paid monthly</Badge>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <Alert tone="info" title="No accounts in this category">
          Try another filter, or open a new account to get started.
        </Alert>
      )}

      <Alert tone="info" title="About this demo">
        Account numbers are masked, profit rates are illustrative and no real ledger is connected. Tap any card to open its
        detail view with statements, limits and recent activity.
      </Alert>
    </PageWrap>
  );
}
