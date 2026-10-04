import { Building2, Check, ChevronDown, Plus, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/lib/session/SessionProvider';
import { activeBusiness, businessesFor, displayName, hasBusiness } from '@/lib/session/selectors';
import { BusinessLogo } from '@/components/BusinessLogo';

/**
 * Personal ⇄ Business switcher (spec §22, §36, §37, §51, §52).
 *
 * This is the single most important control for the mobile business experience:
 * without it, Business Banking exists only behind a typed URL. It sits in the
 * header at every width, so the active banking context is always visible and
 * always one tap from changing.
 */
export function AccountSwitcher() {
  const { session, setMode, setActiveBusiness } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  // Every business the signed-in user owns (spec §22).
  const businesses = businessesFor(session);
  const business = activeBusiness(session);
  const canSwitch = hasBusiness(session);
  const isBusiness = session.mode === 'business';

  // Dismiss on an outside click or Escape — a popover that traps the page is
  // worse than one that closes politely.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (mode: 'personal' | 'business') => {
    setMode(mode);
    setOpen(false);
    navigate(mode === 'business' ? '/business/app' : '/app');
  };

  const label = isBusiness ? business?.name ?? 'Business Banking' : 'Personal Banking';
  const Icon = isBusiness ? Building2 : User;
  const personalCount = session.accounts.filter((a) => a.mode === 'personal').length;
  const businessCount = session.accounts.filter((a) => a.mode === 'business').length;

  // No business profile — show the context as a static label rather than a
  // control that would open a menu with nothing to switch to.
  if (!canSwitch) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        <span className="max-w-[9rem] truncate">{label}</span>
      </span>
    );
  }

  return (
    <div className="relative" ref={wrap}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Banking context: ${label}. Switch banking`}
        className={`focus-ring inline-flex min-h-[44px] max-w-[6.5rem] xs:max-w-[11rem] items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${
          isBusiness
            ? 'border-slate-300 bg-slate-900 text-white hover:bg-slate-800'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {/* Below `sm` the app bar needs the width for the page title, which was
            truncating to "C..". The control collapses to icon + chevron and
            keeps its accessible name from `aria-label` on the button. */}
        <span className="hidden truncate sm:inline">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Choose banking context"
          className="absolute right-0 z-50 mt-2 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift"
        >
          {/* Who is signed in — answers "whose banking information?" (spec §57). */}
          <div className="border-b border-slate-100 px-3.5 py-3">
            <p className="text-sm font-bold text-slate-900">{displayName(session.user)}</p>
            <p className="truncate text-xs text-slate-500">{session.user.email}</p>
          </div>

          <button
            type="button"
            role="option"
            aria-selected={!isBusiness}
            onClick={() => go('personal')}
            className="focus-ring flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <User className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">Personal Banking</span>
              <span className="block text-xs text-slate-500">{personalCount} account(s)</span>
            </span>
            {!isBusiness ? <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> : null}
          </button>

          {/*
            One row per owned business (spec §22). Switching sets the active
            business *and* the banking mode together, so the entire business
            context — accounts, cards, team, invoices — follows the selection
            (§23).
          */}
          {businesses.map((b) => {
            const selected = isBusiness && b.id === business?.id;
            return (
              <button
                key={b.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setActiveBusiness(b.id);
                  setOpen(false);
                  navigate('/business/app');
                }}
                className="focus-ring flex w-full items-center gap-3 border-t border-slate-100 px-3.5 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <BusinessLogo business={b} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{b.name}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {b.userRole} · {b.industry}
                  </span>
                </span>
                {selected ? <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> : null}
              </button>
            );
          })}

          {/* Create/join another business (spec §23). */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/business/app/profile?new=1');
            }}
            className="focus-ring flex w-full items-center gap-3 border-t border-slate-100 px-3.5 py-3 text-left text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300">
              <Plus className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold">Create or join a business</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}