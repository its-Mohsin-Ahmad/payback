/// <reference types="vite/client" />

/**
 * Type declarations for Vite's injected `import.meta.*` values.
 *
 * Without this file `import.meta.env.BASE_URL` is a type error, and the
 * temptation is to reach for `any` or hardcode `/payback`. The Router's
 * `basename` depends on this value (see App.tsx), so it has to be typed rather
 * than asserted away.
 */
interface ImportMetaEnv {
  /** Matches `base` in vite.config.ts — `/payback/` in production, `/` in dev. */
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}