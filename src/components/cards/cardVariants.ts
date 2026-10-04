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
import { CARD_IDENTITIES, paybackCards, type CardIdentity, type PaybackCard } from '@/lib/cardData';
import { useSession } from '@/lib/session/SessionProvider';
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
  /** The underlying card identity rendered by the 3D surface. */
  card: PaybackCard;
  /** Benefits listed in the information panel (spec §19). */
  benefits: string[];
  /** Fee block (spec §20). Clearly marked as demo configuration. */
  fees: { annual: string; international: string; contactless: string };
  /** Feature availability used by the control panel (spec §23). */
  features: { contactless: boolean; online: boolean; international: boolean; atm: boolean };
}

/**
 * The demo cards that back each variant.
 *
 * Falls back to the first card so the showcase still renders if a card is ever
 * removed from the seed data, rather than throwing during render.
 */
function cardById(id: string): PaybackCard {
  return paybackCards.find((c) => c.id === id) ?? paybackCards[0];
}

export const CARD_VARIANTS: CardVariant[] = [
  {
    key: 'green',
    label: 'PAYBACK Green',
    shortLabel: 'Green',
    description: 'Everyday banking with premium control and security.',
    card: cardById('card-1'),
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
    card: cardById('card-2'),
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
    card: cardById('card-3'),
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
 * The three showcase variants, resolved against the signed-in user.
 *
 * Where the session owns a card of that variant, that card is used — so the
 * cardholder name, masked number, status and limits are all the real ones
 * (spec §10, §14). Variants the user does not own fall back to the curated
 * demo card so the showcase still presents all three designs rather than
 * collapsing to a single card.
 */
export function useCardVariants(): CardVariant[] {
  const { session } = useSession();
  return useMemo(
    () =>
      CARD_VARIANTS.map((variant) => {
        const owned = session.cards.find((c) => c.variant === variant.key);
        if (!owned) return variant;
        return {
          ...variant,
          card: toPaybackCard(owned),
          // Availability is the user's actual configuration (spec §14, §15).
          features: {
            contactless: owned.contactless,
            online: owned.online,
            international: owned.international,
            atm: owned.atm,
          },
        };
      }),
    [session.cards],
  );
}