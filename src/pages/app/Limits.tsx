import { useState } from 'react';
import { ArrowUpRight, Scale } from 'lucide-react';
import { PageWrap, UtilisationBar } from '@/components/blocks';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Modal,
  PageHeader,
  ProgressBar,
  Select,
  StatCard,
  TableWrap,
  Td,
  Textarea,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { cards, transferLimits } from '@/data/mock';
import { money } from '@/lib/utils';

export default function LimitsPage() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('Traveling abroad this month');

  const daily = transferLimits[0];
  const monthly = transferLimits[1];
  const dailyLeft = daily.max - daily.used;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Move money"
        title="Limits"
        description="Your transfer, withdrawal and card limits — with live utilisation."
        actions={
          <Button icon={<ArrowUpRight className="h-4 w-4" aria-hidden />} onClick={() => setOpen(true)}>
            Request increase
          </Button>
        }
      />

      <DemoBanner label="Demo limits" text="Limits shown are illustrative for your Premium demo tier and are not real regulatory caps." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Daily transfer left" value={money(dailyLeft)} tone="#10B981" footer={`${money(daily.used)} of ${money(daily.max)} used`} />
        <StatCard label="Monthly transfer left" value={money(monthly.max - monthly.used)} tone="#38BDF8" footer={`${money(monthly.used)} of ${money(monthly.max)} used`} />
        <StatCard label="Used today" value={`${Math.round((daily.used / daily.max) * 100)}%`} tone="#F59E0B" footer="Resets midnight PKT" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Transfer limits" subtitle="Across all rails" />
          <CardBody className="space-y-5">
            {transferLimits.map((limit) => (
              <UtilisationBar
                key={limit.label}
                label={limit.label}
                used={limit.used}
                max={limit.max}
                tone={limit.used / limit.max > 0.7 ? '#F59E0B' : '#10B981'}
              />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Card spend limits" subtitle="Per card, per calendar month" />
          <CardBody className="space-y-5">
            {cards.map((card) => (
              <ProgressBar
                key={card.id}
                value={card.spent}
                max={card.limit}
                label={`${card.label} •••• ${card.last4}`}
                tone={card.spent / card.limit > 0.8 ? '#F43F5E' : '#38BDF8'}
              />
            ))}
            <Alert tone="info" title="ATM withdrawals">
              Cash withdrawals are capped at {money(2000)} per day and {money(8000)} per month on your tier.
            </Alert>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Tier comparison" subtitle="Limits by customer tier (illustrative)" />
        <TableWrap>
          <thead>
            <tr>
              <Th>Tier</Th>
              <Th align="right">Daily transfer</Th>
              <Th align="right">Monthly transfer</Th>
              <Th align="right">ATM / day</Th>
              <Th align="right">FX per month</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Standard', 2000, 10000, 500, 2000],
              ['Premium (you)', 10000, 50000, 2000, 15000],
              ['Private', 50000, 250000, 5000, 100000],
            ].map(([tier, d, m, atm, fx]) => (
              <Tr key={String(tier)} className={String(tier).includes('you') ? 'bg-emerald-50/60' : undefined}>
                <Td className="font-semibold text-slate-900">{tier}</Td>
                <Td align="right" className="tnum">{money(Number(d), 'USD', { decimals: false })}</Td>
                <Td align="right" className="tnum">{money(Number(m), 'USD', { decimals: false })}</Td>
                <Td align="right" className="tnum">{money(Number(atm), 'USD', { decimals: false })}</Td>
                <Td align="right" className="tnum">{money(Number(fx), 'USD', { decimals: false })}</Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="warning" title="Approvals take time">
        Limit increase requests are reviewed against your activity and KYC status — typically within one business day. This
        prototype simulates the request only.
      </Alert>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Request a limit increase"
        description="Tell us what you need and why."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              icon={<Scale className="h-4 w-4" aria-hidden />}
              onClick={() => {
                setOpen(false);
                toast.success('Request submitted', 'We will review it within one business day (demo).');
              }}
            >
              Submit request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Which limit?"
            defaultValue="daily"
            options={[
              { value: 'daily', label: 'Daily transfer limit' },
              { value: 'monthly', label: 'Monthly transfer limit' },
              { value: 'atm', label: 'ATM withdrawal limit' },
              { value: 'fx', label: 'International / FX limit' },
            ]}
          />
          <Textarea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} hint="Include dates and expected amounts where possible." />
        </div>
      </Modal>
    </PageWrap>
  );
}
