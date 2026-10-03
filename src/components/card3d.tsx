import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { PaybackGlyph } from '@/components/brandMark';
import { Badge } from '@/components/ui';
import type { PaybackCard } from '@/lib/cardData';
import { cn } from '@/lib/utils';

export type CardSide = 'front' | 'back';
export type CardSize = 'sm' | 'md' | 'lg';

/** ISO/IEC 7810 ID-1 proportions (85.6 × 53.98 mm). */
const ASPECT = 1.586;

const SIZES: Record<CardSize, { width: number; pad: number; font: string; pan: string; holder: string }> = {
  sm: { width: 248, pad: 14, font: 'text-[8px]', pan: 'text-[11px]', holder: 'text-[10px]' },
  md: { width: 340, pad: 20, font: 'text-[9px]', pan: 'text-[14px]', holder: 'text-[12px]' },
  lg: { width: 440, pad: 26, font: 'text-[10px]', pan: 'text-[18px]', holder: 'text-[14px]' },
};

/* ------------------------------------------------------------------ */
/* Text tone (light surfaces need dark ink)                            */
/* ------------------------------------------------------------------ */

/**
 * Platinum and Gold are light metal surfaces, so their ink has to flip to
 * dark. Every tone-aware class is resolved from here.
 */
function toneClasses(card: PaybackCard) {
  const dark = card.identity.textTone === 'dark';
  return {
    dark,
    /** Primary ink — PAN, holder, expiry, wordmark. */
    ink: dark ? 'text-slate-900' : 'text-white',
    /** Secondary ink — micro labels. */
    inkSoft: dark ? 'text-slate-600/80' : 'text-white/60',
    /** Faintest ink — "Demo card" caption, back-face legal line. */
    inkFaint: dark ? 'text-slate-600/70' : 'text-white/45',
    /** Badge / network mark. */
    badge: dark
      ? 'border-slate-900/20 bg-slate-900/[0.06] text-slate-800'
      : 'border-white/25 bg-white/10 text-white/85',
    /** Surface ring — dark cards need a light edge, light cards a dark one. */
    ring: dark ? 'ring-slate-900/10' : 'ring-white/20',
  };
}

/* ------------------------------------------------------------------ */
/* Card faces                                                          */
/* ------------------------------------------------------------------ */

