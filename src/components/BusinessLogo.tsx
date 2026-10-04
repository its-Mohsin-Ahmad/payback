import { businessInitials } from '@/lib/session/selectors';
import type { BusinessProfile } from '@/lib/session/types';

/**
 * Business logo, or initials when none was uploaded (spec §5, §25).
 *
 * Intentionally a *different* component from the personal `Avatar`: a company
 * mark is never the owner's face. The initials come from the business name —
 * "Nova Digital Solutions" renders ND, never AK — and skip legal fillers so
 * "The Green Valley Traders" reads GVT rather than TGV.
 */
export function BusinessLogo({
  business,
  size = 'md',
  className,
}: {
  business: BusinessProfile | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    sm: 'h-9 w-9 text-[11px] rounded-lg',
    md: 'h-12 w-12 text-sm rounded-xl',
    lg: 'h-16 w-16 text-lg rounded-2xl',
    xl: 'h-20 w-20 text-2xl rounded-2xl sm:h-24 sm:w-24 sm:text-3xl',
  } as const;

  if (!business) {
    return <span className={`${sizes[size]} shrink-0 bg-slate-200 ${className ?? ''}`} aria-hidden />;
  }

  if (business.logoUrl) {
    return (
      <img
        src={business.logoUrl}
        alt={`${business.name} logo`}
        className={`${sizes[size]} shrink-0 border border-slate-200 bg-white object-contain ${className ?? ''}`}
      />
    );
  }

  return (
    <span
      className={`${sizes[size]} flex shrink-0 items-center justify-center bg-slate-900 font-extrabold tracking-tight text-white ${className ?? ''}`}
      role="img"
      aria-label={`${business.name} logo`}
    >
      <span aria-hidden>{businessInitials(business.name)}</span>
    </span>
  );
}