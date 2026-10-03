import { Download } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { AreaChart, GroupedBarChart } from '@/components/charts';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  StatCard,
  useToast,
} from '@/components/ui';
import { businessMetrics, cashflowSeries } from '@/data/enterprise';
import { money } from '@/lib/utils';

const forecast = [
  { label: 'May', value: 134000 },
  { label: 'Jun', value: 141500 },
  { label: 'Jul', value: 138200 },
  { label: 'Aug', value: 147800 },
];

export default function CashflowPage() {
  const toast = useToast();

  const avgIn = cashflowSeries.reduce((s, m) => s + m.inflow, 0) / cashflowSeries.length;
  const avgOut = cashflowSeries.reduce((s, m) => s + m.outflow, 0) / cashflowSeries.length;
  const runway = Math.round((businessMetrics.totalBalance / avgOut) * 10) / 10;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Business banking"
        title="Cash flow"
        description="Where money enters and leaves the business — with a simple forecast."
        actions={
          <Button
            variant="outline"
            icon={<Download className="h-4 w-4" aria-hidden />}
            onClick={() => toast.success('Export queued', 'Cash-flow report exported as CSV (demo).')}
          >
            Export report
          </Button>
        }
      />

      <DemoBanner label="Demo cash flow" text="Forecast is a straight-line illustration, not a financial projection." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg monthly inflow" value={money(avgIn, 'USD', { decimals: false })} delta={4.2} tone="#10B981" />
        <StatCard label="Avg monthly outflow" value={money(avgOut, 'USD', { decimals: false })} delta={-2.1} tone="#38BDF8" />
        <StatCard label="Net this month" value={money(businessMetrics.netCash, 'USD', { decimals: false })} delta={5.4} tone="#8B5CF6" />
        <StatCard label="Runway (at avg spend)" value={`${runway} months`} tone="#F59E0B" footer="Based on current balances" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Inflow vs outflow" subtitle="Last six months" />
          <CardBody>
            <GroupedBarChart
              data={cashflowSeries}
              series={[
                { key: 'inflow', label: 'Inflow', tone: '#10B981' },
                { key: 'outflow', label: 'Outflow', tone: '#38BDF8' },
              ]}
              height={240}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Projected inflow" subtitle="Next four months (illustrative)" />
          <CardBody>
            <AreaChart data={forecast} tone="#8B5CF6" height={240} valueFormatter={(n) => money(n, 'USD', { decimals: false })} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { title: 'Biggest inflow driver', body: 'Aurora Retail Group contributes 31% of monthly inflow — concentration worth watching.' },
          { title: 'Recurring outflows', body: 'Payroll and cloud hosting account for 64% of outflows each month.' },
          { title: 'Timing gap', body: 'Receivables average 34 days while payables average 27 days — a 7-day working-capital gap.' },
        ].map((insight) => (
          <Card key={insight.title}>
            <CardBody>
              <p className="text-sm font-bold text-slate-900">{insight.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{insight.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Alert tone="warning" title="Demo only">
        Cash-flow insights are generated from synthetic data and must not be used for business decisions.
      </Alert>
    </PageWrap>
  );
}
