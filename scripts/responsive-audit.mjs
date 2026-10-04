/**
 * Real-browser responsive audit.
 *
 * Everything else in this project verified layout by *reading* CSS. That is not
 * the same as measuring it, and it repeatedly let genuine overflow through. This
 * drives a real Chrome at real viewport widths and reports:
 *
 *   - `document.scrollWidth > clientWidth` — the page scrolls sideways (failure 1)
 *   - the specific elements responsible, with their computed widths
 *   - elements narrower than the 44px touch-target floor (failure 11)
 *
 * Usage: node scripts/responsive-audit.mjs [width,...]
 */

import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.env.BASE_URL ?? 'http://localhost:4173';

const WIDTHS = (process.argv[2] ?? '320,375,390,430,768,1024')
  .split(',')
  .map((n) => Number(n.trim()))
  .filter(Boolean);

const ROUTES = [
  '/',
  '/business',
  '/products',
  '/rates',
  '/security',
  '/support',
  '/about',
  '/login',
  '/register',
  '/app',
  '/app/accounts',
  '/app/transactions',
  '/app/transfer',
  '/app/scan',
  '/app/cards',
  '/app/bills',
  '/app/loans',
  '/app/investments',
  '/app/rewards',
  '/app/security',
  '/app/profile',
  '/app/settings',
  '/app/notifications',
  '/business/app',
  '/business/app/accounts',
  '/business/app/invoices',
  '/business/app/team',
  '/business/app/approvals',
  '/business/app/payroll',
  '/business/app/reports',
  '/business/app/cards',
  '/admin',
  '/admin/users',
  '/admin/risk',
];

/** Runs in the page: find anything wider than the viewport. */
function findOverflow() {
  const docWidth = document.documentElement.clientWidth;
  const offenders = [];
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    // Right edge past the viewport, or intrinsically wider than it.
    const past = rect.right - docWidth;
    if (past > 1 || rect.width > docWidth + 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 110),
        width: Math.round(rect.width),
        right: Math.round(rect.right),
        overflowBy: Math.round(Math.max(past, rect.width - docWidth)),
      });
    }
  }
  return {
    docWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    offenders: offenders.slice(0, 6),
  };
}

/** Runs in the page: interactive elements below the 44px touch floor. */
function findSmallTargets() {
  const small = [];
  /*
   * Filters, and each one is deliberate:
   *   :not([disabled])  a disabled control cannot be tapped, so it is not a
   *                     missed target — it is an intentionally inert one.
   *   :not(.sr-only)    `sr-only` inputs are 1x1 by design for screen readers;
   *                     they are not pointer targets and never receive a tap.
   * `label` is excluded too: it only becomes a target when it wraps or points at
   * a control, and in that case the control itself is already measured — counting
   * the label double-reported every search field's caption ("Search", 16px tall)
   * as a missed 44px target.
   */
  const sel =
    'a:not([disabled]),button:not([disabled]),[role="button"],' +
    'input:not([disabled]):not(.sr-only),select:not([disabled]),textarea:not([disabled])';
  for (const el of Array.from(document.querySelectorAll(sel))) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Inline links inside prose are exempt; they are not tap targets.
    if (el.tagName === 'A' && style.display.includes('inline') && r.height < 20) continue;
    if (r.height < 44 || r.width < 44) {
      small.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 90),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (el.textContent ?? '').trim().slice(0, 32),
      });
    }
  }
  return small.slice(0, 5);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const problems = [];
const page = await browser.newPage();
await page.setCacheEnabled(false);

for (const width of WIDTHS) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });

  /* Load the shell once, then move between routes in-app.
   *
   * A direct `goto()` of a deep link hits the GitHub Pages 404 handler, which
   * bounces to `/payback/` — so every route silently rendered the *homepage*
   * and the audit passed while testing nothing. The first version of this
   * script had exactly that bug. Client-side navigation plus the route guard
   * below is what makes the result mean anything. */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));

  for (const route of ROUTES) {
    await page.evaluate((r) => {
      window.history.pushState({}, '', `/payback${r}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, route);
    await new Promise((r) => setTimeout(r, 900));

    const info = await page.evaluate(() => ({
      path: location.pathname,
      heading: (document.querySelector('h1')?.textContent ?? document.querySelector('h2')?.textContent ?? '')
        .trim()
        .slice(0, 46),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    /* Guard: if the route did not actually take effect we are looking at the
       previous page, and any measurement would be meaningless. */
    if (!info.path.endsWith(route)) {
      problems.push({ width, route, kind: 'ROUTING', detail: `navigation did not take (still at ${info.path})` });
      continue;
    }

    const scrolls = info.scrollWidth > info.clientWidth + 1;
    if (scrolls) {
      const offenders = (await page.evaluate(findOverflow)).offenders;
      problems.push({
        width,
        route,
        kind: 'H-SCROLL',
        detail: `scrollWidth ${info.scrollWidth} > clientWidth ${info.clientWidth} (by ${info.scrollWidth - info.clientWidth}px) — "${info.heading}"`,
        offenders,
      });
    }

    if (width < 500) {
      const small = await page.evaluate(findSmallTargets);
      if (small.length) {
        problems.push({ width, route, kind: 'TOUCH', detail: `${small.length} target(s) under 44px — "${info.heading}"`, offenders: small });
      }
    }
  }
}

await browser.close();

if (!problems.length) {
  console.log(`PASS — no horizontal scroll or undersized targets across ${WIDTHS.length} widths x ${ROUTES.length} routes.`);
  process.exit(0);
}

console.log(`\n${problems.length} problem(s) found across ${WIDTHS.join(', ')}px\n`);
for (const p of problems) {
  console.log(`[${p.kind}] ${p.width}px  ${p.route}`);
  console.log(`        ${p.detail}`);
  for (const o of p.offenders ?? []) {
    const bits = Object.entries(o)
      .filter(([, v]) => v !== '' && v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('  ');
    console.log(`          ${bits}`);
  }
  console.log('');
}