function CardSurface({
  card,
  size,
  shine,
  children,
}: {
  card: PaybackCard;
  size: CardSize;
  /** Pointer-driven specular highlight position (percentages). */
  shine: { x: number; y: number };
  children: ReactNode;
}) {
  const cfg = SIZES[size];
  const finish = card.identity.finish;
  return (
    /* Every visual layer is inert, so only the explicit hit target in
       PaybackCard3D receives clicks — no overlay can ever block the flip. */
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      style={{ backgroundImage: card.identity.base }}
    >
      {finish === 'brushed' || finish === 'metal' ? <div className="pb-brushed absolute inset-0" aria-hidden /> : null}
      <div className="pb-micro absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0" style={{ backgroundImage: card.identity.sheen, opacity: 0.5 }} aria-hidden />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(420px circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.32), transparent 62%)` }}
        aria-hidden
      />
      <div
        className="animate-sheen absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
        aria-hidden
      />
      <div style={{ padding: cfg.pad }} className="relative flex h-full flex-col justify-between">
        {children}
      </div>
      <div className={cn('absolute inset-0 rounded-2xl ring-1 ring-inset', toneClasses(card).ring)} aria-hidden />
    </div>
  );
}

/** Front — logo, chip, contactless, masked PAN, holder name, expiry, holo patch. */
export function CardFront({
  card,
  size,
  shine,
  showPan,
}: {
  card: PaybackCard;
  size: CardSize;
  shine: { x: number; y: number };
  showPan: boolean;
}) {
  const cfg = SIZES[size];
  const tone = toneClasses(card);
  return (
    <CardSurface card={card} size={size} shine={shine}>
      <div className="flex items-start justify-between">
        <Wordmark className={tone.ink} />
        <ContactlessGlyph className={tone.dark ? 'text-slate-800/80' : 'text-white/85'} />
      </div>

      <div className="flex items-end justify-between">
        <CardChip />
        <NetworkMark label={card.identity.network} className={tone.badge} />
      </div>

      <div>
        <div className={cn('tnum font-mono font-semibold tracking-[0.14em]', tone.ink, cfg.pan)}>
          {showPan ? card.demoPan : card.maskedPan}
        </div>
        <div className="mt-1.5 flex items-end justify-between">
          <div>
            <p className={cn('font-semibold uppercase tracking-[0.16em]', tone.inkSoft, cfg.font)}>Cardholder</p>
            <p className={cn('font-semibold uppercase tracking-[0.1em]', tone.ink, cfg.holder)}>{card.holder}</p>
          </div>
          <div className="text-right">
            <p className={cn('font-semibold uppercase tracking-[0.16em]', tone.inkSoft, cfg.font)}>Valid thru</p>
            <p className={cn('tnum font-mono font-semibold', tone.ink, cfg.holder)}>{card.expiry}</p>
          </div>
        </div>
      </div>

      <div className="pb-holo pointer-events-none absolute right-[-16%] top-[16%] h-[50%] w-[40%] rotate-[18deg] rounded-2xl opacity-60" aria-hidden />
      <span className={cn('absolute bottom-1.5 right-3 text-[6px] font-bold uppercase tracking-[0.2em]', tone.inkFaint)}>Demo card</span>
    </CardSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Card furniture                                                      */
/* ------------------------------------------------------------------ */

/** Metallic EMV chip with contact lines and a specular highlight. */
export function CardChip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 34" className={cn('h-[34px] w-[46px]', className)} aria-label="EMV chip" role="img">
      <defs>
        <linearGradient id="pb-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="26%" stopColor="#cbd5e1" />
          <stop offset="48%" stopColor="#f1f5f9" />
          <stop offset="66%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="pb-chip-glare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="46" height="34" rx="5" fill="url(#pb-chip)" stroke="#94a3b8" strokeWidth="0.6" />
      <g stroke="#64748b" strokeWidth="0.7" opacity="0.75">
        <path d="M13 0v10M13 24v10M33 0v10M33 24v10M0 12h9M37 12h9M0 22h9M37 22h9" fill="none" />
        <rect x="13" y="12" width="20" height="10" rx="2" fill="none" />
      </g>
      <rect width="46" height="34" rx="5" fill="url(#pb-chip-glare)" />
    </svg>
  );
}

/** Contactless payment glyph. */
export function ContactlessGlyph({ className, stroke = 'currentColor' }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" aria-label="Contactless" role="img">
      <path d="M8.5 7.5a8 8 0 0 1 0 9" />
      <path d="M12 5.5a12 12 0 0 1 0 13" />
      <path d="M15.5 3.5a16 16 0 0 1 0 17" />
    </svg>
  );
}

/** Demo network representation — configurable, no partnership implied. */
export function NetworkMark({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md border px-1.5 py-0.5 text-[7px] font-bold tracking-[0.18em]', className)}>
      {label}
    </span>
  );
}

/** Card wordmark — the site's hexagonal mark, unchanged by card tint. */
function Wordmark({ className, iconClass }: { className?: string; iconClass?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-display text-[13px] font-extrabold tracking-tight', className)}>
      <PaybackGlyph className={cn('h-4 w-4', iconClass)} />
      PAYBACK
    </span>
  );
}

/**
 * Back — magnetic stripe, signature panel, masked CVV, embossed PAN and
 * security small print, laid out the way a real ISO/IEC 7810 back is: the
 * magstripe runs full-bleed across the top, the signature panel sits directly
 * beneath it, and the card number is embossed in four groups above the issuer
 * line.
 */
export function CardBack({ card, size, shine }: { card: PaybackCard; size: CardSize; shine: { x: number; y: number } }) {
  const cfg = SIZES[size];
  const tone = toneClasses(card);

  /** Embossed digits: four groups, only the last four revealed. */
  const panGroups = ['••••', '••••', '••••', card.last4];

  /**
   * Face furniture is sized as a fraction of the card's own width so the back
   * keeps identical proportions at `sm`, `md` and `lg` instead of the fixed
   * pixel values drifting out of balance on the smallest card.
   */
  const px = (n: number) => `${Math.round((n / 340) * cfg.width)}px`;

  return (
    <CardSurface card={card} size={size} shine={shine}>
      {/* Magnetic stripe — full bleed, fine grooves, soft top-to-bottom gloss. */}
      <div
        className="absolute inset-x-0 top-0 h-[21%]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 3px), linear-gradient(180deg,#020617 0%,#1e293b 32%,#0b1220 68%,#020617 100%)',
        }}
        aria-hidden
      />
      {/* Crisp lip where the stripe meets the card surface. */}
      <div className="absolute inset-x-0 top-[21%] h-px bg-white/30" aria-hidden />

      <div className="mt-[23.5%] flex flex-1 flex-col justify-between" style={{ gap: px(6) }}>
        {/* Signature panel + masked CVV — the CVV is printed on real cards and
            is always masked here. */}
        <div className="flex items-stretch" style={{ gap: px(6) }}>
          <div
            className="min-w-0 flex-1 overflow-hidden rounded-[5px] bg-gradient-to-b from-white to-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/10"
            style={{ padding: `${px(4)}px ${px(7)}px` }}
          >
            <div className="flex items-end" style={{ height: px(22) }}>
              <span
                className="truncate font-serif italic leading-none text-slate-700"
                style={{ fontSize: px(12) }}
              >
                {card.holder}
              </span>
            </div>
            <div className="h-px bg-slate-300/80" style={{ marginTop: px(3) }} />
            <p
              className="truncate font-bold uppercase leading-none tracking-[0.2em] text-slate-400"
              style={{ fontSize: px(5.5), marginTop: px(3) }}
            >
              Authorised signature
            </p>
          </div>

          <div
            className="flex shrink-0 flex-col items-center justify-center rounded-[5px] bg-gradient-to-b from-white to-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/10"
            style={{ width: px(40), paddingBlock: px(4) }}
          >
            <span
              className="font-bold uppercase leading-none tracking-[0.14em] text-slate-400"
              style={{ fontSize: px(5.5) }}
            >
              CVV
            </span>
            <span
              className="tnum font-mono font-bold leading-none text-slate-700"
              style={{ fontSize: px(11), marginTop: px(1) }}
            >
              •••
            </span>
          </div>
        </div>

        {/* Embossed card number — four evenly spaced groups. */}
        <div
          className="flex items-center justify-between rounded-[5px] ring-1"
          style={{
            padding: `${px(4)}px ${px(8)}px`,
            background: tone.dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)',
          }}
        >
          {panGroups.map((group, i) => (
            <span
              key={i}
              className={cn(
                'tnum font-mono leading-none tracking-[0.12em]',
                i === panGroups.length - 1 ? cn(tone.ink, 'font-bold') : tone.inkSoft
              )}
              style={{ fontSize: px(10) }}
            >
              {group}
            </span>
          ))}
        </div>

        {/* Security small print */}
        <p
          className={cn('font-medium uppercase leading-[1.45] tracking-[0.1em]', tone.inkFaint)}
          style={{ fontSize: px(5.5) }}
        >
          Property of PAYBACK · Demonstration only · No real funds or card network
        </p>

        {/* Issuer + network */}
        <div className="flex items-center justify-between" style={{ gap: px(8) }}>
          <Wordmark
            className={cn('text-[10px] leading-none', tone.ink)}
            iconClass="h-[10px] w-[10px]"
          />
          <span className="flex items-center" style={{ gap: px(4) }}>
            <span
              className={cn('truncate font-bold uppercase leading-none tracking-[0.14em]', tone.inkFaint)}
              style={{ fontSize: px(5.5) }}
            >
              {card.secureElement.present ? 'Secure element' : 'Tokenised'}
            </span>
            <NetworkMark label={card.identity.network} className={tone.badge} />
          </span>
        </div>
      </div>

      <span className="sr-only">
        Card back with magnetic stripe, signature panel and masked security details. {cfg.font}
      </span>
    </CardSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive 3D card                                                 */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function PaybackCard3D({
  card,
  size = 'md',
  interactive = true,
  float = false,
  showPan = false,
  className,
  onSideChange,
  onActivate,
  flipLabel = true,
}: {
  card: PaybackCard;
  size?: CardSize;
  /** Enables tap/click/keyboard flipping and pointer tilt. */
  interactive?: boolean;
  float?: boolean;
  /** Reveal the synthetic demo PAN (never a real credential). */
  showPan?: boolean;
  className?: string;
  /** Reports which face is now showing. Observation only — never selection. */
  onSideChange?: (side: CardSide) => void;
  /** Fired whenever the card is activated (click, Enter or Space). */
  onActivate?: () => void;
  flipLabel?: boolean;
}) {
  const cfg = SIZES[size];
  const reduced = usePrefersReducedMotion();
  const [side, setSide] = useState<CardSide>('front');
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [shine, setShine] = useState({ x: 50, y: 28 });
  const wrap = useRef<HTMLDivElement>(null);

  /**
   * Flipping and selection are deliberately separate concerns: `onSideChange`
   * only reports the new face, `onActivate` reports the intent to select. The
   * carousel relies on this to centre a card without it needing to flip too.
   */
  const flip = useCallback(() => {
    setSide((prev) => {
      const next: CardSide = prev === 'front' ? 'back' : 'front';
      onSideChange?.(next);
      return next;
    });
    onActivate?.();
  }, [onSideChange, onActivate]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || reduced) return;
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setShine({ x: px * 100, y: py * 100 });
    setTilt({ rx: (0.5 - py) * 10, ry: (px - 0.5) * 12 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0 });

  const flipDeg = side === 'back' ? 180 : 0;
  const transform = reduced
    ? `rotateY(${flipDeg}deg)`
    : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry + flipDeg}deg)`;

  return (
    /* maxWidth keeps the card inside narrow grid columns while still using the
       full designed width wherever there is room. */
    <div className={cn('select-none', className)} style={{ width: cfg.width, maxWidth: '100%' }}>
      <div className="relative" style={{ perspective: '1400px' }}>
        {/* Contact shadow that shifts with the tilt */}
        <div
          className="pointer-events-none absolute inset-x-4 rounded-[24px] bg-slate-900/25 blur-xl"
          style={{ transform: `translateY(${18 + tilt.rx * 1.6}px) scale(${1 - tilt.rx * 0.006})`, filter: 'blur(18px)' }}
          aria-hidden
        />

        <div
          ref={wrap}
          onPointerMove={onPointerMove}
          onPointerLeave={reset}
          className={cn(
            'preserve-3d relative w-full rounded-2xl pb-contact-shadow transition-transform duration-500 ease-out motion-reduce:transition-none',
            interactive && 'cursor-pointer',
            float && !reduced && 'animate-float'
          )}
          style={{ aspectRatio: String(ASPECT), transform }}
        >
          {/* Physical edge / thickness */}
          <div className="pb-card-edge" aria-hidden />

          {/* Front face */}
          <div className="backface-hidden absolute inset-0">
            <CardFront card={card} size={size} shine={shine} showPan={showPan} />
          </div>

          {/* Back face */}
          <div
            className="backface-hidden absolute inset-0"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <CardBack card={card} size={size} shine={shine} />
          </div>

          {/* Glass edge highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" aria-hidden />

          {/* Explicit hit target — frontmost plane, covers both faces so the
              card is clickable everywhere regardless of flip state or which
              decorative layer sits on top. */}
          {interactive ? (
            <button
              type="button"
              tabIndex={0}
              aria-label={`${card.identity.name}, ${card.maskedPan}. Activate to ${side === 'front' ? 'view the back' : 'return to the front'}.`}
              aria-pressed={side === 'back'}
              onClick={flip}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-2xl border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          ) : null}
        </div>

        {flipLabel && interactive ? (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <button
              type="button"
              onClick={flip}
              className="focus-ring shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-card transition-colors hover:border-emerald-300 hover:text-emerald-700"
            >
              {side === 'front' ? 'View back' : 'View front'}
            </button>
            <span className="text-[11px] text-slate-400">Tap the card to flip</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carousel                                                            */
/* ------------------------------------------------------------------ */

export function CardCarousel({
  cards,
  activeId,
  onActiveChange,
  size = 'md',
  showPan = false,
  className,
}: {
  cards: PaybackCard[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  size?: CardSize;
  showPan?: boolean;
  className?: string;
}) {
  const cfg = SIZES[size];
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(() => Math.max(0, cards.findIndex((c) => c.id === activeId)));

  /**
   * Set while a programmatic smooth scroll is in flight. Scroll events fired by
   * that animation pass through intermediate offsets; without this lock they
   * would overwrite the index we are deliberately animating towards.
   */
  const animating = useRef(false);

  /**
   * Scroll the track itself instead of using `scrollIntoView`, which also
   * scrolls ancestor containers and made the dot/arrow state drift out of sync
   * with the snap position.
   */
  const scrollToIndex = (target: number, smooth = true) => {
    const el = trackRef.current;
    const item = el?.children[target] as HTMLElement | undefined;
    if (!el || !item) return;
    // Centre the card inside the track's own scrollport.
    const left = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
    const next = Math.max(0, left);
    if (!smooth) {
      el.scrollTo({ left: next, behavior: 'auto' });
      return;
    }
    animating.current = true;
    el.scrollTo({ left: next, behavior: 'smooth' });
  };

  const emit = (next: number) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, next));
    if (clamped === index) {
      // Already selected — still re-centre so a click always feels responsive.
      scrollToIndex(clamped);
      return;
    }
    setIndex(clamped);
    onActiveChange?.(cards[clamped].id);
    scrollToIndex(clamped);
  };

  /**
   * Mirror an externally driven `activeId` back into the local index.
   * Without this the carousel keeps rendering its own stale index, so a card
   * selected by the parent stayed dimmed and off-centre.
   */
  useEffect(() => {
    const next = cards.findIndex((c) => c.id === activeId);
    if (next < 0 || next === index) return;
    setIndex(next);
    scrollToIndex(next, false);
  }, [activeId]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    // Ignore the intermediate positions produced by our own smooth scroll.
    if (animating.current) {
      const item = el.children[index] as HTMLElement | undefined;
      if (!item) return;
      const desired = Math.max(0, item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2);
      if (Math.abs(el.scrollLeft - desired) <= 2) animating.current = false;
      return;
    }
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    Array.from(el.children).forEach((child, i) => {
      const item = child as HTMLElement;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(itemCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== index) {
      setIndex(best);
      onActiveChange?.(cards[best].id);
    }
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            emit(index + 1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            emit(index - 1);
          }
        }}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="PAYBACK cards"
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 focus:outline-none"
      >
        {cards.map((card, i) => {
          const distance = Math.abs(i - index);
          return (
            <div
              key={card.id}
              className="snap-center shrink-0 transition-all duration-500 ease-out"
              style={{
                transform: `scale(${distance === 0 ? 1 : Math.max(0.82, 1 - distance * 0.07)})`,
                opacity: distance === 0 ? 1 : Math.max(0.45, 1 - distance * 0.22),
                filter: distance === 0 ? 'none' : 'saturate(0.7)',
              }}
            >
              <PaybackCard3D
                card={card}
                size={size}
                showPan={showPan}
                /* Selection is driven by activation, never by the flip. This
                   updates `index`, reports the new active card and centres it. */
                onActivate={() => emit(i)}
                flipLabel={i === index}
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-bold text-slate-900">{card.identity.name}</p>
                <p className="text-xs text-slate-500">{card.identity.tagline}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls — every dot is tinted with its own card colour, so the button
          always matches the card it reveals. */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
        <button
          type="button"
          onClick={() => emit(index - 1)}
          disabled={index === 0}
          aria-label="Previous card"
          title="Previous card"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-card transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex items-center gap-1" role="tablist" aria-label="Choose a card">
          {cards.map((card, i) => {
            const active = i === index;
            return (
              <button
                key={card.id}
                type="button"
                role="tab"
                onClick={() => emit(i)}
                aria-label={`Show ${card.identity.name}`}
                aria-selected={active}
                title={card.identity.name}
                className={cn(
                  'flex h-7 items-center justify-center rounded-full outline-none transition-all duration-300',
                  'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                  active ? 'w-8' : 'w-5 hover:w-8'
                )}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: active ? card.identity.accent : '#CBD5E1',
                    height: active ? 10 : 8,
                    width: active ? 26 : 8,
                  }}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => emit(index + 1)}
          disabled={index === cards.length - 1}
          aria-label="Next card"
          title="Next card"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-card transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Named key — so every control maps to a card you can read, not just a dot */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() => emit(i)}
            aria-current={i === index}
            title={`Show ${card.identity.name}`}
            className={cn(
              'focus-ring inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
              i === index ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: card.identity.accent }} aria-hidden />
            {card.identity.name.replace('PAYBACK ', '')}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs font-medium text-slate-400">
        <span className="tnum">
          {String(index + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
        </span>{' '}
        — {cards[index].identity.name}
      </p>

      <p className="sr-only">Card width {cfg.width}px. Use left and right arrow keys to browse cards.</p>
    </div>
  );
}