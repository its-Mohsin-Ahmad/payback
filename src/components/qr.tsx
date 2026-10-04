import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Flashlight, HelpCircle, ImageUp, ScanLine, ShieldCheck, X } from 'lucide-react';
import { Badge, Button, useToast } from '@/components/ui';
import { clampLoaderDuration, LoaderAnnouncer } from '@/components/loaders';
import { isExpired, parseQr, QR_KIND_LABEL, type QrPayload } from '@/lib/qrData';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Deterministic demo QR renderer                                       */
/* ------------------------------------------------------------------ */

/**
 * A deterministic, QR-shaped renderer used for visual demonstration.
 *
 * It is **not** a scannable QR specification implementation: modules are derived
 * from a seeded hash of the payload so the same value always renders the same
 * picture. Real scanning is simulated in the prototype.
 */

function hashSeed(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MODULES = 25;

function buildMatrix(value: string) {
  const rand = mulberry32(hashSeed(value));
  const grid: boolean[][] = Array.from({ length: MODULES }, () => Array<boolean>(MODULES).fill(false));

  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[oy + y][ox + x] = edge || core;
      }
    }
  };

  finder(0, 0);
  finder(MODULES - 7, 0);
  finder(0, MODULES - 7);

  // Timing patterns
  for (let i = 8; i < MODULES - 8; i += 1) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Alignment block (bottom-right)
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const on = y === 0 || y === 4 || x === 0 || x === 4 || (y === 2 && x === 2);
      grid[MODULES - 9 + y][MODULES - 9 + x] = on;
    }
  }

  // Data modules — deterministic pseudo-random fill
  const reserved = (r: number, c: number) =>
    (r < 8 && c < 8) ||
    (r < 8 && c > MODULES - 9) ||
    (r > MODULES - 9 && c < 8) ||
    (r === 6 || c === 6) ||
    (r > MODULES - 11 && c > MODULES - 11);

  for (let r = 0; r < MODULES; r += 1) {
    for (let c = 0; c < MODULES; c += 1) {
      if (reserved(r, c)) continue;
      grid[r][c] = rand() > 0.52;
    }
  }

  return grid;
}

