import { Globe2, Nfc, ShoppingCart, Wallet, type LucideIcon } from 'lucide-react';
import { Toggle } from '@/components/ui';
import { useSession } from '@/lib/session/SessionProvider';
import type { UserCard } from '@/lib/session/types';
import type { ResolvedCardVariant } from './cardVariants';

interface ControlDef {
  /** Lookup key on the rendered card (the presentation model). */
  key: keyof Pick<UserCard, 'contactless' | 'online' | 'international' | 'atm'>;
  /** Field written back to the persisted record. */
  cardKey: 'contactless' | 'online' | 'international' | 'atm';
  title: string;
  description: string;
  icon: LucideIcon;
}

const CONTROLS: ControlDef[] = [
  { key: 'contactless', cardKey: 'contactless', title: 'Contactless', description: 'Tap to pay in stores.', icon: Nfc },
  { key: 'online', cardKey: 'online', title: 'Online payments', description: 'Allow online purchases.', icon: ShoppingCart },
  {
    key: 'international',
    cardKey: 'international',
    title: 'International payments',
    description: 'Permit purchases abroad.',
    icon: Globe2,
  },
  { key: 'atm', cardKey: 'atm', title: 'ATM withdrawals', description: 'Allow cash withdrawals.', icon: Wallet },
];

/**
 * Per-card controls (spec §23–§24, §14, §15).
 *
 * Rows are full-width cards on a phone rather than a dense table: the switch
 * itself is a 44px target, and the label wraps rather than truncating when the
 * OS text size is raised.
 *
 * Toggling writes straight through to the session, so the setting survives
 * navigating away and coming back. Earlier this was local `useState`, which
 * looked like it saved and silently did not.
 */
export function CardControls({ variant }: { variant: ResolvedCardVariant }) {
  const { updateCard } = useSession();
  const cardId = variant.card.id;

  const set = (key: keyof UserCard, next: boolean) => {
    updateCard(cardId, { [key]: next });
  };

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {CONTROLS.map((control) => {
          const Icon = control.icon;
          const checked = Boolean(variant.card[control.key]);
          const unavailable = !variant.features[control.key] && control.key === 'international';
          return (
            <li key={control.key} className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm">
              <Toggle
                checked={checked}
                disabled={unavailable}
                onChange={(next) => set(control.cardKey, next)}
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
      <p className="mt-3 text-xs text-slate-400">Demo controls — saved to this device only.</p>
    </div>
  );
}