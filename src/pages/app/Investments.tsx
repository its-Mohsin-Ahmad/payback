import { TrendingUp, Wallet } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { DonutChart, Sparkline } from '@/components/charts';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  SectionTitle,
  StatCard,
  useToast,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { investments, investmentProducts } from '@/data/products';
import { money, percent } from '@/lib/utils';

const ALLOCATION_COLORS = ['#10B981', '#38BDF8', '#8B5CF6', '#F59E0B', '#14B8A6', '#0EA5E9'];

export default function InvestmentsPage() {
  const toast = useToast();

  const invested = investments.reduce((s, i) => s + i.invested, 0);
  const value = investments.reduce((s, i) => s + i.value, 0);
  const gain = value - invested;
  const gainPct = (gain / invested) * 100;

  const allocation = investments.map((i, idx) => ({
    label: i.name,
    value: i.value,
    color: ALLOCATION_COLORS[idx % ALLOCATION_COLORS.length],
  }));

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Grow & borrow"
        title="Investments"
        description="Your portfolio at a glance plus products to grow长期 wealth."
        actions={
          <Button icon={<TrendingUp className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'New subscriptions are simulated in this prototype.')}>
            Invest more
          </Button>
        }
      />

      <DemoBanner label="Demo portfolio" text="Prices, returns and holdings are synthetic — this is not investment advice or an offer." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current value" value={money(value, 'USD', { decimals: false })} delta={Number(gainPct.toFixed(1))} tone="#10B981" icon={<TrendingUp className="h-5 w-5" aria-hidden />} />
        <StatCard label="Total invested" value={money(invested, 'USD', { decimals: false })} tone="#38BDF8" icon={<Wallet className="h-5 w-5" aria-hidden />} />
        <StatCard label="Unrealised gain" value={`${gain >= 0 ? '+' : '−'}${money(Math.abs(gain), 'USD', { decimals: false })}`} delta={Number(gainPct.toFixed(1))} tone="#8B5CF6" footer={percent(gainPct)} />
        <StatCard label="Holdings" value={String(investments.length)} tone="#F59E0B" footer="Across 5 asset classes" />
      </div>

      <section className="space-y-3">
        <SectionTitle title="Your holdings" description="Live valuation of each position (demo)." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {investments.map((inv) => (
            <Card key={inv.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{inv.name}</p>
                    <p className="text-xs text-slate-500">{inv.type}</p>
                  </div>
                  <Badge tone={inv.changePct >= 0 ? 'emerald' : 'rose'}>{percent(inv.changePct)}</Badge>
                </div>

                <Sparkline
                  values={inv.sparkline}
                  tone={inv.changePct >= 0 ? '#10B981' : '#F43F5E'}
                  height={48}
                />

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="tnum text-xl font-bold text-slate-900">{money(inv.value, 'USD', { decimals: false })}</p>
                    <p className="tnum text-xs text-slate-500">Invested {money(inv.invested, 'USD', { decimals: false })}</p>
                  </div>
                  <Badge tone={inv.risk === 'Low' ? 'emerald' : inv.risk === 'Medium' ? 'amber' : 'rose'}>{inv.risk} risk</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <p className="text-slate-400">Horizon</p>
                    <p className="font-semibold text-slate-700">{inv.horizon}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Liquidity</p>
                    <p className="font-semibold text-slate-700">{inv.liquidity}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => toast.success('Order placed', `Bought more ${inv.name} (demo).`)}>
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Redemption', `Selling ${inv.name} is simulated (T+2).`)}>
                    Redeem
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Portfolio allocation" subtitle="By current market value" />
          <CardBody>
            <DonutChart data={allocation} centerLabel="Portfolio" centerValue={money(value, 'USD', { decimals: false })} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Products you can explore" subtitle="Certificates, funds and plans" />
          <CardBody className="grid gap-3 sm:grid-cols-2">
            {investmentProducts.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-100 p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.tone }} aria-hidden />
                  <p className="text-sm font-bold text-slate-900">{p.name}</p>
                </div>
                <p className="tnum mt-1.5 text-xs font-semibold text-emerald-600">{p.rate}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Risk {p.risk} • {p.term}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  block
                  className="mt-2.5"
                  onClick={() => toast.info(p.name, 'Product detail pages are simulated in this prototype.')}
                >
                  Learn more
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      <Alert tone="warning" title="Capital at risk">
        Past performance (even simulated) is not a guide to future returns. Everything on this screen is demo data and
        must not be taken as financial advice.
      </Alert>
    </PageWrap>
  );
}
