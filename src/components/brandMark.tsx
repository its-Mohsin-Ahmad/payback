import type { CSSProperties } from 'react';

/**
 * The PAYBACK brand mark, shared by the website and the physical card so the
 * two are geometrically identical.
 *
 * A six-sided hexagon (a card, abstracted) enclosing an upward chevron
 * (progress — value coming back to you).
 *
 * These paths are the single source of truth. Nothing else in the codebase
 * should inline its own copy of the mark; import from here instead so the
 * header logo, the admin rail and the card artwork can never drift apart.
 */

/** Outer hexagon in a 24×24 viewBox. Pointy-top, matching the card artwork. */
export const HEX_PATH = 'M12 2.5 21 7.4v9.2L12 21.5 3 16.6V7.4L12 2.5Z';

/** Upward chevron seated inside the hexagon. */
export const CHEVRON_PATH = 'M7.5 14.4 12 8.2l4.5 6.2';

/** Accent used for the chevron — the same emerald as the card. */
export const BRAND_ACCENT = '#34D399';

/**
 * The outlined glyph exactly as it appears on the card: hexagon stroke in the
 * current text colour, chevron in emerald. Sits directly on a surface, so it
 * has no fill of its own.
 */
export function PaybackGlyph({
  className,
  accent = BRAND_ACCENT,
  style,
}: {
  className?: string;
  accent?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden focusable="false">
      <path d={HEX_PATH} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={CHEVRON_PATH} stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The filled hexagon used wherever the mark needs to hold its own against a
 * background — site header, admin rail, footer. Same silhouette and same
 * chevron as the card; only the fill differs, because the header and admin
 * rail sit on light and dark surfaces where the outlined glyph would either
 * vanish or lose contrast.
 */
export function PaybackHexTile({
  size = 36,
  background = '#10B981',
  chevron = '#FFFFFF',
  className,
}: {
  size?: number;
  background?: string;
  chevron?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" aria-hidden focusable="false">
      <path d={HEX_PATH} fill={background} />
      <path d={CHEVRON_PATH} stroke={chevron} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}