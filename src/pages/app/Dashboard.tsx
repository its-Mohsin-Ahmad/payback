import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, EyeOff, Gift, Send } from 'lucide-react';
import { AccountCard, ActionGrid, ListShell, TransactionRow } from '@/components/blocks';
import { AreaChart, DonutChart, GroupedBarChart } from '@/components/charts';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  ProgressBar,
  SectionTitle,
  SecurityBadge,
} from '@/components/ui';
import {
  accounts,
  balanceHistory,
  customer,
  monthlyTrend,
  notifications,
  rewardsSummary,
  spendingBreakdown,
  totalBalance,
  transactions,
} from '@/data/mock';
import { quickActions } from '@/lib/nav';
import { money } from '@/lib/utils';

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const masked = '••••••••';
  const latest = notifications.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-content space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Good morning, {customer.preferredName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {customer.tier} • Last signed in {totalBalance.lastLogin}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SecurityBadge label="256-bit encrypted" />
          <Button
            variant="outline"
            size="sm"
            icon={<EyeOff className="h-4 w-4" aria-hidden />}
            onClick={() => setHideBalance((v) => !v)}
          >
            {hideBalance ? 'Show balances' : 'Hide balances'}
          </Button>
          <Link
            to="/app/transfer"
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" aria-hidden />
            Send money
          </Link>
        </div>
      </header>

      <DemoBanner />

      {/* Hero balance card */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-5 text-white shadow-lift navy-mesh sm:p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Total balance</p>
              <p className="tnum mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {hideBalance ? masked : money(totalBalance.total, totalBalance.currency)}
              </p>
              <p className="mt-1.5 text-sm text-white/60">
                {hideBalance ? 'PKR equivalent hidden' : `≈ ${money(totalBalance.pkrEquivalent, 'PKR', { decimals: false })}`}
              </p>
            </div>
            <Badge tone="emerald">▲ {totalBalance.changePct}% this month</Badge>
          </div>

          <div className="mt-4 h-20 overflow-hidden rounded-2xl bg-white/5 p-2">
            <AreaChart
              data={balanceHistory}
              tone="#10B981"
              height={64}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Available', value: hideBalance ? masked : money(totalBalance.available) },
              { label: 'Accounts', value: String(accounts.length) },
              { label: 'Last login', value: totalBalance.lastLogin },
              { label: 'Status', value: 'All systems normal' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">{item.label}</p>
                <p className="tnum mt-0.5 truncate text-[13px] font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Quick actions" subtitle="Everything one tap away" />
            <CardBody>
              <ActionGrid items={quickActions} />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <Gift className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="tnum text-sm font-bold text-slate-900">{rewardsSummary.points.toLocaleString()} points</p>
                    <p className="text-xs text-slate-500">
                      {rewardsSummary.tier} tier • {rewardsSummary.cashValue}
                    </p>
                  </div>
                </div>
                <Link to="/app/rewards" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50">
                  Redeem
                </Link>
              </div>
              <ProgressBar value={rewardsSummary.points} max={rewardsSummary.nextTierPoints} tone="#F59E0B" label="Progress to Platinum" />
              <p className="text-[11px] text-slate-400">
                {(rewardsSummary.nextTierPoints - rewardsSummary.points).toLocaleString()} points to Platinum •{' '}
                {rewardsSummary.expiringPoints.toLocaleString()} expire {rewardsSummary.expiringOn}
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Accounts */}
      <section className="space-y-3">
        <SectionTitle
          title="Your accounts"
          description="Balances update in real time — demo data."
          action={
            <Link to="/app/accounts" className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {accounts.slice(0, 4).map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Spending breakdown" subtitle="April 2025 • by category" />
          <CardBody>
            <DonutChart data={spendingBreakdown} centerLabel="Spent" centerValue={money(3420, 'USD', { decimals: false })} />
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
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </CardBody>
        </Card>
      </section>

      {/* Transactions + notifications */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader
            title="Recent transactions"
            subtitle="Your latest account activity"
            action={
              <Link to="/app/transactions" className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
                View all <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          />
          <CardBody className="px-2 sm:px-3">
            <ListShell>
              {transactions.slice(0, 5).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} showAccount />
              ))}
            </ListShell>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Notifications"
              action={
                <Link to="/app/notifications" className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50">
                  View all
                </Link>
              }
            />
            <CardBody className="space-y-3">
              {latest.map((n) => (
                <div key={n.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{n.title}</p>
                    {!n.read ? <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-label="Unread" /> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.body}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {n.category} • {n.time}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="navy-mesh bg-navy text-white">
            <CardBody className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Security</p>
              <p className="text-sm font-bold">Two-factor is ON</p>
              <p className="text-xs leading-relaxed text-white/60">
                Your security score is 86/100. Verify your recovery email to reach 100.
              </p>
              <Link
                to="/app/security"
                className="focus-ring inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
              >
                Open Security Centre <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </CardBody>
          </Card>
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400">
        All balances, transactions and offers on this screen are synthetic demo data — no real accounts are connected.
      </p>
    </div>
  );
}
