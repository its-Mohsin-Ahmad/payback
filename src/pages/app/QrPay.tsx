import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, ShieldCheck, Store } from 'lucide-react';
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
  KeyValue,
  OtpInput,
  PageHeader,
  Select,
  StatusBadge,
  SuccessState,
  useToast,
} from '@/components/ui';
import { accounts } from '@/data/mock';
import { money } from '@/lib/utils';

type Phase = 'review' | 'verify' | 'done';

export default function QrPayPage() {
  const navigate = useNavigate();
  const toast = useToast();

  // Data recognised from the scanned demo merchant code
  const [phase, setPhase] = useState<Phase>('review');
  const [otp, setOtp] = useState('');
  const [account, setAccount] = useState(accounts[0].id);
  const [tip, setTip] = useState('');
  const [reference] = useState('AUR-88214');

  const base = 128.4;
  const tipValue = Number(tip) || 0;
  const fee = 0;
  const total = base + tipValue + fee;
  const source = accounts.find((a) => a.id === account) ?? accounts[0];

  const confirm = () => {
    if (otp.length !== 6) {
      toast.error('Verification required', 'Enter the 6-digit code to authorise this payment.');
      return;
    }
    setPhase('done');
    toast.success('Payment sent', `${money(total)} to Aurora Retail Group (simulated).`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Smart payments"
        title="Review Payment"
        description="Check every detail before you confirm — QR payments are final once released."
        actions={
          <Badge tone="violet" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>
            Simulated verification
          </Badge>
        }
      />

      <DemoBanner
        label="Simulated QR payment"
        text="This flow recognises a demo merchant code. No merchant is contacted and no money moves in this prototype."
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="Merchant" subtitle={`Code reference ${reference}`} action={<Badge tone="sky">QR payment</Badge>} />
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white">
                <Store className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Aurora Retail Group</p>
                <p className="text-xs text-slate-500">Merchant 88214 • Kuala Lumpur (demo)</p>
              </div>
            </div>

            <KeyValue
              columns={2}
              items={[
                { label: 'Amount', value: money(base, 'USD') },
                { label: 'Currency', value: 'USD' },
                { label: 'Reference', value: reference, mono: true },
                { label: 'Description', value: 'Retail purchase — demo' },
              ]}
            />

            <Input
              label="Add a tip (optional)"
              type="number"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              leftIcon={<span className="text-sm font-bold text-slate-400">$</span>}
            />

            <Select
              label="Pay from"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              options={accounts
                .filter((a) => a.currency === 'USD')
                .map((a) => ({ value: a.id, label: `${a.name} •••• ${a.number} — ${money(a.available, 'USD', { decimals: false })}` }))}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Verify Payment" />
            <CardBody className="space-y-3">
              {[
                { k: 'Recipient', v: 'Aurora Retail Group' },
                { k: 'Amount', v: money(base + tipValue, 'USD') },
                { k: 'Destination', v: '••→ 4471 (demo)' },
                { k: 'Fee', v: fee === 0 ? 'Free' : money(fee, 'USD') },
                { k: 'Reference', v: reference },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">{row.k}</span>
                  <span className="text-right font-semibold text-slate-900">{row.v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-base">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="tnum text-lg font-bold text-slate-900">{money(total, 'USD')}</span>
              </div>
              <p className="text-xs text-slate-400">Debited from {source.name} •••• {source.number}</p>

              {phase === 'review' ? (
                <Button block onClick={() => setPhase('verify')}>
                  Continue to verification
                </Button>
              ) : null}

              {phase === 'verify' ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <OtpInput length={6} value={otp} onChange={setOtp} />
                  </div>
                  <Button block icon={<Lock className="h-4 w-4" aria-hidden />} onClick={confirm}>
                    Authorise {money(total, 'USD')}
                  </Button>
                  <Button block variant="ghost" onClick={() => setPhase('review')}>
                    Back to review
                  </Button>
                </div>
              ) : null}

              {phase === 'done' ? (
                <Button block variant="outline" onClick={() => navigate('/app/transactions')}>
                  View transactions
                </Button>
              ) : null}
            </CardBody>
          </Card>

          <Alert tone="warning" title="Simulated security verification">
            Authentication here is illustrative. A production flow would challenge you with device biometrics and a signed
            approval before releasing funds.
          </Alert>
        </div>
      </section>

      {phase === 'done' ? (
        <Card>
          <CardBody>
            <SuccessState
              title="Payment complete"
              description={`${money(total)} paid to Aurora Retail Group. Reference ${reference}.`}
            />
            <div className="flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
              <div className="rounded-2xl border-4 border-white bg-white p-3 shadow-card">
                <QrCode value="PAYBACK1:receipt:PB-TX-88214" size={140} label="Receipt QR code" />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                Safe receipt reference only — no payment credentials are encoded.
              </p>
              <StatusBadge status="Completed" />
            </div>
          </CardBody>
        </Card>
      ) : null}
    </PageWrap>
  );
}