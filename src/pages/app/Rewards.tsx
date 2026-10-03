import { useState } from 'react';
import { Gift, Sparkles, Star } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
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
  SectionTitle,
  SegmentedControl,
  StatCard,
  useToast,
} from '@/components/ui';
import { redemptionHistory, rewardOffers, rewardsSummary } from '@/data/mock';
import { money } from '@/lib/utils';

type Category = 'All' | string;

export default function RewardsPage() {
  const toast = useToast();
  const [category, setCategory] = useState<Category>('All');

  const categories = ['All', ...Array.from(new Set(rewardOffers.map((o) => o.category)))];
  const visible = category === 'All' ? rewardOffers : rewardOffers.filter((o) => o.category === category);
  const toNext = rewardsSummary.nextTierPoints - rewardsSummary.points;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Grow & borrow"
        title="Rewards"
        description="Earn points on every spend and redeem them with partner offers."
        actions={
          <Badge tone="amber" icon={<Star className="h-3 w-3" aria-hidden />}>
            {rewardsSummary.tier} member
          </Badge>
        }
      />

      <DemoBanner label="Demo rewards" text="Points, partners and vouchers are illustrative — nothing can be redeemed for real." />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-6 text-white shadow-lift navy-mesh lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Points balance</p>
              <p className="tnum mt-2 text-4xl font-bold tracking-tight">{rewardsSummary.points.toLocaleString()}</p>
              <p className="mt-1 text-sm text-white/60">
                {rewardsSummary.cashValue} cash value • {rewardsSummary.tier} tier
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
              <Gift className="h-6 w-6" aria-hidden />
            </span>
          </div>

          <div className="mt-5">
            <ProgressBar value={rewardsSummary.points} max={rewardsSummary.nextTierPoints} tone="#F59E0B" label="Progress to next tier" />
            <p className="mt-2 text-xs text-white/60">
              {toNext.toLocaleString()} points to Platinum • {rewardsSummary.expiringPoints.toLocaleString()} points expire{' '}
              {rewardsSummary.expiringOn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard label="Earned this year" value="12,400 pts" delta={8.4} tone="#10B981" footer="1 pt per $1 spent" />
          <StatCard label="Redeemed this year" value="12,800 pts" tone="#38BDF8" footer="4 rewards claimed" />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl<string>
          value={category}
          onChange={setCategory}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <p className="text-xs text-slate-500">{visible.length} offers available</p>
      </div>

      <section className="space-y-3">
        <SectionTitle title="Partner offers" description="Redeem points for vouchers, discounts and experiences." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((offer) => (
            <Card key={offer.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${offer.tone}1a`, color: offer.tone }}>
                    <Gift className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{offer.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {offer.partner} • {offer.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
                  <span className="tnum font-semibold text-slate-900">{offer.points.toLocaleString()} pts</span>
                  <span className="font-semibold text-emerald-600">worth {offer.cash}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-400">Expires {offer.expiry}</p>
                  <Button
                    size="sm"
                    variant="soft"
                    disabled={offer.points > rewardsSummary.points}
                    onClick={() => toast.success('Redeemed', `${offer.title} redeemed for ${offer.points.toLocaleString()} points (demo).`)}
                  >
                    {offer.points > rewardsSummary.points ? 'Not enough pts' : 'Redeem'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle title="Redemption history" description="Points earned and spent over time." />
        <Card>
          <CardBody className="space-y-3">
            {redemptionHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{entry.item}</p>
                  <p className="text-xs text-slate-500">
                    {entry.date} • {entry.status}
                  </p>
                </div>
                <span className={`tnum shrink-0 text-sm font-bold ${entry.points >= 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {entry.points >= 0 ? '+' : '−'}
                  {Math.abs(entry.points).toLocaleString()}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      <section className="space-y-3">
        <SectionTitle title="How rewards work" description="Three simple steps." />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '1', title: 'Spend', body: 'Earn 1 point per $1 on card payments and transfers.' },
            { step: '2', title: 'Grow', body: 'Tier multipliers push you toward Platinum and Private.' },
            { step: '3', title: 'Redeem', body: 'Swap points for partner vouchers, cashback and travel.' },
          ].map((s) => (
            <Card key={s.step}>
              <CardBody className="space-y-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                  {s.step}
                </span>
                <p className="text-sm font-bold text-slate-900">{s.title}</p>
                <p className="text-xs leading-relaxed text-slate-500">{s.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <Alert tone="info" title="Points never convert to cash directly">
        Redemptions are vouchers only and expire according to the programme rules shown on each offer.
      </Alert>

      <p className="pb-2 text-center text-xs text-slate-400">
        <Sparkles className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-amber-400" aria-hidden />
        Rewards programme operated for demonstration purposes only.
      </p>
    </PageWrap>
  );
}