export function QrCode({
  value,
  size = 180,
  className,
  tone = '#0F172A',
  label,
}: {
  value: string;
  size?: number;
  className?: string;
  tone?: string;
  label?: string;
}) {
  const grid = useMemo(() => buildMatrix(value), [value]);
  const dataPath = useMemo(() => {
    const parts: string[] = [];
    for (let r = 0; r < MODULES; r += 1) {
      for (let c = 0; c < MODULES; c += 1) {
        if (grid[r][c]) parts.push(`M${c} ${r}h1v1h-1z`);
      }
    }
    return parts.join('');
  }, [grid]);

  const eye = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" rx="1.6" fill={tone} />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" rx="1.2" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" rx="0.9" fill={tone} />
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${MODULES} ${MODULES}`}
      className={className}
      role="img"
      aria-label={label ?? 'PAYBACK QR code (demonstration)'}
    >
      <rect width={MODULES} height={MODULES} fill="#fff" />
      <path d={dataPath} fill={tone} />
      {eye(0, 0)}
      {eye(MODULES - 7, 0)}
      {eye(0, MODULES - 7)}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Scanner                                                             */
/* ------------------------------------------------------------------ */

export type ScanPhase = 'scanning' | 'detected' | 'unsupported' | 'invalid' | 'expired';

export interface ScanSample {
  id: string;
  label: string;
  raw: string;
}

export function QrScanner({
  onClose,
  onRecognised,
  title = 'Scan a QR Code',
  subtitle = 'Scan a supported payment or transfer code to continue.',
  samples,
  className,
  actionLabel = 'Review',
}: {
  onClose: () => void;
  /** Fired once a supported code is recognised and the user taps Review. */
  onRecognised: (payload: QrPayload, raw: string) => void;
  title?: string;
  subtitle?: string;
  /** Demo codes this screen can recognise. */
  samples: ScanSample[];
  className?: string;
  actionLabel?: string;
}) {
  const toast = useToast();
  const [phase, setPhase] = useState<ScanPhase>('scanning');
  const [flash, setFlash] = useState(false);
  const [help, setHelp] = useState(false);
  const [payload, setPayload] = useState<QrPayload | null>(null);

  /** Classify a scanned string exactly as a real scanner would. */
  const handleRaw = useCallback((raw: string) => {
    const parsed = parseQr(raw);
    if (!parsed) {
      setPhase(raw.toLowerCase().startsWith('http') ? 'unsupported' : 'invalid');
      return;
    }
    setPayload(parsed);
    setPhase(isExpired(parsed) ? 'expired' : 'detected');
  }, []);

  const reset = () => {
    setPhase('scanning');
    setPayload(null);
  };

  useEffect(() => {
    /*
      The prototype auto-detects a sample code after a beat so the flow can be
      walked end to end. This is a *timer*, not a measurement, so no progress
      percentage is derived from it — showing "83%" here would be a fabricated
      number that reaches 100% whether or not anything was actually scanned.
      The delay is clamped to the shared loader budget.
     */
    const started = Date.now();
    const id = window.setInterval(() => {
      if (Date.now() - started >= clampLoaderDuration(2400)) {
        window.clearInterval(id);
        const sample = samples[samples.length - 1];
        if (sample) handleRaw(sample.raw);
      }
    }, 120);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples, handleRaw]);

  const corners = 'absolute h-8 w-8 rounded-[10px] border-2 border-emerald-400';

  return (
    <div className={cn('relative overflow-hidden rounded-3xl bg-navy', className)}>
      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-30" aria-hidden />
        {/*
          The scanning state is announced, so a screen-reader user knows the
          scanner is looking rather than being left with a silent dark rectangle.
        */}
        {phase === 'scanning' ? <LoaderAnnouncer message="Scanning" detail="Looking for a QR or barcode code." /> : null}
        <div className="animate-spin-slow absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" aria-hidden />
        {flash ? <div className="absolute inset-0 z-20 bg-white/85" aria-hidden /> : null}

        <div className="relative h-64 w-64">
          <span className={cn(corners, 'left-0 top-0 border-b-0 border-r-0')} />
          <span className={cn(corners, 'right-0 top-0 border-b-0 border-l-0')} />
          <span className={cn(corners, 'bottom-0 left-0 border-r-0 border-t-0')} />
          <span className={cn(corners, 'bottom-0 right-0 border-l-0 border-t-0')} />

          {phase === 'scanning' ? (
            <>
              <div className="animate-scan-line absolute inset-x-2 top-2 h-0.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.9)]" />
              <div className="absolute inset-x-0 -bottom-10 text-center text-xs font-medium text-white/70">
                Looking for a code…
              </div>
            </>
          ) : null}

          {phase !== 'scanning' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-navy/70 px-4 text-center backdrop-blur-sm">
              {phase === 'detected' ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden />
              ) : (
                <AlertTriangle className="h-8 w-8 text-amber-400" aria-hidden />
              )}
              <p className="text-sm font-bold text-white">
                {phase === 'detected'
                  ? 'QR Code Detected'
                  : phase === 'expired'
                    ? 'This payment code has expired.'
                    : phase === 'unsupported'
                      ? 'This QR code is not supported by PAYBACK.'
                      : "We couldn't read this code. Try again."}
              </p>
              {payload ? <p className="font-mono text-[11px] text-white/60">{payload.ref}</p> : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      <div className="relative border-t border-white/10 bg-navy-800/60 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">{title}</h2>
            <p className="mt-0.5 text-xs text-white/60">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className="focus-ring rounded-xl bg-white/10 p-2 text-white/80 hover:bg-white/20"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white/20"
            icon={<Flashlight className="h-4 w-4" aria-hidden />}
            onClick={() => setFlash((f) => !f)}
          >
            Flash
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white/20"
            icon={<ImageUp className="h-4 w-4" aria-hidden />}
            onClick={() => {
              reset();
              toast.info('Camera not connected', 'Use a demo code below to continue (prototype).');
            }}
          >
            Upload
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/10 text-white hover:bg-white/20"
            icon={<HelpCircle className="h-4 w-4" aria-hidden />}
            onClick={() => setHelp((h) => !h)}
          >
            Help
          </Button>
        </div>

        {help ? (
          <p className="mt-3 rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed text-white/65">
            PAYBACK recognises payment, transfer, bill and receipt codes. Codes that are expired, malformed or issued by an
            unsupported provider are reported without any payment taking place. Scanning is simulated in this prototype — no
            camera access is requested and no QR content carries credentials.
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="sky" icon={<ScanLine className="h-3 w-3" aria-hidden />}>
            Demo camera
          </Badge>
          <Badge tone="violet" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>
            No secrets in QR
          </Badge>
        </div>

        {phase === 'detected' && payload ? (
          <Button
            className="mt-3 w-full"
            icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
            onClick={() => onRecognised(payload, payload.ref)}
          >
            {actionLabel}
          </Button>
        ) : null}

        {phase !== 'scanning' && phase !== 'detected' ? (
          <Button
            variant="outline"
            className="mt-3 w-full border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={reset}
          >
            Scan again
          </Button>
        ) : null}

        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">Demo codes</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {samples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleRaw(sample.raw)}
                className="focus-ring rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white/80 transition-colors hover:bg-white/20"
              >
                {sample.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleRaw('https://example.com/pay/unsupported')}
              className="focus-ring rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-white/50 transition-colors hover:bg-white/15"
            >
              Unsupported code
            </button>
            {payload?.kind ? <span className="text-[11px] text-white/50">{QR_KIND_LABEL[payload.kind]}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}