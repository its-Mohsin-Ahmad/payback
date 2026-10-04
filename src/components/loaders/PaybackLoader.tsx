/**
 * PAYBACK unified loading system.
 *
 * One visual language for every "we are working on it" moment in the product:
 * the public site, the authenticated app, the admin rail, and every in-flight
 * banking operation.
 *
 * Design rules this module enforces:
 *
 *  - The loader logo is the shared hexagonal brand mark, never a generic circle.
 *  - Progress is only shown when there is a *real* number behind it. Anything
 *    else is indeterminate and is animated as such rather than faking a percent.
 *  - Every loader announces itself through `aria-live`, so the "busy" state is
 *    conveyed to assistive tech and not by motion alone.
 *  - Nothing here claims an operation succeeded. Success is a separate state
 *    that a caller renders once real backing state confirms it.
 */

import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HEX_PATH, CHEVRON_PATH } from '@/components/brandMark';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** Which surface the loader sits on. Drives the palette. */
export type LoaderTone = 'light' | 'dark';

/**
 * How far along a *known* operation is.
 *
 * `null` means indeterminate: the duration or the step count is not genuinely
 * known, so no percentage is rendered and no progressbar role is used.
 */
export type LoaderProgress = number | null;

/** A named step in a multi-stage flow. */
export interface LoaderStage {
  label: string;
  /** Completed, active, or not yet reached. Drives the stage rail. */
  status: 'complete' | 'active' | 'pending' | 'error';
}

interface BaseLoaderProps {
  /** Announced to assistive tech and shown under the title. */
  message?: string;
  /** Secondary, quieter line — e.g. a security reassurance. */
  detail?: string;
  tone?: LoaderTone;
  className?: string;
  /** Rendered beside the glyph, e.g. a QR frame or a card silhouette. */
  children?: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Accessibility primitives                                            */
/* ------------------------------------------------------------------ */

/**
 * A visually hidden live region.
 *
 * `aria-live="polite"` deliberately: a banking app that asserts "loading" at a
 * screen reader on every route change is hostile.
 */
export function LoaderAnnouncer({ message, detail }: { message?: string; detail?: string }) {
  return (
    <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message ? `${message}${detail ? `. ${detail}` : ''}` : 'Loading'}
    </span>
  );
}

/**
 * True when the user has asked for reduced motion.
 *
 * Loaders use this to fall back to a static, high-contrast presentation rather
 * than simply running the animation faster.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}
/* ------------------------------------------------------------------ */
/* The brand loader glyph                                              */
/* ------------------------------------------------------------------ */

/**
 * The hexagonal PAYBACK mark assembling itself.
 *
 * Reuses the exact paths from the brand module, so the loader logo is
 * geometrically identical to the header logo and the card artwork. It is never
 * spun: the motion is a stroke-draw with a breathing halo, which reads as
 * "assembling" rather than "spinning".
 */
export function PaybackLoaderMark({
  size = 96,
  tone = 'light',
  reduced = false,
  className,
}: {
  size?: number;
  tone?: LoaderTone;
  reduced?: boolean;
  className?: string;
}) {
  const stroke = tone === 'light' ? '#0F172A' : '#F8FAFC';
  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Breathing halo */}
      <span
        className={cn('absolute inset-0 rounded-3xl bg-emerald-500', reduced ? '' : 'pb-tile-breathe')}
        style={{ opacity: tone === 'light' ? 0.1 : 0.16 }}
        aria-hidden
      />
      <svg
        viewBox="0 0 24 24"
        width={size * 0.52}
        height={size * 0.52}
        fill="none"
        aria-hidden
        focusable="false"
      >
        <path
          d={HEX_PATH}
          className={reduced ? undefined : 'pb-assemble-hex'}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d={CHEVRON_PATH}
          className={reduced ? undefined : 'pb-assemble-chevron'}
          stroke="#34D399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Status ring                                                         */
/* ------------------------------------------------------------------ */

/**
 * A thin ring around the mark carrying real progress.
 *
 * Only drawn as an arc when `progress` is a number. With `null` it becomes a
 * slow dashed orbit, which reads as "unbounded" — an indeterminate ring that
 * spun like a clock would imply a completion time it cannot know.
 */
export function LoaderStatusRing({
  progress,
  size = 96,
  tone = 'light',
  reduced = false,
  className,
}: {
  progress: LoaderProgress;
  size?: number;
  tone?: LoaderTone;
  reduced?: boolean;
  className?: string;
}) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const track = tone === 'light' ? 'rgba(148,163,184,0.28)' : 'rgba(203,213,225,0.26)';

  if (progress === null) {
    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className={cn('absolute inset-0', className)}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone === 'light' ? 'rgba(16,185,129,0.45)' : 'rgba(52,211,153,0.4)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="14 120"
          className={reduced ? undefined : 'pb-orbit'}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
    );
  }

  const pct = Math.max(0, Math.min(100, progress));
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={cn('absolute inset-0', className)}
      aria-hidden
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth="2.5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                        */
/* ------------------------------------------------------------------ */

