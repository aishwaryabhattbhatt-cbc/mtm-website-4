// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://aishwaryabhattbhatt-cbc.github.io',
  base: '/mtm-website-4/',
  integrations: [sitemap()],
});
