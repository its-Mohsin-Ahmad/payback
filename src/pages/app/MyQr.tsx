import { useState } from 'react';
import { Download, Plus, Share2, ShieldCheck, Wallet } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { QrCode } from '@/components/qr';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Input,
  PageHeader,
  Select,
  useToast,
} from '@/components/ui';
import { accountsFor, displayName } from '@/lib/session/selectors';
import { useSession } from '@/lib/session/SessionProvider';
import { demoMyQr, encodeQr } from '@/lib/qrData';

export default function MyQrPage() {
  const toast = useToast();
  const [amount, setAmount] = useState('50');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('Dinner split');
  const [expiry, setExpiry] = useState('15');
  const [custom, setCustom] = useState<string | null>(null);

  // The payment code identifies the signed-in user, so it can never collect
  // money against someone else's account (spec §12).
  const { session } = useSession();
  const user = session.user;
  const primaryAccount = accountsFor(session)[0];

  const maskedId = `PAYBACK ••• ${primaryAccount?.number.slice(-4) ?? '0000'}`;

  const createQr = () => {
    const value = Number(amount) || 0;
    if (value <= 0) {
      toast.error('Enter an amount', 'Payment requests need an amount greater than zero.');
      return;
    }
    const minutes = Number(expiry) || 15;
    setCustom(
      encodeQr({
        kind: 'payment',
        ref: `PAY-REQ-${Math.floor(Math.random() * 90000 + 10000)}`,
        exp: Date.now() + minutes * 60_000,
        meta: { merchant: displayName(user), currency, amount: value.toFixed(2), description: description || 'Payment request' },
      })
    );
    toast.success('Payment QR created', 'Share it, download it, or let the payer scan it.');
  };

  const share = (what: string) => toast.success(`${what} ready`, 'A share sheet would open here (prototype).');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Smart payments"
        title="My QR"
        description="Show your receiving code, or create a payment request someone can scan."
        actions={
          <Badge tone="emerald" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>
            Safe code only
          </Badge>
        }
      />

      <DemoBanner
        label="Safe QR content"
        text="PAYBACK QR codes contain a reference and non-sensitive display details only — never your PIN, CVV, password or card number."
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader title="Your receiving code" subtitle="Let someone scan to pay you" />
          <CardBody className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-3xl border-4 border-white bg-white p-4 shadow-lift">
              <QrCode value={demoMyQr} size={208} label="Your PAYBACK receiving QR code" />
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{displayName(user)}</p>
              <p className="tnum text-sm text-slate-500">{maskedId}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Badge tone="emerald">Verified</Badge>
                <Badge tone="sky">Accepts instant PAYBACK transfers</Badge>
              </div>
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-3">
              <Button icon={<Wallet className="h-4 w-4" aria-hidden />} onClick={() => share('Receive money')}>
                Receive money
              </Button>
              <Button variant="outline" icon={<Share2 className="h-4 w-4" aria-hidden />} onClick={() => share('Share QR')}>
                Share QR
              </Button>
              <Button variant="outline" icon={<Download className="h-4 w-4" aria-hidden />} onClick={() => share('Download QR')}>
                Download QR
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Create a payment QR" subtitle="Ask someone for an exact amount" />
          <CardBody className="space-y-4">
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<span className="text-sm font-bold text-slate-400">$</span>}
            />
            <Select
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'USD', label: 'USD — US Dollar' },
                { value: 'EUR', label: 'EUR — Euro' },
                { value: 'GBP', label: 'GBP — Pound Sterling' },
                { value: 'AED', label: 'AED — UAE Dirham' },
              ]}
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
            />
            <Select
              label="Expires in"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '60', label: '1 hour' },
                { value: '1440', label: '24 hours' },
                { value: '10080', label: '7 days' },
              ]}
            />
            <Button block icon={<Plus className="h-4 w-4" aria-hidden />} onClick={createQr}>
              Create Payment QR
            </Button>

            {custom ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <QrCode value={custom} size={150} label="Your payment request QR" />
                <p className="text-center text-xs text-emerald-800">
                  {description} • {currency} {Number(amount).toFixed(2)} • expires in {expiry} min
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" icon={<Share2 className="h-4 w-4" aria-hidden />} onClick={() => share('Payment QR')}>
                    Share
                  </Button>
                  <Button size="sm" variant="outline" icon={<Download className="h-4 w-4" aria-hidden />} onClick={() => share('Payment QR')}>
                    Download
                  </Button>
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </section>

      <Alert tone="info" title="Printing and sharing">
        You can print this code or share it as an image. Anyone with the code can request a payment from you — always check the
        amount and reference before confirming, exactly as with any payment request.
      </Alert>
    </PageWrap>
  );
}