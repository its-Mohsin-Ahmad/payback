import { useState } from 'react';
import { Download, FileText, Plus } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { accounts } from '@/data/mock';
import { money } from '@/lib/utils';

const STATEMENTS = [
  { id: 'st-1', period: 'March 2025', account: 'Current Account •••• 4827', pages: 6, size: '240 KB', generated: 'Apr 01, 2025', status: 'Completed' },
  { id: 'st-2', period: 'February 2025', account: 'Current Account •••• 4827', pages: 5, size: '212 KB', generated: 'Mar 01, 2025', status: 'Completed' },
  { id: 'st-3', period: 'March 2025', account: 'Savings Account •••• 6134', pages: 3, size: '118 KB', generated: 'Apr 01, 2025', status: 'Completed' },
  { id: 'st-4', period: 'Q1 2025', account: 'Business Account •••• 9281', pages: 14, size: '1.2 MB', generated: 'Apr 05, 2025', status: 'Completed' },
  { id: 'st-5', period: 'April 2025', account: 'Current Account •••• 4827', pages: 4, size: '156 KB', generated: 'Pending', status: 'Processing' },
];

export default function StatementsPage() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(accounts[0].id);
  const [period, setPeriod] = useState('monthly');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Tools"
        title="Statements"
        description="Generate, download and audit-proof your account statements."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setOpen(true)}>
            Generate statement
          </Button>
        }
      />

      <DemoBanner label="Demo documents" text="Generated statements contain synthetic transactions and are watermarked as demo." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available periods</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">24 months</p>
            <p className="mt-1 text-xs text-slate-500">From March 2023 onwards</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Auto e-statements</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">Enabled</p>
            <p className="mt-1 text-xs text-slate-500">Emailed on the 1st of each month</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tax season ready</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">Q1 pack</p>
            <p className="mt-1 text-xs text-slate-500">All accounts in one ZIP (demo)</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Statement history"
          subtitle="PDF documents generated for your accounts"
          action={
            <Button
              size="sm"
              variant="outline"
              icon={<Download className="h-4 w-4" aria-hidden />}
              onClick={() => toast.success('Bundle queued', 'All statements will be zipped and emailed (demo).')}
            >
              Download all
            </Button>
          }
        />
        <TableWrap>
          <thead>
            <tr>
              <Th>Period</Th>
              <Th>Account</Th>
              <Th className="hidden md:table-cell">Pages</Th>
              <Th className="hidden md:table-cell">Size</Th>
              <Th className="hidden lg:table-cell">Generated</Th>
              <Th align="right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {STATEMENTS.map((row) => (
              <Tr key={row.id}>
                <Td className="font-semibold text-slate-900">{row.period}</Td>
                <Td className="text-xs">{row.account}</Td>
                <Td className="hidden md:table-cell tnum">{row.pages}</Td>
                <Td className="hidden md:table-cell tnum">{row.size}</Td>
                <Td className="hidden lg:table-cell text-xs text-slate-500">{row.generated}</Td>
                <Td align="right">
                  <div className="flex items-center justify-end gap-2">
                    <StatusBadge status={row.status} />
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={row.status !== 'Completed'}
                      icon={<FileText className="h-4 w-4" aria-hidden />}
                      onClick={() => toast.success('Download started', `${row.period} statement (demo PDF).`)}
                    >
                      PDF
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Statements are legally formatted">
        In a real deployment each PDF carries a regulated header, checksum and the institution's digital signature.
      </Alert>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Generate a statement"
        description="Choose the account and period you need."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              icon={<FileText className="h-4 w-4" aria-hidden />}
              onClick={() => {
                setOpen(false);
                toast.success('Statement queued', 'Your PDF will be ready in a few seconds (demo).');
              }}
            >
              Generate
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            options={accounts.map((a) => ({ value: a.id, label: `${a.name} •••• ${a.number}` }))}
          />
          <Select
            label="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: 'monthly', label: 'Previous calendar month' },
              { value: 'quarter', label: 'Previous quarter' },
              { value: 'ytd', label: 'Year to date' },
              { value: 'custom', label: 'Custom range…' },
            ]}
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Statements include every booked transaction, fees charged and closing balance for the selected period.
          </div>
        </div>
      </Modal>
    </PageWrap>
  );
}
