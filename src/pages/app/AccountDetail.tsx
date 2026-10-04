import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Receipt, Send, Copy } from 'lucide-react';
import { ListShell, TransactionRow } from '@/components/blocks';
import { AreaChart } from '@/components/charts';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CopyField,
  DemoBanner,
  EmptyState,
  KeyValue,
  PageHeader,
  SectionTitle,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { accounts, balanceHistory, transactions } from '@/data/mock';
import { money } from '@/lib/utils';

export default function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const account = accounts.find((a) => a.id === id);

  if (!account) {
    return (
      <div className="mx-auto w-full max-w-content">
        <EmptyState
          icon={<ArrowLeft className="h-6 w-6" aria-hidden />}
          title="Account not found"
          description="That account does not exist in this demo dataset."
          action={
            <Button onClick={() => navigate('/app/accounts')} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
              Back to accounts
            </Button>
          }
        />
      </div>
    );
  }

  const accountLabel = `${account.name} •••• ${account.number}`;
  const accountTx = transactions.filter((t) => t.account === accountLabel).slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-content space-y-6">
      <Link
        to="/app/accounts"
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All accounts
      </Link>

      <PageHeader
        eyebrow={account.type}
        title={account.name}
        description={`Account •••• ${account.number} • ${account.currency}`}
        actions={
          <>
            <Badge tone={account.status === 'Active' ? 'emerald' : 'amber'}>{account.status}</Badge>
            {account.isDefault ? <Badge tone="navy">Default account</Badge> : null}
            <Button
              variant="outline"
              size="sm"
              icon={<Send className="h-4 w-4" aria-hidden />}
              onClick={() => navigate('/app/transfer')}
            >
              Transfer
            </Button>
            <Button
              size="sm"
              icon={<Receipt className="h-4 w-4" aria-hidden />}
              onClick={() => navigate('/app/statements')}
            >
              Statements
            </Button>
          </>
        }
      />

      <DemoBanner label="Demo account" text="Balances and history for this account are synthetic illustrations." />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-5 text-white shadow-lift navy-mesh sm:p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Current balance</p>
              <p className="tnum mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {money(account.balance, account.currency)}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Available {money(account.available, account.currency)} • {account.interest}
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Icon name={account.icon} className="h-6 w-6 text-emerald-300" />
            </span>
          </div>
          <div className="mt-4 h-24 overflow-hidden rounded-2xl bg-white/5 p-2">
            <AreaChart
              data={balanceHistory}
              tone="#38BDF8"
              height={72}
              valueFormatter={(n) => money(n, 'USD', { decimals: false })}
            />
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-300">
            ▲ {account.changePct.toFixed(1)}% vs last month
          </p>
        </div>

        <Card>
          <CardHeader title="Account details" />
          <CardBody className="space-y-4">
            <KeyValue
              columns={1}
              items={[
                { label: 'Account type', value: account.type },
                { label: 'Currency', value: account.currency },
                { label: 'Status', value: account.status },
                { label: 'Profit / fee', value: account.interest },
                { label: 'Last 4 digits', value: account.number, mono: true },
              ]}
            />
            <CopyField label="IBAN (demo)" value="PK36 SCBL 0000 0011 2345 6702" hint="Tap copy to share your IBAN." />
          </CardBody>
        </Card>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Transfer money', to: '/app/transfer', icon: <Send className="h-5 w-5" aria-hidden /> },
          { label: 'Pay a bill', to: '/app/bills', icon: <Receipt className="h-5 w-5" aria-hidden /> },
          { label: 'Download statement', to: '/app/statements', icon: <FileText className="h-5 w-5" aria-hidden /> },
          { label: 'Exchange currency', to: '/app/exchange', icon: <Copy className="h-5 w-5" aria-hidden /> },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="focus-ring card-base flex items-center gap-3 p-4 transition-shadow hover:shadow-lift"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              {action.icon}
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold text-slate-800">{action.label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
          </Link>
        ))}
      </section>

      {/* Recent activity */}
      <section className="space-y-3">
        <SectionTitle
          title="Recent activity"
          description={accountTx.length > 0 ? `Last ${accountTx.length} transactions on this account` : 'No demo transactions tagged to this account yet'}
          action={
            <Link
              to="/app/transactions"
              className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <Card>
          <CardBody className="px-2 sm:px-3">
            {accountTx.length > 0 ? (
              <ListShell>
                {accountTx.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </ListShell>
            ) : (
              <Alert tone="info" title="Nothing here yet">
                Once this demo dataset includes activity for {accountLabel}, it will appear here automatically.
              </Alert>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
