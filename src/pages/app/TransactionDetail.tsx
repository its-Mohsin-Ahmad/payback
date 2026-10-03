import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Flag, Share2 } from 'lucide-react';
import { QrCode } from '@/components/qr';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  EmptyState,
  KeyValue,
  Modal,
  PageHeader,
  StatusBadge,
  Timeline,
  useToast,
} from '@/components/ui';
import { transactions } from '@/data/mock';
import { formatDate, money } from '@/lib/utils';

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState('I do not recognise this transaction');

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <div className="mx-auto w-full max-w-content">
        <EmptyState
          icon={<ArrowLeft className="h-6 w-6" aria-hidden />}
          title="Transaction not found"
          description="This transaction is not part of the demo dataset."
          action={
            <Button onClick={() => navigate('/app/transactions')} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
              Back to transactions
            </Button>
          }
        />
      </div>
    );
  }

  const inbound = tx.amount > 0;

  return (
    <div className="mx-auto w-full max-w-content space-y-6">
      <Link
        to="/app/transactions"
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All transactions
      </Link>

      <PageHeader
        eyebrow={tx.category}
        title={tx.description}
        description={`${formatDate(tx.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • ${tx.merchant}`}
        actions={
          <>
            <StatusBadge status={tx.status} />
            {tx.risk ? <Badge tone={tx.risk === 'Low' ? 'emerald' : tx.risk === 'Medium' ? 'amber' : 'rose'}>Risk: {tx.risk}</Badge> : null}
            <Button
              variant="outline"
              size="sm"
              icon={<Copy className="h-4 w-4" aria-hidden />}
              onClick={() => {
                void navigator.clipboard?.writeText(tx.reference).catch(() => undefined);
                toast.info('Reference copied', tx.reference);
              }}
            >
              Copy ref
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" aria-hidden />}
              onClick={() => toast.success('Receipt downloaded', 'A PDF receipt was generated (demo).')}
            >
              Receipt
            </Button>
            <Button size="sm" variant="danger" icon={<Flag className="h-4 w-4" aria-hidden />} onClick={() => setReportOpen(true)}>
              Report
            </Button>
          </>
        }
      />

      <DemoBanner label="Demo transaction" text="This entry is synthetic. Reporting it will not contact any real support desk." />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-6 text-center text-white shadow-lift navy-mesh">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{inbound ? 'Amount received' : 'Amount paid'}</p>
          <p className="tnum mt-2 text-4xl font-bold tracking-tight">
            {inbound ? '+' : '−'}
            {money(Math.abs(tx.amount), tx.currency)}
          </p>
          <p className="mt-2 text-sm text-white/60">{tx.description}</p>
          <div className="mt-4 flex justify-center">
            <StatusBadge status={tx.status} />
          </div>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader title="Transaction details" subtitle={tx.reference} />
          <CardBody>
            <KeyValue
              columns={2}
              items={[
                { label: 'Reference', value: tx.reference, mono: true },
                { label: 'Date', value: formatDate(tx.date, { month: 'short', day: 'numeric', year: 'numeric' }) },
                { label: 'Account', value: tx.account },
                { label: 'Method', value: tx.method },
                { label: 'Category', value: tx.category },
                { label: 'Merchant', value: tx.merchant },
                { label: 'Currency', value: tx.currency },
                { label: 'Status', value: tx.status },
              ]}
            />
            {tx.note ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">“{tx.note}”</p>
            ) : null}
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader title="Receipt code" subtitle="A safe reference — never card or credential data" />
        <CardBody className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="rounded-2xl border-4 border-white bg-white p-2 shadow-card">
            <QrCode value={`PAYBACK1:receipt:${tx.reference}`} size={112} label="Receipt QR code" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Verify this receipt anywhere</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Anyone can scan this code to check that <span className="font-mono">{tx.reference}</span> is a genuine PAYBACK
              record and see the amount, date and status.
            </p>
            <Link
              to="/app/verify"
              className="focus-ring mt-3 inline-flex h-9 items-center rounded-lg border border-slate-300 px-3.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            >
              Verify a transaction
            </Link>
          </div>
        </CardBody>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Timeline" subtitle="How this transaction progressed" />
          <CardBody>
            <Timeline
              items={[
                { title: 'Initiated', time: `${formatDate(tx.date, { month: 'short', day: 'numeric' })} • 10:02 AM`, detail: `Started from ${tx.account}` },
                { title: 'Authorised (2FA)', time: '10:02 AM', detail: 'Verified with your 6-digit code' },
                { title: 'Debited', time: '10:03 AM', detail: money(Math.abs(tx.amount), tx.currency) },
                { title: `Sent via ${tx.method}`, time: '10:03 AM', detail: tx.status === 'Failed' ? 'Rail rejected the payment' : 'Handed to the payment rail' },
                {
                  title: tx.status === 'Completed' ? 'Completed' : tx.status === 'Pending' ? 'Awaiting settlement' : tx.status,
                  time: tx.status === 'Completed' ? '10:04 AM' : '—',
                  detail: tx.status === 'Completed' ? 'Funds delivered successfully' : 'We will notify you on update',
                  active: tx.status === 'Completed',
                  tone: tx.status === 'Failed' ? '#F43F5E' : tx.status === 'Pending' ? '#F59E0B' : '#10B981',
                },
              ]}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Something look wrong?" subtitle="We resolve most disputes within 5 business days" />
            <CardBody className="flex flex-col gap-2 sm:flex-row">
              <Button variant="danger" icon={<Flag className="h-4 w-4" aria-hidden />} onClick={() => setReportOpen(true)}>
                Report a problem
              </Button>
              <Button variant="outline" icon={<Share2 className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Share link copied', 'A read-only demo link was copied (simulated).')}>
                Share receipt
              </Button>
              <Link
                to="/app/support"
                className="focus-ring inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                Contact support
              </Link>
            </CardBody>
          </Card>

          <Alert tone="info" title="Stay protected">
            PAYBACK will never ask for your password, PIN or verification code by phone, SMS or email. If you receive such a
            request, report it immediately.
          </Alert>
        </div>
      </section>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report a problem"
        description={`${tx.reference} • ${tx.description}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setReportOpen(false);
                toast.success('Report submitted', 'Our team will review it and get back to you within 24 hours (demo).');
              }}
            >
              Submit report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Reason</label>
          <div className="space-y-2">
            {['I do not recognise this transaction', 'Wrong amount was charged', 'Item never arrived / service not received', 'Duplicate charge'].map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReason(option)}
                  className={`focus-ring w-full rounded-xl border p-3 text-left text-sm transition-colors ${
                    reason === option ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option}
                </button>
              )
            )}
          </div>
          <Alert tone="warning" title="Freeze if needed">
            If your card was compromised, freeze it instantly from the Cards screen before submitting.
          </Alert>
        </div>
      </Modal>
    </div>
  );
}
