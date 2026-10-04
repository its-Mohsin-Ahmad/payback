import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  Headphones,
  Lock,
  QrCode,
  ScanQrCode,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { ContactlessGlyph, PaybackCard3D } from '@/components/card3d';
import { AreaChart, DonutChart, GroupedBarChart } from '@/components/charts';
import { ProviderLogo } from '@/components/logos';
import { DemoBanner, SecurityBadge } from '@/components/ui';
import { useDemoCards } from '@/components/cards/cardVariants';

export default function HomePage() {
  /**
   * Even the marketing page embosses the signed-in user's name.
   *
   * A visitor who registers and then returns to the homepage should see their own
   * card, not a stranger's (spec §12, §17). `useDemoCards` stamps the name from
   * the session, so there is no name literal anywhere on this page.
   */
  const demoCards = useDemoCards();
  const heroCard = demoCards[0];
  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-navy navy-mesh">
        <div className="animate-spin-slow pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />

        <div className="mx-auto max-w-content px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-white/15">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Banking Built Around You
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Banking Built Around You.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                One secure place for your money, cards, transfers, payments, savings, investments and everyday financial life.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-base font-semibold text-white shadow-soft transition-all hover:bg-emerald-600"
                >
                  Open an Account
                </Link>
                <Link
                  to="/products"
                  className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-base font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Explore PAYBACK
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <SecurityBadge label="256-bit encryption" />
                <SecurityBadge label="Biometric approvals" />
                <SecurityBadge label="24/7 fraud monitoring" />
              </div>
            </div>

            {/* 3D card + floating financial indicators */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div className="animate-float">
                  <PaybackCard3D card={heroCard} size="md" float={false} />
                </div>

                <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur sm:block">
                  <p className="text-[11px] uppercase tracking-wide text-white/50">Total balance</p>
                  <p className="tnum text-lg font-bold text-white">$12,480.75</p>
                  <p className="text-[11px] font-semibold text-emerald-300">▲ 2.4% this month</p>
                </div>

                <div className="absolute -right-4 bottom-16 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3.5 py-2.5 backdrop-blur sm:flex">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-300">
                    <Send className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">Transfer sent</p>
                    <p className="text-[11px] text-white/55">$1,250 · Instant</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 left-2 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur sm:flex">
                  <QrCode className="h-4 w-4 text-sky-300" aria-hidden />
                  <span className="text-[11px] font-semibold text-white">Scan &amp; Pay</span>
                </div>
                <div className="absolute -right-2 -top-4 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur sm:flex">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />
                  <span className="text-[11px] font-semibold text-white">Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Trust strip                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { icon: Lock, title: 'Secure Banking', hint: 'Biometric approvals' },
              { icon: Zap, title: 'Smart Transfers', hint: 'Instant rails' },
              { icon: QrCode, title: 'Premium Cards', hint: 'Metal & virtual' },
              { icon: Headphones, title: '24/7 Support', hint: 'Under 2 minutes' },
              { icon: Globe, title: 'Global Access', hint: 'Multi-currency' },
            ].map((item) => (
              <li key={item.title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="truncate text-xs text-slate-500">{item.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <DemoBanner
          label="Prototype ecosystem"
          text="Every balance, card, rate and transfer below is synthetic. No banking service is provided and no external rail is connected."
        />

        {/* Your money, one place */}
        <section>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need. One Banking Experience.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Balance, spending, savings, transfers and investments in a single view — updated the moment money moves, not at the
              end of the day.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total balance</p>
                  <p className="tnum mt-1 text-3xl font-bold text-slate-900">$12,480.75</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">▲ 2.4% this month</span>
              </div>
              <div className="mt-4">
                <AreaChart
                  data={[
                    { label: '1 Apr', value: 9800 },
                    { label: '9 Apr', value: 10420 },
                    { label: '17 Apr', value: 10880 },
                    { label: '25 Apr', value: 12480 },
                  ]}
                  tone="#10B981"
                  height={170}
                  valueFormatter={(n) => `$${n.toLocaleString()}`}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Spending', value: '$3,420', hint: 'this month' },
                  { label: 'Savings', value: '$4,320', hint: 'profit paid' },
                  { label: 'Transfers', value: '18', hint: 'this month' },
                  { label: 'Investments', value: '$20,565', hint: 'portfolio' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="tnum mt-0.5 text-base font-bold text-slate-900">{item.value}</p>
                    <p className="text-[11px] text-slate-400">{item.hint}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-sm font-bold text-slate-900">This month</h3>
              <ul className="mt-3 space-y-3">
                {[
                  { icon: Send, label: 'Transfer to Ali Raza', value: '−$1,250', tone: 'text-rose-600' },
                  { icon: Store, label: 'Aurora Retail Group', value: '−$128', tone: 'text-rose-600' },
                  { icon: Wallet, label: 'Salary credited', value: '+$4,850', tone: 'text-emerald-600' },
                  { icon: TrendingUp, label: 'Portfolio up 1.4%', value: '+$285', tone: 'text-emerald-600' },
                ].map((row) => (
                  <li key={row.label} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <row.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{row.label}</span>
                    <span className={`tnum shrink-0 text-sm font-bold ${row.tone}`}>{row.value}</span>
                  </li>
                ))}
              </ul>
              <Link to="/app" className="focus-ring mt-4 inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                Open the app <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* 3D card showcase */}
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-card sm:p-10">
          {/*
            Green, Platinum and Gold are fanned as an overlapping hand of cards
            rather than sat in a grid with gaps between them.

            Each card is pulled left by `--pb-fan-overlap`, and `z-index` rises
            with position so the fan stacks left-over-right. Hovering promotes a
            card above its neighbours — without that, the overlap means only the
            last card is ever fully visible and the other two look clipped.

            Labels sit *below* the fan instead of under each card, because an
            overlapping card would otherwise cover the label of the one beneath.
          */}
          <div className="flex flex-col items-center">
            <div className="pb-fan flex items-start justify-center">
              {[
                { card: demoCards[0], label: 'Green', hint: 'Everyday' },
                { card: demoCards[1], label: 'Silver', hint: 'Metal' },
                { card: demoCards[2], label: 'Gold', hint: 'Signature' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="group relative transition-transform duration-500 ease-out hover:z-20 hover:-translate-y-4 focus-within:z-20 focus-within:-translate-y-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{ zIndex: i }}
                >
                  <PaybackCard3D
                    card={item.card}
                    size="md"
                    fill={false}
                    flipLabel={false}
                    /* Width comes from the same variable the overlap uses, so the
                       fan stays proportional at every breakpoint. The component
                       sets an inline width, hence the `!` override. */
                    className="!w-[var(--pb-fan-card)]"
                  />
                </div>
              ))}
            </div>

            {/* Legend, in the same order as the fan so each name maps to the
                card directly above it. */}
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
              {[
                { label: 'Green', hint: 'Everyday' },
                { label: 'Platinum', hint: 'Metal' },
                { label: 'Gold', hint: 'Signature' },
              ].map((item) => (
                <li key={item.label} className="text-center">
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.hint}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 grid items-center gap-10 border-t border-slate-200/80 pt-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Meet Your PAYBACK Card.</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Three signature finishes — Green for everyday banking, Platinum metal and Gold for the highest tier. Flip
                any card to see the magstripe, signature panel and embossed card number.
              </p>
            </div>

            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Fingerprint, label: 'Smart chip', hint: 'PAYBACK Secure Element' },
                  { icon: CreditCard, label: 'Contactless', hint: 'Tap to pay instantly' },
                  { icon: ShieldCheck, label: 'Security', hint: 'Freeze in one tap' },
                  { icon: Smartphone, label: 'Digital wallet', hint: 'Add to your device' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <item.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.hint}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <Link to="/app/cards" className="focus-ring inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800">
                  Explore PAYBACK Cards
                </Link>
                <Link to="/app/cards" className="focus-ring inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50">
                  Get a Card
                </Link>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <ContactlessGlyph className="h-3.5 w-3.5" aria-hidden />
                Demo cards — no plastic issued and no card network involved.
              </p>
            </div>
          </div>
        </section>

        {/* Money movement */}
        <section>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Move Money Without the Complexity.</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Money travels from your PAYBACK account to a bank, a wallet or a business anywhere — with the fee and the arrival
              time shown before you confirm.
            </p>
          </div>

          <div className="relative mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { name: 'PAYBACK', eta: 'Instant', fee: 'Free', demo: false },
                { name: 'Local Bank', eta: 'Within 24h', fee: 'From $0.50', demo: false },
                { name: 'Easypaisa', eta: 'Demo Transfer', fee: 'Demo', demo: true },
                { name: 'JazzCash', eta: 'Demo Transfer', fee: 'Demo', demo: true },
                { name: 'UPaisa', eta: 'Demo Transfer', fee: 'Demo', demo: true },
                { name: 'NayaPay', eta: 'Demo Transfer', fee: 'Demo', demo: true },
                { name: 'International', eta: '1–3 days', fee: 'From $12', demo: false },
                { name: 'PayPal', eta: 'Not connected', fee: 'Integration required', demo: true },
              ].map((rail) => (
                <div key={rail.name} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
                  <ProviderLogo mark={rail.name} tileClassName="h-10 w-10" />
                  <p className="mt-2.5 text-sm font-bold text-slate-900">{rail.name}</p>
                  <p className="text-xs text-slate-500">{rail.eta}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">{rail.fee}</p>
                  {rail.demo ? (
                    <span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Demo
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Rails shown for demonstration. Anything labelled Demo is simulated — no provider integration is claimed.
            </p>
          </div>
        </section>

        {/* QR payments */}
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Point. Scan. Pay.</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              One scanner for merchants, transfers, bills and receipts. PAYBACK recognises the code type, shows you exactly who
              gets paid, then asks for verification before a cent moves.
            </p>

            <ol className="mt-6 space-y-3">
              {[
                { icon: ScanQrCode, label: 'Scan', hint: 'Camera, upload or a saved code' },
                { icon: QrCode, label: 'Identify', hint: 'Merchant, recipient, biller or receipt' },
                { icon: ShieldCheck, label: 'Verify', hint: 'Fee, reference and authentication' },
                { icon: Sparkles, label: 'Confirm', hint: 'Instant receipt with a safe QR' },
              ].map((step, i) => (
                <li key={step.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {i + 1}. {step.label}
                    </p>
                    <p className="text-xs text-slate-500">{step.hint}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/app/scan"
                className="focus-ring inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600"
              >
                Explore Smart Payments
              </Link>
              <Link
                to="/app/my-qr"
                className="focus-ring inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                Show my QR
              </Link>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="relative w-[280px] rounded-[2.5rem] border-8 border-navy bg-navy p-4 shadow-lift">
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" aria-hidden />
              <div className="relative h-64 overflow-hidden rounded-2xl bg-navy-800">
                <div className="hero-grid absolute inset-0 opacity-25" aria-hidden />
                <div className="absolute left-6 right-6 top-16 h-40 rounded-2xl border-2 border-emerald-400">
                  <span className="absolute -left-0.5 -top-0.5 h-6 w-6 rounded-tl-2xl border-l-2 border-t-2 border-emerald-400" aria-hidden />
                  <span className="absolute -right-0.5 -top-0.5 h-6 w-6 rounded-tr-2xl border-r-2 border-t-2 border-emerald-400" aria-hidden />
                  <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-2xl border-b-2 border-l-2 border-emerald-400" aria-hidden />
                  <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-br-2xl border-b-2 border-r-2 border-emerald-400" aria-hidden />
                  <span className="animate-scan-line absolute inset-x-3 top-2 h-0.5 rounded-full bg-emerald-400" aria-hidden />
                </div>
                <p className="absolute inset-x-0 top-8 text-center text-xs font-semibold text-white">Scan a QR Code</p>
              </div>
              <div className="mt-3 flex items-center justify-around text-[10px] font-semibold text-white/70">
                <span>Scan</span>
                <span>My QR</span>
                <span>History</span>
              </div>
            </div>
          </div>
        </section>

        {/* Day in the life */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Banking That Understands Your Day.</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Money rarely moves at random. PAYBACK follows the rhythm of your day — salary in, payments out, purchases by
              card, and a clear summary when the month closes.
            </p>

            <ol className="mt-6 space-y-4">
              {[
                { time: '08:12', title: 'Salary received', detail: 'Aurora Payroll • +$4,850', tone: '#10B981' },
                { time: '13:40', title: 'Bill payment made', detail: 'Electricity autopay • −$120', tone: '#38BDF8' },
                { time: '19:05', title: 'Card purchase', detail: 'Local Eats • −$38.60', tone: '#8B5CF6' },
                { time: 'Month end', title: 'Financial summary', detail: 'You saved 12% more than March', tone: '#F59E0B' },
              ].map((moment) => (
                <li key={moment.title} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: moment.tone }} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">{moment.title}</p>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{moment.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{moment.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900">This month at a glance</h3>
            <div className="mt-4">
              <DonutChart
                data={[
                  { label: 'Food & dining', value: 1024, color: '#10B981' },
                  { label: 'Shopping', value: 856, color: '#38BDF8' },
                  { label: 'Transport', value: 513, color: '#8B5CF6' },
                  { label: 'Bills & utilities', value: 427, color: '#F59E0B' },
                  { label: 'Other', value: 600, color: '#CBD5E1' },
                ]}
                centerLabel="Spent"
                centerValue="$3,420"
              />
            </div>
            <Link
              to="/app/analytics"
              className="focus-ring mt-5 inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Financial Insights <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Rewards */}
        <section>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Get More From Every Day.</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Earn points on everything you spend, then turn them into travel, dining, shopping and lifestyle rewards.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '15% off hotel stays', partner: 'Global Stays', points: '5,000 pts', tone: '#10B981' },
              { title: '$50 flight voucher', partner: 'SkyLink Air', points: '8,000 pts', tone: '#38BDF8' },
              { title: 'Dining cashback', partner: 'Local Eats', points: '3,000 pts', tone: '#F59E0B' },
              { title: 'Electronics discount', partner: 'TechWorld', points: '6,000 pts', tone: '#8B5CF6' },
              { title: 'Lifestyle voucher', partner: 'Urban Living', points: '4,000 pts', tone: '#14B8A6' },
              { title: 'Shopping weekend', partner: 'Mega Mall', points: '2,500 pts', tone: '#0EA5E9' },
            ].map((offer) => (
              <div key={offer.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
                <span className="block h-1.5 w-12 rounded-full" style={{ backgroundColor: offer.tone }} aria-hidden />
                <p className="mt-3 text-sm font-bold text-slate-900">{offer.title}</p>
                <p className="text-xs text-slate-500">{offer.partner}</p>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">{offer.points}</p>
              </div>
            ))}
          </div>

          <Link
            to="/app/rewards"
            className="focus-ring mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Explore Rewards
          </Link>
        </section>

        {/* Business */}
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Store, label: 'Business account', hint: 'Current, payroll, reserve & FX' },
                { icon: Users, label: 'Payroll', hint: 'One run, every department' },
                { icon: FileText, label: 'Invoices', hint: 'Send and chase faster' },
                { icon: ShieldCheck, label: 'Approvals', hint: 'Maker-checker control' },
                { icon: CreditCard, label: 'Business cards', hint: 'Per-card limits & receipts' },
                { icon: TrendingUp, label: 'Cash flow', hint: 'Forecast and runway' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-2.5 text-sm font-bold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Built for Ambitious Businesses.</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Company accounts, bulk payouts, payroll and approvals with the separation of duties your finance team expects —
              and the speed your business needs.
            </p>
            <Link
              to="/business"
              className="focus-ring mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Explore Business Banking
            </Link>
          </div>
        </section>

        {/* International */}
        <section>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your Banking, Without Borders.</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Hold and spend multiple currencies, send international transfers with tracked settlement, and always see the rate
              and fee before you confirm.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { flag: '🇺🇸', pair: 'USD / PKR', buy: 277.5, sell: 278.4, change: '+0.12%' },
              { flag: '🇪🇺', pair: 'EUR / PKR', buy: 298.3, sell: 299.6, change: '+0.08%' },
              { flag: '🇦🇪', pair: 'AED / PKR', buy: 75.6, sell: 76.1, change: '+0.10%' },
            ].map((rate) => (
              <div key={rate.pair} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" aria-hidden>
                    {rate.flag}
                  </span>
                  <p className="text-sm font-bold text-slate-900">{rate.pair}</p>
                </div>
                <p className="tnum mt-3 text-xs text-slate-500">
                  Buy {rate.buy} • Sell {rate.sell}
                </p>
                <p className="tnum mt-1 text-xs font-bold text-emerald-600">{rate.change}</p>
              </div>
            ))}
          </div>

          <Link
            to="/rates"
            className="focus-ring mt-6 inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            See all rates and fees <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Dark premium break                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-navy navy-mesh">
        <div className="animate-spin-slow pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />

        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="relative">
                <div className="animate-float">
                  <PaybackCard3D card={demoCards[2]} size="md" />
                </div>
                <div className="absolute -bottom-6 -left-6 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3.5 py-2.5 backdrop-blur sm:flex">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />
                  <span className="text-[11px] font-semibold text-white">Secure element active</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Banking Beyond the Ordinary.</h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                A private-grade experience: metal cards, embedded secure elements, biometric approvals and a security centre
                that shows you exactly how your money is protected — every day, on every device.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: CreditCard, label: 'Metal card', hint: 'Brushed finish & hologram' },
                  { icon: Fingerprint, label: 'Biometric approvals', hint: 'Device secure enclave' },
                  { icon: ShieldCheck, label: 'Always monitored', hint: 'Fraud scoring in real time' },
                  { icon: Globe, label: 'Global reach', hint: 'Multi-currency transfers' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/5 p-4">
                    <item.icon className="h-5 w-5 text-emerald-300" aria-hidden />
                    <p className="mt-2 text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-white/55">{item.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Final CTA                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Your Financial Life. One Place.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Open a smarter banking experience built around the way you live, work and move money.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-7 text-base font-semibold text-white shadow-soft transition-all hover:bg-emerald-600"
            >
              Open an Account
            </Link>
            <Link
              to="/login"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 px-7 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              Login to PAYBACK
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Prototype demonstration — no real financial service is provided and all figures are synthetic.
          </p>
        </div>
      </section>
    </div>
  );
}