import { Check } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { ResolvedCardVariant } from './cardVariants';

/**
 * Information panel for the selected variant (spec §19–§21).
 *
 * Compact check rows rather than prose, and the fee block is explicitly framed as
 * demo configuration — a card page that states real prices it cannot honour is a
 * worse problem than one that admits it is showing sample data (spec §20).
 */
export function CardInformation({ variant }: { variant: ResolvedCardVariant }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-section-title font-extrabold text-slate-900">{variant.label}</h3>
          <Badge tone="emerald">{variant.shortLabel}</Badge>
        </div>
        <p className="mt-2 text-pretty text-[15px] leading-relaxed text-slate-600">{variant.description}</p>
      </div>

      <ul className="grid gap-2.5">
        {variant.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-3 w-3" aria-hidden />
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      {/* Fees (spec §20) */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Fees &amp; availability</p>
        <dl className="mt-3 space-y-2">
          {[
            ['Annual fee', variant.fees.annual],
            ['International transactions', variant.fees.international],
            ['Contactless', variant.fees.contactless],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="text-sm font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          Demo configuration — not live pricing.
        </p>
      </div>
    </div>
  );
}