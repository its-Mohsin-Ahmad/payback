/**
 * PAYBACK card identities — one shared model used by the homepage, the customer
 * app, the cards manager, receipts and business banking so every surface shows
 * the same card system.
 *
 * All PANs, limits and network marks below are synthetic demo values.
 */

import { cards as seedCards } from '@/data/mock';

export type CardTier = 'everyday' | 'premium' | 'black' | 'virtual' | 'business' | 'travel';
export type CardFinish = 'matte' | 'brushed' | 'metal' | 'gloss';

export interface CardIdentity {
  tier: CardTier;
  name: string;
  tagline: string;
  finish: CardFinish;
  /** Base surface gradient of the physical card. */
  base: string;
  /** Light response used for the moving sheen + specular highlight. */
  sheen: string;
  textTone: 'light' | 'dark';
  accent: string;
  /** Configurable demo network representation — not a partnership claim. */
  network: string;
  perks: string[];
}

export const CARD_IDENTITIES: Record<CardTier, CardIdentity> = {
  everyday: {
    tier: 'everyday',
    name: 'PAYBACK Everyday',
    tagline: 'Simple, dependable debit for daily life.',
    finish: 'matte',
    base: 'linear-gradient(135deg, #0F172A 0%, #1E293B 52%, #14324a 100%)',
    sheen: 'linear-gradient(120deg, rgba(255,255,255,0.22), rgba(56,189,248,0.14) 45%, rgba(255,255,255,0.04))',
    textTone: 'light',
    accent: '#38BDF8',
    network: 'DEMO NETWORK',
    perks: ['No monthly fee', 'Instant PAYBACK transfers', 'Virtual card companion'],
  },
  premium: {
    tier: 'premium',
    name: 'PAYBACK Premium',
    tagline: 'Metal-edged personal banking with travel perks.',
    finish: 'brushed',
    base: 'linear-gradient(135deg, #0b1220 0%, #16324f 45%, #0f766e 100%)',
    sheen: 'linear-gradient(115deg, rgba(255,255,255,0.3), rgba(16,185,129,0.22) 40%, rgba(56,189,248,0.16) 70%, rgba(255,255,255,0.05))',
    textTone: 'light',
    accent: '#10B981',
    network: 'DEMO NETWORK',
    perks: ['Airport lounge access (demo)', 'Travel insurance cover', '2 foreign currency spends / month'],
  },
  black: {
    tier: 'black',
    name: 'PAYBACK Black',
    tagline: 'Our highest-end private card.',
    finish: 'metal',
    base: 'linear-gradient(135deg, #05070d 0%, #10131c 38%, #1c2434 62%, #05070d 100%)',
    sheen: 'linear-gradient(110deg, rgba(255,255,255,0.34), rgba(167,139,250,0.18) 35%, rgba(16,185,129,0.16) 62%, rgba(255,255,255,0.06))',
    textTone: 'light',
    accent: '#A78BFA',
    network: 'DEMO NETWORK',
    perks: ['Unlimited lounge access (demo)', 'Private relationship manager', 'Concierge-style support queue'],
  },
  virtual: {
    tier: 'virtual',
    name: 'PAYBACK Virtual',
    tagline: 'Digital-only card for online subscriptions.',
    finish: 'gloss',
    base: 'linear-gradient(135deg, #10233b 0%, #164e63 48%, #0e7490 100%)',
    sheen: 'linear-gradient(120deg, rgba(255,255,255,0.26), rgba(34,211,238,0.2) 45%, rgba(255,255,255,0.04))',
    textTone: 'light',
    accent: '#22D3EE',
    network: 'DEMO NETWORK',
    perks: ['Instant issuance', 'Merchant-locked or single-use', 'No plastic footprint'],
  },
  business: {
    tier: 'business',
    name: 'PAYBACK Business',
    tagline: 'Team cards with per-card controls.',
    finish: 'matte',
    base: 'linear-gradient(135deg, #0F172A 0%, #134e4a 50%, #065f46 100%)',
    sheen: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(16,185,129,0.2) 50%, rgba(255,255,255,0.03))',
    textTone: 'light',
    accent: '#10B981',
    network: 'DEMO NETWORK',
    perks: ['Per-card spend limits', 'Receipt capture', 'Maker-checker approval rules'],
  },
  travel: {
    tier: 'travel',
    name: 'PAYBACK Travel',
    tagline: 'International spending, multi-currency aware.',
    finish: 'brushed',
    base: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #0c4a6e 100%)',
    sheen: 'linear-gradient(115deg, rgba(255,255,255,0.28), rgba(56,189,248,0.24) 45%, rgba(129,140,248,0.18) 72%, rgba(255,255,255,0.05))',
    textTone: 'light',
    accent: '#818CF8',
    network: 'DEMO NETWORK',
    perks: ['No foreign transaction fee (demo)', 'Multi-currency spend', 'Travel notification alerts'],
  },
};

