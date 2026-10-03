import { useState } from 'react';
import { CheckCircle2, Search, ShieldCheck, XCircle } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { QrScanner, type ScanSample } from '@/components/qr';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Input,
  KeyValue,
  PageHeader,
  StatusBadge,
  useToast,
} from '@/components/ui';
import { transactions } from '@/data/mock';
import { demoReceiptQr } from '@/lib/qrData';
import { formatDate, money } from '@/lib/utils';

const SAMPLES: ScanSample[] = [
  { id: 'receipt', label: 'Receipt QR (Amazon)', raw: demoReceiptQr },
  { id: 'transfer', label: 'Receipt QR (PAYBACK)', raw: 'PAYBACK1:receipt:PB-TR-44120' },
];

export default function VerifyTransactionPage() {
  const toast = useToast();
  const [reference, setReference] = useState('PB-TX-88214');
  const [result, setResult] = useState<(typeof transactions)[number] | null>(null);
  const [searched, setSearched] = useState(false);
  const [scanning, setScanning] = useState(false);

  const verify = (ref: string) => {
    const found = transactions.find((t) => t.reference.toLowerCase() === ref.trim().toLowerCase());
    setResult(found ?? null);
    setSearched(true);
    if (found) toast.success('Transaction Verified', `${found.reference} • ${found.description}`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Trust & safety"
        title="Verify Transaction"
        description="Scan a receipt code or enter a reference to confirm a transaction is genuine."
        actions={
          <Badge tone="emerald" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>
            Safe references only
          </Badge>
        }
      />

      <DemoBanner
        label="Simulated verification"
        text="Verification checks a safe transaction reference. Receipt QR codes never contain card numbers, PINs or credentials."
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {scanning ? (
            <QrScanner
              title="Scan a receipt code"
              subtitle="Point at the QR on a receipt or statement."
              samples={SAMPLES}
              onClose={() => setScanning(false)}
              onRecognised={(payload) => {
                setScanning(false);
                setReference(payload.ref);
                verify(payload.ref);
              }}
            />
          ) : null}

          <Card>
            <CardHeader title="Enter a reference" subtitle="Found on any PAYBACK receipt or statement" />
            <CardBody className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input
                    label="Transaction reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. PB-TX-88214"
                    leftIcon={<Search className="h-4 w-4" aria-hidden />}
                  />
                </div>
                <Button icon={<ShieldCheck className="h-4 w-4" aria-hidden />} onClick={() => verify(reference)}>
                  Verify
                </Button>
              </div>
              <Button variant="outline" block onClick={() => setScanning(true)}>
                Scan a receipt QR instead
              </Button>
            </CardBody>
          </Card>

          {searched ? (
            <Card>
              <CardHeader
                title={result ? 'Transaction Verified' : 'No matching transaction'}
                action={
                  result ? (
                    <Badge tone="emerald" icon={<CheckCircle2 className="h-3 w-3" aria-hidden />}>
                      Genuine record
                    </Badge>
                  ) : (
                    <Badge tone="rose" icon={<XCircle className="h-3 w-3" aria-hidden />}>
                      Not found
                    </Badge>
                  )
                }
              />
              <CardBody>
                {result ? (
                  <KeyValue
                    columns={2}
                    items={[
                      { label: 'Reference', value: result.reference, mono: true },
                      { label: 'Date', value: formatDate(result.date, { month: 'short', day: 'numeric', year: 'numeric' }) },
                      { label: 'Merchant / description', value: result.description },
                      { label: 'Amount', value: money(result.amount, result.currency) },
                      { label: 'Account', value: result.account },
                      { label: 'Risk rating', value: result.risk ?? 'Low' },
                    ]}
                  />
                ) : (
                  <p className="text-sm text-slate-500">
                    We could not find <span className="font-mono">{reference}</span> in the demo ledger. Check the reference
                    and try again, or contact support if you believe a payment is missing.
                  </p>
                )}
                {result ? (
                  <div className="mt-4 flex items-center gap-2">
                    <StatusBadge status={result.status} />
                    <span className="text-xs text-slate-400">Checked against the PAYBACK ledger (demo)</span>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          ) : null}
        </div>

        <Card>
          <CardHeader title="Why verify?" />
          <CardBody className="space-y-3 text-sm text-slate-600">
            {[
              'Confirm a payment you were told was made actually exists.',
              'Check the exact amount, date and account it came from.',
              'Spot fake receipts before you return goods or release payment.',
              'Share the reference with support if something looks wrong.',
            ].map((item) => (
              <p key={item} className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                {item}
              </p>
            ))}
          </CardBody>
        </Card>
      </section>
    </PageWrap>
  );
}