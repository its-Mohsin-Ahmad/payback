import { Plus } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DemoBanner,
  PageHeader,
  SectionTitle,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { businessAccounts, businessMetrics } from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function BusinessAccountsPage() {
  const toast = useToast();

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Business banking"
        title="Accounts"
        description="Current, payroll, reserve and FX accounts for your company."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Opening additional accounts is simulated.')}>
            Open account
          </Button>
        }
      />

      <DemoBanner label="Demo balances" text="Company account balances are synthetic figures." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total balance" value={money(businessMetrics.totalBalance, 'USD', { decimals: false })} delta={3.1} tone="#10B981" />
        <StatCard label="Month inflow" value={money(businessMetrics.monthInflow, 'USD', { decimals: false })} delta={4.6} tone="#38BDF8" />
        <StatCard label="Month outflow" value={money(businessMetrics.monthOutflow, 'USD', { decimals: false })} delta={-1.9} tone="#8B5CF6" />
        <StatCard label="Pending payments" value={String(businessMetrics.pendingPayments)} tone="#F59E0B" footer={money(businessMetrics.pendingAmount, 'USD', { decimals: false })} />
      </div>

      <section className="space-y-3">
        <SectionTitle title="Company accounts" description="Tap any row for statements and payments." />
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Account</Th>
                <Th className="hidden md:table-cell">Type</Th>
                <Th className="hidden md:table-cell">Number</Th>
                <Th align="right">Balance</Th>
                <Th align="right">Status</Th>
              </tr>
            </thead>
            <tbody>
              {businessAccounts.map((account) => (
                <Tr key={account.id}>
                  <Td className="font-semibold text-slate-900">{account.name}</Td>
                  <Td className="hidden md:table-cell text-xs">{account.type}</Td>
                  <Td className="hidden md:table-cell tnum font-mono text-[13px]">{account.number}</Td>
                  <Td align="right" className="tnum font-semibold text-slate-900">
                    {money(account.balance, account.currency, { decimals: false })}
                  </Td>
                  <Td align="right">
                    <Badge tone={account.status === 'Active' ? 'emerald' : 'amber'}>{account.status}</Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>

      <Alert tone="info" title="Account roles">
        Payroll Account funds salary runs, Tax Reserve is read-only except for scheduled tax payments, and Business USD is
        under enhanced review for cross-border settlements (demo).
      </Alert>
    </PageWrap>
  );
}
