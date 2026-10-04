import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Copy,
  Info,
  LayoutDashboard,
  Lock,
  Plus,
  QrCode,
  Repeat2,
  Search,
  Send,
  ShieldCheck,
  Star,
  UserPlus,
  Zap,
} from 'lucide-react';
import {
  Alert,
  AmountChips,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Input,
  KeyValue,
  Modal,
  OtpInput,
  PageHeader,
  ProgressBar,
  SecurityBadge,
  Select,
  Stepper,
  SuccessState,
  Textarea,
  Toggle,
  useToast,
} from '@/components/ui';
import { TransferLoader, type LoaderStage } from '@/components/loaders';
import { PageWrap } from '@/components/blocks';
import { QrCode as ReceiptQr } from '@/components/qr';
import { Icon } from '@/components/Icon';
import { ProviderLogo } from '@/components/logos';
import { PROVIDERS } from '@/data/products';
import { accounts, quickRecipients, recipients as savedRecipients, transferLimits } from '@/data/mock';
import { cn, money, uid } from '@/lib/utils';

type Step = 'recipient' | 'details' | 'amount' | 'review' | 'verify' | 'done';

interface Draft {
  recipientName: string;
  providerId: string;
  identifier: string;
  identifierLabel: string;
  bankName: string;
  accountId: string;
  amount: number;
  note: string;
  saveRecipient: boolean;
  favourite: boolean;
  purpose: string;
}

const STEPS: { key: Step; label: string; hint: string }[] = [
  { key: 'recipient', label: 'Recipient', hint: 'Who to pay' },
  { key: 'details', label: 'Details', hint: 'Provider & account' },
  { key: 'amount', label: 'Amount', hint: 'Value & funding' },
  { key: 'review', label: 'Review', hint: 'Confirm' },
  { key: 'verify', label: 'Verify', hint: 'Two-factor' },
];

/**
 * The stages a bank transfer genuinely passes through.
 *
 * Shown while the transfer is in flight instead of a percentage — we can name
 * each phase honestly, but we cannot honestly measure a completion rate.
 */
const TRANSFER_STAGES = ['Authorising with your bank', 'Sending to the recipient', 'Confirming receipt'];

const emptyDraft: Draft = {
  recipientName: '',
  providerId: 'payback',
  identifier: '',
  identifierLabel: 'Mobile number',
  bankName: '',
  accountId: accounts[0].id,
  amount: 0,
  note: '',
  saveRecipient: true,
  favourite: false,
  purpose: 'Family support',
};

const identifierFor = (providerId: string) => {
  switch (providerId) {
    case 'payback':
      return { label: 'PAYBACK ID or mobile', placeholder: 'e.g. 0300 123 4567' };
    case 'bank':
      return { label: 'IBAN / account number', placeholder: 'PK36 SCBL 0000 0011 2345 6702' };
    case 'easypaisa':
    case 'jazzcash':
    case 'upaisa':
      return { label: 'Wallet mobile number', placeholder: 'e.g. 0321 445 8890' };
    case 'nayapay':
      return { label: 'NayaPay ID', placeholder: 'e.g. nayapay-3390' };
    case 'swift':
      return { label: 'IBAN / SWIFT BIC', placeholder: 'GB29 NWBK 6016 1331 9268 19' };
    case 'paypal':
      return { label: 'PayPal email', placeholder: 'name@example.com' };
    default:
      return { label: 'Recipient reference', placeholder: 'Enter reference' };
  }
};

/* ------------------------------------------------------------------ */
/* Step 1 — choose recipient                                           */
/* ------------------------------------------------------------------ */

