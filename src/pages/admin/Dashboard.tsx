import { Link } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { GroupedBarChart } from '@/components/charts';
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  SectionTitle,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import {
  adminIntegrationHealth,
  adminKpis,
  adminMetrics,
  adminVolumeSeries,
} from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function AdminDashboardPage() {
  const queues = [
    { label: 'Pending KYC', value: adminMetrics.pendingKyc, to: '/admin/kyc', tone: 'amber' },
    { label: 'Open disputes', value: adminMetrics.openDisputes, to: '/admin/disputes', tone: 'rose' },
    { label: 'Fraud flagged', value: adminMetrics.fraudFlagged, to: '/admin/risk', tone: 'rose' },
    { label: 'Support queue', value: adminMetrics.supportQueue, to: '/admin/reports', tone: 'sky' },
  ] as const;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Internal platform"
        title="Operations dashboard"
        description="Platform health, queues and volume at a glance."
        actions={
          <>
            <Badge tone="emerald" icon={<Activity className="h-3 w-3" aria-hidden />}>
              Uptime {adminMetrics.uptime}%
            </Badge>
            <Badge tone="violet">Demo data</Badge>
          </>
        }
      />

      <DemoBanner label="Demo admin data" text="Every metric, queue and log entry below is synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminKpis.map((kpi) => (
          <Link key={kpi.id} to="/admin/analytics" className="card-base focus-ring p-4 transition-shadow hover:shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{kpi.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${kpi.tone}1a`, color: kpi.tone }}>
                <Icon name={kpi.icon} className="h-5 w-5" />
              </span>
            </div>
            <p className="tnum mt-2 text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className={`mt-1 text-xs font-semibold ${kpi.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {kpi.delta >= 0 ? '▲' : '▼'} {Math.abs(kpi.delta)}% vs last period
            </p>
          </Link>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title="Transaction volume" subtitle="Last 7 days • inflow vs outflow (demo)" />
          <CardBody>
            <GroupedBarChart
              data={adminVolumeSeries}
              series={[
                { key: 'inflow', label: 'Inflow', tone: '#10B981' },
                { key: 'outflow', label: 'Outflow', tone: '#38BDF8' },
              ]}
              height={240}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Queues"
              subtitle="Work waiting on your team"
              action={
                <Link to="/admin/kyc" className="focus-ring inline-flex min-h-[44px] items-center rounded-lg px-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50">
                  Open
                </Link>
              }
            />
            <CardBody className="space-y-2.5">
              {queues.map((queue) => (
                <Link
                  key={queue.label}
                  to={queue.to}
                  className="focus-ring flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <span className="text-sm font-semibold text-slate-700">{queue.label}</span>
                  <span className="tnum rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold text-slate-800">{queue.value}</span>
                </Link>
              ))}
            </CardBody>
          </Card>

          <Alert tone="success" title="All critical systems operational">
            One rail is degraded — see Integrations for latency details.
          </Alert>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle
          title="Integration health"
          description="Latency and uptime of core rails."
          action={
            <Link to="/admin/integrations" className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
              Manage <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminIntegrationHealth.slice(0, 6).map((integration) => (
            <Card key={integration.id}>
              <CardBody className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{integration.name}</p>
                  <p className="tnum text-xs text-slate-500">
                    {integration.latency} • {integration.uptime} uptime
                  </p>
                </div>
                <Badge
                  tone={integration.status === 'Operational' ? 'emerald' : integration.status === 'Degraded' ? 'amber' : 'violet'}
                >
                  {integration.status}
                </Badge>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </PageWrap>
  );
}
