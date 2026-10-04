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

import { paybackCards, type PaybackCard } from '@/lib/cardData';

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