import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation, Phone } from 'lucide-react';
import { Card, CardBody, DemoBanner } from '@/components/ui';
import { atms, branches } from '@/data/products';

export default function BranchesPage() {
  return (
    <div className="mx-auto w-full max-w-content space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Branches & ATMs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Find us near you</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Branch and cash-machine locations shown below are approximate examples for this prototype — no mapping or location
          service is connected.
        </p>
      </header>

      <DemoBanner label="Demo locations" text="Addresses, hours and availability are synthetic examples." />

      <section className="grid gap-4 sm:grid-cols-2">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardBody className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.address}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {branch.city} • {branch.hours}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                    branch.open ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {branch.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="h-3.5 w-3.5" aria-hidden /> {branch.phone}
              </p>
              <Link to="/app/branches" className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                View in app <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </CardBody>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Cash machines nearby</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {atms.map((atm) => (
            <div key={atm.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Navigation className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{atm.name}</p>
                <p className="text-xs text-slate-500">
                  {atm.address} • {atm.distance}
                </p>
                <p className="text-[11px] text-slate-400">
                  {atm.type} • {atm.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}