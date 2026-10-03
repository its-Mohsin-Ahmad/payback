import { Plus, Snowflake } from 'lucide-react';
import { PageWrap, UtilisationBar } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  StatCard,
  useToast,
} from '@/components/ui';
import { corporateCards } from '@/data/enterprise';
import { money } from '@/lib/utils';

export default function CorporateCardsPage() {
  const toast = useToast();

  const totalLimit = corporateCards.reduce((s, c) => s + c.limit, 0);
  const totalSpent = corporateCards.reduce((s, c) => s + c.spent, 0);
  const frozen = corporateCards.filter((c) => c.status === 'Frozen').length;

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
        <StatCard label="Spent this cycle" value={money(totalSpent, 'USD', { decimals: false })} tone="#38BDF8" footer={`${Math.round((totalSpent / totalLimit) * 100)}% of limits`} />
        <StatCard label="Frozen cards" value={String(frozen)} tone="#F59E0B" footer={`${corporateCards.length} cards issued`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {corporateCards.map((card) => (
          <Card key={card.id}>
            <CardHeader
              title={card.holder}
              subtitle={card.label}
              action={<Badge tone={card.status === 'Active' ? 'emerald' : 'amber'}>{card.status}</Badge>}
            />
            <CardBody className="space-y-4">
              <UtilisationBar
                label="Limit used"
                used={card.spent}
                max={card.limit}
                tone={card.spent / card.limit > 0.85 ? '#F43F5E' : '#10B981'}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={card.status === 'Frozen' ? 'primary' : 'danger'}
                  icon={<Snowflake className="h-4 w-4" aria-hidden />}
                  onClick={() => toast.warning(card.status === 'Frozen' ? 'Unfreeze simulated' : 'Freeze simulated', `${card.label} updated (demo).`)}
                >
                  {card.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info('Limits', 'Per-card limit editing is simulated.')}>
                  Adjust limit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.info('Statement', 'Card statement opened (demo).')}>
                  Statement
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Alert tone="info" title="Spend policies">
        Cards enforce merchant-category rules, single-transaction caps and weekend controls. Policy changes apply to new
        authorisations only (demo).
      </Alert>
    </PageWrap>
  );
}
