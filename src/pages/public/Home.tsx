import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Globe, HandCoins, ShieldCheck, Sparkles, TrendingUp, Wallet, Zap } from 'lucide-react';
import { Card, CardBody, DemoBanner, SecurityBadge } from '@/components/ui';
import { PROVIDERS, transferMethods } from '@/data/products';

const highlights = [
  { icon: Wallet, title: 'Everyday accounts', body: 'Current, savings, student and joint accounts with real-time balances and instant internal transfers.', to: '/products' },
  { icon: CreditCard, title: 'Cards that travel', body: 'Debit, virtual and business cards with instant controls you can change in seconds.', to: '/products' },
  { icon: Globe, title: 'Money that crosses borders', body: 'International transfers with transparent fees and tracked settlement times.', to: '/rates' },
  { icon: TrendingUp, title: 'Grow your money', body: 'Savings certificates, mutual funds and retirement plans with plain-language risk labels.', to: '/products' },
  { icon: HandCoins, title: 'Borrow responsibly', body: 'Personal, auto and home finance with clear instalment schedules.', to: '/products' },
  { icon: Zap, title: 'Automation', body: 'Autopay, scheduled transfers, payroll and bulk payouts for teams.', to: '/business' },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy navy-mesh">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-white/15">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Personal + business banking, one ecosystem
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                The bank that keeps up with your life.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                PAYBACK brings accounts, cards, transfers, bills, loans and investments into one calm, secure app — with
                instant payments to any wallet or bank.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-base font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600">
                  Open an account
                </Link>
                <Link to="/business" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-base font-semibold text-white transition-colors hover:bg-white/20">
                  Explore business banking
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <SecurityBadge label="256-bit encryption" />
                <SecurityBadge label="Biometric sign-in" />
                <SecurityBadge label="24/7 fraud monitoring" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">App preview</p>
                <span className="text-xs text-white/50">Demo only</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {['Send', 'Bills', 'Top up', 'Exchange', 'Rewards', 'Cards', 'Loans', 'Invest'].map((label) => (
                  <span key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 p-3 text-center">
                    <span className="h-8 w-8 rounded-lg bg-emerald-500/20" aria-hidden />
                    <span className="text-[10px] font-semibold text-white/70">{label}</span>
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-navy/60 p-4">
                <p className="text-xs text-white/50">Transfer to Ali Raza</p>
                <p className="tnum mt-1 text-2xl font-bold text-white">$1,250.00</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex h-8 items-center rounded-lg bg-emerald-500 px-3 text-xs font-semibold text-white">Confirm</span>
                  <span className="inline-flex h-8 items-center rounded-lg bg-white/10 px-3 text-xs font-semibold text-white/80">Cancel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: '2.4M+', v: 'customers served' },
            { k: '99.98%', v: 'platform uptime' },
            { k: '< 2 min', v: 'average chat reply' },
            { k: '6', v: 'connected provider rails' },
          ].map((stat) => (
            <div key={stat.k} className="card-base p-4 text-center">
              <p className="tnum text-2xl font-bold text-slate-900">{stat.k}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-content space-y-6 px-4 sm:px-6 lg:px-8">
        <DemoBanner label="Prototype site" text="PAYBACK is a demonstration ecosystem. No accounts are opened, no money moves and every figure shown is synthetic." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title}>
              <CardBody className="space-y-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
                <Link to={item.to} className="focus-ring inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Learn more <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send money on any rail</h2>
              <p className="mt-1 text-sm text-slate-500">
                From instant PAYBACK transfers to international wires — with the fee and arrival time shown before you confirm.
              </p>
            </div>
            <Link to="/products" className="focus-ring inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              See all products <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {transferMethods.map((method) => (
              <div key={method.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{method.label}</p>
                  {method.badge ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      {method.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-slate-500">{method.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {PROVIDERS.slice(0, 6).map((provider) => (
              <span key={provider.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <span className="h-5 w-5 rounded-full" style={{ backgroundColor: provider.color }} aria-hidden />
                {provider.name}
              </span>
            ))}
            <span className="text-xs text-slate-400">and more inside the app</span>
          </div>
        </div>
      </section>

      {/* Security band */}
      <section className="bg-navy navy-mesh">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Security is the product</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Device binding, biometric approvals, real-time fraud scoring and an immutable audit trail — designed so that
                the fastest way to lose money is still hard.
              </p>
              <Link to="/security" className="focus-ring mt-6 inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                Read our security approach <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { k: '256-bit', v: 'Encryption at rest and in transit' },
                { k: '2FA', v: 'Mandatory on transfers above $2,000' },
                { k: 'Biometric', v: 'Passkeys and face/fingerprint approval' },
                { k: '24/7', v: 'Fraud monitoring and instant card freeze' },
              ].map((item) => (
                <div key={item.k} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-lg font-bold text-emerald-300">{item.k}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business teaser */}
      <section className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Business banking</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Finance that keeps up with your team</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Multi-user accounts with maker-checker approvals, bulk payouts, payroll runs, corporate cards and accounting
              integrations — all in one console.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link to="/business" className="focus-ring inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600">
                Explore business banking
              </Link>
              <Link to="/register" className="focus-ring inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50">
                Talk to us
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: '4', v: 'Account types' },
              { k: '5,000', v: 'Payouts per file' },
              { k: '2-step', v: 'Approval control' },
              { k: '4', v: 'Native integrations' },
            ].map((item) => (
              <div key={item.k} className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="tnum text-xl font-bold text-slate-900">{item.k}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-content px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-emerald-500 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to try PAYBACK?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            Create a demo account and explore the full ecosystem — personal banking, business finance and the admin platform.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link to="/register" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-800">
              Open a demo account
            </Link>
            <Link to="/login" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/25">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}