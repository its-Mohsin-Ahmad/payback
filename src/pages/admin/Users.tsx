import { useState } from 'react';
import { Download, Search, Users } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  EmptyState,
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
import { adminUsers } from '@/data/enterprise';

type Filter = 'All' | 'Individual' | 'Business';
const PAGE_SIZE = 6;

export default function AdminUsersPage() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [page, setPage] = useState(1);

  const filtered = adminUsers.filter((user) => {
    if (filter !== 'All' && user.type !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.id.toLowerCase().includes(q);
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Operations"
        title="Users"
        description="Search, inspect and act on customer accounts."
        actions={
          <Button variant="outline" icon={<Download className="h-4 w-4" aria-hidden />} onClick={() => toast.success('Export queued', 'User list exported (demo).')}>
            Export
          </Button>
        }
      />

      <DemoBanner label="Demo users" text="Accounts, emails and statuses are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={adminUsers.length.toLocaleString()} delta={4.4} tone="#10B981" footer="Sample page of 48,210" />
        <StatCard label="Active" value={String(adminUsers.filter((u) => u.status === 'Active').length)} tone="#38BDF8" />
        <StatCard label="Restricted / suspended" value={String(adminUsers.filter((u) => u.status !== 'Active').length)} tone="#F59E0B" />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Search"
            placeholder="Name, email or user ID…"
            leftIcon={<Search className="h-4 w-4" aria-hidden />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <div className="flex items-end">
            <SegmentedControl<Filter>
              value={filter}
              onChange={(next) => {
                setFilter(next);
                setPage(1);
              }}
              options={[
                { value: 'All', label: 'All' },
                { value: 'Individual', label: 'Individual' },
                { value: 'Business', label: 'Business' },
              ]}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader title="User directory" subtitle={`${filtered.length} matching accounts`} />
        {rows.length === 0 ? (
          <EmptyState icon={<Users className="h-6 w-6" aria-hidden />} title="No users match" description="Try a different search or filter." />
        ) : (
          <>
            <TableWrap>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th className="hidden md:table-cell">ID</Th>
                  <Th className="hidden md:table-cell">Tier</Th>
                  <Th>KYC</Th>
                  <Th className="hidden lg:table-cell">Joined</Th>
                  <Th align="right">Status</Th>
                  <Th align="right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={user.name} size="sm" color="#0F172A" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{user.name}</p>
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="hidden md:table-cell tnum font-mono text-[13px]">{user.id}</Td>
                    <Td className="hidden md:table-cell">
                      <Badge tone="neutral">{user.tier}</Badge>
                    </Td>
                    <Td>
                      <Badge tone={user.kyc === 'Verified' ? 'emerald' : user.kyc === 'Pending' ? 'amber' : 'sky'}>{user.kyc}</Badge>
                    </Td>
                    <Td className="hidden lg:table-cell text-xs text-slate-500">{user.joined}</Td>
                    <Td align="right">
                      <Badge tone={user.status === 'Active' ? 'emerald' : user.status === 'Suspended' ? 'rose' : 'amber'}>{user.status}</Badge>
                    </Td>
                    <Td align="right">
                      <Button size="xs" variant="outline" onClick={() => toast.info('User detail', `${user.name} profile opened (demo).`)}>
                        View
                      </Button>
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
      </Card>

      <Alert tone="warning" title="Destructive actions are logged">
        Freezing or suspending an account writes an immutable audit entry (see Audit Log).
      </Alert>
    </PageWrap>
  );
}
