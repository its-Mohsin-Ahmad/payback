import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * GitHub Pages hosts static files only, so deep links such as
 * `/payback/app/accounts` are handled by `public/404.html`: it stores the
 * requested URL and bounces back to the app root. Restore that URL before the
 * first render so the router sees the original path.
 */
function restoreDeepLink() {
  const key = 'payback:redirect';
  try {
    const stored = window.sessionStorage.getItem(key);
    if (!stored) return;
    window.sessionStorage.removeItem(key);
    const current = window.location.pathname + window.location.search + window.location.hash;
    if (stored === current) return;
    if (stored.startsWith(window.location.pathname)) {
      window.history.replaceState(null, '', stored);
    }
  } catch (error) {
    /* sessionStorage unavailable (private mode / blocked) — nothing to restore */
  }
}

restoreDeepLink();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
