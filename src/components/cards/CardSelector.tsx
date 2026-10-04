import { CARD_VARIANTS } from './cardVariants';
import { cn } from '@/lib/utils';

/**
 * Compact variant selector (spec §9, §37).
 *
 * Each chip carries a miniature of the card it selects, built from that card's
 * own gradient — a swatch, so the choice is legible without reading the label.
 *
 * At 320px the three chips plus their gaps fit, so there is no horizontal scroll.
 * The container still allows its own overflow below that point, which keeps the
 * *selector* scrollable without ever letting the *page* scroll sideways.
 */
export function CardSelector({
  index,
  onIndexChange,
}: {
  index: number;
  onIndexChange: (next: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Choose a card design"
      className="grid-tight -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid-cols-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {CARD_VARIANTS.map((v, i) => {
        const active = i === index;
        return (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onIndexChange(i)}
            className={cn(
              'focus-ring group flex min-h-[64px] min-w-[124px] shrink-0 snap-start items-center gap-3 rounded-2xl border bg-white px-3 text-left transition-all duration-200 motion-reduce:transition-none',
              active
                ? 'border-emerald-400 shadow-card ring-1 ring-emerald-500/25'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-card',
            )}
          >
            {/* Miniature card, same 1.586 ratio as the hero. */}
            <span
              className="h-9 w-[1.586rem] shrink-0 rounded-[5px] shadow-sm ring-1 ring-black/5"
              style={{ backgroundImage: v.card.identity.base }}
              aria-hidden
            />
            <span className="min-w-0">
              <span
                className={cn(
                  'block truncate text-[13px] font-bold',
                  active ? 'text-slate-900' : 'text-slate-600',
                )}
              >
                {v.shortLabel}
              </span>
              <span className="block truncate text-[11px] text-slate-400">{v.card.identity.finish}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}