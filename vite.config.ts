import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => ({
  /**
   * `base` decides where built assets are served from.
   *  - development (`npm run dev`): root of the dev server
   *  - production build: the GitHub Pages project sub-path, overridable with
   *    the BASE_PATH env variable (e.g. BASE_PATH=/ for a custom domain root)
   */
  base: mode === 'development' ? '/' : process.env.BASE_PATH ?? '/payback/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
}));
