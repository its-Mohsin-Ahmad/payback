import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Lock } from 'lucide-react';
import { cn, formatDate, money } from '@/lib/utils';
import { Badge, ProgressBar, StatusBadge } from '@/components/ui';
import { Icon } from '@/components/Icon';
import type { Account, Card as CardType, Transaction } from '@/data/mock';

/* ------------------------------------------------------------------ */
/* Page wrapper                                                        */
/* ------------------------------------------------------------------ */

export function PageWrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-content space-y-6', className)}>{children}</div>;
}

export function Grid({ children, className, cols = 4 }: { children: ReactNode; className?: string; cols?: 2 | 3 | 4 }) {
  const map = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 xl:grid-cols-3', 4: 'sm:grid-cols-2 xl:grid-cols-4' } as const;
  return <div className={cn('grid grid-cols-1 gap-4', map[cols], className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Amounts                                                             */
/* ------------------------------------------------------------------ */

export function AmountText({
  value,
  currency = 'USD',
  size = 'md',
  colored = false,
  className,
}: {
  value: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colored?: boolean;
  className?: string;
}) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl', xl: 'text-3xl' } as const;
  return (
    <span
      className={cn(
        'tnum font-semibold',
        sizes[size],
        colored ? (value < 0 ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-900',
        className
      )}
    >
      {value < 0 ? '−' : value > 0 && colored ? '+' : ''}
      {money(Math.abs(value), currency)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Transaction row                                                     */
/* ------------------------------------------------------------------ */

export function TransactionRow({ tx, showAccount }: { tx: Transaction; showAccount?: boolean }) {
  const inbound = tx.amount > 0;
  return (
    <li>
      <Link
        to={`/app/transactions/${tx.id}`}
        className="focus-ring flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50 sm:px-3"
      >
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            inbound ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
          )}
        >
          {inbound ? <ArrowDownRight className="h-5 w-5" aria-hidden /> : <ArrowUpRight className="h-5 w-5" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{tx.description}</p>
          <p className="truncate text-xs text-slate-500">
            {formatDate(tx.date, { month: 'short', day: 'numeric' })} &bull; {tx.category}
            {showAccount ? ` • ${tx.account}` : ''}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <AmountText value={tx.amount} currency={tx.currency} colored size="sm" className="block" />
          <span className="mt-0.5 block">
            <StatusBadge status={tx.status} className="px-1.5 py-0 text-[10px]" />
          </span>
        </div>
        <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" aria-hidden />
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Account card                                                        */
/* ------------------------------------------------------------------ */

export function AccountCard({ account, compact }: { account: Account; compact?: boolean }) {
  return (
    <Link to={`/app/accounts/${account.id}`} className="focus-ring card-base group block p-4 transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon name={account.icon} className="h-5 w-5" />
        </span>
        <div className="flex flex-col items-end gap-1">
          <Badge tone={account.status === 'Active' ? 'emerald' : 'amber'}>{account.status}</Badge>
          {account.isDefault ? <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Default</span> : null}
        </div>
      </div>
      <p className="mt-3 truncate text-sm font-semibold text-slate-900">{account.name}</p>
      <p className="text-xs text-slate-500">
        {account.type} &bull; •••• {account.number}
      </p>
      <p className="tnum mt-3 text-xl font-bold text-slate-900">{money(account.balance, account.currency)}</p>
      {account.equivalent ? <p className="text-[11px] text-slate-400">{account.equivalent}</p> : null}
      {!compact ? <p className="mt-1.5 text-[11px] font-semibold text-emerald-600">▲ {account.changePct.toFixed(1)}% this month</p> : null}
      {account.interest ? <p className="mt-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">{account.interest}</p> : null}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Card visual                                                         */
/* ------------------------------------------------------------------ */

export function CardVisual({ card, size = 'md' }: { card: CardType; size?: 'sm' | 'md' }) {
  const isFrozen = card.status === 'Frozen' || card.status === 'Blocked';
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl text-white shadow-lift',
        size === 'sm' ? 'aspect-[1.7/1] max-w-[280px]' : 'aspect-[1.7/1] max-w-[380px]'
      )}
      style={{ backgroundImage: card.gradient }}
    >
      <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'radial-gradient(circle at 88% 12%, #fff 0, transparent 42%)' }} aria-hidden />
      <div className={cn('relative flex h-full flex-col justify-between', size === 'sm' ? 'p-4' : 'p-5')}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">{card.type}</p>
            <p className={cn('font-display font-bold', size === 'sm' ? 'text-sm' : 'text-base')}>{card.label}</p>
          </div>
          <span className="font-display text-sm font-extrabold italic tracking-tight">{card.scheme}</span>
        </div>

        <div>
          <p className={cn('tnum font-mono tracking-[0.18em]', size === 'sm' ? 'text-sm' : 'text-lg')}>•••• •••• •••• {card.last4}</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Expires</p>
              <p className="tnum text-xs font-semibold">{card.expiry}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Limit used</p>
              <p className="tnum text-xs font-semibold">{Math.round((card.spent / card.limit) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>
      {isFrozen ? (
        <div className="absolute inset-0 flex items-center justify-center bg-navy/70">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            {card.status}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Utilisation meter                                                   */
/* ------------------------------------------------------------------ */

export function UtilisationBar({
  label,
  used,
  max,
  tone = '#10B981',
  formatter = (n: number) => money(n),
}: {
  label: string;
  used: number;
  max: number;
  tone?: string;
  formatter?: (n: number) => string;
}) {
  const pct = max === 0 ? 0 : Math.round((used / max) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="tnum text-slate-500">
          {formatter(used)} <span className="text-slate-300">/</span> {formatter(max)}
        </span>
      </div>
      <ProgressBar value={used} max={max} tone={tone} label={label} />
      <p className="text-[11px] text-slate-400">{pct}% of limit used</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quick action grid                                                   */
/* ------------------------------------------------------------------ */

export function ActionGrid({
  items,
  className,
}: {
  items: { label: string; to: string; icon: string; tone: string }[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-4 gap-2 sm:gap-3', className)}>
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="focus-ring group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${item.tone}1a`, color: item.tone }}
          >
            <Icon name={item.icon} className="h-5 w-5" />
          </span>
          <span className="text-[11px] font-semibold leading-tight text-slate-700 sm:text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic list shell                                                  */
/* ------------------------------------------------------------------ */

export function ListShell({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn('divide-y divide-slate-100', className)}>{children}</ul>;
}

export function EmptyRow({ text }: { text: string }) {
  return <li className="px-3 py-8 text-center text-sm text-slate-400">{text}</li>;
}