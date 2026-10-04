import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { PaybackCard3D } from '@/components/card3d';
import { CARD_VARIANTS } from './cardVariants';
import { cn } from '@/lib/utils';

/**
 * The hero showcase (spec §6, §10, §17, §18, §27, §28).
 *
 * One card is centred at a time rather than a scrolling track of three. A track
 * necessarily shows its neighbours, which the spec explicitly forbids ("never
 * allow partial unwanted cards"), and centring one card also keeps the swipe
 * gesture unambiguous.
 *
 * Sizing follows spec §14 exactly — `100vw - 40px` capped at 360px on the
 * narrowest phones, `100vw - 48px` capped at 380px above 375px — so the card can
 * never touch an edge or push the page into a horizontal scroll.
 */
export function CardShowcase({
  index,
  onIndexChange,
}: {
  index: number;
  onIndexChange: (next: number) => void;
}) {
  const variant = CARD_VARIANTS[index];
  const [flipped, setFlipped] = useState(false);

  /**
   * A swipe has to be told apart from a tap, but `click` fires *after*
   * `pointerup`, so by the time the card's click handler runs the gesture is
   * already resolved. These refs carry the verdict across that gap.
   */
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const go = useCallback(
    (next: number) => {
      // Wraps around: a carousel that dead-ends on the last card feels broken.
      const wrapped = ((next % CARD_VARIANTS.length) + CARD_VARIANTS.length) % CARD_VARIANTS.length;
      onIndexChange(wrapped);
      // Always return to the front, so selecting a new card never lands the user
      // on the back of a card they have not read yet.
      setFlipped(false);
    },
    [onIndexChange],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    start.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const from = start.current;
    start.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    // Horizontal intent has to dominate, otherwise a vertical scroll over the
    // card changes the card instead of scrolling the page.
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      go(dx < 0 ? index + 1 : index - 1);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    }
  };

  const onActivate = () => {
    if (swiped.current) {
      // Consume the click that the swipe's pointerup is about to produce.
      swiped.current = false;
      return;
    }
    setFlipped((f) => !f);
  };

  const accent = variant.card.identity.accent;

  return (
    <div
      className="relative flex flex-col items-center"
      role="group"
      aria-roledescription="carousel"
      aria-label="Card showcase"
    >
      {/* Atmospheric backdrop (spec §27–§28). Decorative only, and deliberately
          built from gradients that fall off to transparent rather than `blur()`,
          which paints outside its box and was a direct cause of horizontal
          overflow in this section. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-1/2 h-[130%] w-[120%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: `radial-gradient(ellipse at center, ${accent}26 0%, ${accent}0D 38%, transparent 66%)` }}
        />
        {/* Two faint concentric rings — depth without clutter. */}
        <div className="absolute left-1/2 top-1/2 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/45" />
        <div className="absolute left-1/2 top-1/2 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/30" />
        {/* Barely-there grid, masked to the middle so the edges fade away. */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center, #000 0%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, #000 0%, transparent 72%)',
          }}
        />
      </div>

      {/* Swipe surface. `touch-pan-y` keeps vertical scrolling with the page while
          still letting a horizontal drag register as a gesture. */}
      <div
        className="flex w-full touch-pan-y justify-center"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
        }}
      >
        <div
          className="w-[min(calc(100vw-2.5rem),360px)] min-[375px]:w-[min(calc(100vw-3rem),380px)] sm:w-[400px] lg:w-[440px]"
          onKeyDown={onKeyDown}
        >
          <PaybackCard3D
            card={variant.card}
            /* `lg` is the designed showcase size; `fill` lets it shrink to fit a
               phone without ever exceeding that. */
            size="lg"
            fill
            flipped={flipped}
            onFlipChange={setFlipped}
            /* Tap flips; selection is handled by the selector and the arrows. */
            flipOnActivate={false}
            onActivate={onActivate}
            showPan={false}
            flipLabel={false}
          />
        </div>
      </div>

      {/* Explicit flip control (spec §12). Tapping the card works too, but nothing
          about a physical card advertises that, so this stays as the
          discoverable path. */}
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`Flip ${variant.label} card to view the ${flipped ? 'front' : 'back'}`}
        className="focus-ring mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 text-xs font-semibold text-slate-600 shadow-card backdrop-blur transition-colors hover:border-emerald-300 hover:text-emerald-700"
      >
        {flipped ? 'View front' : 'View back'}
      </button>

      {/* Pagination: previous, dots, next (spec §10, §38). */}
      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous card"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:border-emerald-300 hover:text-emerald-700"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose a card">
          {CARD_VARIANTS.map((v, i) => {
            const active = i === index;
            return (
              <button
                key={v.key}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show ${v.label}`}
                onClick={() => go(i)}
                className={cn(
                  'focus-ring flex h-11 min-w-[24px] items-center justify-center rounded-full outline-none',
                  'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                )}
              >
                <span
                  className="block rounded-full transition-all duration-300 motion-reduce:transition-none"
                  style={{
                    backgroundColor: active ? v.card.identity.accent : '#CBD5E1',
                    height: active ? 10 : 8,
                    width: active ? 26 : 8,
                  }}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next card"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:border-emerald-300 hover:text-emerald-700"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Position readout. `aria-live` announces the change for screen readers,
          since the card swap is otherwise a purely visual event. */}
      <p className="mt-2 text-xs font-medium text-slate-400" aria-live="polite">
        <span className="tnum">{String(index + 1).padStart(2, '0')}</span>
        <span className="mx-1.5 text-slate-300">/</span>
        <span className="tnum">{String(CARD_VARIANTS.length).padStart(2, '0')}</span>
        <span className="mx-1.5">—</span>
        {variant.label}
      </p>
    </div>
  );
}