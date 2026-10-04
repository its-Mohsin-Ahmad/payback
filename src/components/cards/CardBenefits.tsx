import { Globe2, ShieldCheck, SlidersHorizontal, Sparkles, type LucideIcon } from 'lucide-react';
import { CARD_PILLARS } from './cardVariants';

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  globe: Globe2,
  sparkles: Sparkles,
};

/**
 * The four pillars (spec §22).
 *
 * Two columns from `xs` upward. Small line icons rather than filled badges — the
 * spec asks for restraint, and oversized coloured icons pull attention away from
 * the card, which is meant to stay the visual hero.
 */
export function CardBenefits() {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {CARD_PILLARS.map((pillar) => {
        const Icon = ICONS[pillar.icon];
        return (
          <li
            key={pillar.key}
            className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-sm transition-shadow hover:shadow-card lg:p-5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <h3 className="mt-3 text-sm font-bold text-slate-900">{pillar.title}</h3>
            <p className="mt-1 text-pretty text-[13px] leading-relaxed text-slate-500">{pillar.description}</p>
          </li>
        );
      })}
    </ul>
  );
}