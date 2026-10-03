import { useState } from 'react';
import { CreditCard, Plus, Snowflake, Zap } from 'lucide-react';
import { CardVisual, PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  ProgressBar,
  Toggle,
  useToast,
} from '@/components/ui';
import { cards as initialCards, type Card as CardType } from '@/data/mock';
import { money } from '@/lib/utils';

export default function CardsPage() {
  const toast = useToast();
  const [cards, setCards] = useState<CardType[]>(initialCards);
  const [selectedId, setSelectedId] = useState(initialCards[0].id);

  const selected = cards.find((c) => c.id === selectedId) ?? cards[0];

  const patch = (id: string, changes: Partial<CardType>) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));

  const toggleFreeze = (card: CardType) => {
    const next = card.status === 'Frozen' ? 'Active' : 'Frozen';
    patch(card.id, { status: next as CardType['status'] });
    if (next === 'Frozen') toast.warning('Card frozen', `${card.label} will decline new authorisations (demo).`);
    else toast.success('Card unfrozen', `${card.label} is accepting payments again (demo).`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Move money"
        title="Cards"
        description="Manage debit, virtual and business cards — controls apply instantly."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo only', 'New card issuance is not part of this prototype.')}>
            Order new card
          </Button>
        }
      />

      <DemoBanner label="Demo cards" text="Card numbers, limits and controls are simulated — no physical or virtual card is issued." />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelectedId(card.id)}
            className={`focus-ring rounded-3xl p-1 text-left transition-all ${
              selected.id === card.id ? 'ring-2 ring-emerald-500/60' : 'hover:opacity-95'
            }`}
          >
            <CardVisual card={card} />
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={`${selected.label} controls`}
              subtitle={`•••• ${selected.last4} • Expires ${selected.expiry}`}
              action={<Badge tone={selected.status === 'Active' ? 'emerald' : 'amber'}>{selected.status}</Badge>}
            />
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Toggle checked={selected.online} onChange={(next) => patch(selected.id, { online: next })} label="Online payments" hint="E-commerce and in-app purchases" />
                <Toggle checked={selected.international} onChange={(next) => patch(selected.id, { international: next })} label="International" hint="Payments outside your home country" />
                <Toggle checked={selected.contactless} onChange={(next) => patch(selected.id, { contactless: next })} label="Contactless" hint="Tap to pay at terminals" />
                <Toggle checked={selected.atm} onChange={(next) => patch(selected.id, { atm: next })} label="ATM withdrawals" hint="Cash access at machines" />
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <ProgressBar value={selected.spent} max={selected.limit} tone={selected.spent / selected.limit > 0.8 ? '#F43F5E' : '#10B981'} label="Monthly limit used" />
                <p className="mt-2 text-xs text-slate-500">
                  {money(selected.spent)} spent of {money(selected.limit)} • {money(selected.limit - selected.spent)} remaining
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick actions" />
            <CardBody className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button variant={selected.status === 'Frozen' ? 'primary' : 'danger'} icon={<Snowflake className="h-4 w-4" aria-hidden />} onClick={() => toggleFreeze(selected)}>
                {selected.status === 'Frozen' ? 'Unfreeze card' : 'Freeze card'}
              </Button>
              <Button variant="outline" icon={<Zap className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Single-use virtual cards are not part of this prototype.')}>
                Create single-use card
              </Button>
              <Button variant="outline" icon={<CreditCard className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Card details', 'Full details are masked in this demo for safety.')}>
                Show card details
              </Button>
              <Button variant="ghost" onClick={() => toast.warning('Demo', 'Card replacement is simulated in this prototype.')}>
                Replace card
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Card summary" subtitle={selected.type} />
            <CardBody className="space-y-3">
              <ProgressBar value={selected.spent} max={selected.limit} label="Spend this cycle" tone="#10B981" />
              <dl className="space-y-2 text-sm">
                {[
                  { k: 'Scheme', v: selected.scheme },
                  { k: 'Status', v: selected.status },
                  { k: 'Currency', v: selected.currency },
                  { k: 'Monthly limit', v: money(selected.limit) },
                  { k: 'Spent', v: money(selected.spent) },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">{row.k}</dt>
                    <dd className="tnum font-semibold text-slate-900">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>

          <Alert tone="info" title="Lost or stolen?">
            Freeze the card here instantly, then report it from Support. Freezing blocks new authorisations while existing
            subscriptions continue until you cancel them.
          </Alert>
        </div>
      </div>
    </PageWrap>
  );
}