function RecipientStep({
  draft,
  onPick,
  onNew,
}: {
  draft: Draft;
  onPick: (name: string, providerId: string, identifier: string) => void;
  onNew: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = savedRecipients.filter(
    (r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.provider.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, provider or reference"
            aria-label="Search recipients"
            className="focus-ring h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <Button variant="outline" icon={<QrCode className="h-4 w-4" aria-hidden />} onClick={() => onNew()}>
          Scan QR
        </Button>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent recipients</h2>
          <Badge tone="sky">Quick pick</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickRecipients.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onPick(r.name, r.provider.toLowerCase().includes('easypaisa') ? 'easypaisa' : r.provider.toLowerCase().includes('jazz') ? 'jazzcash' : r.provider.toLowerCase().includes('naya') ? 'nayapay' : 'payback', '03•• ••• ••••')}
              className={cn(
                'focus-ring flex flex-col items-center gap-2 rounded-2xl border bg-white p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift',
                draft.recipientName === r.name ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
              )}
            >
              <Avatar name={r.name} size="md" color="#0F172A" />
              <span className="w-full truncate text-xs font-semibold text-slate-800">{r.name}</span>
              <span className="text-[10px] text-slate-400">{r.provider}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Saved beneficiaries</h2>
          <Button size="xs" variant="ghost" icon={<Plus className="h-3.5 w-3.5" aria-hidden />} onClick={onNew}>
            Add new
          </Button>
        </div>
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {filtered.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onPick(r.name, r.provider.toLowerCase().includes('easypaisa') ? 'easypaisa' : r.provider.toLowerCase().includes('jazz') ? 'jazzcash' : r.provider.toLowerCase().includes('naya') ? 'nayapay' : r.provider.toLowerCase().includes('bank') ? 'bank' : r.provider.toLowerCase().includes('international') ? 'swift' : 'payback', r.identifier)}
                className="focus-ring flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <Avatar name={r.name} size="sm" color={r.initialsColor} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-900">
                    {r.name}
                    {r.verified ? <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden /> : null}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {r.provider} &bull; {r.identifier}
                  </p>
                </div>
                {r.favourite ? <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden /> : null}
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
              </button>
            </li>
          ))}
          {filtered.length === 0 ? <li className="px-4 py-8 text-center text-sm text-slate-400">No saved beneficiaries match “{query}”.</li> : null}
        </ul>
      </div>

      <button
        type="button"
        onClick={onNew}
        className="focus-ring flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-soft">
          <UserPlus className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900">Send to a new recipient</span>
          <span className="block text-xs text-slate-500">Enter details manually or paste an account number</span>
        </span>
        <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2 — recipient & provider details                               */
/* ------------------------------------------------------------------ */

