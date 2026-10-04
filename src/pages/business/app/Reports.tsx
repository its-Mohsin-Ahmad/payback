import { Download, FileBarChart } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  EmptyState,
  PageHeader,
  useToast,
} from '@/components/ui';
import { businessMetrics, cashflowSeries } from '@/data/enterprise';
import { money } from '@/lib/utils';

/*
 * The business nav has always linked "Reports" to /business/app/reports, but no
 * route was ever registered for it — the path fell through to the `*` catch-all
 * and silently redirected to the dashboard. This page makes that link real.
 */

type ReportRow = {
  name: string;
  category: 'Financial' | 'Compliance' | 'Operational';
  period: string;
  updated: string;
};

const reports: ReportRow[] = [
  { name: 'Monthly profit & loss', category: 'Financial', period: 'May 2026', updated: '2 Jun 2026' },
  { name: 'Cash movement summary', category: 'Financial', period: 'May 2026', updated: '2 Jun 2026' },
  { name: 'Card spend breakdown', category: 'Operational', period: 'May 2026', updated: '1 Jun 2026' },
  { name: 'Invoice ageing', category: 'Financial', period: 'Q2 2026', updated: '31 May 2026' },
  { name: 'Transaction audit trail', category: 'Compliance', period: 'May 2026', updated: '31 May 2026' },
  { name: 'KYC & beneficial ownership', category: 'Compliance', period: 'Annual', updated: '28 May 2026' },
  { name: 'Payroll reconciliation', category: 'Operational', period: 'May 2026', updated: '28 May 2026' },
  { name: 'Vendor payment register', category: 'Financial', period: 'May 2026', updated: '27 May 2026' },
];

const CATEGORY_TONE: Record<ReportRow['category'], string> = {
  Financial: 'bg-emerald-50 text-emerald-700',
  Compliance: 'bg-violet-50 text-violet-700',
  Operational: 'bg-sky-50 text-sky-700',
};

export default function BusinessReportsPage() {
  const toast = useToast();

  const totalIn = cashflowSeries.reduce((s, m) => s + m.inflow, 0);
  const totalOut = cashflowSeries.reduce((s, m) => s + m.outflow, 0);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Business banking"
        title="Reports"
        description="Periodical statements and exports for your business account."
        actions={
          <Button
            className="min-h-[44px] w-full sm:w-auto"
            onClick={() => toast.success('Export queued', 'Your full report bundle will be emailed when it is ready.')}
          >
            <Download className="h-4 w-4" aria-hidden />
            Export all
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Money in', value: money(totalIn), tone: 'text-emerald-600' },
          { label: 'Money out', value: money(totalOut), tone: 'text-rose-600' },
          { label: 'Net position', value: money(businessMetrics.totalBalance), tone: 'text-slate-900' },
        ].map((m) => (
          <Card key={m.label}>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{m.label}</p>
              <p className={`mt-1 text-xl font-bold ${m.tone}`}>{m.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Available reports"
          subtitle="Generated from your business activity. All figures are synthetic."
        />
        <CardBody>
          <ul className="grid gap-2">
            {reports.map((r) => (
              <li key={r.name}>
                <button
                  type="button"
                  onClick={() => toast.info('Preparing report', `${r.name} · ${r.period}`)}
                  className="focus-ring flex min-h-[56px] w-full items-center gap-3 rounded-xl border border-slate-200 px-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <FileBarChart className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">{r.name}</span>
                    <span className="block text-xs text-slate-500">
                      {r.period} · Updated {r.updated}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_TONE[r.category]}`}
                  >
                    {r.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <DemoBanner />
    </PageWrap>
  );
}