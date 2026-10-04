/**
 * PAYBACK skeleton system.
 *
 * Skeletons are the right tool when *structure* is the thing being communicated:
 * the user sees the shape of the page they are about to get, which is far more
 * useful feedback than a spinning circle. Where the thing being fetched is a
 * single object with no known shape, use `PageLoader` instead.
 *
 * Everything here is inert: no focusable elements and no per-block
 * announcements (one live region is mounted by the parent instead), and it all
 * collapses to static blocks under `prefers-reduced-motion`.
 */

import { cn } from '@/lib/utils';
import { LoaderAnnouncer } from './PaybackLoader';

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** A single shimmering block. The base unit of every skeleton below. */
export function Skeleton({ className, rounded = 'rounded-lg' }: { className?: string; rounded?: string }) {
  return <div className={cn('pb-skeleton', rounded, className)} aria-hidden />;
}

/** One to three lines of text at a given width. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full')}
          rounded="rounded-full"
        />
      ))}
    </div>
  );
}

/** A circular avatar / icon placeholder. */
export function SkeletonCircle({ size = 40, className }: { size?: number; className?: string }) {
  return <Skeleton className={cn('shrink-0', className)} rounded="rounded-full" />;
}

/**
 * A labelled section header: title on the left, action on the right. Mirrors
 * `PageHeader` so the page does not reflow once real content arrives.
 */
export function SkeletonHeader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)} aria-hidden>
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-3.5 w-80" rounded="rounded-full" />
      </div>
      <Skeleton className="h-9 w-28" rounded="rounded-xl" />
    </div>
  );
}

/** A generic card-shaped placeholder with a title block and body lines. */
export function SkeletonCard({ className, bodyLines = 3 }: { className?: string; bodyLines?: number }) {
  return (
    <div className={cn('card-base p-5', className)} aria-hidden>
      <div className="flex items-center gap-3">
        <SkeletonCircle size={40} />
        <SkeletonText lines={2} className="flex-1" />
      </div>
      <SkeletonText lines={bodyLines} className="mt-5" />
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Composed skeletons                                                  */
/* ------------------------------------------------------------------ */

/**
 * The dashboard skeleton.
 *
 * Deliberately mirrors the real dashboard layout: greeting, account cards,
 * quick actions, a spend chart and a transaction list. Because the shape
 * matches, the page does not jump when the data lands.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true">
      <LoaderAnnouncer message="Loading your dashboard" />

      <SkeletonHeader />

      {/* Accounts */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-base space-y-4 p-5" aria-hidden>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" rounded="rounded-full" />
              <SkeletonCircle size={28} />
            </div>
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-3 w-32" rounded="rounded-full" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 w-20" rounded="rounded-lg" />
              <Skeleton className="h-8 w-20" rounded="rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" rounded="rounded-2xl" />
        ))}
      </div>

      {/* Chart + insights */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-base space-y-4 p-5 lg:col-span-2" aria-hidden>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" rounded="rounded-full" />
            <Skeleton className="h-8 w-24" rounded="rounded-lg" />
          </div>
          <div className="flex h-44 items-end gap-2 pt-4">
            {[45, 70, 55, 90, 62, 78, 50, 84, 68, 95, 58, 72].map((h, i) => (
              <Skeleton key={i} className="flex-1" rounded="rounded-t-md" />
            ))}
          </div>
        </div>
        <div className="card-base space-y-4 p-5" aria-hidden>
          <Skeleton className="h-4 w-28" rounded="rounded-full" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonCircle size={36} />
              <SkeletonText lines={2} className="flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="card-base overflow-hidden" aria-hidden>
        <div className="border-b border-slate-100 p-5">
          <Skeleton className="h-4 w-40" rounded="rounded-full" />
        </div>
        <ul className="divide-y divide-slate-100">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center gap-4 p-4">
              <SkeletonCircle size={40} />
              <SkeletonText lines={2} className="flex-1" />
              <Skeleton className="h-4 w-20" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
/**
 * The Cards-page skeleton: a hero card slot, the carousel track and the
 * supporting detail grid.
 */
export function CardsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true">
      <LoaderAnnouncer message="Loading your cards" />

      <SkeletonHeader />

      {/* Carousel track — card-shaped slots at the real aspect ratio */}
      <div className="flex gap-6 overflow-hidden py-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[200px] w-[340px] shrink-0" rounded="rounded-2xl" />
        ))}
      </div>

      {/* Active card detail */}
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-base space-y-3 p-5" aria-hidden>
            <Skeleton className="h-3.5 w-24" rounded="rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-40" rounded="rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A generic list/table skeleton.
 *
 * Used for transactions, beneficiaries, statements and every admin table, so a
 * single component covers the whole product's tabular surfaces.
 */
export function ListSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('card-base overflow-hidden', className)} role="status" aria-busy="true">
      <LoaderAnnouncer message="Loading" />
      <ul className="divide-y divide-slate-100" aria-hidden>
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 p-4">
            <SkeletonCircle size={40} />
            <SkeletonText lines={2} className="flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24" rounded="rounded-lg" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A metric-tile skeleton for dashboards and admin summaries.
 */
export function MetricSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card-base space-y-3 p-5', className)} aria-hidden>
      <Skeleton className="h-3.5 w-24" rounded="rounded-full" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" rounded="rounded-full" />
    </div>
  );
}