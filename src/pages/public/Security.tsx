import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Fingerprint, KeyRound, Lock, MonitorSmartphone, ShieldCheck, Siren } from 'lucide-react';
import { Card, CardBody, DemoBanner, SecurityBadge } from '@/components/ui';

const pillars = [
  { icon: Lock, title: 'Encryption everywhere', body: 'Data at rest and in transit uses modern, reviewed ciphers with strict key rotation.' },
  { icon: Fingerprint, title: 'Biometric & passkeys', body: 'Payment approvals can require a face or fingerprint check — never just a session token.' },
  { icon: KeyRound, title: 'Layered authentication', body: 'Device binding, risk-based step-up and mandatory 2FA above defined thresholds.' },
  { icon: MonitorSmartphone, title: 'Real-time monitoring', body: 'Every authorisation is scored in milliseconds; unusual behaviour triggers a hold.' },
  { icon: Siren, title: 'Instant kill switch', body: 'Freeze cards and end sessions from the app the moment something looks wrong.' },
  { icon: ShieldCheck, title: 'Audited by design', body: 'Privileged actions are logged immutably and reviewed under separation-of-duties rules.' },
];

export default function SecurityPage() {
  return (
    <div className="space-y-16">
      <section className="bg-navy navy-mesh">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-white/15">
                Security & trust
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Security that never takes a day off
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                Banking-grade controls built into every layer — from how we store data to how a payment is authorised in the
                split second before money moves.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <SecurityBadge label="256-bit encryption" />
                <SecurityBadge label="PCI-DSS aligned" />
                <SecurityBadge label="24/7 monitoring" />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Your security score</p>
              <p className="tnum mt-2 text-5xl font-bold text-emerald-300">86</p>
              <p className="mt-1 text-sm text-white/60">Strong — two improvements to reach 100</p>
              <div className="mt-4 space-y-2.5">
                {[
                  { label: 'Two-factor authentication', ok: true },
                  { label: 'Biometric sign-in', ok: true },
                  { label: 'Transaction alerts', ok: true },
                  { label: 'Recovery email verified', ok: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{row.label}</span>
                    <span className={row.ok ? 'text-emerald-300' : 'text-amber-300'}>{row.ok ? 'Done' : 'Action'}</span>
                  </div>
                ))}
              </div>
              <Link to="/app/security" className="focus-ring mt-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20">
                Open Security Centre <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-content space-y-6 px-4 sm:px-6 lg:px-8">
        <DemoBanner label="Prototype" text="Security controls described here illustrate intended behaviour — none are live in this demo." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title}>
              <CardBody className="space-y-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <pillar.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{pillar.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{pillar.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardBody className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Protecting your money</h2>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  'Every transfer above your tier limit needs two-factor confirmation.',
                  'New beneficiaries stay unverified for 24 hours before you can pay them.',
                  'Beneficiary details are matched before the payment is sent — never after.',
                  'Disputed card payments are provisionally credited while we investigate.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">If something goes wrong</h2>
              <ol className="space-y-3 text-sm text-slate-600">
                {[
                  { n: '1', t: 'Freeze the card or end sessions immediately from the app.' },
                  { n: '2', t: 'Report the transaction and attach any reference you have.' },
                  { n: '3', t: 'We investigate within 24 hours and keep you updated.' },
                  { n: '4', t: 'Genuine claims are refunded in full, with interest where due.' },
                ].map((step) => (
                  <li key={step.n} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {step.n}
                    </span>
                    {step.t}
                  </li>
                ))}
              </ol>
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                PAYBACK will never ask for your password, PIN or verification code. Report any such request to support.
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="rounded-3xl bg-emerald-500 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-white">See your own security posture</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
            The demo Security Centre shows a personalised score, active sessions and alerts you can act on instantly.
          </p>
          <Link to="/app/security" className="focus-ring mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-800">
            Open Security Centre
          </Link>
        </div>
      </section>
    </div>
  );
}