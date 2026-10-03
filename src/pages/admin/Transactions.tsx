import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  Input,
  PageHeader,
  Pagination,
  SegmentedControl,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { adminTransactions } from '@/data/enterprise';
import { money } from '@/lib/utils';

type Status = 'All' | 'Completed' | 'Pending' | 'Failed' | 'Flagged';
const PAGE_SIZE = 6;

export default function AdminTransactionsPage() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('All');
  const [page, setPage] = useState(1);

  const filtered = adminTransactions.filter((tx) => {
    if (status !== 'All' && tx.status !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return tx.id.toLowerCase().includes(q) || tx.user.toLowerCase().includes(q) || tx.rail.toLowerCase().includes(q);
  });

  const flagged = adminTransactions.filter((tx) => tx.risk === 'High' || tx.status === 'Flagged').length;
  const volume = adminTransactions.reduce((s, tx) => s + tx.amount, 0);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Operations"
        title="Transactions"
        description="Monitor the live ledger across every rail (demo snapshot)."
        actions={
          <Button variant="outline" icon={<Download className="h-4 w-4" aria-hidden />} onClick={() => toast.success('Export queued', 'Transaction extract requested (demo).')}>
            Export extract
          </Button>
        }
      />

      <DemoBanner label="Demo ledger" text="Transaction IDs, users and amounts are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Sample volume" value={money(volume, 'USD', { decimals: false })} tone="#10B981" footer={`${adminTransactions.length} transactions`} />
        <StatCard label="Flagged for review" value={String(flagged)} tone="#EF4444" footer="Requires analyst action" />
        <StatCard label="Success rate" value="97.5%" delta={0.4} tone="#38BDF8" footer="Of the current sample" />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <Input
          label="Search"
          placeholder="Transaction ID, user ID or rail…"
          leftIcon={<Search className="h-4 w-4" aria-hidden />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <SegmentedControl<Status>
          value={status}
          onChange={(next) => {
            setStatus(next);
            setPage(1);
          }}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Failed', label: 'Failed' },
            { value: 'Flagged', label: 'Flagged' },
          ]}
        />
      </div>

      <Card>
        <CardHeader title="Ledger snapshot" subtitle={`${filtered.length} matching transactions`} />
        <TableWrap>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>User</Th>
              <Th className="hidden md:table-cell">Rail</Th>
              <Th align="right">Amount</Th>
              <Th>Risk</Th>
              <Th className="hidden lg:table-cell">Time</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx) => (
              <Tr key={tx.id} onClick={() => toast.info('Transaction', `${tx.id} opened (demo).`)}>
                <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{tx.id}</Td>
                <Td className="tnum text-xs">{tx.user}</Td>
                <Td className="hidden md:table-cell text-xs">{tx.rail}</Td>
                <Td align="right" className="tnum font-semibold text-slate-900">{money(tx.amount, tx.currency, { decimals: false })}</Td>
                <Td>
                  <Badge tone={tx.risk === 'High' ? 'rose' : tx.risk === 'Medium' ? 'amber' : 'emerald'}>{tx.risk}</Badge>
                </Td>
                <Td className="hidden lg:table-cell tnum text-xs text-slate-500">{tx.time}</Td>
                <Td align="right">
                  <Badge
                    tone={tx.status === 'Completed' ? 'emerald' : tx.status === 'Failed' ? 'rose' : tx.status === 'Flagged' ? 'rose' : 'amber'}
                  >
                    {tx.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
        <div className="px-4 py-3">
          <Pagination page={current} pageCount={pageCount} onPage={setPage} />
        </div>
      </Card>
    </PageWrap>
  );
}
