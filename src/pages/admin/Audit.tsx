import { useState } from 'react';
import { Lock, Search } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  Input,
  PageHeader,
  SegmentedControl,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { adminAuditLog } from '@/data/enterprise';

type Scope = 'All' | 'Admin' | 'System';

export default function AdminAuditPage() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('All');

  const filtered = adminAuditLog.filter((entry) => {
    if (scope === 'Admin' && entry.actor.startsWith('system')) return false;
    if (scope === 'System' && !entry.actor.startsWith('system')) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return entry.actor.toLowerCase().includes(q) || entry.action.toLowerCase().includes(q) || entry.target.toLowerCase().includes(q);
  });

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Governance"
        title="Audit log"
        description="Immutable record of every privileged action on the platform."
        actions={
          <Button variant="outline" icon={<Lock className="h-4 w-4" aria-hidden />} onClick={() => toast.success('Export sealed', 'Signed audit export generated (demo).')}>
            Export signed log
          </Button>
        }
      />

      <DemoBanner label="Demo audit data" text="Actors, actions and timestamps are synthetic." />

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <Input
          label="Search"
          placeholder="Actor, action or target…"
          leftIcon={<Search className="h-4 w-4" aria-hidden />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SegmentedControl<Scope>
          value={scope}
          onChange={setScope}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Admin', label: 'Admin actions' },
            { value: 'System', label: 'System events' },
          ]}
        />
      </div>

      <Card>
        <CardHeader title="Activity" subtitle={`${filtered.length} entries`} />
        <TableWrap>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Actor</Th>
              <Th>Action</Th>
              <Th className="hidden md:table-cell">Target</Th>
              <Th className="hidden lg:table-cell">Timestamp</Th>
              <Th className="hidden md:table-cell">IP</Th>
              <Th align="right">Type</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => {
              const system = entry.actor.startsWith('system');
              return (
                <Tr key={entry.id}>
                  <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{entry.id}</Td>
                  <Td className="font-semibold text-slate-800">{entry.actor}</Td>
                  <Td className="text-xs text-slate-600">{entry.action}</Td>
                  <Td className="hidden md:table-cell tnum text-xs">{entry.target}</Td>
                  <Td className="hidden lg:table-cell text-xs text-slate-500">{entry.time}</Td>
                  <Td className="hidden md:table-cell tnum text-xs text-slate-400">{entry.ip}</Td>
                  <Td align="right">
                    <Badge tone={system ? 'sky' : 'navy'}>{system ? 'System' : 'Admin'}</Badge>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Retention">
        Audit entries are retained for seven years and cannot be edited or deleted by any single role (demo policy).
      </Alert>
    </PageWrap>
  );
}