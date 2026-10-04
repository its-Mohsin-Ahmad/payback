/**
 * The three showcase variants and their demo positioning.
 *
 * Colours and surfaces are not repeated here — each variant reuses the
 * `CardIdentity` that the rest of the app already renders, so the card shown in
 * the showcase is the *same* card object the accounts, receipts and business
 * screens use. That is what stops the marketing card and the real card from
 * drifting apart.
 *
 * Every figure below is synthetic demo content (spec §20, §48).
 */

import { useMemo } from 'react';
import { CARD_IDENTITIES, demoCardsFor, type CardIdentity, type PaybackCard } from '@/lib/cardData';
import { useSession } from '@/lib/session/SessionProvider';
import { cardholderName } from '@/lib/session/selectors';
import type { UserCard } from '@/lib/session/types';

/**
 * Map a session card onto the shape the 3D renderer expects.
 *
 * The two shapes are kept separate on purpose: `PaybackCard` is a *presentation*
 * model with derived gradients and demo copy, while `UserCard` is the persisted
 * record. Converting here means the physical card reads the signed-in user's
 * cardholder name while reusing the existing premium rendering unchanged.
 */
function toPaybackCard(card: UserCard): PaybackCard {
  const tier = card.variant === 'green' ? 'everyday' : card.variant === 'silver' ? 'premium' : 'black';
  const base = CARD_IDENTITIES[tier];
  const identity: CardIdentity = {
    ...base,
    // The product name follows the user's chosen variant, not the legacy tier
    // name, so "Green" does not print as "Everyday" (spec §8).
    name: `PAYBACK ${card.variant === 'gold' ? 'Gold' : card.variant === 'silver' ? 'Silver' : 'Green'}`,
  };
  return {
    id: card.id,
    identity,
    // Spec §10 — this is the whole point: the embossed name is the account
    // holder's, taken from the session, never a constant.
    holder: card.cardholderName,
    maskedPan: card.maskedPan,
    // Never a real PAN. The "demo" reveal shows the same masked value.
    demoPan: card.maskedPan,
    last4: card.last4,
    expiry: card.expiry,
    status: card.status,
    type: card.type,
    limit: card.spendingLimit,
    spent: Math.round(card.spendingLimit * 0.42),
    dailyLimit: card.dailyLimit,
    monthlyLimit: card.spendingLimit,
    currency: card.currency,
    online: card.online,
    international: card.international,
    contactless: card.contactless,
    atm: card.atm,
    virtual: false,
    secureElement: {
      present: true,
      label: 'PAYBACK Secure Element',
      state: 'Active',
      detail: 'Embedded hardware module bound to your PAYBACK identity (concept).',
    },
  };
}

export interface CardVariant {
  /** Stable key for selection state and tests. */
  key: 'green' | 'silver' | 'gold';
  /** Full product name — "PAYBACK Gold". */
  label: string;
  /** Compact name for the selector chips — "Gold". */
  shortLabel: string;
  description: string;
  /**
   * Populated by `useCardVariants()` for the signed-in user.
   *
   * Optional on the static template because a module-level constant cannot know
   * who is signed in — resolving it here is what stops any card from ever
   * carrying someone else's name (§2, §12).
   */
  card?: PaybackCard;
  /** Benefits listed in the information panel (spec §19). */
  benefits: string[];
  /** Fee block (spec §20). Clearly marked as demo configuration. */
  fees: { annual: string; international: string; contactless: string };
  /** Feature availability used by the control panel (spec §23). */
  features: { contactless: boolean; online: boolean; international: boolean; atm: boolean };
}

/** A variant with its card resolved against the signed-in user. */
export type ResolvedCardVariant = CardVariant & { card: PaybackCard };

/** Demo seed cards backing the Green / Silver / Gold variants, in that order. */
const DEMO_IDS = ['card-1', 'card-2', 'card-3'] as const;

