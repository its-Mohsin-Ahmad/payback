import { useState } from 'react';
import { Plus, Snowflake } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { PaybackCard3D } from '@/components/card3d';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DemoBanner,
  PageHeader,
  ProgressBar,
  StatCard,
  useToast,
} from '@/components/ui';
import { corporateCards } from '@/data/enterprise';
import { useDemoCards } from '@/components/cards/cardVariants';
import { money } from '@/lib/utils';

export default function CorporateCardsPage() {
  const toast = useToast();
  // Card *visuals* (gradient, chip, network mark) come from the session-stamped
  // demo set. The holder line is kept per-card from the team roster below,
  // because each of those cards belongs to a different authorised person — that
  // is the point of corporate card issuance (spec §4).
  const demoCards = useDemoCards();
  const [frozen, setFrozen] = useState<string[]>(
    corporateCards.filter((c) => c.status === 'Frozen').map((c) => c.id)
  );

  const totalLimit = corporateCards.reduce((s, c) => s + c.limit, 0);
  const totalSpent = corporateCards.reduce((s, c) => s + c.spent, 0);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Manage"
        title="Corporate cards"
        description="Issue, limit and freeze cards for your team."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Card issuance is simulated in this prototype.')}>
            Issue card
          </Button>
        }
      />

      <DemoBanner label="Demo cards" text="Card numbers, holders and limits are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total monthly limit" value={money(totalLimit, 'USD', { decimals: false })} tone="#10B981" />
        <StatCard
          label="Spent this cycle"
          value={money(totalSpent, 'USD', { decimals: false })}
          tone="#38BDF8"
          footer={`${Math.round((totalSpent / totalLimit) * 100)}% of limits`}
        />
        <StatCard
          label="Frozen cards"
          value={String(frozen.length)}
          tone="#F59E0B"
          footer={`${corporateCards.length} cards issued`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {corporateCards.map((card) => {
          const isFrozen = frozen.includes(card.id);
          const visual = demoCards.find((c) => c.last4 === card.id.split('-')[1]) ?? demoCards[2];
          const pct = Math.round((card.spent / card.limit) * 100);
          return (
            <div key={card.id} className="space-y-3">
              <div className="flex justify-center">
                <PaybackCard3D
                  card={{
                    ...visual,
                    holder: card.holder.toUpperCase(),
                    status: isFrozen ? 'Frozen' : 'Active',
                    spent: card.spent,
                    limit: card.limit,
                  }}
                  size="sm"
                  flipLabel={false}
                />
              </div>
              <Card>
                <CardBody className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">{card.holder}</p>
                    <Badge tone={isFrozen ? 'amber' : 'emerald'}>{isFrozen ? 'Frozen' : 'Active'}</Badge>
                  </div>
                  <p className="tnum text-xs text-slate-500">
                    {money(card.spent, 'USD', { decimals: false })} of {money(card.limit, 'USD', { decimals: false })} • {pct}%
                  </p>
                  <ProgressBar value={card.spent} max={card.limit} label={`${card.label} utilisation`} tone={pct > 85 ? '#F43F5E' : '#10B981'} />
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant={isFrozen ? 'primary' : 'danger'}
                      icon={<Snowflake className="h-4 w-4" aria-hidden />}
                      onClick={() => {
                        setFrozen((prev) => (isFrozen ? prev.filter((id) => id !== card.id) : [...prev, card.id]));
                        toast.warning(isFrozen ? 'Card unfrozen' : 'Card frozen', `${card.label} updated (demo).`);
                      }}
                    >
                      {isFrozen ? 'Unfreeze' : 'Freeze'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info('Receipts', `${card.label} receipts opened (demo).`)}>
                      Receipts
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>

      <Alert tone="info" title="Spend policies">
        Cards enforce merchant-category rules, single-transaction caps and weekend controls. Policy changes apply to new
        authorisations only (demo).
      </Alert>
    </PageWrap>
  );
}