function DetailsStep({ draft, update }: { draft: Draft; update: (patch: Partial<Draft>) => void }) {
  const ident = identifierFor(draft.providerId);
  const provider = PROVIDERS.find((p) => p.id === draft.providerId);
  const isDemo = provider?.eta === 'Demo Transfer';
  const isNotConnected = provider?.fee === 'Integration Required';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">How would you like to send?</h2>
        <p className="mt-0.5 text-xs text-slate-500">Choose a provider or rail. Demo and unconnected rails are clearly labelled.</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PROVIDERS.filter((p) => p.id !== 'other').map((p) => {
            const active = draft.providerId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => update({ providerId: p.id, identifierLabel: identifierFor(p.id).label })}
                aria-pressed={active}
                className={cn(
                  'focus-ring relative flex flex-col items-start gap-2 rounded-2xl border bg-white p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift',
                  active ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                )}
              >
                <ProviderLogo mark={p.id} tileClassName="h-9 w-9" />
                <span className="w-full truncate text-xs font-bold text-slate-900">{p.short}</span>
                <span className="text-[10px] leading-tight text-slate-500">{p.eta}</span>
                {p.fee === 'Demo' ? (
                  <span className="absolute right-2 top-2 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">Demo</span>
                ) : null}
                {p.fee === 'Integration Required' ? (
                  <span className="absolute right-2 top-2 rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-700">Not live</span>
                ) : null}
                {p.id === 'payback' ? (
                  <span className="absolute right-2 top-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">Instant</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {isDemo || isNotConnected ? (
        <Alert tone={isNotConnected ? 'danger' : 'warning'} title={isNotConnected ? 'Integration required' : 'Demo transfer'}>
          {isNotConnected
            ? 'PayPal is not connected in this prototype, so the transfer cannot be completed. Select another provider to continue.'
            : 'This provider is simulated. The transfer will be recorded as a demo transaction and no real money will move.'}
        </Alert>
      ) : (
        <Alert tone="success" title={`${provider?.name} selected`}>
          Fee: {provider?.fee} &bull; Estimated arrival: {provider?.eta}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Recipient name"
          value={draft.recipientName}
          onChange={(e) => update({ recipientName: e.target.value })}
          placeholder="e.g. Ahmed Khan"
          required
        />
        <Input
          label={ident.label}
          value={draft.identifier}
          onChange={(e) => update({ identifier: e.target.value })}
          placeholder={ident.placeholder}
          required
          rightSlot={
            draft.identifier.length > 2 ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                <Check className="h-3 w-3" aria-hidden />
                Verified
              </span>
            ) : null
          }
        />

        {draft.providerId === 'bank' || draft.providerId === 'swift' ? (
          <Input
            label="Bank name"
            value={draft.bankName}
            onChange={(e) => update({ bankName: e.target.value })}
            placeholder="e.g. Standard Chartered Bank"
            containerClassName="sm:col-span-2"
          />
        ) : null}

        <Select
          label="Purpose of transfer"
          value={draft.purpose}
          onChange={(e) => update({ purpose: e.target.value })}
          options={[
            { value: 'Family support', label: 'Family support' },
            { value: 'Salary payment', label: 'Salary payment' },
            { value: 'Business payment', label: 'Business payment' },
            { value: 'Rent', label: 'Rent' },
            { value: 'Loan repayment', label: 'Loan repayment' },
            { value: 'Gift', label: 'Gift' },
            { value: 'Other', label: 'Other' },
          ]}
          containerClassName={draft.providerId === 'bank' || draft.providerId === 'swift' ? 'sm:col-span-2' : ''}
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <Toggle
          checked={draft.saveRecipient}
          onChange={(v) => update({ saveRecipient: v })}
          label="Save this recipient"
          hint="Add to your beneficiary list for faster transfers next time."
        />
        {draft.saveRecipient ? (
          <Toggle
            checked={draft.favourite}
            onChange={(v) => update({ favourite: v })}
            label="Mark as favourite"
            hint="Favourites appear first in your recipient list."
          />
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3 — amount & funding source                                    */
/* ------------------------------------------------------------------ */

function AmountStep({ draft, update }: { draft: Draft; update: (patch: Partial<Draft>) => void }) {
  const provider = PROVIDERS.find((p) => p.id === draft.providerId);
  const source = accounts.find((a) => a.id === draft.accountId) ?? accounts[0];
  const fee = draft.providerId === 'swift' ? 12 : 0;
  const total = draft.amount + fee;
  const insufficient = total > source.available;
  const dailyLimit = transferLimits[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">You send</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-slate-400">$</span>
          <input
            type="text"
            inputMode="decimal"
            value={draft.amount === 0 ? '' : String(draft.amount)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, '');
              const n = Number(raw);
              update({ amount: Number.isFinite(n) ? n : 0 });
            }}
            placeholder="0.00"
            aria-label="Transfer amount"
            className="tnum w-full max-w-[260px] border-0 bg-transparent text-center text-4xl font-bold tracking-tight text-slate-900 outline-none placeholder:text-slate-300"
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Available in {source.name}: <span className="tnum font-semibold text-slate-700">{money(source.available, source.currency)}</span>
        </p>
        <AmountChips className="mt-4 justify-center" amounts={[50, 100, 250, 500, 1000, 2500]} onPick={(v) => update({ amount: v })} />
        {insufficient ? (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Amount exceeds the available balance of this account.
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900">Pay from</h2>
        <div className="mt-3 space-y-2">
          {accounts.slice(0, 4).map((a) => {
            const active = draft.accountId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => update({ accountId: a.id })}
                aria-pressed={active}
                className={cn(
                  'focus-ring flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-all',
                  active ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-200/80 hover:border-slate-300'
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{a.name}</span>
                  <span className="block text-xs text-slate-500">
                    {a.type} &bull; •••• {a.number}
                  </span>
                </span>
                <span className="tnum shrink-0 text-right text-sm font-bold text-slate-900">{money(a.balance, a.currency)}</span>
                {active ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <Textarea
        label="Reference / note (optional)"
        value={draft.note}
        onChange={(e) => update({ note: e.target.value })}
        placeholder="e.g. April school fees"
        rows={2}
        hint="Appears on your statement and on the recipient's notification."
      />

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Transfer amount</span>
          <span className="tnum font-semibold text-slate-900">{money(draft.amount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Fee ({provider?.short})</span>
          <span className="tnum font-semibold text-slate-900">{fee === 0 ? 'Free' : money(fee)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
          <span className="font-semibold text-slate-700">Total debit</span>
          <span className="tnum text-base font-bold text-slate-900">{money(total)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Estimated arrival: <span className="font-semibold text-slate-700">{provider?.eta}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily limit</p>
        <div className="mt-2">
          <ProgressBar value={dailyLimit.used + draft.amount} max={dailyLimit.max} label="Daily transfer limit" />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <span className="tnum font-semibold text-slate-700">{money(dailyLimit.used + draft.amount)}</span> of{' '}
          <span className="tnum font-semibold text-slate-700">{money(dailyLimit.max)}</span> used today &bull;{' '}
          <Link to="/app/limits" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Manage limits
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 4 — review                                                      */
/* ------------------------------------------------------------------ */

function ReviewStep({ draft, onEdit }: { draft: Draft; onEdit: (key: Step) => void }) {
  const provider = PROVIDERS.find((p) => p.id === draft.providerId);
  const source = accounts.find((a) => a.id === draft.accountId) ?? accounts[0];
  const fee = draft.providerId === 'swift' ? 12 : 0;
  const total = draft.amount + fee;
  const ident = identifierFor(draft.providerId);
  const simulated = provider?.eta === 'Demo Transfer' || provider?.fee === 'Integration Required';

  const row = (label: string, value: React.ReactNode, onEditKey?: Step) => (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-slate-500">{label}</span>
      <span className="min-w-0 text-right text-sm font-semibold text-slate-900">{value}</span>
      {onEditKey ? (
        <button
          type="button"
          onClick={() => onEdit(onEditKey)}
          className="focus-ring shrink-0 rounded-lg px-1.5 py-0.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Edit
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-card">
        <div className="flex justify-center">
          <Avatar name={draft.recipientName || 'New recipient'} size="xl" color="#0F172A" />
        </div>
        <p className="mt-3 text-sm text-slate-500">Sending to</p>
        <p className="mt-0.5 text-lg font-bold text-slate-900">{draft.recipientName}</p>
        <p className="text-xs text-slate-500">
          {provider?.name} &bull; {draft.identifier}
        </p>
        <p className="tnum mt-4 text-4xl font-bold tracking-tight text-slate-900">{money(draft.amount)}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Badge tone="emerald" icon={<Zap className="h-3 w-3" aria-hidden />}>
            {provider?.eta}
          </Badge>
          <Badge tone={fee === 0 ? 'emerald' : 'sky'}>{fee === 0 ? 'No fee' : `${money(fee)} fee`}</Badge>
          {simulated ? <Badge tone="amber">Demo transfer</Badge> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-2">
        {row('From account', <span>{source.name} &bull; •••• {source.number}</span>, 'amount')}
        {row('Recipient account', <span className="font-mono text-[13px]">{draft.identifier}</span>, 'details')}
        {row('Provider / rail', provider?.name, 'details')}
        {draft.bankName ? row('Bank', draft.bankName, 'details') : null}
        {row('Purpose', draft.purpose, 'details')}
        {row('Reference', draft.note || <span className="text-slate-400">None</span>, 'amount')}
        <div className="my-1 border-t border-dashed border-slate-200" />
        {row('Amount', money(draft.amount))}
        {row('Fee', fee === 0 ? 'Free' : money(fee))}
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 py-3">
          <span className="text-sm font-semibold text-slate-700">Total debit</span>
          <span className="tnum text-lg font-bold text-slate-900">{money(total)}</span>
        </div>
        {row('Estimated arrival', provider?.eta)}
        {row('Debited balance', <span className="tnum">{money(source.available - total)}</span>)}
      </div>

      {simulated ? (
        <Alert tone="warning" title="You are about to make a demo transfer">
          This prototype simulates the provider end to end. No real money moves, no external provider is contacted, and the entry is
          labelled as demo data everywhere it appears.
        </Alert>
      ) : (
        <Alert tone="info" title="Funds leave instantly">
          {provider?.name} transfers cannot be reversed once sent. Double-check the recipient details before confirming.
        </Alert>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <SecurityBadge label="256-bit encrypted" />
        <SecurityBadge label="Two-factor verified" />
        <SecurityBadge label="Demo environment" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 5 — two-factor verification                                    */
/* ------------------------------------------------------------------ */

function VerifyStep({
  otp,
  setOtp,
  channel,
  secondsLeft,
  onResend,
  onSwitch,
}: {
  otp: string;
  setOtp: (v: string) => void;
  channel: 'sms' | 'authenticator';
  secondsLeft: number;
  onResend: () => void;
  onSwitch: () => void;
}) {
  const masked = channel === 'sms' ? '+1 ••• ••• 4821' : 'PAYBACK Authenticator';
  const complete = otp.length === 6;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-card">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Lock className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-3 text-lg font-bold text-slate-900">Two-factor verification</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the 6-digit code sent to <span className="font-semibold text-slate-700">{masked}</span>
        </p>

        <div className="mt-5 flex justify-center">
          <OtpInput length={6} value={otp} onChange={setOtp} />
        </div>

        <p className={cn('mt-4 text-xs font-semibold', complete ? 'text-emerald-600' : 'text-slate-400')}>
          {complete ? 'Code complete — confirm to send.' : 'The code expires in 04:58.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onResend} disabled={secondsLeft > 0}>
            {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend code'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onSwitch} icon={<ShieldCheck className="h-4 w-4" aria-hidden />}>
            {channel === 'sms' ? 'Use authenticator app' : 'Use SMS instead'}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOtp('123456')}
          className="focus-ring mt-5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 hover:bg-amber-100"
        >
          Demo: autofill code 123456
        </button>
      </div>

      <Alert tone="warning" title="Demo verification">
        Any 6-digit code is accepted in this prototype. Real deployments require a live SMS or authenticator challenge.
      </Alert>

      <ul className="space-y-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-600">
        <li className="flex gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
          PAYBACK staff will never ask for your verification code.
        </li>
        <li className="flex gap-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" aria-hidden />
          Transfers above $2,000 additionally require biometric or passkey confirmation.
        </li>
        <li className="flex gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          If you did not request this transfer, cancel immediately and contact support.
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TransferPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [otp, setOtp] = useState('');
  const [channel, setChannel] = useState<'sms' | 'authenticator'>('sms');
  const [resendIn, setResendIn] = useState(30);
  const [processing, setProcessing] = useState(false);
  /** Which transfer stage we are genuinely at, or null when idle. */
  const [transferStage, setTransferStage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ ref: string; at: string } | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const done = stepIdx >= STEPS.length;
  const stepKey: Step = done ? 'done' : STEPS[stepIdx].key;
  const provider = PROVIDERS.find((p) => p.id === draft.providerId);
  const source = accounts.find((a) => a.id === draft.accountId) ?? accounts[0];
  const fee = draft.providerId === 'swift' ? 12 : 0;
  const total = draft.amount + fee;

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    if (stepKey !== 'verify' || resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [stepKey, resendIn]);

  const validate = (): string | null => {
    if (!draft.recipientName.trim()) return 'Choose or enter a recipient name before continuing.';
    if (!draft.identifier.trim()) return `Enter the ${identifierFor(draft.providerId).label.toLowerCase()}.`;
    if (stepKey === 'details' && provider?.fee === 'Integration Required')
      return `${provider.name} is not connected in this prototype — pick another provider to continue.`;
    if (stepKey === 'amount') {
      if (draft.amount <= 0) return 'Enter an amount greater than zero.';
      if (total > source.available) return 'The amount (including fees) exceeds the available balance of the selected account.';
    }
    if (stepKey === 'verify' && otp.length !== 6) return 'Enter the 6-digit verification code to authorise the transfer.';
    return null;
  };

  /**
 * Submit the transfer.
 *
 * The prototype has no network, so this walks the *named* stages a real bank
 * transfer passes through rather than showing an invented percentage. The stages
 * are the honest model: we are telling the user what is happening, not claiming
 * a completion rate we cannot measure.
 */
const submit = () => {
  setProcessing(true);
  setTransferStage(0);
  const timers = [
    window.setTimeout(() => setTransferStage(1), 700),
    window.setTimeout(() => setTransferStage(2), 1400),
  ];
  window.setTimeout(() => {
    timers.forEach(window.clearTimeout);
    setReceipt({ ref: uid('TXN-').toUpperCase(), at: new Date().toISOString() });
    setTransferStage(null);
    setProcessing(false);
    setOtp('');
    setStepIdx(STEPS.length);
    toast.success('Transfer sent', `${money(draft.amount)} is on its way to ${draft.recipientName}.`);
  }, 2200);
};

  const handleNext = () => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    if (stepKey === 'review') {
      setStepIdx(4);
      setResendIn(30);
      return;
    }
    if (stepKey === 'verify') {
      submit();
      return;
    }
    setStepIdx((i) => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError(null);
    setStepIdx((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTo = (key: Step) => {
    const idx = STEPS.findIndex((s) => s.key === key);
    if (idx >= 0) {
      setError(null);
      setStepIdx(idx);
    }
  };

  const restart = () => {
    setDraft(emptyDraft);
    setReceipt(null);
    setError(null);
    setOtp('');
    setStepIdx(0);
  };

  const copyReceipt = async () => {
    if (!receipt) return;
    const text = `PAYBACK transfer ${receipt.ref} — ${money(draft.amount)} to ${draft.recipientName}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.info('Receipt copied', 'Transfer details copied to your clipboard.');
    } catch {
      toast.warning('Copy unavailable', 'Your browser blocked clipboard access.');
    }
  };

  const body = (() => {
    switch (stepKey) {
      case 'recipient':
        return (
          <RecipientStep
            draft={draft}
            onPick={(name, providerId, identifier) => {
              update({ recipientName: name, providerId, identifier });
              setStepIdx(1);
            }}
            onNew={() => {
              update({ recipientName: '', identifier: '' });
              setStepIdx(1);
            }}
          />
        );
      case 'details':
        return <DetailsStep draft={draft} update={update} />;
      case 'amount':
        return <AmountStep draft={draft} update={update} />;
      case 'review':
        return <ReviewStep draft={draft} onEdit={jumpTo} />;
      case 'verify':
        return (
          <VerifyStep
            otp={otp}
            setOtp={setOtp}
            channel={channel}
            secondsLeft={resendIn}
            onResend={() => {
              setResendIn(30);
              toast.info('Code resent', channel === 'sms' ? 'A new code was sent by SMS.' : 'A new code was pushed to your authenticator app.');
            }}
            onSwitch={() => {
              setChannel((c) => (c === 'sms' ? 'authenticator' : 'sms'));
              setResendIn(30);
            }}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <SuccessState
              title="Transfer sent"
              description={`${money(draft.amount)} to ${draft.recipientName} via ${provider?.name}. Estimated arrival: ${provider?.eta}.`}
            />
            <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-left">
              <KeyValue
                columns={2}
                items={[
                  { label: 'Reference', value: receipt?.ref ?? '—', mono: true },
                  { label: 'Status', value: <Badge tone="emerald">Completed</Badge> },
                  { label: 'Recipient', value: draft.recipientName },
                  { label: 'Destination', value: draft.identifier, mono: true },
                  { label: 'Funded by', value: `${source.name} •••• ${source.number}` },
                  { label: 'Total debited', value: money(total) },
                  { label: 'Purpose', value: draft.purpose },
                  { label: 'Timestamp', value: receipt ? new Date(receipt.at).toLocaleString('en-US') : '—' },
                ]}
              />
              <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                This transfer was simulated by the PAYBACK prototype — no real money moved and no external provider was contacted.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button variant="outline" icon={<Copy className="h-4 w-4" aria-hidden />} onClick={copyReceipt}>
                Copy receipt
              </Button>
              <Button variant="outline" onClick={() => setShowReceipt(true)}>View receipt</Button>
              <Button variant="soft" icon={<Repeat2 className="h-4 w-4" aria-hidden />} onClick={restart}>
                Send another
              </Button>
              <Button icon={<LayoutDashboard className="h-4 w-4" aria-hidden />} onClick={() => navigate('/app')}>
                Back to dashboard
              </Button>
            </div>
          </div>
        );
    }
  })();

  const footer = (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant="ghost"
        onClick={stepIdx === 0 ? () => navigate('/app') : handleBack}
        icon={stepIdx === 0 ? undefined : <ArrowLeft className="h-4 w-4" aria-hidden />}
      >
        {stepIdx === 0 ? 'Cancel' : 'Back'}
      </Button>
      <Button
        onClick={handleNext}
        loading={processing}
        iconRight={
          stepKey === 'verify' ? (
            <Send className="h-4 w-4" aria-hidden />
          ) : stepKey === 'review' ? (
            <ShieldCheck className="h-4 w-4" aria-hidden />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden />
          )
        }
      >
        {stepKey === 'review' ? 'Confirm & send' : stepKey === 'verify' ? 'Authorise transfer' : 'Continue'}
      </Button>
    </div>
  );

  return (
    <>
      {/*
        The in-flight state overlays the form rather than replacing it, so the
        user can still see the transfer they are authorising.
      */}
      {processing ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-surface/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-lift">
            <TransferLoader
              stages={TRANSFER_STAGES.map((label, i): LoaderStage => ({
                label,
                status: i < (transferStage ?? 0) ? 'complete' : i === (transferStage ?? 0) ? 'active' : 'pending',
              }))}
              amount={money(total)}
              recipient={draft.recipientName}
            />
          </div>
        </div>
      ) : null}

      <PageWrap>
      <PageHeader
        eyebrow="Payments"
        title="Send money"
        description="Move money to any PAYBACK account, mobile wallet or bank — validated, verified and confirmed in seconds."
        actions={
          <>
            <SecurityBadge label="256-bit encrypted" />
            <Button variant="outline" size="sm" onClick={() => navigate('/app/limits')} icon={<Info className="h-4 w-4" aria-hidden />}>
              Limits &amp; fees
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {!done ? <Stepper steps={STEPS.map((s) => ({ label: s.label, hint: s.hint }))} current={stepIdx} /> : null}

          <div
            key={stepKey}
            className="animate-fade-in rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-6"
          >
            {body}
          </div>

          {error ? (
            <Alert tone="danger" title="Cannot continue">
              {error}
            </Alert>
          ) : null}

          {!done ? footer : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader title="Transfer summary" subtitle={provider?.name ?? 'PAYBACK'} />
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={draft.recipientName || 'New recipient'} size="sm" color="#0F172A" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{draft.recipientName || 'No recipient yet'}</p>
                  <p className="truncate text-xs text-slate-500">{draft.identifier || 'Choose a recipient to begin'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-500">Amount</span>
                <span className="tnum font-semibold text-slate-900">{money(draft.amount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Fee</span>
                <span className="tnum font-semibold text-slate-900">{fee === 0 ? 'Free' : money(fee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="tnum text-base font-bold text-slate-900">{money(total)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Arrives {provider?.eta?.toLowerCase()}
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Daily limit</p>
                <div className="mt-1.5">
                  <ProgressBar value={transferLimits[0].used + draft.amount} max={transferLimits[0].max} label="Daily limit usage" />
                </div>
                <p className="tnum mt-1.5 text-[11px] text-slate-500">
                  {money(transferLimits[0].used + draft.amount, 'USD', { decimals: false })} of{' '}
                  {money(transferLimits[0].max, 'USD', { decimals: false })}
                </p>
              </div>
            </CardBody>
          </Card>

          <DemoBanner
            label="Demo flow"
            text="Provider rails, fees and OTP verification are simulated. No external network is contacted and no real money moves."
          />

          <Link
            to="/support"
            className="focus-ring flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden />
              Need help with a transfer?
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </aside>
      </div>

      <Modal
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        title="Transfer receipt"
        description={receipt?.ref}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowReceipt(false)}>
              Close
            </Button>
            <Button icon={<Copy className="h-4 w-4" aria-hidden />} onClick={copyReceipt}>
              Copy details
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-5 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-6 w-6" aria-hidden />
            </span>
            <p className="tnum text-2xl font-bold text-slate-900">{money(draft.amount)}</p>
            <p className="text-sm text-slate-500">
              to <span className="font-semibold text-slate-800">{draft.recipientName}</span> via {provider?.name}
            </p>
            <Badge tone="violet">Demo — no real money moved</Badge>
          </div>
          <KeyValue
            columns={1}
            items={[
              { label: 'Reference', value: receipt?.ref ?? '—', mono: true },
              { label: 'Destination', value: draft.identifier, mono: true },
              { label: 'Funded by', value: `${source.name} •••• ${source.number}` },
              { label: 'Purpose', value: draft.purpose },
              { label: 'Note', value: draft.note || '—' },
              { label: 'Fee', value: fee === 0 ? 'Free' : money(fee) },
              { label: 'Total debited', value: money(total) },
              { label: 'Timestamp', value: receipt ? new Date(receipt.at).toLocaleString('en-US') : '—' },
            ]}
          />
          <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ReceiptQr value={`PAYBACK1:receipt:${receipt?.ref ?? 'PB-TX-00000'}`} size={140} label="Receipt QR code" />
            <p className="text-center text-xs text-slate-500">
              Scan this receipt to verify it later — the code carries only a safe reference.
            </p>
          </div>
        </div>
      </Modal>
      </PageWrap>
    </>
  );
}
