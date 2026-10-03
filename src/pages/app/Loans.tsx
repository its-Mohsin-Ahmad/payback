import { useState } from 'react';
import { HandCoins } from 'lucide-react';
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
  ProgressBar,
  SectionTitle,
  Select,
  StatusBadge,
  useToast,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { loans, loanProducts } from '@/data/products';
import { money } from '@/lib/utils';

export default function LoansPage() {
  const toast = useToast();
  const [applyOpen, setApplyOpen] = useState(false);
  const [product, setProduct] = useState(loanProducts[0].name);
  const [amount, setAmount] = useState('5000');
  const [purpose, setPurpose] = useState('Home renovation');

  const outstanding = loans.reduce((s, l) => s + l.outstanding, 0);
  const nextInstallments = loans.reduce((s, l) => s + l.installment, 0);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Grow & borrow"
        title="Loans"
        description="Track active financing and explore products you are eligible for."
        actions={
          <Button icon={<HandCoins className="h-4 w-4" aria-hidden />} onClick={() => setApplyOpen(true)}>
            Apply for a loan
          </Button>
        }
      />

      <DemoBanner label="Demo lending" text="Rates are illustrative, approvals are simulated and no credit check is performed." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total outstanding</p>
            <p className="tnum mt-1 text-2xl font-bold text-slate-900">{money(outstanding, 'USD', { decimals: false })}</p>
            <p className="mt-1 text-xs text-slate-500">Across {loans.length} active loans</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next month instalments</p>
            <p className="tnum mt-1 text-2xl font-bold text-slate-900">{money(nextInstallments, 'USD', { decimals: false })}</p>
            <p className="mt-1 text-xs text-slate-500">Debited automatically from your Current Account</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Credit standing</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">Excellent</p>
            <p className="mt-1 text-xs text-slate-500">All instalments paid on time (demo)</p>
          </CardBody>
        </Card>
      </div>

      <section className="space-y-3">
        <SectionTitle title="Active loans" description="Progress, schedules and upcoming dues." />
        <div className="grid gap-4 lg:grid-cols-3">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader title={loan.name} subtitle={loan.rate} action={<StatusBadge status={loan.status} />} />
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Outstanding</p>
                    <p className="tnum text-xl font-bold text-slate-900">{money(loan.outstanding, 'USD', { decimals: false })}</p>
                    <p className="text-xs text-slate-500">of {money(loan.amount, 'USD', { decimals: false })} borrowed</p>
                  </div>
                  <Badge tone="sky">{loan.tenure}</Badge>
                </div>
                <ProgressBar value={loan.paid} max={loan.total} label={`${loan.paid} of ${loan.total} instalments paid`} />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Instalment</p>
                    <p className="tnum font-bold text-slate-900">{money(loan.installment)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Next due</p>
                    <p className="font-bold text-slate-900">{loan.nextDue}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => toast.success('Instalment scheduled', `${money(loan.installment)} will be debited on ${loan.nextDue} (demo).`)}
                  >
                    Pay instalment
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Schedule', `Full schedule for ${loan.name} is simulated.`)}>
                    Schedule
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle title="Loan products" description="Explore what you could apply for." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loanProducts.map((p) => (
            <Card key={p.id}>
              <CardBody className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${p.tone}1a`, color: p.tone }}>
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.range}</p>
                  </div>
                </div>
                <dl className="space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Rate</dt>
                    <dd className="font-semibold text-slate-900">{p.rate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Tenor</dt>
                    <dd className="font-semibold text-slate-900">{p.tenor}</dd>
                  </div>
                </dl>
                <Button
                  size="sm"
                  variant="outline"
                  block
                  onClick={() => {
                    setProduct(p.name);
                    setApplyOpen(true);
                  }}
                >
                  Check eligibility
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <Alert tone="warning" title="Borrow responsibly">
        All figures are illustrative. In a real deployment, rates, fees and eligibility depend on your credit assessment and
        the applicable regulatory disclosures.
      </Alert>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Loan application"
        description="Takes under two minutes — demo only."
        footer={
          <>
            <Button variant="ghost" onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setApplyOpen(false);
                toast.success(
                  'Application received',
                  `Your ${product} application for ${money(Number(amount) || 0, 'USD', { decimals: false })} is under review (demo).`
                );
              }}
            >
              Submit application
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Product" value={product} onChange={(e) => setProduct(e.target.value)} options={loanProducts.map((p) => ({ value: p.name, label: `${p.name} — ${p.rate}` }))} />
          <Input label="Amount needed" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} leftIcon={<span className="text-sm font-bold text-slate-400">$</span>} />
          <Input label="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <Alert tone="info" title="Soft search only">
            Checking eligibility in this prototype performs no credit check and leaves no footprint.
          </Alert>
        </div>
      </Modal>
    </PageWrap>
  );
}