export const CARD_VARIANTS: CardVariant[] = [
  {
    key: 'green',
    label: 'PAYBACK Green',
    shortLabel: 'Green',
    description: 'Everyday banking with premium control and security.',
    benefits: [
      'Premium card design',
      'Advanced card controls',
      'Secure contactless payments',
      'Real-time transaction notifications',
      '24/7 support',
    ],
    fees: { annual: 'PKR 0', international: 'Available', contactless: 'Supported' },
    features: { contactless: true, online: true, international: false, atm: true },
  },
  {
    key: 'silver',
    label: 'PAYBACK Silver',
    shortLabel: 'Silver',
    description: 'Elevated everyday banking with additional benefits.',
    benefits: [
      'Premium metal card design',
      'Advanced card controls',
      'Secure contactless payments',
      'International payment support',
      'Real-time transaction notifications',
      '24/7 support',
    ],
    fees: { annual: 'PKR 4,500', international: '2 free spends / month', contactless: 'Supported' },
    features: { contactless: true, online: true, international: true, atm: true },
  },
  {
    key: 'gold',
    label: 'PAYBACK Gold',
    shortLabel: 'Gold',
    description: 'Premium banking designed for elevated experiences.',
    benefits: [
      'Premium metal card design',
      'Advanced card controls',
      'Secure contactless payments',
      'International payment support',
      'Real-time transaction notifications',
      '24/7 priority support',
    ],
    fees: { annual: 'PKR 12,000', international: 'Unlimited', contactless: 'Supported' },
    features: { contactless: true, online: true, international: true, atm: true },
  },
];

/** The four pillars shown under the hero (spec §22). */
export const CARD_PILLARS = [
  {
    key: 'secure',
    title: 'Secure',
    description: 'Advanced security and card controls.',
    icon: 'shield',
  },
  {
    key: 'flexible',
    title: 'Flexible',
    description: 'Manage spending and payment preferences.',
    icon: 'sliders',
  },
  {
    key: 'global',
    title: 'Global',
    description: 'Designed for modern international banking.',
    icon: 'globe',
  },
  {
    key: 'smart',
    title: 'Smart',
    description: 'Real-time controls and transaction visibility.',
    icon: 'sparkles',
  },
] as const;

/** Spendable limit text for the details sheet (spec §25). */
export function limitLabel(card: PaybackCard) {
  return `PKR ${card.dailyLimit.toLocaleString('en-PK')} daily · PKR ${card.monthlyLimit.toLocaleString(
    'en-PK',
  )} monthly`;
}

/**
 * The six demo cards, stamped with the signed-in cardholder's name.
 *
 * Memoised on the user's name so every surface that calls this shares one array
 * and the name propagates everywhere at once (spec §5, §7, §17).
 */
export function useDemoCards(): PaybackCard[] {
  const { session } = useSession();
  return useMemo(() => demoCardsFor(cardholderName(session.user)), [session.user]);
}

/**
 * The three showcase variants, resolved against the signed-in user.
 *
 * Where the session owns a card of that variant, that card is used — so the
 * cardholder name, masked number, status and limits are all the real ones
 * (spec §10, §14). Variants the user does not own fall back to a demo card
 * stamped with the *same* holder name, so a preview never shows someone else's
 * identity.
 */
export function useCardVariants(): ResolvedCardVariant[] {
  const { session } = useSession();
  // Demo cards already carry the live holder name, so an unowned variant still
  // previews as *this user's* card rather than someone else's (spec §3, §6).
  const demo = useDemoCards();
  return useMemo(() => {
    const cardById = (id: string) => demo.find((c) => c.id === id) ?? demo[0];
    return CARD_VARIANTS.map((variant, i) => {
      const owned = session.cards.find((c) => c.variant === variant.key);
      const base = { ...variant, card: cardById(DEMO_IDS[i]) };
      if (!owned) return base;
      return {
        ...base,
        card: toPaybackCard(owned),
        // Availability is the user's actual configuration (spec §14, §15).
        features: {
          contactless: owned.contactless,
          online: owned.online,
          international: owned.international,
          atm: owned.atm,
        },
      };
    });
  }, [session.cards, demo]);
}