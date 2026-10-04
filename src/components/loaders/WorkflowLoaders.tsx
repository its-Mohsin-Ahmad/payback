/**
 * PAYBACK contextual workflow loaders.
 *
 * One loader per *domain*. Every banking operation in PAYBACK has a shape, and
 * showing that shape while it runs is far more reassuring than a generic
 * circle — a transfer should look like value moving, a QR scan should look like
 * a scanner, a biometric check should look like a sensor reading.
 *
 * Two rules apply to every loader in this file:
 *
 *  1. **No fake progress.** Nothing here invents a percentage or an ETA. Where
 *     the number of steps is genuinely known (`LoaderStages`) the stages are
 *     shown; otherwise the motion is honest about being unbounded.
 *  2. **No fake success.** These render the *working* state only. Success is
 *     `SuccessTransition` from the core module, rendered by the caller once
 *     real backing state confirms the operation actually completed.
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  LoaderAnnouncer,
  LoaderBar,
  LoaderStages,
  PaybackLoaderMark,
  usePrefersReducedMotion,
  type LoaderProgress,
  type LoaderStage,
  type LoaderTone,
} from './PaybackLoader';

/** Shared shell so every contextual loader inherits identical spacing. */
function LoaderShell({
  message,
  detail,
  tone = 'light',
  className,
  children,
}: {
  message: string;
  detail?: string;
  tone?: LoaderTone;
  className?: string;
  children: ReactNode;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn('flex flex-col items-center gap-6 px-6 py-12 text-center', className)}
      role="status"
      aria-busy="true"
    >
      <LoaderAnnouncer message={message} detail={detail} />
      {children}
      <div className="max-w-sm space-y-1.5">
        <p className={cn('text-sm font-semibold', dark ? 'text-white' : 'text-navy')}>{message}</p>
        {detail ? (
          <p className={cn('text-xs', dark ? 'text-slate-400' : 'text-slate-500')}>{detail}</p>
        ) : null}
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* CardLoader                                                          */
/* ------------------------------------------------------------------ */

/**
 * Card issuing, freezing, PIN setting and 3-D Secure challenges.
 *
 * Shows a card silhouette materialising behind the brand mark, so the user can
 * see *what* is being produced while the issuer works.
 */
export function CardLoader({
  action = 'Preparing your card',
  detail = 'Generating the card artwork and security credentials.',
  mask,
  tone = 'light',
  className,
}: {
  action?: string;
  detail?: string;
  /** Masked PAN to preview on the emerging card, e.g. "•••• 4417". */
  mask?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <LoaderShell message={action} detail={detail} tone={tone} className={className}>
      <div className="relative flex h-52 w-80 items-center justify-center">
        {/* Card silhouette resolving behind the mark */}
        <div
          className={cn(
            'absolute h-40 w-64 rounded-2xl border border-slate-300/70 bg-gradient-to-br from-white to-slate-100 dark:border-white/10 dark:from-white/10 dark:to-white/5',
            reduced ? '' : 'pb-confirm-pop',
          )}
          aria-hidden
        >
          <div className="absolute left-5 top-5 h-7 w-9 rounded-md bg-slate-300/70 dark:bg-white/15" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
            <div className="h-3 w-24 rounded-full bg-slate-300/70 dark:bg-white/15" />
            <span className="pb-skeleton h-3 w-16 rounded-full" />
          </div>
        </div>

        <div className="absolute">
          <PaybackLoaderMark size={72} tone={tone} reduced={reduced} />
        </div>
        {mask ? (
          <span className="absolute -bottom-1 font-mono text-xs tracking-widest text-slate-500 tnum">{mask}</span>
        ) : null}
      </div>
    </LoaderShell>
  );
}

/* ------------------------------------------------------------------ */
/* TransferLoader                                                      */
/* ------------------------------------------------------------------ */

/**
 * A money transfer in flight.
 *
 * Renders the real stages a bank transfer passes through. The stage list is the
 * honest progress model here — "62% transferred" would be an invention, whereas
 * "authorising / sending / confirming" is exactly what is happening.
 */
export function TransferLoader({
  stages,
  amount,
  recipient,
  tone = 'light',
  className,
}: {
  /** The genuinely-known stages, driven by the caller. */
  stages: LoaderStage[];
  /** Formatted amount, shown so the user can verify what is moving. */
  amount?: string;
  recipient?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const active = stages.find((s) => s.status === 'active');

  return (
    <LoaderShell
      message={active?.label ?? 'Processing your transfer'}
      detail="Keep this screen open. Transfers cannot be cancelled once sent."
      tone={tone}
      className={className}
    >
      <div className="relative flex h-24 w-full max-w-sm items-center gap-4" aria-hidden>
        <span className="h-4 w-4 shrink-0 rounded-full bg-emerald-500" />
        <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn('absolute top-0 h-1 w-10 rounded-full bg-emerald-500', reduced ? '' : 'pb-flow-dot')}
              style={{
                left: 0,
                animationDelay: `${i * 0.55}s`,
                ['--pb-flow-distance' as string]: `${200 + i * 40}px`,
              }}
            />
          ))}
        </span>
        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-emerald-500" />
      </div>

      {amount ? (
        <p className="text-2xl font-bold tracking-tight text-navy tnum dark:text-white">{amount}</p>
      ) : null}
      {recipient ? <p className="-mt-3 text-xs text-slate-500">to {recipient}</p> : null}

      <LoaderStages stages={stages} tone={tone} className="w-full max-w-xs" />
    </LoaderShell>
  );
}
/* ------------------------------------------------------------------ */
/* PaymentLoader                                                       */
/* ------------------------------------------------------------------ */

