import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Leaf, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Card, CardBody, DemoBanner } from '@/components/ui';

const values = [
  { icon: Compass, title: 'Clarity over complexity', body: 'Fees, arrival times and risk are shown before you commit — never buried in terms.' },
  { icon: ShieldCheck, title: 'Trust is a feature', body: 'Security ships before growth experiments, and every privileged action is logged.' },
  { icon: Heart, title: 'Built for real life', body: 'Salary day, rent week, school fees — designed around actual money moments.' },
  { icon: Leaf, title: 'Lighter footprint', body: 'Paperless statements, digital receipts and fewer branch journeys by default.' },
];

const timeline = [
  { year: '2019', title: 'The idea', body: 'A small team set out to make everyday banking feel instant and calm in Pakistan.' },
  { year: '2021', title: 'First accounts', body: 'Current and savings accounts launched with instant internal transfers.' },
  { year: '2023', title: 'Business banking', body: 'Payroll, bulk payouts and maker-checker approvals for growing teams.' },
  { year: '2025', title: 'One ecosystem', body: 'Personal, business and admin surfaces connected by a single ledger.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section className="bg-navy navy-mesh">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-white/15">
                About PAYBACK
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Banking built around how money actually moves
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                PAYBACK is a digital banking ecosystem concept: everyday personal banking, business finance and the operational
                tooling that keeps both honest.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-base font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600">
                  Open an account
                </Link>
                <Link to="/business" className="focus-ring inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-base font-semibold text-white transition-colors hover:bg-white/20">
                  Business banking
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { k: '48k+', v: 'Demo customer accounts' },
                { k: '620+', v: 'Team members' },
                { k: '12', v: 'Cities with branches' },
                { k: '99.98%', v: 'Platform uptime' },
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
        <DemoBanner label="Prototype" text="PAYBACK is a demonstration ecosystem; the company, people and figures on this page are illustrative." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title}>
              <CardBody className="space-y-2.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <value.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-bold text-slate-900">{value.title}</p>
                <p className="text-sm leading-relaxed text-slate-500">{value.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">How we got here</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.year} className="border-l-2 border-emerald-500 pl-4">
                <p className="tnum text-sm font-bold text-emerald-600">{item.year}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-emerald-500 p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
                <Sparkles className="h-5 w-5" aria-hidden />
                Work with us
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <Users className="h-4 w-4" aria-hidden />
                We hire engineers, designers and risk thinkers who care about the details.
              </p>
            </div>
            <Link to="/support" className="focus-ring inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800">
              Say hello <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}