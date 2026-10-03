import { Percent, Save } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  PageHeader,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';

const feeSchedule = [
  { id: 'f-1', product: 'PAYBACK-to-PAYBACK transfer', type: 'Flat', value: 'Free', updated: 'Jan 12, 2025', status: 'Active' },
  { id: 'f-2', product: 'Local bank transfer', type: 'Flat', value: '$0.50', updated: 'Jan 12, 2025', status: 'Active' },
  { id: 'f-3', product: 'International transfer', type: 'Percentage', value: '0.4% (min $12)', updated: 'Apr 24, 2025', status: 'Active' },
  { id: 'f-4', product: 'Wallet top-up', type: 'Flat', value: '$0.25', updated: 'Feb 03, 2025', status: 'Active' },
  { id: 'f-5', product: 'ATM withdrawal (tier-based)', type: 'Slab', value: 'Free ×5, then $1.50', updated: 'Mar 18, 2025', status: 'Active' },
  { id: 'f-6', product: 'FX conversion spread', type: 'Percentage', value: '0.35%', updated: 'Apr 02, 2025', status: 'Active' },
  { id: 'f-7', product: 'Instant card settlement', type: 'Percentage', value: '1.2%', updated: 'Dec 09, 2024', status: 'Draft' },
];

const limitMatrix = [
  { tier: 'Standard', daily: 2000, monthly: 10000, atm: 500, fx: 2000 },
  { tier: 'Premium', daily: 10000, monthly: 50000, atm: 2000, fx: 15000 },
  { tier: 'Private', daily: 50000, monthly: 250000, atm: 5000, fx: 100000 },
  { tier: 'Business', daily: 100000, monthly: 1000000, atm: 10000, fx: 250000 },
];

export default function AdminFeesPage() {
  const toast = useToast();

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Configuration"
        title="Fees & limits"
        description="Price every product and cap every tier — centrally."
        actions={
          <Button icon={<Save className="h-4 w-4" aria-hidden />} onClick={() => toast.success('Schedule published', 'New fees take effect on the next cycle (demo).')}>
            Publish changes
          </Button>
        }
      />

      <DemoBanner label="Demo pricing" text="Fees and limits below are illustrative — not real tariffs." />

      <Card>
        <CardHeader
          title="Fee schedule"
          subtitle="Applied to all customer segments unless overridden"
          action={
            <Button size="sm" variant="outline" icon={<Percent className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Add fee', 'Fee editor is simulated.')}>
              Add fee rule
            </Button>
          }
        />
        <TableWrap>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Type</Th>
              <Th>Value</Th>
              <Th className="hidden md:table-cell">Last updated</Th>
              <Th align="right">Status</Th>
              <Th align="right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {feeSchedule.map((fee) => (
              <Tr key={fee.id}>
                <Td className="font-semibold text-slate-900">{fee.product}</Td>
                <Td className="text-xs text-slate-500">{fee.type}</Td>
                <Td className="tnum font-semibold text-slate-900">{fee.value}</Td>
                <Td className="hidden md:table-cell text-xs text-slate-500">{fee.updated}</Td>
                <Td align="right">
                  <Badge tone={fee.status === 'Active' ? 'emerald' : 'amber'}>{fee.status}</Badge>
                </Td>
                <Td align="right">
                  <Button size="xs" variant="outline" onClick={() => toast.info('Edit fee', `${fee.product} opened for editing (demo).`)}>
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Card>
        <CardHeader title="Tier limits" subtitle="Daily and monthly caps by customer tier" />
        <TableWrap>
          <thead>
            <tr>
              <Th>Tier</Th>
              <Th align="right">Daily transfer</Th>
              <Th align="right">Monthly transfer</Th>
              <Th align="right">ATM / day</Th>
              <Th align="right">FX / month</Th>
            </tr>
          </thead>
          <tbody>
            {limitMatrix.map((row) => (
              <Tr key={row.tier}>
                <Td className="font-semibold text-slate-900">{row.tier}</Td>
                <Td align="right" className="tnum">${row.daily.toLocaleString()}</Td>
                <Td align="right" className="tnum">${row.monthly.toLocaleString()}</Td>
                <Td align="right" className="tnum">${row.atm.toLocaleString()}</Td>
                <Td align="right" className="tnum">${row.fx.toLocaleString()}</Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="warning" title="Changes are versioned">
        Every publish creates a new schedule version with an effective date, and the previous version stays immutable for
        reconciliation (demo behaviour).
      </Alert>
    </PageWrap>
  );
}
