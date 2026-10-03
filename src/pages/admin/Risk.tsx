import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
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
  TableWrap,
  Td,
  Th,
  Toggle,
  Tr,
  useToast,
} from '@/components/ui';
import { adminMetrics, adminTransactions } from '@/data/enterprise';
import { money } from '@/lib/utils';

const rules = [
  { id: 'fr-1', name: 'Velocity: 5 transfers / 10 minutes', detail: 'Blocks rapid-fire outbound payments', enabled: true, hits: 42 },
  { id: 'fr-2', name: 'New device + high value', detail: 'Holds payments over $2,000 from new devices', enabled: true, hits: 17 },
  { id: 'fr-3', name: 'Cross-border first 30 days', detail: 'Scrutinises international transfers for new accounts', enabled: true, hits: 9 },
  { id: 'fr-4', name: 'Sanctions list screening', detail: 'Real-time name and account screening', enabled: true, hits: 2 },
  { id: 'fr-5', name: 'Night-window ATM withdrawals', detail: 'Flags cash withdrawals 00:00–05:00', enabled: false, hits: 0 },
];

export default function AdminRiskPage() {
  const toast = useToast();
  const [ruleState, setRuleState] = useState(rules);

  const flagged = adminTransactions.filter((tx) => tx.risk === 'High' || tx.status === 'Flagged');

  const toggle = (id: string) => {
    setRuleState((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
    const rule = ruleState.find((r) => r.id === id);
    toast.warning(rule?.enabled ? 'Rule disabled' : 'Rule enabled', `${rule?.name} updated (demo).`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Operations"
        title="Risk & fraud"
        description="Detection rules, flagged activity and manual holds."
        actions={<Badge tone="rose">{adminMetrics.fraudFlagged} flagged (24h)</Badge>}
      />

      <DemoBanner label="Demo risk data" text="Rules and hits are synthetic — no real screening occurs." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Flagged (24h)" value={String(adminMetrics.fraudFlagged)} delta={-11.4} tone="#EF4444" footer="Down vs yesterday" />
        <StatCard label="Active rules" value={String(ruleState.filter((r) => r.enabled).length)} tone="#10B981" footer={`${ruleState.length} configured`} />
        <StatCard label="Rule hits (7d)" value={String(ruleState.reduce((s, r) => s + r.hits, 0))} tone="#38BDF8" footer="Auto-blocked or held" />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Detection rules" subtitle="Toggle rules on or off in real time (demo)" />
          <CardBody className="space-y-3">
            {ruleState.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-slate-100 p-3.5">
                <Toggle
                  checked={rule.enabled}
                  onChange={() => toggle(rule.id)}
                  label={rule.name}
                  hint={`${rule.detail} • ${rule.hits} hits in 7 days`}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Flagged transactions" subtitle="Awaiting analyst decision" />
          <TableWrap>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>User</Th>
                <Th align="right">Amount</Th>
                <Th>Risk</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {flagged.map((tx) => (
                <Tr key={tx.id}>
                  <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{tx.id}</Td>
                  <Td className="tnum text-xs">{tx.user}</Td>
                  <Td align="right" className="tnum font-semibold text-slate-900">{money(tx.amount, tx.currency, { decimals: false })}</Td>
                  <Td>
                    <Badge tone={tx.risk === 'High' ? 'rose' : 'amber'}>{tx.risk}</Badge>
                  </Td>
                  <Td align="right">
                    <Button size="xs" variant="outline" onClick={() => toast.success('Released', `${tx.id} cleared for processing (demo).`)}>
                      Clear
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>

      <Alert tone="info" title="Analyst workflow">
        Flagged items are held for up to 24 hours. Clearing releases them; escalating sends the case to Compliance with a
        full event trail (demo).
      </Alert>
    </PageWrap>
  );
}
