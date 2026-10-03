import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Button,
  DemoBanner,
  EmptyState,
  Input,
  PageHeader,
  Pagination,
  SegmentedControl,
  Select,
  StatCard,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { accounts, transactions, type Transaction } from '@/data/mock';
import { formatDate, money } from '@/lib/utils';

type Status = 'All' | Transaction['status'];
const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('All');
  const [category, setCategory] = useState('All');
  const [account, setAccount] = useState('All');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => ['All', ...Array.from(new Set(transactions.map((t) => t.category)))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (status !== 'All' && tx.status !== status) return false;
      if (category !== 'All' && tx.category !== category) return false;
      if (account !== 'All' && tx.account !== account) return false;
      if (!q) return true;
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.merchant.toLowerCase().includes(q) ||
        tx.reference.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      );
    });
  }, [query, status, category, account]);

  const moneyIn = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const moneyOut = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const pending = filtered.filter((t) => t.status === 'Pending').length;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const resetPage = () => setPage(1);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Overview"
        title="Transactions"
        description="Search, filter and export every movement across your accounts."
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" aria-hidden />}
            onClick={() => toast.success('Export queued', 'A CSV of the current filters will be emailed to you (demo).')}
          >
            Export CSV
          </Button>
        }
      />

      <DemoBanner label="Demo ledger" text="Transactions are synthetic and generated for demonstration only." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Money in (filtered)" value={money(moneyIn)} delta={4.1} tone="#10B981" />
        <StatCard label="Money out (filtered)" value={money(moneyOut)} delta={-2.6} tone="#38BDF8" />
        <StatCard label="Pending" value={String(pending)} tone="#F59E0B" footer={`${filtered.length} transactions match`} />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-3">
          <Input
            label="Search"
            placeholder="Merchant, reference or category…"
            leftIcon={<Search className="h-4 w-4" aria-hidden />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
          />
          <Select
            label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              resetPage();
            }}
            options={categories.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Account"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
              resetPage();
            }}
            options={[
              { value: 'All', label: 'All accounts' },
              ...accounts.map((a) => ({ value: `${a.name} •••• ${a.number}`, label: `${a.name} •••• ${a.number}` })),
            ]}
          />
        </div>
        <SegmentedControl<Status>
          value={status}
          onChange={(next) => {
            setStatus(next);
            resetPage();
          }}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Failed', label: 'Failed' },
            { value: 'Reversed', label: 'Reversed' },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Search className="h-6 w-6" aria-hidden />}
            title="No transactions match"
            description="Try clearing the search box or switching filters."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuery('');
                  setStatus('All');
                  setCategory('All');
                  setAccount('All');
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th className="hidden md:table-cell">Account</Th>
                  <Th className="hidden lg:table-cell">Method</Th>
                  <Th align="right">Amount</Th>
                  <Th align="right">Status</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((tx) => (
                  <Tr key={tx.id} onClick={() => navigate(`/app/transactions/${tx.id}`)}>
                    <Td className="whitespace-nowrap text-xs text-slate-500">
                      {formatDate(tx.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Td>
                    <Td>
                      <p className="font-semibold text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-500">
                        {tx.category} • {tx.reference}
                      </p>
                    </Td>
                    <Td className="hidden whitespace-nowrap text-xs md:table-cell">{tx.account}</Td>
                    <Td className="hidden whitespace-nowrap text-xs text-slate-500 lg:table-cell">{tx.method}</Td>
                    <Td
                      align="right"
                      className={tx.amount >= 0 ? 'tnum font-semibold text-emerald-600' : 'tnum font-semibold text-slate-900'}
                    >
                      {tx.amount >= 0 ? '+' : '−'}
                      {money(Math.abs(tx.amount), tx.currency)}
                    </Td>
                    <Td align="right">
                      <StatusBadge status={tx.status} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
            <div className="px-4 py-3">
              <Pagination page={current} pageCount={pageCount} onPage={setPage} />
            </div>
          </>
        )}
      </div>
    </PageWrap>
  );
}
