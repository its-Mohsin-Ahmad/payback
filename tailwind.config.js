/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    /*
     * Breakpoints are *added* to the Tailwind defaults, never replaced. The
     * existing 400+ `sm:`/`md:`/`lg:` usages across the app keep working, while
     * `xs` covers the small-phone range (320–399px) that the defaults have no
     * hook for and `3xl` covers ultra-wide. The spec's device list maps to these
     * as: 320–390 → xs/base, 414–480 → sm, 600–768 → md, 834–1024 → lg,
     * 1280–1440 → xl, 1920 → 2xl, 2560+ → 3xl.
     */
    screens: {
      xs: '400px',
      ...defaultTheme.screens,
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // PAYBACK master palette (matches the documented hex values)
        navy: {
          DEFAULT: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        surface: '#F8FAFC',
        /* Dark-mode surfaces, named so components reference intent rather than
         * raw slate values (spec §144). */
        'night': '#0F172A',
        'night-card': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1600px',
      },
      /*
       * Safe-area spacing (spec §06). Exposed as spacing keys so the normal
       * padding/margin utilities generate from them — `pt-safe-top`,
       * `pb-safe-bottom`, `px-safe-x`. Bottom nav and sticky actions use these
       * so they never sit under a home indicator or a notch.
       */
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        /* Height of the mobile bottom nav including its safe-area padding, so
         * scrollable content can reserve exactly enough space for it. */
        'bottom-nav': 'calc(3.5rem + env(safe-area-inset-bottom))',
      },
      /*
       * Fluid type scale (spec §112–113). Each step interpolates with `clamp()`
       * between a small-phone and a large-desktop size, so headings stay
       * readable at 320px without becoming enormous on a 2560px display.
       */
      fontSize: {
        'page-title': ['clamp(1.375rem, 1.15rem + 1.1vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'section-title': ['clamp(1.0625rem, 1rem + 0.5vw, 1.375rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-fluid': ['clamp(0.875rem, 0.85rem + 0.15vw, 1rem)', { lineHeight: '1.6' }],
        'caption-fluid': ['clamp(0.75rem, 0.73rem + 0.12vw, 0.875rem)', { lineHeight: '1.5' }],
        'balance': ['clamp(1.75rem, 1.35rem + 2vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        lift: '0 10px 30px -12px rgba(15, 23, 42, 0.18)',
        soft: '0 2px 8px -2px rgba(15, 23, 42, 0.08)',
        /* Sticky header elevation (spec §10) — deliberately restrained. */
        sticky: '0 1px 0 0 rgba(15, 23, 42, 0.06), 0 4px 12px -6px rgba(15, 23, 42, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        // Bottom-sheet top corners (spec §204).
        'sheet': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Bottom-sheet enter/exit (spec §234).
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'sheet-down': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-up': 'slide-up 0.4s ease-out both',
        'sheet-up': 'sheet-up 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
      },
    },
  },
  plugins: [],
};
