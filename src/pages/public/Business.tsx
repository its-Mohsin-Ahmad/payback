import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Building2, CreditCard, FileText, Package, ShieldCheck, Store, Users } from 'lucide-react';
import { Card, CardBody, DemoBanner, SecurityBadge } from '@/components/ui';

const modules = [
  { icon: Building2, title: 'Multi-account', body: 'Current, payroll, tax reserve and FX accounts under one company profile.' },
  { icon: BarChart3, title: 'Cash flow', body: 'Inflow vs outflow, working-capital gaps and a rolling forecast.' },
  { icon: FileText, title: 'Invoices', body: 'Raise, send and chase invoices with hosted payment links.' },
  { icon: Store, title: 'Vendors', body: 'Payables with terms, due dates and bulk payment runs.' },
  { icon: Users, title: 'Payroll', body: 'Department-level runs, tax withholding and one-click submission.' },
  { icon: ShieldCheck, title: 'Approvals', body: 'Maker-checker workflows with dual control above your threshold.' },
  { icon: CreditCard, title: 'Corporate cards', body: 'Issue team cards with per-card limits and instant freeze.' },
  { icon: Package, title: 'Integrations', body: 'Accounting sync, payroll automation and bulk payout APIs.' },
];

export default function BusinessPage() {
  return (
    <div className="space-y-16">
      <section className="bg-navy navy-mesh">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-white/15">
                Business banking
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Run the numbers. Keep the controls.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                Company accounts, payouts, payroll, invoices and approvals — with the separation of duties your finance team
                expects and the speed your business needs.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-base font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600">
                  Open a business account
                </Link>
                <Link to="/business/app" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-base font-semibold text-white transition-colors hover:bg-white/20">
                  Preview the console
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <SecurityBadge label="Dual approval" />
                <SecurityBadge label="Role-based access" />
                <SecurityBadge label="Audit trail" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { k: '$186M', v: 'Monthly volume processed' },
                { k: '5,000', v: 'Payouts per bulk file' },
                { k: '99.9%', v: 'Platform uptime' },
                { k: '2 hrs', v: 'Average dispute resolution' },
              ].map((stat) => (
                <div key={stat.k} className="rounded-2xl bg-white/5 p-4">
                  <p className="tnum text-xl font-bold text-emerald-300">{stat.k}</p>
                  <p className="mt-0.5 text-xs text-white/60">{stat.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-content space-y-6 px-4 sm:px-6 lg:px-8">
        <DemoBanner label="Prototype" text="Business figures shown are synthetic and no account can actually be opened here." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <Card key={module.title}>
              <CardBody className="space-y-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <module.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{module.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{module.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">How a payment flows</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            {[
              { step: '1', title: 'Maker creates', body: 'A team member uploads or creates the payment with an invoice reference.' },
              { step: '2', title: 'Policy checks', body: 'Limits, beneficiaries and sanctions screening run automatically.' },
              { step: '3', title: 'Approver releases', body: 'A second authorised user approves — one person can never do both.' },
              { step: '4', title: 'Funds settle', body: 'Debit happens at the value date with a downloadable audit receipt.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-slate-50 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
                  {item.step}
                </span>
                <p className="mt-2.5 text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
          <Link to="/business/app/approvals" className="focus-ring mt-6 inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            See the approvals queue <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}