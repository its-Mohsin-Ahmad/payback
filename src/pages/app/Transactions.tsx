import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ScanQrCode, Search } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Button,
  DemoBanner,
  EmptyState,
  Input,
  PageHeader,
  Pagination,
  ResponsiveTable,
  SegmentedControl,
  Select,
  StatCard,
  StatusBadge,
  useToast,
  type TableColumn,
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

  /**
   * Declared once, rendered as a table on desktop and as cards on mobile
   * (spec §116). Columns keep their desktop order; on a phone the `primary`
   * column becomes the headline and the `value` column sits opposite it.
   */
  const columns: TableColumn<Transaction>[] = [
    {
      key: 'date',
      header: 'Date',
      mobile: 'meta',
      cellClassName: 'whitespace-nowrap text-xs text-slate-500',
      cell: (tx) => formatDate(tx.date, { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      key: 'description',
      header: 'Description',
      mobile: 'primary',
      cell: (tx) => (
        <>
          <p className="font-semibold text-slate-900">{tx.description}</p>
          <p className="text-xs text-slate-500">
            {tx.category} • {tx.reference}
          </p>
        </>
      ),
    },
    {
      key: 'account',
      header: 'Account',
      mobile: 'meta',
      desktopHidden: 'md',
      cellClassName: 'whitespace-nowrap text-xs',
      cell: (tx) => tx.account,
    },
    {
      key: 'method',
      header: 'Method',
      mobile: 'meta',
      desktopHidden: 'lg',
      cellClassName: 'whitespace-nowrap text-xs text-slate-500',
      cell: (tx) => tx.method,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      mobile: 'value',
      cell: (tx) => (
        <span className={tx.amount >= 0 ? 'tnum font-semibold text-emerald-600' : 'tnum font-semibold text-slate-900'}>
          {tx.amount >= 0 ? '+' : '−'}
          {money(Math.abs(tx.amount), tx.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      mobile: 'meta',
      cell: (tx) => <StatusBadge status={tx.status} />,
    },
  ];

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Overview"
        title="Transactions"
        description="Search, filter and export every movement across your accounts."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<ScanQrCode className="h-4 w-4" aria-hidden />}
              onClick={() => navigate('/app/verify')}
            >
              Scan receipt / code
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" aria-hidden />}
              onClick={() => toast.success('Export queued', 'A CSV of the current filters will be emailed to you (demo).')}
            >
              Export CSV
            </Button>
          </>
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
            <ResponsiveTable
              columns={columns}
              rows={rows}
              rowKey={(tx) => tx.id}
              onRowClick={(tx) => navigate(`/app/transactions/${tx.id}`)}
              mobileLabel="Transactions"
            />
            <div className="px-4 py-3">
              <Pagination page={current} pageCount={pageCount} onPage={setPage} />
            </div>
          </>
        )}
      </div>
    </PageWrap>
  );
}
