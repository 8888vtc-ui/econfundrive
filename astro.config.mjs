import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  site: 'https://ecofundrive.com',

  // Optimisations Build 2025
  build: {
    inlineStylesheets: 'auto', // Auto-inline critical CSS
    format: 'file', // Clean URLs
    assets: '_assets', // Custom assets folder
  },

  // Optimisations Vite
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS per route pour meilleure perf
      minify: 'esbuild', // esbuild = plus rapide que terser
      rollupOptions: {
        output: {
          manualChunks: {
            // Code splitting intelligent
            vendor: ['@anthropic-ai/sdk'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@anthropic-ai/sdk'],
    },
  },

  // Prefetch pour navigation instantanée
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport', // Prefetch au scroll
  },

  // Compression
  compressHTML: true,

  // Images optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Security headers via Netlify
  // (définis dans netlify.toml)
});
