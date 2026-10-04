import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Clock, TrendingUp } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { GroupedBarChart } from '@/components/charts';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  EmptyState,
  PageHeader,
  SectionTitle,
  StatCard,
} from '@/components/ui';
import {
  approvals,
  businessAccounts,
  businessMetrics,
  cashflowSeries,
  invoices,
} from '@/data/enterprise';
import { useSession } from '@/lib/session/SessionProvider';
import { activeBusiness, displayName, greeting } from '@/lib/session/selectors';
import { money } from '@/lib/utils';

export default function BusinessDashboardPage() {
  // Company identity resolves from the session, so switching business changes
  // this whole page (§14, §23).
  const { session } = useSession();
  const navigate = useNavigate();
  const user = session.user;
  const biz = activeBusiness(session);

  /**
   * A user with no business profile has no business dashboard to show. Handled
   * explicitly rather than with `?? '…'` at each usage, so a missing business can
   * never render as a half-blank page full of placeholder company names (§27).
   */
  if (!biz) {
    return (
      <PageWrap>
        <EmptyState
          icon={<Building2 className="h-6 w-6" aria-hidden />}
          title="No business profile yet"
          description="Create a business to unlock business banking, cards and team tools."
          action={<Button onClick={() => navigate('/business/app/profile')}>Set up a business</Button>}
        />
      </PageWrap>
    );
  }
  const dueInvoices = invoices.filter((i) => i.status === 'Overdue' || i.status === 'Sent').slice(0, 4);
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Business banking"
        /* Greeting uses the signed-in user; the company line uses the active
           business. Both are derived, never stored (§14, §27). */
        title={`${greeting()}, ${displayName(user)}`}
        description={`${biz.name} • ${biz.userRole} view`}
        actions={
          <>
            <Badge tone="sky" icon={<Building2 className="h-3 w-3" aria-hidden />}>
              {biz.industry}
            </Badge>
            <Link
              to="/business/app/approvals"
              className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600"
            >
              Approvals
              {pendingApprovals.length > 0 ? (
                <span className="rounded-full bg-white/20 px-1.5 text-[11px] font-bold">{pendingApprovals.length}</span>
              ) : null}
            </Link>
          </>
        }
      />

      <DemoBanner label="Demo business data" text="Balances, invoices and approvals are synthetic — no company accounts are connected." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total balance" value={money(businessMetrics.totalBalance, 'USD', { decimals: false })} delta={3.1} tone="#10B981" icon={<TrendingUp className="h-5 w-5" aria-hidden />} footer={`${businessAccounts.length} accounts`} />
        <StatCard label="Net cash this month" value={money(businessMetrics.netCash, 'USD', { decimals: false })} delta={5.4} tone="#38BDF8" footer={`In ${money(businessMetrics.monthInflow, 'USD', { decimals: false })} • Out ${money(businessMetrics.monthOutflow, 'USD', { decimals: false })}`} />
        <StatCard label="Unpaid invoices" value={money(businessMetrics.unpaidAmount, 'USD', { decimals: false })} tone="#F59E0B" footer={`${businessMetrics.unpaidInvoices} invoices • ${businessMetrics.overdueInvoices} overdue`} />
        <StatCard label="Payroll due" value={money(businessMetrics.payrollAmount, 'USD', { decimals: false })} tone="#8B5CF6" footer={businessMetrics.payrollDue} />
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader
            title="Cash flow"
            subtitle="Inflow vs outflow — last six months"
            action={
              <Link to="/business/app/cashflow" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50">
                Details
              </Link>
            }
          />
          <CardBody>
            <GroupedBarChart
              data={cashflowSeries}
              series={[
                { key: 'inflow', label: 'Inflow', tone: '#10B981' },
                { key: 'outflow', label: 'Outflow', tone: '#38BDF8' },
              ]}
              height={230}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Awaiting approval"
              subtitle={`${pendingApprovals.length} items need you`}
              action={
                <Link to="/business/app/approvals" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50">
                  Review
                </Link>
              }
            />
            <CardBody className="space-y-3">
              {pendingApprovals.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.requestedBy} • {item.approvers}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tnum text-sm font-bold text-slate-900">{money(item.amount, 'USD', { decimals: false })}</p>
                    <Badge tone={item.risk === 'High' ? 'rose' : item.risk === 'Medium' ? 'amber' : 'emerald'}>{item.risk}</Badge>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Alert tone="warning" title="Payroll lock">
            Submit payroll by Apr 28 to guarantee {money(businessMetrics.payrollAmount, 'USD', { decimals: false })} lands on{' '}
            {businessMetrics.payrollDue}.
          </Alert>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle
          title="Invoices needing attention"
          description="Oldest first — chase before they age."
          action={
            <Link to="/business/app/invoices" className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
              All invoices <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <Card>
          <CardBody className="space-y-3">
            {dueInvoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3.5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{invoice.customer}</p>
                    <Badge tone={invoice.status === 'Overdue' ? 'rose' : 'sky'}>{invoice.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {invoice.id} • due {invoice.due}
                  </p>
                </div>
                <p className="tnum text-sm font-bold text-slate-900">{money(invoice.amount, invoice.currency, { decimals: false })}</p>
                <Link
                  to="/business/app/invoices"
                  className="focus-ring inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                >
                  Chase
                </Link>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      <section className="space-y-3">
        <SectionTitle
          title="Accounts"
          action={
            <Link to="/business/app/accounts" className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
              Manage <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {businessAccounts.map((account) => (
            <Card key={account.id}>
              <CardBody>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">{account.name}</p>
                  <Badge tone={account.status === 'Active' ? 'emerald' : 'amber'}>{account.status}</Badge>
                </div>
                <p className="tnum mt-2 text-xl font-bold text-slate-900">{money(account.balance, account.currency, { decimals: false })}</p>
                <p className="text-xs text-slate-500">
                  {account.type} • {account.number}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400">
        Business banking prototype for {biz.legalName} — all figures synthetic.
      </p>
    </PageWrap>
  );
}