/**
 * Determinate or indeterminate progress bar.
 *
 * `progress === null` renders a sweeping segment with no numeric label and no
 * `role="progressbar"` — an ARIA progressbar with no value is a lie to the
 * assistive layer.
 */
export function LoaderBar({
  progress,
  tone = 'light',
  reduced = false,
  className,
}: {
  progress: LoaderProgress;
  tone?: LoaderTone;
  reduced?: boolean;
  className?: string;
}) {
  const base = tone === 'light' ? 'rgba(148,163,184,0.22)' : 'rgba(203,213,225,0.2)';

  if (progress === null) {
    return (
      <div
        className={cn('relative h-1.5 w-full overflow-hidden rounded-full', className)}
        style={{ backgroundColor: base }}
        aria-hidden
      >
        <span
          className={cn(
            'absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600',
            reduced ? '' : 'pb-sweep',
          )}
        />
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full', className)}
      style={{ backgroundColor: base }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-valuetext={`${Math.round(pct)} percent`}
    >
      <span
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
        style={{ width: `${pct}%`, transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Stage rail                                                          */
/* ------------------------------------------------------------------ */

/**
 * The vertical checklist used by every multi-step flow.
 *
 * This is the honest alternative to a fake percentage: for KYC or a transfer we
 * genuinely know which stage we are on, so we show the stages rather than
 * inventing "73%".
 */
export function LoaderStages({
  stages,
  tone = 'light',
  className,
}: {
  stages: LoaderStage[];
  tone?: LoaderTone;
  className?: string;
}) {
  const muted = 'text-slate-400';
  const strong = tone === 'light' ? 'text-slate-800' : 'text-slate-100';

  return (
    <ol className={cn('space-y-2.5 text-left', className)}>
      {stages.map((stage, i) => {
        const isDone = stage.status === 'complete';
        const isActive = stage.status === 'active';
        const isError = stage.status === 'error';
        return (
          <li key={`${stage.label}-${i}`} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                isDone && 'border-emerald-500 bg-emerald-500 text-white',
                isActive && tone === 'light' && 'border-emerald-600 text-emerald-700',
                isActive && tone === 'dark' && 'border-emerald-400 text-emerald-300',
                isError && 'border-rose-400 bg-rose-500 text-white',
                !isDone && !isActive && !isError && cn('border-slate-300', muted),
              )}
              aria-hidden
            >
              {isDone ? '✓' : isError ? '!' : i + 1}
            </span>
            <span
              className={cn(
                isActive || isDone ? cn('font-semibold', strong) : cn('font-normal', muted),
                isError && 'text-rose-600 dark:text-rose-300',
              )}
            >
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* PaybackLoader — the master full-screen loader                       */
/* ------------------------------------------------------------------ */

/**
 * The full-screen brand loader. Used for application boot, public-site entry and
 * hard page transitions.
 *
 * It never auto-dismisses — the caller decides when the real work has finished.
 */
export function PaybackLoader({
  open = true,
  message = 'Preparing your experience',
  detail,
  progress = null,
  tone = 'light',
  dismissible = false,
  onDismiss,
  className,
  children,
}: BaseLoaderProps & {
  open?: boolean;
  /** Real progress 0–100, or null when genuinely unknown. */
  progress?: LoaderProgress;
  /** Allow the user to skip a non-blocking loader. */
  dismissible?: boolean;
  onDismiss?: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  if (!open) return null;

  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 px-6',
        dark ? 'bg-navy text-white' : 'bg-surface text-navy',
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-label={message}
    >
      {/* Ambient brand wash */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className={cn(
            'absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full',
            reduced ? '' : 'pb-tile-breathe',
          )}
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.16), transparent 65%)' }}
        />
      </div>

      <LoaderAnnouncer message={message} detail={detail} />

      <div className="relative">
        <LoaderStatusRing progress={progress} size={128} tone={tone} reduced={reduced} />
        <PaybackLoaderMark size={128} tone={tone} reduced={reduced} className="relative" />
      </div>

      <div className="relative flex max-w-md flex-col items-center gap-2 text-center">
        <p className={cn('text-base font-semibold', dark ? 'text-white' : 'text-navy')}>{message}</p>
        {detail ? <p className={cn('text-sm', dark ? 'text-slate-400' : 'text-slate-500')}>{detail}</p> : null}
        {children}
        <LoaderBar progress={progress} tone={tone} reduced={reduced} className="mt-3 max-w-[260px]" />
      </div>

      {dismissible && onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'focus-ring relative rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
            dark
              ? 'border-white/20 text-slate-300 hover:border-white/40 hover:text-white'
              : 'border-slate-300 text-slate-600 hover:border-emerald-400 hover:text-emerald-700',
          )}
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* PageLoader — inline page-level loading                              */
/* ------------------------------------------------------------------ */

/**
 * The in-page loader for a route or section that is fetching. Smaller and
 * non-modal, so the surrounding chrome stays usable and the user keeps their
 * sense of place.
 */
export function PageLoader({
  message = 'Loading',
  detail,
  tone = 'light',
  className,
  children,
}: BaseLoaderProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className={cn(
        'flex min-h-[320px] w-full flex-col items-center justify-center gap-5 px-6 py-14',
        className,
      )}
      role="status"
      aria-busy="true"
    >
      <LoaderAnnouncer message={message} detail={detail} />
      <div className="relative">
        <LoaderStatusRing progress={null} size={92} tone={tone} reduced={reduced} />
        <PaybackLoaderMark size={92} tone={tone} reduced={reduced} className="relative" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className={cn('text-sm font-semibold', tone === 'light' ? 'text-navy' : 'text-white')}>{message}</p>
        {detail ? (
          <p className={cn('text-xs', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>{detail}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ButtonLoader                                                        */
/* ------------------------------------------------------------------ */

/**
 * In-button busy state.
 *
 * Replaces the button label with a small arc and an accessible status. Callers
 * keep the button width stable so the surrounding layout does not jump.
 */
export function ButtonLoader({
  loading = false,
  label,
  tone = 'light',
  className,
}: {
  loading?: boolean;
  /** Label to show once loading finishes. */
  label?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const arc = tone === 'light' ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.25)';
  const fg = tone === 'light' ? '#FFFFFF' : '#0F172A';

  if (!loading) return <>{label}</>;

  return (
    <span className={cn('inline-flex items-center justify-center gap-2', className)}>
      <svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0" aria-hidden focusable="false">
        <circle cx="12" cy="12" r="9" fill="none" stroke={arc} strokeWidth="2.6" />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={fg}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="14 43"
          className={reduced ? undefined : 'pb-orbit'}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
      <span role="status" aria-live="polite" className="sr-only">
        Working
      </span>
    </span>
  );
}
/* ------------------------------------------------------------------ */
/* Transition states                                                   */
/* ------------------------------------------------------------------ */

/**
 * The resolving half of a workflow.
 *
 * Rendered only when a caller holds *real* backing state that the operation
 * actually succeeded — never on a timer. Keeping it a separate component makes
 * that separation explicit at every call site.
 */
export function SuccessTransition({
  title,
  detail,
  tone = 'light',
  className,
}: {
  title: string;
  detail?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center gap-4 text-center', className)} role="status" aria-live="polite">
      <span className="pb-confirm-pop relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden focusable="false">
          <path
            d="M5 12.5 10 17.5 19 7"
            className="pb-confirm-tick"
            stroke="#059669"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="space-y-1">
        <p className={cn('text-base font-semibold', tone === 'light' ? 'text-navy' : 'text-white')}>{title}</p>
        {detail ? (
          <p className={cn('text-sm', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>{detail}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The failure state a loader hands off to.
 *
 * Carries a retry action, because a dead end with no way forward is the worst
 * possible outcome after a wait.
 */
export function ErrorState({
  title = 'Something went wrong',
  detail,
  onRetry,
  retryLabel = 'Try again',
  tone = 'light',
  className,
}: {
  title?: string;
  detail?: string;
  onRetry?: () => void;
  retryLabel?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  return (
    <div
      className={cn('pb-fault flex flex-col items-center gap-4 text-center', className)}
      role="alert"
      aria-live="assertive"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden focusable="false">
          <circle cx="12" cy="12" r="9" stroke="#E11D48" strokeWidth="1.8" opacity="0.4" />
          <path d="M12 7.5v5.2M12 16.2v.2" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
      <div className="space-y-1">
        <p className={cn('text-base font-semibold', tone === 'light' ? 'text-navy' : 'text-white')}>{title}</p>
        {detail ? (
          <p className={cn('text-sm', tone === 'light' ? 'text-slate-500' : 'text-slate-400')}>{detail}</p>
        ) : null}
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'focus-ring rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors',
            tone === 'light'
              ? 'bg-navy text-white hover:bg-navy-800'
              : 'bg-emerald-500 text-white hover:bg-emerald-400',
          )}
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

/**
 * The route-change veil.
 *
 * Sits above the app while a lazy route resolves. Rendered on top of — never
 * instead of — the previous content, so navigating never blanks the screen.
 */
export function RouteTransition({ active, label = 'Loading page' }: { active: boolean; label?: string }) {
  if (!active) return null;
  return (
    <div
      className="pb-veil-in pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-surface/70 backdrop-blur-[2px]"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <PaybackLoaderMark size={72} />
    </div>
  );
}