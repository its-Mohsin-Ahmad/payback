import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Facebook, Globe, Instagram, Linkedin, Lock, Mail, MapPin, Menu, Phone, ShieldCheck, Twitter, X } from 'lucide-react';
import { Brand } from '@/components/Brand';
import { Button, DemoBanner } from '@/components/ui';
import { publicNav } from '@/lib/nav';
import { cn } from '@/lib/utils';

const footerColumns = [
  {
    title: 'Banking',
    links: [
      { label: 'Personal Banking', to: '/' },
      { label: 'Business Banking', to: '/business' },
      { label: 'Card Products', to: '/products' },
      { label: 'Loans & Finance', to: '/loans-products' },
      { label: 'Investments', to: '/investments-products' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Currency Rates', to: '/rates' },
      { label: 'Branch & ATM Finder', to: '/branches' },
      { label: 'Help Centre', to: '/support' },
      { label: 'Report Fraud', to: '/security' },
      { label: 'Open an Account', to: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About PAYBACK', to: '/about' },
      { label: 'Security & Trust', to: '/security' },
      { label: 'Careers', to: '/about' },
      { label: 'Newsroom', to: '/about' },
      { label: 'Contact', to: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/privacy' },
      { label: 'Security Disclosures', to: '/security' },
      { label: 'Accessibility', to: '/about' },
    ],
  },
];

/**
 * One footer column.
 *
 * Collapsed to a tappable header on a phone and expanded from `lg` (spec §107).
 * A four-column footer stacked into one column is a ~40-link scroll on a 375px
 * screen, which buries the rest of the page; accordions keep it to four rows.
 *
 * Implemented with a native `<details>`/`<summary>` pair so it works without
 * JavaScript, is keyboard accessible, and needs no open/close state.
 */
function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <details className="group border-b border-slate-200 lg:border-0 lg:py-0">
      <summary className="focus-ring flex min-h-[48px] cursor-pointer list-none items-center justify-between py-3 text-sm font-bold text-slate-900 lg:pointer-events-none lg:py-0">
        {title}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 lg:hidden"
          aria-hidden
        />
      </summary>
      <ul className="space-y-1 pb-4 lg:mt-4 lg:space-y-2.5 lg:pb-0">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="focus-ring flex min-h-[44px] items-center rounded text-sm text-slate-500 transition-colors hover:text-emerald-700 lg:min-h-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="bg-navy px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-white/70">
        <span className="sm:hidden">Demo &mdash; synthetic data only</span><span className="hidden sm:inline">Prototype demonstration &mdash; synthetic data only, not a live banking service</span>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Brand showTagline />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'focus-ring rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="emerald" size="sm" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Open Account
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>

        {menuOpen ? (
          <div className="animate-fade-in border-t border-slate-200 bg-white lg:hidden">
            <nav className="mx-auto flex max-w-content flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
              {publicNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'focus-ring rounded-xl px-3 py-3 text-sm font-semibold transition-colors',
                      isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login">
                  <Button variant="outline" block>
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="emerald" block>
                    Open Account
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-10">
            <div>
              <Brand />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                PAYBACK is a digital banking ecosystem concept covering everyday personal banking, business finance and connected money movement.
              </p>
              <div className="mt-5 space-y-2 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" aria-hidden />
                  Gulberg III, Lahore, Pakistan
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-600" aria-hidden />
                  24/7 helpline &bull; +92 21 &bull;&bull;&bull; 0100
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-600" aria-hidden />
                  help@payback.example
                </p>
              </div>
              <div className="mt-5 flex items-center gap-2">
                {[Facebook, Twitter, Instagram, Linkedin].map((SocialIcon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-emerald-300 hover:text-emerald-600"
                  >
                    <SocialIcon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            </div>

            {footerColumns.map((col) => (
              <FooterColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} PAYBACK Digital Banking. Demonstration prototype &mdash; all figures are synthetic.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                TLS 1.3 &bull; 256-bit encryption
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                ISO 27001 aligned controls
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" aria-hidden />
                English (Pakistan)
              </span>
            </div>
          </div>

          <DemoBanner className="mt-6" label="Demo" />
        </div>
      </footer>
    </div>
  );
}