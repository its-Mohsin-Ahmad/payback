import { Link } from 'react-router-dom';
import { PaybackHexTile } from '@/components/brandMark';
import { cn } from '@/lib/utils';

/**
 * PAYBACK wordmark + hexagonal mark.
 *
 * The mark is the card's hexagon with its chevron, filled so it holds its own
 * in the header, admin rail and footer. Geometry lives in `brandMark.tsx`,
 * which is shared with the physical card artwork.
 */
export function LogoMark({ className, tone = 'emerald', size = 36 }: { className?: string; tone?: 'emerald' | 'navy' | 'white'; size?: number }) {
  const background = tone === 'emerald' ? '#10B981' : tone === 'navy' ? '#0F172A' : '#FFFFFF';
  // Emerald fill needs a light chevron to read; navy and white tiles take the
  // brand emerald, matching the card.
  const chevron = tone === 'emerald' ? '#FFFFFF' : '#34D399';
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', className)} style={{ width: size, height: size }}>
      <PaybackHexTile size={size} background={background} chevron={chevron} />
    </span>
  );
}

export function Wordmark({ className, tone = 'navy' }: { className?: string; tone?: 'navy' | 'white' }) {
  return (
    <span className={cn('font-display text-lg font-extrabold tracking-tight', tone === 'white' ? 'text-white' : 'text-navy', className)}>
      PAY<span className="text-emerald-500">BACK</span>
    </span>
  );
}

export function Brand({
  to = '/',
  tone = 'navy',
  size = 36,
  showTagline = false,
  className,
}: {
  to?: string;
  tone?: 'navy' | 'white';
  size?: number;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <Link to={to} className={cn('focus-ring inline-flex min-h-[44px] items-center gap-2.5 rounded-lg', className)} aria-label="PAYBACK home">
      <LogoMark tone={tone === 'white' ? 'white' : 'emerald'} size={size} />
      <span className="leading-none">
        <Wordmark tone={tone} />
        {showTagline ? (
          <span className={cn('mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em]', tone === 'white' ? 'text-white/50' : 'text-slate-400')}>
            Digital Banking
          </span>
        ) : null}
      </span>
    </Link>
  );
}
