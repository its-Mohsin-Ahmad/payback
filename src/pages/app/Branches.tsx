import { MapPin, Navigation, Phone } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { Alert, Badge, Button, Card, CardBody, CardHeader, DemoBanner, PageHeader } from '@/components/ui';
import { atms, branches } from '@/data/products';

export default function BranchesPage() {
  return (
    <PageWrap>
      <PageHeader
        eyebrow="Tools"
        title="Branches & ATMs"
        description="Find nearby PAYBACK branches and cash machines (approximate demo locations)."
        actions={
          <Badge tone="emerald" icon={<Navigation className="h-3 w-3" aria-hidden />}>
            Location: Lahore (demo)
          </Badge>
        }
      />

      <DemoBanner label="Demo locations" text="Addresses are illustrative. No live location or mapping service is used." />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Branches" subtitle={`${branches.length} branches`} />
          <CardBody className="space-y-3">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{branch.name}</p>
                    <Badge tone={branch.open ? 'emerald' : 'rose'}>{branch.open ? 'Open now' : 'Closed'}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{branch.address}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {branch.city} • {branch.hours} • {branch.phone}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                >
                  Directions
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="ATMs" subtitle={`${atms.length} machines nearby`} />
          <CardBody className="space-y-3">
            {atms.map((atm) => (
              <div key={atm.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{atm.name}</p>
                    <Badge tone={atm.status === 'Available' ? 'emerald' : 'amber'}>{atm.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {atm.address} • {atm.distance}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{atm.type}</p>
                </div>
              </div>
            ))}
            <Alert tone="info" title="Deposit ATMs accept cash">
              Machines marked “Cash • Deposit” accept note deposits up to {new Intl.NumberFormat('en-US').format(5000)} per day.
            </Alert>
          </CardBody>
        </Card>
      </section>
    </PageWrap>
  );
}
