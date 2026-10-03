import { useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
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
  PageHeader,
  Select,
  StatCard,
  useToast,
} from '@/components/ui';
import { accounts, exchangeRates, rateHistory } from '@/data/mock';
import { money } from '@/lib/utils';
import { LineChart } from '@/components/charts';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'PKR'];

/** Cross rates vs USD (demo). */
const usdRates: Record<string, number> = {
  USD: 1,
  PKR: 277.5,
  EUR: 0.9246,
  GBP: 0.789,
  AED: 3.6725,
  SAR: 3.75,
};

const cross = (from: string, to: string) => usdRates[to] / usdRates[from];

export default function CurrencyExchangePage() {
  const toast = useToast();
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('1000');
  const [busy, setBusy] = useState(false);

  const value = Number(amount) || 0;
  const mid = cross(from, to);
  const converted = value * mid * (1 - 0.0035);
  const fee = Math.max(value * 0.0025, 0);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const execute = () => {
    if (value <= 0) {
      toast.error('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      toast.success('Exchange complete (demo)', `${money(value, from)} → ${money(converted, to)} at ${mid.toFixed(4)}`);
    }, 800);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Tools"
        title="Currency exchange"
        description="Convert between currencies at live-looking (but simulated) rates."
        actions={<Badge tone="sky">Spread 0.35% • demo</Badge>}
      />

      <DemoBanner label="Demo FX" text="Rates are synthetic and no foreign exchange is actually executed." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="FX allowance left" value={money(14000, 'USD', { decimals: false })} tone="#10B981" footer="of $15,000 monthly tier limit" />
        <StatCard label="Exchanged this month" value={money(1000, 'USD', { decimals: false })} tone="#38BDF8" footer="2 conversions" />
        <StatCard label="Today's best mover" value="+0.15%" delta={0.15} tone="#8B5CF6" footer="GBP / PKR" />
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="Convert" subtitle="Rates refresh every 60 seconds (simulated)" />
          <CardBody className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div className="space-y-3">
                <Select label="From" value={from} onChange={(e) => setFrom(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
                <Input
                  label="You send"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  leftIcon={<span className="text-sm font-bold text-slate-400">{from}</span>}
                />
                <Select
                  label="Fund account"
                  defaultValue={accounts[0].id}
                  options={accounts.map((a) => ({ value: a.id, label: `${a.name} •••• ${a.number} — ${money(a.available, a.currency)}` }))}
                />
              </div>

              <button
                type="button"
                onClick={swap}
                aria-label="Swap currencies"
                className="focus-ring mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition-colors hover:border-emerald-300 hover:text-emerald-600 sm:mb-2"
              >
                <ArrowLeftRight className="h-5 w-5" aria-hidden />
              </button>

              <div className="space-y-3">
                <Select label="To" value={to} onChange={(e) => setTo(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">They receive</p>
                  <p className="tnum mt-0.5 text-lg font-bold text-slate-900">{money(converted, to)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Rate &amp; fee</p>
                  <p className="tnum mt-0.5 text-sm font-semibold text-slate-700">
                    1 {from} = {mid.toFixed(4)} {to}
                  </p>
                  <p className="tnum text-xs text-slate-500">Fee {money(fee, from)}</p>
                </div>
              </div>
            </div>

            <Button block loading={busy} icon={<RefreshCw className="h-4 w-4" aria-hidden />} onClick={execute}>
              Exchange now
            </Button>
            <Alert tone="warning" title="Simulated conversion">
              This screen never touches a real FX market. Amounts are adjusted only inside the demo ledger.
            </Alert>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Rate snapshot" subtitle="Against PKR (demo)" />
            <CardBody className="space-y-3">
              {exchangeRates.slice(0, 5).map((rate) => (
                <div key={rate.pair} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden>
                      {rate.flag}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{rate.pair}</p>
                      <p className="tnum text-xs text-slate-500">
                        Buy {rate.buy} • Sell {rate.sell}
                      </p>
                    </div>
                  </div>
                  <Badge tone={rate.change >= 0 ? 'emerald' : 'rose'}>
                    {rate.change >= 0 ? '+' : ''}
                    {rate.change}%
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="USD / PKR trend" subtitle="First 25 days of April (demo)" />
            <CardBody>
              <LineChart data={rateHistory} tone="#10B981" height={160} yFormatter={(n) => n.toFixed(0)} />
            </CardBody>
          </Card>
        </div>
      </section>
    </PageWrap>
  );
}
