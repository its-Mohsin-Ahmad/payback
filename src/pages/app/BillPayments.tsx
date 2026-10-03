import { useState } from 'react';
import { Plus, Receipt, Zap } from 'lucide-react';
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
  SectionTitle,
  Select,
  StatCard,
  Toggle,
  useToast,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { accounts, billCategories, bills as seed, type Bill } from '@/data/mock';
import { formatDate, money } from '@/lib/utils';

export default function BillPaymentsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Bill[]>(seed);
  const [payTarget, setPayTarget] = useState<Bill | null>(null);
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(accounts[0].id);

  const due = items.filter((b) => b.status === 'Due' || b.status === 'Overdue');
  const dueTotal = due.reduce((s, b) => s + b.amount, 0);
  const overdue = items.filter((b) => b.status === 'Overdue').length;
  const autopay = items.filter((b) => b.autopay).length;

  const openPay = (bill: Bill) => {
    setPayTarget(bill);
    setAmount(String(bill.amount));
  };

  const confirm = () => {
    if (!payTarget) return;
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }
    setItems((prev) => prev.map((b) => (b.id === payTarget.id ? { ...b, status: 'Paid' } : b)));
    setPayTarget(null);
    toast.success('Bill paid', `${money(value)} sent to ${payTarget.biller} (demo).`);
  };

  const toggleAutopay = (id: string) =>
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, autopay: !b.autopay } : b)));

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Move money"
        title="Bill payments"
        description="Utilities, subscriptions and more — pay now or automate."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Add-biller onboarding is simulated in this prototype.')}>
            Add biller
          </Button>
        }
      />

      <DemoBanner label="Demo billers" text="No real biller is contacted — payments are recorded locally for demonstration." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Due next 14 days" value={money(dueTotal)} tone="#F59E0B" footer={`${due.length} bills upcoming`} icon={<Receipt className="h-5 w-5" aria-hidden />} />
        <StatCard label="Overdue" value={String(overdue)} tone="#F43F5E" footer="Pay now to avoid late fees" />
        <StatCard label="On autopay" value={String(autopay)} tone="#10B981" footer="Debited automatically on due dates" />
      </div>

      <section className="space-y-3">
        <SectionTitle title="Categories" description="Pick a category to find your biller." />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-10">
          {billCategories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => toast.info(cat.name, `Filtered billers in ${cat.name} (demo).`)}
              className="focus-ring card-base flex flex-col items-center gap-1.5 p-3 transition-shadow hover:shadow-lift"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <Icon name={cat.icon} className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold text-slate-600">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader title="Your bills" subtitle={`${items.length} billers linked`} />
        <CardBody className="space-y-3">
          {items.map((bill) => (
            <div key={bill.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 sm:flex-nowrap">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-card">
                <Icon name={bill.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{bill.biller}</p>
                  <Badge tone={bill.status === 'Paid' ? 'emerald' : bill.status === 'Overdue' ? 'rose' : bill.status === 'Scheduled' ? 'sky' : 'amber'}>
                    {bill.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {bill.category} • Due {formatDate(bill.due, { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="hidden w-28 sm:block">
                <Toggle checked={bill.autopay} onChange={() => toggleAutopay(bill.id)} label="Autopay" />
              </div>
              <p className="tnum w-24 text-right text-sm font-bold text-slate-900">{money(bill.amount)}</p>
              <Button size="sm" variant={bill.status === 'Paid' ? 'ghost' : 'primary'} disabled={bill.status === 'Paid'} onClick={() => openPay(bill)}>
                {bill.status === 'Paid' ? 'Paid' : 'Pay now'}
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      <Alert tone="info" title="Autopay safety net">
        Autopay debits your default account two days before the due date and notifies you each time. Cancel anytime.
      </Alert>

      <Modal
        open={payTarget !== null}
        onClose={() => setPayTarget(null)}
        title={`Pay ${payTarget?.biller ?? ''}`}
        description={
          payTarget ? `${payTarget.category} • due ${formatDate(payTarget.due, { month: 'short', day: 'numeric', year: 'numeric' })}` : undefined
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button icon={<Zap className="h-4 w-4" aria-hidden />} onClick={confirm}>
              Confirm payment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            leftIcon={<span className="text-sm font-bold text-slate-400">$</span>}
          />
          <Select
            label="Pay from"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            options={accounts
              .filter((a) => a.currency === 'USD')
              .map((a) => ({ value: a.id, label: `${a.name} •••• ${a.number} — ${money(a.available)}` }))}
          />
          <Alert tone="warning" title="Demo payment">
            Nothing is charged. The bill will simply move to “Paid” in this prototype.
          </Alert>
        </div>
      </Modal>
    </PageWrap>
  );
}
