import { Link } from 'react-router-dom';
import { Compass, Home, LifeBuoy, Search } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-content flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Compass className="h-8 w-8" aria-hidden />
      </span>
      <p className="tnum mt-6 text-6xl font-bold tracking-tight text-slate-900">404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">We could not find that page</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        The link may be broken, or the page may have moved. Try the shortcuts below or head back to the start.
      </p>

      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Link to="/" className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600">
          <Home className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
        <Link to="/app">
          <Button variant="outline">Open the demo app</Button>
        </Link>
        <Link to="/support">
          <Button variant="ghost" icon={<LifeBuoy className="h-4 w-4" aria-hidden />}>
            Get help
          </Button>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
        {[
          { label: 'Products', to: '/products' },
          { label: 'Business banking', to: '/business' },
          { label: 'Rates', to: '/rates' },
          { label: 'Security', to: '/security' },
          { label: 'Support', to: '/support' },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="focus-ring rounded-lg px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800">
            {link.label}
          </Link>
        ))}
      </div>

      <p className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400">
        <Search className="h-3.5 w-3.5" aria-hidden />
        Tip: press the browser back button if you followed a link here.
      </p>
    </div>
  );
}