import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Bell, Building2, LogOut, Menu, MessageSquare, Search } from 'lucide-react';
import { Brand } from '@/components/Brand';
import { Icon } from '@/components/Icon';
import { Avatar, Badge, useToast } from '@/components/ui';
import { appNav, bottomNav, businessNav, type NavGroup } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { customer } from '@/data/mock';
import { businessProfile } from '@/data/enterprise';

function NavSection({ group, onNavigate }: { group: NavGroup; onNavigate?: () => void }) {
  return (
    <div className="pb-4">
      <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{group.title}</p>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-emerald-500/15 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-emerald-400' : 'text-white/45 group-hover:text-white/80')} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="shrink-0 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
                  ) : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarContent({ variant, onNavigate }: { variant: 'personal' | 'business'; onNavigate?: () => void }) {
  const groups = variant === 'business' ? businessNav : appNav;
  const displayName = variant === 'business' ? businessProfile.primaryContact : customer.name;
  const displayRole = variant === 'business' ? businessProfile.role : customer.tier;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-4">
        <Brand tone="white" to={variant === 'business' ? '/business/app' : '/app'} />
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-3" aria-label="Application">
        {groups.map((group) => (
          <NavSection key={group.title} group={group} onNavigate={onNavigate} />
        ))}

        <div className="mx-3 mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-400">Demo mode</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/55">
            Balances, cards and provider transfers shown here are synthetic.
          </p>
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
          <Avatar name={displayName} size="sm" color={variant === 'business' ? '#38BDF8' : '#10B981'} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{displayName}</p>
            <p className="truncate text-[11px] text-white/50">{displayRole}</p>
          </div>
          <Link to="/login" aria-label="Sign out" className="focus-ring rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { PaybackLoader } from '@/components/loaders';

export function AppShell({ variant = 'personal' }: { variant?: 'personal' | 'business' }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [booting, setBooting] = useState(true);
  const { pathname } = useLocation();
  const toast = useToast();

  /**
   * Boot state for the authenticated app.
   *
   * The shell is shown only once the session has actually been restored, so the
   * user never sees a half-built interface flash before it re-authenticates.
   * It runs on entry only — never on navigation — and is deliberately
   * indeterminate: we genuinely do not know how long a session restore takes.
   */
  useEffect(() => {
    if (sessionStorage.getItem('pb:booted')) return;
    sessionStorage.setItem('pb:booted', '1');
    const t = window.setTimeout(() => setBooting(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setUserMenu(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  const base = variant === 'business' ? '/business/app' : '/app';
  const nav = variant === 'business' ? businessNav : appNav;
  const flatNav = nav.flatMap((g) => g.items);
  const current = [...flatNav].sort((a, b) => b.to.length - a.to.length).find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));

  return (
    <>
      <PaybackLoader
        open={booting}
        tone="dark"
        message={variant === 'business' ? 'Opening your business account' : 'Opening your PAYBACK account'}
        detail="Restoring your secure session."
      />
      <div className="flex min-h-screen bg-surface" aria-busy={booting || undefined}>
      <aside className="navy-mesh sticky top-0 hidden h-screen w-[268px] shrink-0 lg:block" aria-label="Sidebar">
        <SidebarContent variant={variant} />
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="navy-mesh absolute inset-y-0 left-0 w-[280px] max-w-[85vw] animate-fade-in shadow-lift">
            <SidebarContent variant={variant} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{current?.label ?? 'Dashboard'}</p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {variant === 'business' ? businessProfile.name : `Welcome back, ${customer.preferredName}`}
              </p>
            </div>

            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                placeholder="Search transactions, payees…"
                aria-label="Search"
                className="focus-ring h-10 w-56 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 xl:w-72"
              />
            </div>

            <button
              type="button"
              onClick={() => toast.info('No new messages', 'Secure messages from PAYBACK will appear here in the full product.')}
              className="focus-ring relative hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 sm:block"
              aria-label="Messages"
            >
              <MessageSquare className="h-5 w-5" aria-hidden />
            </button>

            <Link
              to={variant === 'business' ? '/business/app/approvals' : '/app/notifications'}
              className="focus-ring relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden />
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                3
              </span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenu((o) => !o)}
                className="focus-ring flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={userMenu}
              >
                <Avatar name={variant === 'business' ? businessProfile.name : customer.name} size="sm" color={variant === 'business' ? '#38BDF8' : '#0F172A'} />
                <span className="hidden text-left lg:block">
                  <span className="block text-xs font-semibold text-slate-900">
                    {variant === 'business' ? businessProfile.name.split(' ')[0] : customer.preferredName}
                  </span>
                  <span className="block text-[11px] text-slate-500">{variant === 'business' ? 'Business' : 'Premium'}</span>
                </span>
              </button>

              {userMenu ? (
                <div role="menu" className="animate-fade-in absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{variant === 'business' ? businessProfile.name : customer.name}</p>
                    <p className="truncate text-xs text-slate-500">{variant === 'business' ? businessProfile.role : customer.email}</p>
                    <Badge tone="emerald" className="mt-2">
                      {variant === 'business' ? 'Business tier' : customer.tier}
                    </Badge>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: 'Profile', to: `${base}/profile`, icon: 'user' },
                      { label: 'Security Centre', to: variant === 'business' ? `${base}/profile` : `${base}/security`, icon: 'shield-check' },
                      { label: 'Help & Support', to: `${base}/support`, icon: 'message-circle' },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        role="menuitem"
                        className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Icon name={item.icon} className="h-4 w-4 text-slate-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 p-1.5">
                    <Link to="/login" className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                      <LogOut className="h-4 w-4" aria-hidden />
                      Sign out
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 bg-white px-4 py-2 text-xs text-slate-500 sm:px-6">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              All systems operational
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Last sign-in: {variant === 'business' ? 'Today, 08:14 AM' : '25 Apr 2025, 9:42 AM'}</span>
            {variant === 'business' ? (
              <Link to="/app" className="ml-auto hidden items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 sm:inline-flex">
                <Building2 className="h-3.5 w-3.5" aria-hidden />
                Switch to personal
              </Link>
            ) : (
              <Link to="/business/app" className="ml-auto hidden items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 sm:inline-flex">
                <Building2 className="h-3.5 w-3.5" aria-hidden />
                Business banking
              </Link>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-10">
          <Outlet />
        </main>

        {variant === 'personal' ? (
          <nav className="no-print safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden" aria-label="Bottom">
            <ul className="grid grid-cols-5">
              {bottomNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn('focus-ring flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition-colors', isActive ? 'text-emerald-600' : 'text-slate-400')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon name={item.icon} className={cn('h-5 w-5', isActive ? 'text-emerald-600' : 'text-slate-400')} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        </div>
      </div>
    </>
  );
}