export const CARD_TIERS = Object.keys(CARD_IDENTITIES) as CardTier[];

/** Demo mapping of the six identities onto the existing demo cards. */
const TIER_BY_CARD_ID: Record<string, CardTier> = {
  'card-1': 'premium',
  'card-2': 'virtual',
  'card-3': 'business',
  'card-4': 'everyday',
  'card-5': 'black',
  'card-6': 'travel',
};

/** Synthetic PANs used only for visualisation. Never real credentials. */
const DEMO_PAN: Record<string, string> = {
  'card-1': '4242 4242 4242 4821',
  'card-2': '5312 1104 8830 7942',
  'card-3': '4024 0088 1109 5510',
  'card-4': '4242 4242 4242 1064',
  'card-5': '4000 0219 4407 7733',
  'card-6': '5301 8820 4412 9081',
};

const holders: Record<string, string> = {
  'card-1': 'MOHSIN AHMAD',
  'card-2': 'MOHSIN AHMAD',
  'card-3': 'NORTHWIND TECH',
  'card-4': 'MOHSIN AHMAD',
  'card-5': 'M AHMAD',
  'card-6': 'MOHSIN AHMAD',
};

export interface SecureElementState {
  present: boolean;
  label: string;
  state: 'Active' | 'Provisioning' | 'Not enabled';
  detail: string;
}

export interface PaybackCard {
  id: string;
  identity: CardIdentity;
  holder: string;
  /** Masked PAN for standard UI. */
  maskedPan: string;
  /** Full synthetic PAN — demo visual only, never a real credential. */
  demoPan: string;
  last4: string;
  expiry: string;
  status: 'Active' | 'Frozen' | 'Blocked' | 'Expired';
  type: string;
  limit: number;
  spent: number;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
  online: boolean;
  international: boolean;
  contactless: boolean;
  atm: boolean;
  virtual: boolean;
  secureElement: SecureElementState;
}

export const paybackCards: PaybackCard[] = seedCards.map((card, index) => {
  const tier = TIER_BY_CARD_ID[card.id] ?? CARD_TIERS[index % CARD_TIERS.length];
  const identity = CARD_IDENTITIES[tier];
  const pan = DEMO_PAN[card.id] ?? `4242 4242 4242 ${card.last4}`;
  return {
    id: card.id,
    identity,
    holder: holders[card.id] ?? 'MOHSIN AHMAD',
    maskedPan: `•••• •••• •••• ${card.last4}`,
    demoPan: pan,
    last4: card.last4,
    expiry: card.expiry,
    status: card.status,
    type: card.type,
    limit: card.limit,
    spent: card.spent,
    dailyLimit: Math.round(card.limit / 30),
    monthlyLimit: card.limit,
    currency: card.currency,
    online: card.online,
    international: card.international,
    contactless: card.contactless,
    atm: card.atm,
    virtual: tier === 'virtual',
    secureElement: {
      present: tier !== 'virtual',
      label: tier === 'virtual' ? 'Tokenised in device wallet' : 'PAYBACK Secure Element',
      state: tier === 'virtual' ? 'Not enabled' : 'Active',
      detail:
        tier === 'virtual'
          ? 'Virtual cards use a device-bound token instead of a physical secure element.'
          : 'Embedded hardware module that binds this card to your PAYBACK identity for key storage and transaction signing (concept).',
    },
  };
});

/** Concept-only SIM banking identity. Not a mobile-network SIM. */
export const secureSim = {
  id: 'pb-secure-sim',
  name: 'PAYBACK Secure SIM',
  tagline: 'A banking identity bound to your verified device.',
  status: 'Active' as const,
  activation: 'Activated on this device',
  device: 'PAYBACK Mobile — iPhone 15 (demo)',
  securityState: 'Strong',
  features: [
    'Secure identity binding for approvals',
    'Device authentication for high-value payments',
    'Signed banking notifications',
    'Assisted account recovery',
  ],
  disclaimer:
    'Concept only. This is not a mobile-network SIM and no cellular profile is provisioned in this prototype.',
};

/** Card spending helper used by cards, receipts and analytics. */
export function cardUtilisation(card: PaybackCard) {
  return card.limit === 0 ? 0 : Math.min(100, Math.round((card.spent / card.limit) * 100));
}

export function formatPan(pan: string) {
  return pan.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
}

export function maskPan(last4: string) {
  return `•••• •••• •••• ${last4}`;
}