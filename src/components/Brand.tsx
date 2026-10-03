import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * PAYBACK wordmark + mark. The mark is a stylised "P" formed from an
 * upward chevron (growth) inside a rounded square (a card).
 */
export function LogoMark({ className, tone = 'emerald', size = 36 }: { className?: string; tone?: 'emerald' | 'navy' | 'white'; size?: number }) {
  const bg = tone === 'emerald' ? '#10B981' : tone === 'navy' ? '#0F172A' : '#FFFFFF';
  const fg = tone === 'white' ? '#0F172A' : '#FFFFFF';
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-xl', className)}
      style={{ width: size, height: size, backgroundColor: bg }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 19V7.5A3.5 3.5 0 0 1 9.5 4h2A3.5 3.5 0 0 1 15 7.5v0A3.5 3.5 0 0 1 11.5 11H9" />
        <path d="M12 15.5 15.5 12 19 15.5" />
      </svg>
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
    <Link to={to} className={cn('focus-ring inline-flex items-center gap-2.5 rounded-lg', className)} aria-label="PAYBACK home">
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
