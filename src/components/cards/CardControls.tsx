import { useState } from 'react';
import { Globe2, Nfc, ShoppingCart, Wallet, type LucideIcon } from 'lucide-react';
import { Toggle } from '@/components/ui';
import type { CardVariant } from './cardVariants';

interface ControlDef {
  key: keyof CardVariant['features'];
  title: string;
  description: string;
  icon: LucideIcon;
}

const CONTROLS: ControlDef[] = [
  { key: 'contactless', title: 'Contactless', description: 'Tap to pay in stores.', icon: Nfc },
  { key: 'online', title: 'Online payments', description: 'Allow online purchases.', icon: ShoppingCart },
  {
    key: 'international',
    title: 'International payments',
    description: 'Permit purchases abroad.',
    icon: Globe2,
  },
  { key: 'atm', title: 'ATM withdrawals', description: 'Allow cash withdrawals.', icon: Wallet },
];

/**
 * Per-card controls (spec §23–§24).
 *
 * Rows are full-width cards on a phone rather than a dense table: the switch
 * itself is a 44px target, and the label wraps rather than truncating when the
 * OS text size is raised.
 *
 * State resets when the variant changes, because switching cards must not carry
 * one card's toggle state onto another.
 */
export function CardControls({ variant }: { variant: CardVariant }) {
  const [state, setState] = useState<Record<string, boolean>>(variant.features);

  return (
    <div key={variant.key}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {CONTROLS.map((control) => {
          const Icon = control.icon;
          const checked = state[control.key] ?? false;
          const unavailable = variant.key === 'green' && control.key === 'international';
          return (
            <li key={control.key} className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm">
              <Toggle
                checked={checked}
                disabled={unavailable}
                onChange={(next) => setState((prev) => ({ ...prev, [control.key]: next }))}
                label={
                  <span className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        checked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-800">{control.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                        {unavailable ? 'Not included on this card.' : control.description}
                      </span>
                    </span>
                  </span>
                }
              />
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-400">Demo controls — changes are not persisted.</p>
    </div>
  );
}