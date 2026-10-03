import { useState } from 'react';
import { FileText, Plus, Send } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  Input,
  Modal,
  PageHeader,
  SegmentedControl,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { businessMetrics, invoices } from '@/data/enterprise';
import { money } from '@/lib/utils';

type Status = 'All' | 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export default function BusinessInvoicesPage() {
  const toast = useToast();
  const [status, setStatus] = useState<Status>('All');
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('5000');

  const visible = status === 'All' ? invoices : invoices.filter((i) => i.status === status);
  const paid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Pay & collect"
        title="Invoices"
        description="Raise, track and chase customer invoices."
        actions={
          <>
            <Button variant="outline" icon={<Send className="h-4 w-4" aria-hidden />} onClick={() => toast.success('Reminders sent', 'Chasers emailed for overdue invoices (demo).')}>
              Chase overdue
            </Button>
            <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setOpen(true)}>
              New invoice
            </Button>
          </>
        }
      />

      <DemoBanner label="Demo invoices" text="Customers, amounts and statuses are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={money(businessMetrics.unpaidAmount, 'USD', { decimals: false })} tone="#F59E0B" footer={`${businessMetrics.unpaidInvoices} invoices`} />
        <StatCard label="Overdue" value={String(businessMetrics.overdueInvoices)} tone="#EF4444" footer="Chase before month end" />
        <StatCard label="Collected (period)" value={money(paid, 'USD', { decimals: false })} delta={7.3} tone="#10B981" />
      </div>

      <SegmentedControl<Status>
        value={status}
        onChange={setStatus}
        options={[
          { value: 'All', label: 'All', count: invoices.length },
          { value: 'Draft', label: 'Drafts' },
          { value: 'Sent', label: 'Sent' },
          { value: 'Paid', label: 'Paid' },
          { value: 'Overdue', label: 'Overdue' },
        ]}
      />

      <Card>
        <CardHeader title="Invoice register" subtitle={`${visible.length} shown`} />
        <TableWrap>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Customer</Th>
              <Th className="hidden md:table-cell">Issued</Th>
              <Th className="hidden md:table-cell">Due</Th>
              <Th align="right">Amount</Th>
              <Th align="right">Status</Th>
              <Th align="right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((invoice) => (
              <Tr key={invoice.id}>
                <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{invoice.id}</Td>
                <Td className="font-semibold text-slate-800">{invoice.customer}</Td>
                <Td className="hidden md:table-cell text-xs text-slate-500">{invoice.issue}</Td>
                <Td className="hidden md:table-cell text-xs text-slate-500">{invoice.due}</Td>
                <Td align="right" className="tnum font-semibold text-slate-900">{money(invoice.amount, invoice.currency, { decimals: false })}</Td>
                <Td align="right">
                  <Badge tone={invoice.status === 'Paid' ? 'emerald' : invoice.status === 'Overdue' ? 'rose' : invoice.status === 'Draft' ? 'neutral' : 'sky'}>
                    {invoice.status}
                  </Badge>
                </Td>
                <Td align="right">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      invoice.status === 'Paid'
                        ? toast.info('Receipt', `${invoice.id} receipt opened (demo).`)
                        : toast.success('Reminder sent', `Chased ${invoice.customer} for ${invoice.id} (demo).`)
                    }
                  >
                    {invoice.status === 'Paid' ? 'Receipt' : 'Remind'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Payment links">
        Each invoice includes a hosted payment link (simulated) that settles into your Business Current account.
      </Alert>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create invoice"
        description="A draft will be added to the register."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              icon={<FileText className="h-4 w-4" aria-hidden />}
              onClick={() => {
                setOpen(false);
                toast.success('Invoice created', `${customer || 'Customer'} — ${money(Number(amount) || 0, 'USD', { decimals: false })} (demo).`);
              }}
            >
              Create draft
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Customer" placeholder="e.g. Aurora Retail Group" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} leftIcon={<span className="text-sm font-bold text-slate-400">$</span>} />
          <Input label="Payment terms" defaultValue="Net 30" hint="Due date is calculated from the issue date." />
        </div>
      </Modal>
    </PageWrap>
  );
}
