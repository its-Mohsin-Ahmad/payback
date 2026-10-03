# PAYBACK — Banking Built Around You

A full digital banking ecosystem built as a single React + TypeScript application:

| Surface | Route | What it covers |
| --- | --- | --- |
| Public website | `/` | Marketing site: products, rates, security, support, legal |
| Customer app | `/app` | Accounts, cards, transfers, bills, loans, investments, rewards, FX, statements, security centre |
| Business banking | `/business/app` | Company accounts, cash flow, invoices, vendors, payroll, maker–checker approvals, corporate cards, team, integrations |
| Admin platform | `/admin` | Operations dashboard, KYC queue, disputes, risk rules, fees & limits, roles, audit log, platform settings |

> **Prototype notice** — every balance, transaction, rate, fee, provider and partner in this project is **synthetic demo data**.
> No banking, payment, card or investment service is provided, no external rail (bank, wallet, SWIFT, PayPal…) is contacted, and
> no real money moves. Provider integrations are deliberately labelled `Demo Transfer`, `Integration Required` or
> `Not connected`.

## Tech stack

- **React 18** + **TypeScript 5.6** + **Vite 5**
- **Tailwind CSS 3.4** with a custom navy / emerald design system
- **react-router-dom 6** (three application shells behind one router)
- **lucide-react** icons, hand-rolled SVG charts (no chart library)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc --noEmit`) then build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Type-check only |

## Project structure

```
src/
├── components/     ui.tsx (design system), blocks.tsx, charts.tsx, Icon, Brand
├── data/           mock.ts (customer), enterprise.ts (business + admin), products.ts
├── layouts/        PublicLayout, AppShell (personal + business), AdminShell
├── lib/            utils.ts (money/format helpers), nav.ts (navigation config)
├── pages/
│   ├── public/     marketing site
│   ├── app/        customer application
│   ├── business/   business banking console
│   └── admin/      internal admin platform
├── App.tsx         routes for all four surfaces
└── index.css       Tailwind layers, tokens and animations
```

## Design system

- **Colours** — navy `#0F172A` base, emerald `#10B981` primary, sky `#38BDF8` secondary, slate neutrals, surface `#F8FAFC`
- **Components** — buttons, badges, status pills, cards, inputs, selects, toggles, modals, drawers, tables with pagination, toasts, steppers, OTP input, timeline, accordion, KPI stat cards, progress bars/rings
- **Charts** — sparkline, area chart, grouped bar chart, donut chart, line chart, progress ring, mini bars
- **Utilities** — `card-base`, `focus-ring`, `shadow-card`, `shadow-lift`, `navy-mesh`, `emerald-mesh`, `tnum`, `safe-bottom`

## Deployment

The app is a static SPA deployed to GitHub Pages at `/payback/`.

- `vite.config.ts` sets `base` to `/payback/` for production builds (override with `BASE_PATH=/` for a custom domain root)
- `public/404.html` + `src/main.tsx` implement the SPA deep-link redirect, so client-side routes like `/app/accounts` work on refresh
- `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`

```bash
npm run build        # BASE_PATH=/payback/ by default
```

## Licence

Demo project — provided for evaluation and learning.