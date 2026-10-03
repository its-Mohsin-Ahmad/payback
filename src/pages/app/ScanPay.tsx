import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Barcode, QrCode, ScanQrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { QrScanner, type ScanSample } from '@/components/qr';
import { Alert, Badge, Button, Card, CardBody, CardHeader, DemoBanner, PageHeader, useToast } from '@/components/ui';
import {
  demoInvoiceQr,
  demoPaymentQr,
  demoReceiptQr,
  demoTransferQr,
  encodeQr,
  QR_KIND_LABEL,
  SUPPORTED_CODES,
  type QrPayload,
} from '@/lib/qrData';

const SAMPLES: ScanSample[] = [
  { id: 'merchant', label: 'Merchant payment', raw: demoPaymentQr },
  { id: 'transfer', label: 'Transfer request', raw: demoTransferQr },
  { id: 'bill', label: 'Bill / invoice', raw: demoInvoiceQr },
  { id: 'receipt', label: 'Transaction receipt', raw: demoReceiptQr },
];

export default function ScanPayPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [scanning, setScanning] = useState(true);
  const [last, setLast] = useState<QrPayload | null>(null);

  const handle = (payload: QrPayload) => {
    setLast(payload);
    const meta = payload.meta ?? {};
    if (payload.kind === 'payment') {
      toast.success('QR Code Detected', `${meta.merchant ?? 'Merchant'} • ${meta.amount ?? ''} ${meta.currency ?? ''}`);
    } else if (payload.kind === 'transfer') {
      toast.success('Recipient Found', `${meta.name ?? 'Recipient'} (${meta.provider ?? 'PAYBACK'})`);
    } else {
      toast.info('QR Code Detected', QR_KIND_LABEL[payload.kind]);
    }
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Smart payments"
        title="Scan & Pay"
        description="Point, scan, pay. PAYBACK recognises payment, transfer, bill and receipt codes."
        actions={
          <Badge tone="violet" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>
            Demo camera
          </Badge>
        }
      />

      <DemoBanner
        label="Simulated scanning"
        text="No camera access is requested in this prototype. Scanning recognises safe demo codes only — QR payloads never contain PINs, CVVs or credentials."
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {scanning ? (
          <QrScanner
            title="Scan a QR Code"
            subtitle="Scan a supported payment or transfer code to continue."
            samples={SAMPLES}
            onClose={() => setScanning(false)}
            onRecognised={handle}
          />
        ) : (
          <Card>
            <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
              <ScanQrCode className="h-10 w-10 text-slate-300" aria-hidden />
              <p className="text-sm font-semibold text-slate-900">Scanner closed</p>
              <Button onClick={() => setScanning(true)}>Open scanner</Button>
            </CardBody>
          </Card>
        )}

        <div className="space-y-4">
          <Card>
            <CardHeader title="Scan Code" subtitle="PAYBACK detects the code type automatically" />
            <CardBody className="space-y-2.5">
              {SUPPORTED_CODES.map((code) => (
                <div key={code.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    {code.id === 'qr' ? <QrCode className="h-4 w-4" aria-hidden /> : <Barcode className="h-4 w-4" aria-hidden />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{code.label}</p>
                    <p className="text-xs text-slate-500">{code.hint}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="What happens next" />
            <CardBody>
              <ol className="space-y-2.5 text-sm text-slate-600">
                {['Scan → identify the code type', 'Review merchant, amount and fees', 'Verify with authentication', 'Confirm and get a receipt'].map(
                  (step, i) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  )
                )}
              </ol>
              <Button
                className="mt-4 w-full"
                icon={<Sparkles className="h-4 w-4" aria-hidden />}
                onClick={() => {
                  setLast({
                    kind: 'payment',
                    ref: 'PAY-MERCH-88214',
                    meta: { merchant: 'Aurora Retail Group', currency: 'USD', amount: '128.40', reference: 'AUR-88214' },
                  });
                  navigate('/app/qr-pay');
                }}
              >
                Open a payment review
              </Button>
            </CardBody>
          </Card>

          {last ? (
            <Alert tone="success" title={`Last scan: ${QR_KIND_LABEL[last.kind]}`}>
              <span className="font-mono text-xs">{last.ref}</span>
            </Alert>
          ) : null}
        </div>
      </section>

      <Card>
        <CardHeader title="Create your own code" subtitle="Demo codes encode a safe reference only" />
        <CardBody className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/app/my-qr')}>
            My QR
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const custom = encodeQr({
                kind: 'payment',
                ref: `PAY-CUSTOM-${Math.floor(Math.random() * 9000 + 1000)}`,
                exp: Date.now() + 15 * 60_000,
                meta: { merchant: 'Custom request', currency: 'USD', amount: '25.00' },
              });
              toast.success('Payment QR created', `${custom.slice(0, 42)}…`);
            }}
          >
            Create payment QR
          </Button>
        </CardBody>
      </Card>
    </PageWrap>
  );
}