import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, HandCoins, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardBody, DemoBanner, SegmentedControl } from '@/components/ui';
import { ProviderLogo } from '@/components/logos';
import { insuranceProducts, investmentProducts, loanProducts, PROVIDERS } from '@/data/products';

type Tab = 'Accounts' | 'Cards' | 'Loans' | 'Investments' | 'Insurance';

const accountProducts = [
  { title: 'Current Account', body: 'Everyday spending with instant internal transfers and no monthly fee.', to: '/register' },
  { title: 'Savings Account', body: 'Illustrative profit paid monthly, with instant access to your money.', to: '/register' },
  { title: 'Student Account', body: 'No monthly fee, a free debit card and budgeting tools for students.', to: '/register' },
  { title: 'Foreign Currency Account', body: 'Hold EUR, GBP, AED and more with a clear conversion rate.', to: '/register' },
];

const cardProducts = [
  { title: 'PAYBACK Platinum Debit', body: 'Everyday card with travel cover and 24/7 support.', tag: 'Most popular' },
  { title: 'PAYBACK Virtual', body: 'Single-use or merchant-locked cards for online shopping.', tag: 'Online only' },
  { title: 'PAYBACK Business Credit', body: 'Team cards with per-card limits and receipt capture.', tag: 'Business' },
];

export default function ProductsPage() {
  const [tab, setTab] = useState<Tab>('Accounts');

  return (
    <div className="mx-auto w-full max-w-content space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Products</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything in one ecosystem</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Accounts, cards, finance and investments designed to work together — with one balance view and one security model.
        </p>
      </header>

      <DemoBanner label="Illustrative products" text="Product features, rates and fees shown here are synthetic examples, not offers." />

      <SegmentedControl<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'Accounts', label: 'Accounts' },
          { value: 'Cards', label: 'Cards' },
          { value: 'Loans', label: 'Loans' },
          { value: 'Investments', label: 'Investments' },
          { value: 'Insurance', label: 'Insurance' },
        ]}
      />

      {tab === 'Accounts' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {accountProducts.map((product) => (
            <Card key={product.title}>
              <CardBody className="space-y-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Wallet className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{product.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{product.body}</p>
                <Link to={product.to} className="focus-ring -my-3 inline-flex min-h-[44px] items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Open account <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'Cards' ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {cardProducts.map((card) => (
            <Card key={card.title}>
              <CardBody className="space-y-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <CreditCard className="h-5 w-5" aria-hidden />
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                  {card.tag}
                </span>
                <p className="text-sm font-bold text-slate-900">{card.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{card.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'Loans' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loanProducts.map((product) => (
            <Card key={product.id}>
              <CardBody className="space-y-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${product.tone}1a`, color: product.tone }}>
                  <HandCoins className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{product.name}</p>
                <p className="tnum text-xs font-semibold text-emerald-600">{product.rate}</p>
                <p className="text-xs text-slate-500">
                  {product.range} • {product.tenor}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'Investments' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {investmentProducts.map((product) => (
            <Card key={product.id}>
              <CardBody className="space-y-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${product.tone}1a`, color: product.tone }}>
                  <TrendingUp className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{product.name}</p>
                <p className="tnum text-xs font-semibold text-emerald-600">{product.rate}</p>
                <p className="text-xs text-slate-500">
                  Risk {product.risk} • {product.term}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'Insurance' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insuranceProducts.map((product) => (
            <Card key={product.id}>
              <CardBody className="space-y-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${product.tone}1a`, color: product.tone }}>
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.cover}</p>
                <p className="tnum text-xs font-semibold text-emerald-600">{product.premium}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">Supported transfer rails</h2>
        <p className="mt-1 text-sm text-slate-500">Fees and settlement times are shown before every payment.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PROVIDERS.map((provider) => (
            <div key={provider.id} className="rounded-xl border border-slate-100 p-3.5">
              <div className="flex items-center gap-2.5">
                <ProviderLogo mark={provider.id} tileClassName="h-7 w-7" />
                <p className="text-sm font-semibold text-slate-900">{provider.name}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {provider.fee} • {provider.eta}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}