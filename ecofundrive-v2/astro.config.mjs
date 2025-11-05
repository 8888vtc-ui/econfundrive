import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
  site: 'https://ecofundrive.com',

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
