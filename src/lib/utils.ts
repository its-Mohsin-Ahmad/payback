/**
 * Small class-name joiner used across the PAYBACK component system.
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}

/** PKR currency formatter (PAYBACK primary currency). */
export function pkr(value: number, opts: { decimals?: boolean; sign?: boolean } = {}): string {
  const { decimals = true, sign = false } = opts;
  const formatted = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Math.abs(value));
  const prefix = sign ? (value < 0 ? '- ' : '+ ') : value < 0 ? '-' : '';
  return `${prefix}PKR ${formatted}`;
}

/** Generic currency formatter. */
export function money(value: number, currency = 'USD', opts: { decimals?: boolean } = {}): string {
  const { decimals = true } = opts;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(value);
}

/** Compact number e.g. 1.2M */
export function compact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function percent(value: number, digits = 1): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

/** Mask an account number keeping the last 4. */
export function maskAccount(account: string): string {
  const tail = account.replace(/\s/g, '').slice(-4);
  return `•••• ${tail}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{3})/g, '•');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export function uid(prefix = 'PB'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}

/** Format an ISO date into a friendly string. */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
  return new Date(iso).toLocaleDateString('en-US', opts);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
