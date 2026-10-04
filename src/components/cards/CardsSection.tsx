import { useState, type ReactNode } from 'react';
import { AlertTriangle, SearchX } from 'lucide-react';
import { Button, EmptyState, ErrorState } from '@/components/ui';
import { CardsSkeleton } from '@/components/loaders';
import { CardsHeader } from './CardsHeader';
import { CardShowcase } from './CardShowcase';
import { CardSelector } from './CardSelector';
import { CardInformation } from './CardInformation';
import { CardBenefits } from './CardBenefits';
import { CardControls } from './CardControls';
import { CardDetailsSheet } from './CardDetailsSheet';
import { CARD_VARIANTS } from './cardVariants';

/**
 * The Cards section (spec §51).
 *
 * Layout is genuinely recomposed rather than scaled down:
 *
 *   ≥1024px  two columns, 57.5% showcase / 42.5% information (spec §6)
 *   768–1023 stacked, showcase first, still two-column benefits (spec §29–§30)
 *   <768px  a single vertical mobile flow — heading, card, pagination, selector,
 *           information, actions (spec §13, §50)
 *
 * The card stays the visual hero at every width because the information column
 * sits *beside* it on desktop rather than pushing it downward.
 */
export function CardsSection({
  state = 'ready',
  onRetry,
  stickyCta = false,
  onOrder,
  onVariantChange,
}: {
  /** Drives the loading / error / empty treatments (spec §43–§45). */
  state?: 'ready' | 'loading' | 'error' | 'empty';
  onRetry?: () => void;
  /** Sticky mobile action bar (spec §41). Off on public marketing surfaces. */
  stickyCta?: boolean;
  onOrder?: (key: string) => void;
  /**
   * Reports the card behind the newly selected variant. The authenticated page
   * uses this to keep its payment controls bound to the card the user is looking
   * at — without it, selecting Gold would leave the controls editing a different
   * card entirely.
   */
  onVariantChange?: (cardId: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const variant = CARD_VARIANTS[index];

  /** Single entry point for selection so both the carousel and the chips stay in sync. */
  const select = (next: number) => {
    setIndex(next);
    onVariantChange?.(CARD_VARIANTS[next].card.id);
  };

  if (state === 'loading') {
    return (
      <SectionShell>
        <CardsSkeleton />
      </SectionShell>
    );
  }

  if (state === 'error') {
    return (
      <SectionShell>
        <ErrorState title="We couldn't load your cards." description="Please try again." onRetry={onRetry} />
      </SectionShell>
    );
  }

  if (state === 'empty') {
    return (
      <SectionShell>
        <EmptyState
          icon={<SearchX className="h-6 w-6" aria-hidden />}
          title="Your PAYBACK card is waiting."
          description="Choose a card designed around the way you bank."
          action={<Button onClick={() => setIndex(0)}>Explore Cards</Button>}
        />
      </SectionShell>
    );
  }

  return (
    <section className="relative" aria-labelledby="cards-heading">
      <SectionShell>
        <div id="cards-heading">
          <CardsHeader />
        </div>

        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10 xl:gap-16">
          {/* Showcase — 57.5% of the row on desktop. */}
          <div className="flex flex-col gap-6">
            <CardShowcase index={index} onIndexChange={select} />
            <CardSelector index={index} onIndexChange={select} />
          </div>

          {/* Information — 42.5%. */}
          <div className="mt-10 flex flex-col gap-6 lg:mt-0">
            <CardInformation variant={variant} />

            {/* Actions. Full-width on a phone so both are reachable by a thumb,
                auto-width beside the card on desktop (spec §21). */}
            <div className="flex flex-col gap-2.5 xs:flex-row lg:flex-col xl:flex-row">
              <Button className="w-full xs:w-auto" onClick={() => onOrder?.(variant.key)}>
                Get this card
              </Button>
              <Button variant="outline" className="w-full xs:w-auto" onClick={() => setDetailsOpen(true)}>
                View details
              </Button>
            </div>

            {/* Freeze state (spec §42) is surfaced on the information column so a
                card that cannot be used says so before the user tries. */}
            {variant.card.status !== 'Active' ? (
              <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                This card is {variant.card.status.toLowerCase()} and cannot authorise new payments.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <CardBenefits />
        </div>

        <div className="mt-12 lg:mt-16">
          <h3 className="text-section-title font-bold text-slate-900">Card controls</h3>
          <p className="mt-1.5 text-[15px] text-slate-600">Manage how and where {variant.label} can be used.</p>
          <div className="mt-5">
            <CardControls variant={variant} />
          </div>
        </div>
      </SectionShell>

      <CardDetailsSheet
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        variant={variant}
        onOrder={() => {
          setDetailsOpen(false);
          onOrder?.(variant.key);
        }}
      />

      {stickyCta ? <StickyCta label={`Get ${variant.shortLabel}`} onClick={() => onOrder?.(variant.key)} /> : null}
    </section>
  );
}

/**
 * Page padding (spec §4) and vertical rhythm (spec §36): 16px on a phone, 24px
 * on a tablet, 32px on desktop, with section padding shrinking to suit.
 */
function SectionShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">{children}</div>;
}

/**
 * Sticky mobile action (spec §41).
 *
 * Offset by the bottom nav's real height plus the home-indicator inset, so it
 * sits directly above the navigation instead of covering it. `lg` hides it —
 * on desktop the inline CTA is already visible and two would compete.
 */
function StickyCta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      className="safe-bottom fixed inset-x-0 bottom-[var(--pb-nav-h,3.5rem)] z-30 border-t border-slate-200 bg-white/95 px-4 pt-3 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <Button className="w-full" size="lg" onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}