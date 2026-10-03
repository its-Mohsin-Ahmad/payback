import { useState } from 'react';
import { Banknote, Plus } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Input,
  Modal,
  PageHeader,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { businessAccounts, vendors } from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function BusinessVendorsPage() {
  const toast = useToast();
  const [payTarget, setPayTarget] = useState<(typeof vendors)[number] | null>(null);
  const [amount, setAmount] = useState('');

  const dueTotal = vendors.filter((v) => v.status === 'Due').reduce((s, v) => s + v.due, 0);
  const scheduled = vendors.filter((v) => v.status === 'Scheduled').reduce((s, v) => s + v.due, 0);

  const openPay = (vendor: (typeof vendors)[number]) => {
    setPayTarget(vendor);
    setAmount(String(vendor.due));
  };

  const confirm = () => {
    if (!payTarget) return;
    if (!Number(amount) || Number(amount) <= 0) {
      toast.error('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }
    setPayTarget(null);
    toast.success('Payment scheduled', `${money(Number(amount), 'USD', { decimals: false })} to ${payTarget.name} (demo).`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Pay & collect"
        title="Vendors & payables"
        description="Who you owe, on what terms — and pay them in bulk."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Vendor onboarding is simulated.')}>
            Add vendor
          </Button>
        }
      />

      <DemoBanner label="Demo payables" text="Vendor names, amounts and accounts are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Due now" value={money(dueTotal, 'USD', { decimals: false })} tone="#EF4444" footer={`${vendors.filter((v) => v.status === 'Due').length} vendors`} />
        <StatCard label="Scheduled" value={money(scheduled, 'USD', { decimals: false })} tone="#38BDF8" footer="Paying on their due dates" />
        <StatCard label="Paid this month" value={money(vendors.filter((v) => v.status === 'Paid').reduce((s, v) => s + v.due, 0), 'USD', { decimals: false })} tone="#10B981" />
      </div>

      <Card>
        <CardHeader title="Vendor ledger" subtitle={`${vendors.length} vendors`} />
        <TableWrap>
          <thead>
            <tr>
              <Th>Vendor</Th>
              <Th className="hidden md:table-cell">Category</Th>
              <Th className="hidden md:table-cell">Terms</Th>
              <Th className="hidden lg:table-cell">Account</Th>
              <Th align="right">Amount due</Th>
              <Th align="right">Status</Th>
              <Th align="right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <Tr key={vendor.id}>
                <Td className="font-semibold text-slate-900">{vendor.name}</Td>
                <Td className="hidden md:table-cell text-xs">{vendor.category}</Td>
                <Td className="hidden md:table-cell text-xs text-slate-500">{vendor.terms}</Td>
                <Td className="hidden lg:table-cell tnum font-mono text-[13px]">{vendor.account}</Td>
                <Td align="right" className="tnum font-semibold text-slate-900">{money(vendor.due, 'USD', { decimals: false })}</Td>
                <Td align="right">
                  <Badge tone={vendor.status === 'Paid' ? 'emerald' : vendor.status === 'Due' ? 'rose' : 'sky'}>{vendor.status}</Badge>
                </Td>
                <Td align="right">
                  <Button size="xs" variant={vendor.status === 'Paid' ? 'ghost' : 'primary'} disabled={vendor.status === 'Paid'} onClick={() => openPay(vendor)}>
                    {vendor.status === 'Paid' ? 'Paid' : 'Pay'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="warning" title="Dual approval required">
        Payments above $2,500 need a second approver. Your current maker is {`Nadia Rehman`} (demo).
      </Alert>

      <Modal
        open={payTarget !== null}
        onClose={() => setPayTarget(null)}
        title={`Pay ${payTarget?.name ?? ''}`}
        description={payTarget ? `${payTarget.category} • ${payTarget.terms} • ${payTarget.account}` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button icon={<Banknote className="h-4 w-4" aria-hidden />} onClick={confirm}>
              Schedule payment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} leftIcon={<span className="text-sm font-bold text-slate-400">$</span>} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Paying from <span className="font-semibold">{businessAccounts[0].name}</span> — funds leave on the scheduled date
            (demo).
          </div>
        </div>
      </Modal>
    </PageWrap>
  );
}
