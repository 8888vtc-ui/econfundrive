import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
  site: 'https://ecofundrive.com',
  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'never',
    format: 'file'
  },

  vite: {
    build: {
      cssCodeSplit: false
    }
  }
});
