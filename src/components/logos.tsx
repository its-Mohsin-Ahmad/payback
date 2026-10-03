import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Provider marks for the transfer rails (Easypaisa, JazzCash, UPaisa,
 * NayaPay, PayPal, SWIFT, local bank and PAYBACK itself).
 *
 * These are original, simplified geometric marks drawn in each provider's
 * brand colours for demonstration only — they are not the providers'
 * trademarked logos and imply no partnership or integration.
 */

export type ProviderMarkId =
  | 'payback'
  | 'bank'
  | 'easypaisa'
  | 'jazzcash'
  | 'upaisa'
  | 'nayapay'
  | 'swift'
  | 'paypal'
  | 'other';

/** Resolve a provider id (or free text) to a known mark. */
export function markFor(id: string): ProviderMarkId {
  const key = id.toLowerCase();
  if (key.includes('easypaisa')) return 'easypaisa';
  if (key.includes('jazz')) return 'jazzcash';
  if (key.includes('upaisa')) return 'upaisa';
  if (key.includes('naya')) return 'nayapay';
  if (key.includes('paypal')) return 'paypal';
  if (key.includes('swift') || key.includes('international')) return 'swift';
  if (key.includes('bank')) return 'bank';
  if (key.includes('payback')) return 'payback';
  return 'other';
}

/** Circular/rounded tile wrapper — `tile` paints the brand-colour background. */
export function ProviderLogo({
  mark,
  className,
  tileClassName,
}: {
  mark: ProviderMarkId | string;
  className?: string;
  tileClassName?: string;
}) {
  const id = (mark as ProviderMarkId) in MARKS ? (mark as ProviderMarkId) : markFor(String(mark));
  const spec = MARKS[id];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl',
        spec.tile,
        tileClassName ?? 'h-9 w-9'
      )}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className={cn('h-[62%] w-[62%]', className)} role="presentation" focusable="false">
        {spec.path}
      </svg>
    </span>
  );
}

interface MarkSpec {
  tile: string;
  path: React.ReactNode;
}

const MARKS: Record<ProviderMarkId, MarkSpec> = {
  /* PAYBACK — hexagon shield with the brand chevron. */
  payback: {
    tile: 'bg-navy',
    path: (
      <g fill="none" stroke="#34D399" strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 4.5 27 10.4v11.2L16 27.5 5 21.6V10.4L16 4.5Z" />
        <path d="M11 19 16 12.2 21 19" />
      </g>
    ),
  },

  /* Local bank — classical pediment + columns. */
  bank: {
    tile: 'bg-slate-800',
    path: (
      <g fill="#F1F5F9">
        <path d="M16 5 29 12.5H3L16 5Z" />
        <rect x="6" y="14.5" width="3" height="9" rx="0.8" />
        <rect x="12.2" y="14.5" width="3" height="9" rx="0.8" />
        <rect x="18.2" y="14.5" width="3" height="9" rx="0.8" />
        <rect x="24" y="14.5" width="3" height="9" rx="0.8" />
        <rect x="3" y="24.5" width="26" height="3" rx="1" />
      </g>
    ),
  },

  /* Easypaisa — rounded "e" mark on brand green. */
  easypaisa: {
    tile: 'bg-[#0F9D58]',
    path: (
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.5a9.5 9.5 0 1 0 1.6 9.9" />
        <path d="M8.4 15.6h14" />
      </g>
    ),
  },

  /* JazzCash — rounded square with a bolt. */
  jazzcash: {
    tile: 'bg-[#E31E24]',
    path: (
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="20" height="20" rx="5.5" />
        <path d="M17.6 10.5 12.4 17h3.6l-1.2 4.8 5.2-6.6h-3.6l1.2-4.7Z" fill="#FFFFFF" stroke="none" />
      </g>
    ),
  },

  /* UPaisa — circular "U" ring on brand orange. */
  upaisa: {
    tile: 'bg-[#F47521]',
    path: (
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round">
        <path d="M11.5 9.5v7.6a4.5 4.5 0 0 0 9 0V9.5" />
        <path d="M11.5 20.5h9" strokeWidth="2.2" opacity="0.55" />
      </g>
    ),
  },

  /* NayaPay — layered chevrons on brand purple. */
  nayapay: {
    tile: 'bg-[#6D28D9]',
    path: (
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 20 16 9.5 24 20" />
        <path d="M11.5 24 16 18.2 20.5 24" opacity="0.6" />
      </g>
    ),
  },

  /* SWIFT — wire globe with latitude lines. */
  swift: {
    tile: 'bg-[#0EA5E9]',
    path: (
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.1">
        <circle cx="16" cy="16" r="10.5" />
        <ellipse cx="16" cy="16" rx="4.6" ry="10.5" />
        <path d="M5.5 16h21" strokeLinecap="round" />
        <path d="M7.6 10.2h16.8M7.6 21.8h16.8" strokeLinecap="round" opacity="0.7" />
      </g>
    ),
  },

  /* PayPal-style double "P" on brand blue. */
  paypal: {
    tile: 'bg-[#1D4ED8]',
    path: (
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 24 13 8h5.5a5 5 0 0 1 0 10H13.4" />
        <path d="M14.5 24 17.8 8.6h5.2a4.6 4.6 0 0 1 0 9.2h-5" opacity="0.62" />
      </g>
    ),
  },

  /* Other — neutral dotted grid. */
  other: {
    tile: 'bg-slate-500',
    path: (
      <g fill="#FFFFFF">
        <circle cx="11" cy="16" r="2.6" />
        <circle cx="21" cy="16" r="2.6" />
      </g>
    ),
  },
};