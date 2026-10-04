/**
 * Section heading (spec §5).
 *
 * Centred on desktop and left-aligned on phones, where a centred block of three
 * lines of large type reads as a banner rather than an introduction. The copy is
 * width-capped so the supporting line never runs the full width of a 1280px
 * screen.
 */
export function CardsHeader() {
  return (
    <header className="mx-auto max-w-[720px] text-center sm:text-center">
      <p className="text-caption-fluid font-bold uppercase tracking-[0.18em] text-emerald-600">PAYBACK Cards</p>

      {/* `text-balance` keeps "Your Life." from wrapping away on its own at 320px,
          which was the single worst line-break in the old layout. */}
      <h2 className="mt-3 text-balance text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900">
        Cards Designed Around <span className="text-emerald-600">Your Life.</span>
      </h2>

      <p className="mx-auto mt-4 max-w-[640px] text-pretty text-[15px] leading-relaxed text-slate-600 sm:text-base">
        Premium PAYBACK cards with powerful controls, intelligent security, and benefits built for everyday
        spending.
      </p>
    </header>
  );
}