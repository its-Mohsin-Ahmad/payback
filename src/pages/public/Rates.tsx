import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { LineChart } from '@/components/charts';
import { Alert, Button, Card, CardBody, DemoBanner } from '@/components/ui';
import { exchangeRates, rateHistory } from '@/data/mock';
import { PROVIDERS } from '@/data/products';
import { ProviderLogo } from '@/components/logos';
import { money } from '@/lib/utils';

const usdRates: Record<string, number> = { USD: 1, PKR: 277.5, EUR: 0.9246, GBP: 0.789, AED: 3.6725, SAR: 3.75 };
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'PKR'];

export default function RatesPage() {
  const [amount, setAmount] = useState('1000');
  const [to, setTo] = useState('PKR');

  const value = Number(amount) || 0;
  const rate = usdRates[to];
  const converted = value * rate;

  return (
    <div className="mx-auto w-full max-w-content space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Rates & fees</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Transparent pricing, always</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Exchange rates, transfer fees and settlement times — shown before you confirm, not hidden afterwards.
        </p>
      </header>

      <DemoBanner label="Demo rates" text="Rates below are synthetic illustrations, not live market or bank pricing." />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardBody className="p-0">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">FX board</h2>
              <p className="mt-0.5 text-xs text-slate-500">Against PKR • updated Apr 25, 2025 09:40 (demo)</p>
            </div>
            <div className="divide-y divide-slate-100">
              {exchangeRates.map((rateRow) => (
                <div key={rateRow.pair} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden>
                      {rateRow.flag}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{rateRow.pair}</p>
                      <p className="tnum text-xs text-slate-500">
                        Buy {rateRow.buy} • Sell {rateRow.sell}
                      </p>
                    </div>
                  </div>
                  <span className={`tnum text-sm font-semibold ${rateRow.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {rateRow.change >= 0 ? '+' : ''}
                    {rateRow.change}%
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Quick calculator</h2>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">You have (USD)</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="focus-ring tnum min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Convert to</span>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="focus-ring min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                >
                  {CURRENCIES.filter((c) => c !== 'USD').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">You receive (illustrative)</p>
                <p className="tnum mt-1 text-2xl font-bold text-slate-900">{money(converted, to)}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  1 USD = {rate.toFixed(4)} {to} • 0.35% spread
                </p>
              </div>
              <Button
                block
                icon={<RefreshCw className="h-4 w-4" aria-hidden />}
                onClick={() => {
                  setAmount('1000');
                  setTo('PKR');
                }}
              >
                Reset
              </Button>
            </CardBody>
          </Card>

          <Alert tone="info" title="How spreads work">
            The buy rate applies when PAYBACK buys currency from you; the sell rate when it sells to you. The gap is our revenue.
          </Alert>
        </div>
      </section>

      <Card>
        <CardBody>
          <h2 className="text-base font-semibold text-slate-900">USD / PKR — last 25 days</h2>
          <div className="mt-3">
            <LineChart data={rateHistory} tone="#10B981" height={200} yFormatter={(n) => n.toFixed(0)} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">Transfer fees by rail</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {PROVIDERS.map((provider) => (
              <div key={provider.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <ProviderLogo mark={provider.id} tileClassName="h-8 w-8" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{provider.name}</p>
                    <p className="text-xs text-slate-500">{provider.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-slate-900">{provider.fee}</span>
                  <span className="text-xs text-slate-500">{provider.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}