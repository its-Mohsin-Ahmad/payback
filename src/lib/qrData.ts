/**
 * PAYBACK QR payload model.
 *
 * QR codes in PAYBACK carry **safe references only** — a kind, an opaque
 * reference and optional non-sensitive display data. They never contain
 * passwords, PINs, CVVs, API keys or authentication secrets. A production
 * deployment would replace `ref` with a short-lived signed token from the API.
 */

export type QrKind = 'payment' | 'transfer' | 'receipt' | 'invoice' | 'my-code' | 'bill';

export interface QrPayload {
  kind: QrKind;
  ref: string;
  /** Optional non-sensitive display fields for the confirmation screen. */
  meta?: Record<string, string>;
  /** Epoch ms after which the code should be treated as expired. */
  exp?: number;
}

const PREFIX = 'PAYBACK1';

export function encodeQr(payload: QrPayload) {
  const head = `${PREFIX}:${payload.kind}:${payload.ref}`;
  const exp = payload.exp ? `:${payload.exp}` : '';
  const meta = payload.meta && Object.keys(payload.meta).length ? `:${btoa(unescape(encodeURIComponent(JSON.stringify(payload.meta))))}` : '';
  return `${head}${exp}${meta}`;
}

export function parseQr(text: string): QrPayload | null {
  const parts = text.trim().split(':');
  if (parts[0] !== PREFIX || !parts[1] || !parts[2]) return null;
  const kind = parts[1] as QrKind;
  const known: QrKind[] = ['payment', 'transfer', 'receipt', 'invoice', 'my-code', 'bill'];
  if (!known.includes(kind)) return null;
  const payload: QrPayload = { kind, ref: parts[2] };
  if (parts[3]) payload.exp = Number(parts[3]);
  if (parts[4]) {
    try {
      payload.meta = JSON.parse(decodeURIComponent(escape(atob(parts[4]))));
    } catch {
      payload.meta = undefined;
    }
  }
  return payload;
}

export function isExpired(payload: QrPayload) {
  return typeof payload.exp === 'number' && payload.exp < Date.now();
}

const minutes = (n: number) => Date.now() + n * 60_000;

/* ------------------------------------------------------------------ */
/* Demo payloads used across the prototype                              */
/* ------------------------------------------------------------------ */

/** Merchant payment request scanned with Scan & Pay. */
export const demoPaymentQr = encodeQr({
  kind: 'payment',
  ref: 'PAY-MERCH-88214',
  exp: minutes(15),
  meta: { merchant: 'Aurora Retail Group', currency: 'USD', amount: '128.40', reference: 'AUR-88214', note: 'Demo merchant code' },
});

/** Transfer request that resolves to a recipient. */
export const demoTransferQr = encodeQr({
  kind: 'transfer',
  ref: 'RCPT-ALI-1122',
  exp: minutes(10),
  meta: { name: 'Ali Raza', provider: 'Easypaisa', identifier: '0300 ••• 1122', verified: 'true', currency: 'USD' },
});

/** A PAYBACK ID / wallet code the customer shows to receive money. */
export const demoMyQr = encodeQr({
  kind: 'my-code',
  ref: 'PAYBACK:PB-7F3K22',
  meta: { name: 'Mohsin Ahmad', handle: 'mohsin.ahmad', verified: 'true' },
});

/** Receipt code — safe transaction reference only. */
export const demoReceiptQr = encodeQr({
  kind: 'receipt',
  ref: 'PB-TX-88214',
  meta: { date: '2025-04-25', merchant: 'Amazon', amount: '126.45', currency: 'USD' },
});

/** Invoice / biller code used by Scan Bill. */
export const demoInvoiceQr = encodeQr({
  kind: 'invoice',
  ref: 'BILL-K-ELEC-0047112',
  meta: { biller: 'Electricity', consumer: '0047112', due: '2025-04-28', currency: 'USD' },
});

export const QR_KIND_LABEL: Record<QrKind, string> = {
  payment: 'Payment request',
  transfer: 'Transfer request',
  receipt: 'Transaction receipt',
  invoice: 'Bill payment',
  'my-code': 'PAYBACK code',
  bill: 'Bill payment',
};

/** Codes the scanner recognises — anything else is reported as unsupported. */
export const SUPPORTED_CODES = [
  { id: 'qr', label: 'QR code', hint: 'Any supported PAYBACK or merchant code' },
  { id: 'barcode', label: 'Barcode', hint: 'Biller and invoice barcodes' },
  { id: 'payment', label: 'Payment code', hint: 'Scan to pay a merchant' },
  { id: 'invoice', label: 'Invoice code', hint: 'Locate a bill or invoice' },
] as const;

export type SupportedCodeId = (typeof SUPPORTED_CODES)[number]['id'];