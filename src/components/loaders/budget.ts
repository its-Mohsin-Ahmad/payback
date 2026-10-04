/**
 * PAYBACK loader time budget.
 *
 * Every loader in this product is bounded by a single hard ceiling. Two reasons:
 *
 *  1. A demo that stalls for 30 seconds teaches users that PAYBACK is slow.
 *  2. Several loaders are *chained* (a five-step account creation, a staged
 *     transfer), so their total is a sum that silently grows whenever a step is
 *     added. Checking each timeout by hand is how that goes unnoticed — the cap
 *     has to be enforced in code, not by convention.
 */

import { useEffect, useRef, useState } from 'react';

/** The absolute ceiling for any single loader, in milliseconds. */
export const LOADER_MAX_MS = 5000;

/**
 * Clamp a requested duration into the budget.
 *
 * Use this anywhere a duration is composed or derived, so a chain of steps can
 * never accumulate past the ceiling.
 */
export function clampLoaderDuration(ms: number): number {
  // Guard NaN explicitly: `Math.min(Math.round(NaN), MAX)` is NaN, and a NaN
  // delay makes setTimeout fire immediately, silently skipping the loader.
  if (!Number.isFinite(ms)) return LOADER_MAX_MS;
  return Math.max(0, Math.min(Math.round(ms), LOADER_MAX_MS));
}

/**
 * Split a budget across `count` sequential steps.
 *
 * Given a total budget this returns the per-step delay that finishes *just*
 * inside it, with the remainder added to the final step so no time is lost to
 * rounding. Callers derive their step delay from this instead of hard-coding a
 * number, which is what keeps a growing step list inside the ceiling.
 */
export function loaderStepDelay(count: number, budget = LOADER_MAX_MS): number {
  if (count <= 0) return 0;
  return Math.floor(budget / count);
}
/**
 * A loader that resolves itself and cannot outstay the budget.
 *
 * Returns `true` while the loader should be shown. Two guarantees:
 *
 *  - The requested duration is clamped to `LOADER_MAX_MS`, so no caller can
 *    accidentally request a longer stall.
 *  - The timer is always cleared on unmount, so navigating away mid-load cannot
 *    leave a `setState` on an unmounted component.
 *
 * This is the single place the cap is enforced for mount-time loaders; pages use
 * it instead of open-coding a timeout.
 */
export function useBoundedLoader(durationMs: number, enabled = true): boolean {
  const [loading, setLoading] = useState(enabled);

  // Held in a ref so a changed duration does not restart the timer mid-stall.
  const msRef = useRef(clampLoaderDuration(durationMs));
  const onRef = useRef(enabled);
  msRef.current = clampLoaderDuration(durationMs);
  onRef.current = enabled;

  useEffect(() => {
    if (!onRef.current) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), msRef.current);
    return () => window.clearTimeout(t);
    // Mount-only by design: the loader runs once per entry. Re-running on every
    // dependency change would re-trigger the stall each time the user navigates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading;
}