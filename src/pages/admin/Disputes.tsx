import { useState } from 'react';
import { Gavel, Scale } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  PageHeader,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { adminDisputes } from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function AdminDisputesPage() {
  const toast = useToast();
  const [items, setItems] = useState(adminDisputes);

  const resolve = (id: string) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'Resolved' } : d)));
    toast.success('Dispute resolved', `${id} closed and customer notified (demo).`);
  };

  const openValue = items.filter((d) => d.status !== 'Resolved').reduce((s, d) => s + d.amount, 0);
  const breached = items.filter((d) => d.sla.includes('1 day')).length;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Operations"
        title="Disputes"
        description="Chargebacks and complaints tracked against SLA."
        actions={<Badge tone="rose">{items.filter((d) => d.status !== 'Resolved').length} open</Badge>}
      />

      <DemoBanner label="Demo disputes" text="Cases, amounts and SLAs are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open value" value={money(openValue, 'USD', { decimals: false })} tone="#EF4444" />
        <StatCard label="SLA at risk" value={String(breached)} tone="#F59E0B" footer="Due within 24 hours" />
        <StatCard label="Resolved (sample)" value={String(items.filter((d) => d.status === 'Resolved').length)} delta={12} tone="#10B981" />
      </div>

      <Card>
        <CardHeader title="Case register" subtitle="Newest first" />
        <TableWrap>
          <thead>
            <tr>
              <Th>Case</Th>
              <Th>Subject</Th>
              <Th className="hidden md:table-cell">User</Th>
              <Th align="right">Amount</Th>
              <Th>Priority</Th>
              <Th>SLA</Th>
              <Th align="right">Status</Th>
              <Th align="right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((dispute) => (
              <Tr key={dispute.id}>
                <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{dispute.id}</Td>
                <Td className="font-semibold text-slate-800">{dispute.subject}</Td>
                <Td className="hidden md:table-cell tnum text-xs">{dispute.user}</Td>
                <Td align="right" className="tnum font-semibold text-slate-900">{money(dispute.amount, 'USD', { decimals: false })}</Td>
                <Td>
                  <Badge tone={dispute.priority === 'High' ? 'rose' : dispute.priority === 'Medium' ? 'amber' : 'neutral'}>
                    {dispute.priority}
                  </Badge>
                </Td>
                <Td className="tnum text-xs text-slate-500">{dispute.sla}</Td>
                <Td align="right">
                  <Badge tone={dispute.status === 'Resolved' ? 'emerald' : dispute.status === 'Investigating' ? 'amber' : 'sky'}>
                    {dispute.status}
                  </Badge>
                </Td>
                <Td align="right">
                  {dispute.status === 'Resolved' ? (
                    <span className="text-xs text-slate-400">Closed</span>
                  ) : (
                    <div className="flex justify-end gap-1.5">
                      <Button size="xs" variant="outline" onClick={() => toast.info('Escalated', `${dispute.id} escalated to compliance (demo).`)}>
                        Escalate
                      </Button>
                      <Button size="xs" icon={<Gavel className="h-3.5 w-3.5" aria-hidden />} onClick={() => resolve(dispute.id)}>
                        Resolve
                      </Button>
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="warning" title="Regulatory clock">
        Card-network rules require acknowledgement within 5 business days and resolution within 45 days (illustrative for
        this demo).
      </Alert>

      <div className="flex justify-end">
        <Button variant="outline" icon={<Scale className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Bulk tools', 'Bulk resolution is simulated.')}>
          Bulk actions
        </Button>
      </div>
    </PageWrap>
  );
}
