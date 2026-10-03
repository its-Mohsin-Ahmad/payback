import { useState } from 'react';
import { PageWrap } from '@/components/blocks';
import { AreaChart, DonutChart, GroupedBarChart } from '@/components/charts';
import {
  DemoBanner,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
  SegmentedControl,
  StatCard,
} from '@/components/ui';
import { adminMetrics, adminVolumeSeries } from '@/data/enterprise';
import { compact, money } from '@/lib/utils';

type Range = '7D' | '30D' | '90D';

const userGrowth = [
  { label: 'Nov', value: 41200 },
  { label: 'Dec', value: 42400 },
  { label: 'Jan', value: 43850 },
  { label: 'Feb', value: 45100 },
  { label: 'Mar', value: 46600 },
  { label: 'Apr', value: 48210 },
];

const segmentMix = [
  { label: 'Individual', value: 34120, color: '#10B981' },
  { label: 'Business', value: 9840, color: '#38BDF8' },
  { label: 'Student', value: 2860, color: '#8B5CF6' },
  { label: 'Enterprise', value: 1390, color: '#F59E0B' },
];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<Range>('30D');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Overview"
        title="Platform analytics"
        description="Growth, volume and mix across the PAYBACK platform (demo)."
        actions={
          <SegmentedControl<Range>
            value={range}
            onChange={setRange}
            size="sm"
            options={[{ value: '7D', label: '7D' }, { value: '30D', label: '30D' }, { value: '90D', label: '90D' }]}
          />
        }
      />

      <DemoBanner label="Demo analytics" text="Figures are synthetic and generated for demonstration." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={adminMetrics.totalUsers.toLocaleString()} delta={4.4} tone="#10B981" />
        <StatCard label="Active today" value={adminMetrics.activeToday.toLocaleString()} delta={2.6} tone="#38BDF8" />
        <StatCard label="New this month" value={adminMetrics.newThisMonth.toLocaleString()} delta={8.1} tone="#8B5CF6" />
        <StatCard label="Volume (30d)" value={`$${compact(adminMetrics.totalVolume)}`} delta={6.8} tone="#F59E0B" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="User growth" subtitle={`Range: ${range} • cumulative accounts`} />
          <CardBody>
            <AreaChart data={userGrowth} tone="#10B981" height={230} valueFormatter={(n) => compact(n)} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Daily volume" subtitle="Inflow vs outflow (demo)" />
          <CardBody>
            <GroupedBarChart
              data={adminVolumeSeries}
              series={[
                { key: 'inflow', label: 'Inflow', tone: '#10B981' },
                { key: 'outflow', label: 'Outflow', tone: '#38BDF8' },
              ]}
              height={230}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Customer mix" subtitle="By segment" />
          <CardBody>
            <DonutChart data={segmentMix} centerLabel="Users" centerValue={adminMetrics.totalUsers.toLocaleString()} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Key ratios" subtitle="Health of the platform" />
          <CardBody className="space-y-4">
            {[
              { label: 'KYC approval rate', value: 92, note: '186 pending review' },
              { label: 'Disputes resolved within SLA', value: 88, note: '42 open' },
              { label: 'Transactions succeeding', value: 99, note: 'Failed + reversed excluded' },
              { label: 'Support first-reply SLA', value: 95, note: `${adminMetrics.supportQueue} queued` },
            ].map((ratio) => (
              <div key={ratio.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{ratio.label}</span>
                  <span className="tnum font-bold text-slate-900">{ratio.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${ratio.value}%` }} />
                </div>
                <p className="text-[11px] text-slate-400">{ratio.note}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PageWrap>
  );
}
