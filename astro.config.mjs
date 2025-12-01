import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  integrations: [],
  build: {
    inlineStylesheets: 'auto', // Inline les petits CSS
    assets: 'assets'
  },
  vite: {
    build: {
      assetsDir: 'assets',
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Supprime console.log en production
          drop_debugger: true
        }
      }
    },
    css: {
      devSourcemap: false
    }
  },
  image: {
    domains: ['www.ecofundrive.com'],
    remotePatterns: [{ protocol: 'https' }]
  },
  compressHTML: true
});

