import { useState } from 'react';
import { Users } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  Modal,
  PageHeader,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { businessMetrics, payroll } from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function BusinessPayrollPage() {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const gross = payroll.reduce((s, p) => s + p.gross, 0);
  const tax = payroll.reduce((s, p) => s + p.tax, 0);
  const net = payroll.reduce((s, p) => s + p.net, 0);
  const people = payroll.reduce((s, p) => s + p.people, 0);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Pay & collect"
        title="Payroll"
        description="Department-level payroll run for the current cycle."
        actions={
          <Button icon={<Users className="h-4 w-4" aria-hidden />} onClick={() => setOpen(true)}>
            Review & submit run
          </Button>
        }
      />

      <DemoBanner label="Demo payroll" text="Employee counts and figures are synthetic aggregates — no personal data is shown." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Employees" value={String(people)} tone="#10B981" footer="Across 5 departments" />
        <StatCard label="Gross pay" value={money(gross, 'USD', { decimals: false })} tone="#38BDF8" />
        <StatCard label="Tax withheld" value={money(tax, 'USD', { decimals: false })} tone="#F59E0B" footer="Remitted with filing (demo)" />
        <StatCard label="Net payout" value={money(net, 'USD', { decimals: false })} delta={2.8} tone="#8B5CF6" footer={`Due ${businessMetrics.payrollDue}`} />
      </div>

      <Card>
        <CardHeader title="This cycle" subtitle={`Run date: ${businessMetrics.payrollDue} • funding account: Payroll ••→ 1104`} action={<Badge tone="amber">Draft</Badge>} />
        <TableWrap>
          <thead>
            <tr>
              <Th>Department</Th>
              <Th align="right">People</Th>
              <Th align="right">Gross</Th>
              <Th align="right">Tax</Th>
              <Th align="right">Net</Th>
              <Th className="hidden lg:table-cell" align="right">Share</Th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((dept) => (
              <Tr key={dept.id}>
                <Td className="font-semibold text-slate-900">{dept.name}</Td>
                <Td align="right" className="tnum">{dept.people}</Td>
                <Td align="right" className="tnum">{money(dept.gross, 'USD', { decimals: false })}</Td>
                <Td align="right" className="tnum text-slate-500">{money(dept.tax, 'USD', { decimals: false })}</Td>
                <Td align="right" className="tnum font-semibold text-slate-900">{money(dept.net, 'USD', { decimals: false })}</Td>
                <Td align="right" className="hidden lg:table-cell tnum text-xs text-slate-500">
                  {Math.round((dept.net / net) * 100)}%
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="How submission works">
        On submit, the run moves to Approvals for your second approver, then funds are debited from the Payroll Account on
        the run date (all simulated).
      </Alert>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Submit payroll run"
        description={`${people} employees • net ${money(net, 'USD', { decimals: false })}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success('Payroll submitted', 'Sent for second approval (demo).');
              }}
            >
              Submit for approval
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {[
            ['Departments', String(payroll.length)],
            ['Employees', String(people)],
            ['Gross', money(gross, 'USD', { decimals: false })],
            ['Tax withheld', money(tax, 'USD', { decimals: false })],
            ['Net payout', money(net, 'USD', { decimals: false })],
            ['Value date', businessMetrics.payrollDue],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm last:border-0">
              <span className="text-slate-500">{label}</span>
              <span className="tnum font-semibold text-slate-900">{value}</span>
            </div>
          ))}
          <Alert tone="warning" title="Irreversible once approved">
            Payroll batches cannot be cancelled after the second approval in a real deployment.
          </Alert>
        </div>
      </Modal>
    </PageWrap>
  );
}
