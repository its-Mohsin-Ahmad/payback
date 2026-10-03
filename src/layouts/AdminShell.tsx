import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, LogOut, RefreshCw, Search } from 'lucide-react';
import { LogoMark } from '@/components/Brand';
import { Icon } from '@/components/Icon';
import { Avatar, Badge, Button, useToast } from '@/components/ui';
import { adminNav, type NavGroup } from '@/lib/nav';
import { cn } from '@/lib/utils';

function AdminGroup({ group, collapsed, onNavigate }: { group: NavGroup; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <div className="pb-3">
      {!collapsed ? (
        <p className="px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{group.title}</p>
      ) : (
        <div className="mx-3 my-3 h-px bg-slate-800" />
      )}
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  collapsed && 'justify-center px-2',
                  isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                )
              }
            >
              <Icon name={item.icon} className="h-4 w-4 shrink-0" />
              {!collapsed ? (
                <>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.badge ? <span className="shrink-0 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-200">{item.badge}</span> : null}
                </>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const toast = useToast();

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  const flat = adminNav.flatMap((g) => g.items);
  const current = [...flat].sort((a, b) => b.to.length - a.to.length).find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-800 bg-navy transition-[width] duration-200 lg:flex',
          collapsed ? 'w-[76px]' : 'w-[248px]'
        )}
        aria-label="Admin sidebar"
      >
        <div className={cn('flex h-14 shrink-0 items-center border-b border-slate-800 px-3', collapsed ? 'justify-center' : 'justify-between')}>
          <Link to="/admin" className="focus-ring flex items-center gap-2.5 rounded-lg" aria-label="PAYBACK admin">
            <LogoMark tone="emerald" size={32} />
            {!collapsed ? (
              <span className="leading-none">
                <span className="block font-display text-sm font-extrabold tracking-tight text-white">
                  PAY<span className="text-emerald-400">BACK</span>
                </span>
                <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Admin Console</span>
              </span>
            ) : null}
          </Link>
        </div>

        <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-2" aria-label="Admin">
          {adminNav.map((group) => (
            <AdminGroup key={group.title} group={group} collapsed={collapsed} />
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="focus-ring m-2 flex items-center justify-center gap-2 rounded-lg border border-slate-800 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" aria-hidden />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" aria-hidden /> Collapse
            </>
          )}
        </button>
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-[260px] flex-col bg-navy shadow-lift">
            <div className="flex h-14 items-center gap-2.5 border-b border-slate-800 px-3">
              <LogoMark tone="emerald" size={32} />
              <span className="font-display text-sm font-extrabold tracking-tight text-white">PAYBACK Admin</span>
            </div>
            <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-2">
              {adminNav.map((group) => (
                <AdminGroup key={group.title} group={group} collapsed={false} onNavigate={() => setDrawerOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open admin navigation"
            >
              <Icon name="dashboard" className="h-5 w-5" />
            </button>

            <nav className="hidden min-w-0 items-center gap-2 text-xs text-slate-500 sm:flex" aria-label="Breadcrumb">
              <span className="font-semibold text-slate-400">Admin</span>
              <span aria-hidden>/</span>
              <span className="truncate font-semibold text-slate-800">{current?.label ?? 'Dashboard'}</span>
            </nav>

            <div className="relative ml-auto hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                placeholder="Search users, IDs, references…"
                aria-label="Search admin data"
                className="focus-ring h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 xl:w-80"
              />
            </div>

            <Badge tone="amber" className="hidden sm:inline-flex">
              Staging &bull; demo data
            </Badge>

            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Refresh data"
              onClick={() => toast.success('Data refreshed', 'Dashboard metrics reloaded from the demo dataset.')}
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
            </Button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <Avatar name="Hina Qureshi" size="sm" color="#0F172A" />
              <span className="hidden text-left lg:block">
                <span className="block text-xs font-semibold text-slate-900">Hina Qureshi</span>
                <span className="block text-[11px] text-slate-500">Compliance Officer</span>
              </span>
              <Link to="/login" aria-label="Sign out" className="focus-ring rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600">
                <LogOut className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-5">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-400 sm:px-5">
          PAYBACK Admin Console &bull; Internal use only &bull; Prototype build with synthetic data &bull; v0.9.0-demo
        </footer>
      </div>
    </div>
  );
}