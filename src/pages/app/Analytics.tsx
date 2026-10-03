import { useState } from 'react';
import { Download, Sparkles, TrendingUp } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { AreaChart, DonutChart, GroupedBarChart } from '@/components/charts';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  ProgressBar,
  SectionTitle,
  SegmentedControl,
  StatCard,
  useToast,
} from '@/components/ui';
import { balanceHistory, monthlyTrend, spendingBreakdown, transactions } from '@/data/mock';
import { money } from '@/lib/utils';

type Range = '6M' | '1Y' | 'All';

export default function AnalyticsPage() {
  const toast = useToast();
  const [range, setRange] = useState<Range>('6M');

  const income = monthlyTrend.reduce((s, m) => s + m.income, 0);
  const spending = monthlyTrend.reduce((s, m) => s + m.spending, 0);
  const savingsRate = Math.round(((income - spending) / income) * 100);
  const avgTicket = transactions.reduce((s, t) => s + Math.abs(t.amount), 0) / transactions.length;
  const categoryTotals = spendingBreakdown.slice().sort((a, b) => b.value - a.value);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Overview"
        title="Analytics"
        description="Understand where your money comes from, where it goes and how that changes over time."
        actions={
          <>
            <SegmentedControl<Range>
              value={range}
              onChange={setRange}
              size="sm"
              options={[{ value: '6M', label: '6M' }, { value: '1Y', label: '1Y' }, { value: 'All', label: 'All' }]}
            />
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" aria-hidden />}
              onClick={() => toast.success('Report ready', 'Your analytics report was exported (demo).')}
            >
              Export
            </Button>
          </>
        }
      />

      <DemoBanner label="Demo analytics" text="All figures below are computed from the synthetic demo ledger." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Income (period)" value={money(income, 'USD', { decimals: false })} delta={6.2} tone="#10B981" icon={<TrendingUp className="h-5 w-5" aria-hidden />} />
        <StatCard label="Spending (period)" value={money(spending, 'USD', { decimals: false })} delta={-3.4} tone="#38BDF8" icon={<TrendingUp className="h-5 w-5" aria-hidden />} />
        <StatCard label="Savings rate" value={`${savingsRate}%`} delta={2.1} tone="#8B5CF6" footer="Target: 30% of income" />
        <StatCard label="Avg. transaction" value={money(avgTicket)} tone="#F59E0B" footer={`${transactions.length} transactions analysed`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Balance over time" subtitle={`Range: ${range} • demo data`} />
          <CardBody>
            <AreaChart data={balanceHistory} tone="#10B981" height={220} valueFormatter={(n) => money(n, 'USD', { decimals: false })} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Income vs spending" subtitle="Last six months" />
          <CardBody>
            <GroupedBarChart
              data={monthlyTrend}
              series={[
                { key: 'income', label: 'Income', tone: '#10B981' },
                { key: 'spending', label: 'Spending', tone: '#38BDF8' },
              ]}
              height={220}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Spending by category" subtitle="April 2025" />
          <CardBody>
            <DonutChart data={spendingBreakdown} size={180} centerLabel="Total" centerValue={money(3420, 'USD', { decimals: false })} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Category detail" subtitle="Amounts and share of spend" />
          <CardBody className="space-y-4">
            {categoryTotals.map((c) => (
              <ProgressBar key={c.label} value={c.value} max={categoryTotals[0].value} tone={c.color} label={c.label} />
            ))}
          </CardBody>
        </Card>
      </div>

      <section className="space-y-3">
        <SectionTitle title="Insights" description="Automatic observations from your demo data." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Alert tone="success" title="You are spending less on dining">
            Food &amp; dining is down 12% versus last month — roughly {money(140)} back in your pocket.
          </Alert>
          <Alert tone="warning" title="Subscriptions creeping up">
            Three recurring subscriptions renewed this month totalling {money(53.99)}. Review them under Bill Payments.
          </Alert>
          <Alert tone="info" title="Room to save">
            Moving {money(300)} monthly into Savings would reach your emergency-fund goal in 14 months at the illustrative
            profit rate.
          </Alert>
        </div>
      </section>

      <Card className="navy-mesh bg-navy text-white">
        <CardBody className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold">PAYBACK Insights (demo)</p>
              <p className="text-xs text-white/60">Forecasts are illustrative projections, not financial advice.</p>
            </div>
          </div>
          <Button variant="soft" size="sm" onClick={() => toast.info('Coming soon', 'Smart budgets land in a future demo release.')}>
            Try smart budgets
          </Button>
        </CardBody>
      </Card>
    </PageWrap>
  );
}
