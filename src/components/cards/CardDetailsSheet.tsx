import { PaybackCard3D } from '@/components/card3d';
import { Alert, Badge, Button, Modal } from '@/components/ui';
import { CARD_PILLARS, limitLabel, type CardVariant } from './cardVariants';

/**
 * Card details (spec §25).
 *
 * Uses `Modal`, which is a centred dialog at `sm`+ and a bottom sheet below
 * that, with `safe-bottom` on the actions and drag-to-dismiss already built in.
 *
 * No PAN, CVV or PIN is rendered here — the card shows only its masked number,
 * which is the same demo value shown everywhere else (spec §48).
 */
export function CardDetailsSheet({
  open,
  onClose,
  variant,
  onOrder,
}: {
  open: boolean;
  onClose: () => void;
  variant: CardVariant;
  onOrder: () => void;
}) {
  const { card } = variant;
  const features = [
    ['Contactless payments', variant.features.contactless],
    ['Online payments', variant.features.online],
    ['International payments', variant.features.international],
    ['ATM withdrawals', variant.features.atm],
    ['Device-wallet token', card.secureElement.present],
  ] as const;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={variant.label}
      description={variant.description}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onOrder}>Get this card</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* The card itself, so the sheet is not an abstract list of numbers. */}
        <div className="flex justify-center">
          <div className="w-[min(100%,300px)]">
            <PaybackCard3D card={card} size="md" fill interactive={false} showPan={false} flipLabel={false} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Annual fee</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{variant.fees.annual}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Card status</p>
            <p className="mt-1">
              <Badge tone={card.status === 'Active' ? 'emerald' : 'amber'}>{card.status}</Badge>
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Spending limits</p>
          <p className="mt-1.5 text-sm text-slate-700">{limitLabel(card)}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Supported features</p>
          <ul className="mt-2 grid gap-2">
            {features.map(([label, available]) => (
              <li key={label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-600">{label}</span>
                <Badge tone={available ? 'emerald' : 'neutral'}>{available ? 'Supported' : 'Not included'}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Benefits</p>
          <ul className="mt-2 grid gap-2">
            {CARD_PILLARS.map((pillar) => (
              <li key={pillar.key} className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{pillar.title}</span> — {pillar.description}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Eligibility</p>
          <p className="mt-1.5 text-sm text-slate-700">
            An active PAYBACK account and completed identity verification. Approval is subject to checks (demo).
          </p>
        </div>

        <Alert tone="info" title="Demo card">
          Card numbers, limits and fees shown here are synthetic samples. No real card, PIN or CVV is ever
          displayed.
        </Alert>
      </div>
    </Modal>
  );
}