/**
 * A merchant payment being authorised.
 *
 * When the acquirer reports a real authorisation percentage it is passed
 * through; otherwise `progress` stays null and the bar is indeterminate.
 */
export function PaymentLoader({
  merchant,
  amount,
  progress = null,
  stages,
  tone = 'light',
  className,
}: {
  merchant?: string;
  amount?: string;
  /** Real 0–100 from the acquirer, or null when genuinely unknown. */
  progress?: LoaderProgress;
  stages?: LoaderStage[];
  tone?: LoaderTone;
  className?: string;
}) {
  return (
    <LoaderShell
      message="Authorising your payment"
      detail={merchant ? `Paying ${merchant}` : 'Contacting the merchant and your bank.'}
      tone={tone}
      className={className}
    >
      <div className="space-y-4" aria-hidden>
        {amount ? (
          <p className="text-3xl font-bold tracking-tight text-navy tnum dark:text-white">{amount}</p>
        ) : null}
        <LoaderBar progress={progress} tone={tone} className="mx-auto w-56" />
        {stages?.length ? <LoaderStages stages={stages} tone={tone} className="mx-auto w-full max-w-xs" /> : null}
      </div>
    </LoaderShell>
  );
}

/* ------------------------------------------------------------------ */
/* QRScannerLoader                                                     */
/* ------------------------------------------------------------------ */

/**
 * The QR / barcode scanner.
 *
 * Overlays a scan band on the existing camera frame rather than replacing it —
 * the user needs to keep seeing what they are pointing at, which is the whole
 * feedback loop for scanning.
 */
export function QRScannerLoader({
  status = 'Scanning',
  detail = 'Hold the QR code inside the frame.',
  tone = 'dark',
  className,
}: {
  status?: string;
  detail?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 flex items-center justify-center', className)}
      role="status"
      aria-busy="true"
    >
      <LoaderAnnouncer message={status} detail={detail} />
      {/* Scan band sweeping down the viewport */}
      <span
        className={cn(
          'absolute inset-x-6 top-0 h-16 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent',
          reduced ? '' : 'pb-scan-band',
        )}
        aria-hidden
      />
      {/* Corner brackets that breathe with the scan */}
      <span className="relative h-56 w-56" aria-hidden>
        {(['top-2 left-2 border-l-2 border-t-2', 'top-2 right-2 border-r-2 border-t-2', 'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2'] as const).map(
          (pos) => (
            <span key={pos} className={cn('absolute h-9 w-9 rounded-sm border-emerald-400', pos)} />
          ),
        )}
      </span>
      <p className="absolute bottom-10 rounded-full bg-black/55 px-4 py-1.5 text-xs font-medium text-white">
        {status}
      </p>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* BiometricLoader                                                     */
/* ------------------------------------------------------------------ */

/**
 * Fingerprint / face authentication.
 *
 * Concentric rings contract inward like a sensor reading. The fingerprint
 * outline is the PAYBACK hexagon scaled up, so the biometric moment still
 * carries the brand rather than borrowing a generic OS glyph.
 */
export function BiometricLoader({
  method = 'fingerprint',
  message = 'Waiting for authentication',
  detail,
  tone = 'light',
  className,
}: {
  method?: 'fingerprint' | 'face';
  message?: string;
  detail?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const label = method === 'face' ? 'Look at your device to continue' : 'Touch the sensor to continue';

  return (
    <LoaderShell message={message} detail={detail ?? label} tone={tone} className={className}>
      <div className="relative flex h-40 w-40 items-center justify-center" aria-hidden>
        {/* Contracting sensor rings */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn('absolute h-24 w-24 rounded-full border-2 border-emerald-500/60', reduced ? '' : 'pb-biometric-wave')}
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}
        {/* The mark at the centre of the read */}
        <span className="absolute">
          <PaybackLoaderMark size={56} tone={tone} reduced={reduced} />
        </span>
      </div>
    </LoaderShell>
  );
}

/* ------------------------------------------------------------------ */
/* KYCVerificationLoader                                               */
/* ------------------------------------------------------------------ */

/**
 * Identity verification.
 *
 * KYC is the clearest case where a percentage would be a lie: what matters is
 * which document is being checked, so the stage rail does the work.
 */
export function KYCVerificationLoader({
  stages,
  detail = 'This usually takes a few minutes. You can leave this page.',
  tone = 'light',
  className,
}: {
  /** Genuinely-known verification stages, driven by the caller. */
  stages: LoaderStage[];
  detail?: string;
  tone?: LoaderTone;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const active = stages.find((s) => s.status === 'active');
  const failed = stages.find((s) => s.status === 'error');

  return (
    <LoaderShell
      message={failed ? 'Verification needs attention' : (active?.label ?? 'Verifying your identity')}
      detail={detail}
      tone={tone}
      className={className}
    >
      <div className="relative" aria-hidden>
        <PaybackLoaderMark size={88} tone={tone} reduced={reduced} />
      </div>
      <LoaderStages stages={stages} tone={tone} className="w-full max-w-xs" />
    </LoaderShell>
  );
}