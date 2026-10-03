import { useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  StatCard,
  useToast,
} from '@/components/ui';
import { approvals as seed } from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function BusinessApprovalsPage() {
  const toast = useToast();
  const [items, setItems] = useState(seed);

  const pending = items.filter((i) => i.status === 'Pending');
  const pendingAmount = pending.reduce((s, i) => s + i.amount, 0);

  const decide = (id: string, decision: 'Approved' | 'Rejected') => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: decision } : i)));
    const item = items.find((i) => i.id === id);
    if (decision === 'Approved') toast.success('Approved', `${item?.title} — ${money(item?.amount ?? 0, 'USD', { decimals: false })} (demo).`);
    else toast.warning('Rejected', `${item?.title} was rejected and returned to the requester (demo).`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Pay & collect"
        title="Approvals"
        description="Maker-checker queue — nothing moves without your sign-off."
        actions={<Badge tone="amber">{pending.length} pending</Badge>}
      />

      <DemoBanner label="Demo approvals" text="Approving or rejecting updates local state only." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending count" value={String(pending.length)} tone="#F59E0B" footer="Awaiting your decision" />
        <StatCard label="Pending value" value={money(pendingAmount, 'USD', { decimals: false })} tone="#38BDF8" />
        <StatCard label="Approved today" value={String(items.filter((i) => i.status === 'Approved').length)} tone="#10B981" />
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <Badge tone={item.risk === 'High' ? 'rose' : item.risk === 'Medium' ? 'amber' : 'emerald'}>
                    {item.risk} risk
                  </Badge>
                  <Badge
                    tone={item.status === 'Approved' ? 'emerald' : item.status === 'Rejected' ? 'rose' : 'amber'}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Requested by {item.requestedBy} on {item.requestedOn} • {item.approvers}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="tnum text-lg font-bold text-slate-900">{money(item.amount, 'USD', { decimals: false })}</p>
              </div>

              {item.status === 'Pending' ? (
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" icon={<Check className="h-4 w-4" aria-hidden />} onClick={() => decide(item.id, 'Approved')}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" icon={<X className="h-4 w-4" aria-hidden />} onClick={() => decide(item.id, 'Rejected')}>
                    Reject
                  </Button>
                </div>
              ) : null}
            </CardBody>
          </Card>
        ))}
      </div>

      <Alert tone="info" title="Policy: dual control">
        Payments above $2,500 and any new beneficiary require two approvers. High-risk items escalate to your Compliance
        Officer automatically (demo policy).
      </Alert>
    </PageWrap>
  );
}
