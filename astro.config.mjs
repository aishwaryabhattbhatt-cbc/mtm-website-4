// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = '/mtm-website-4/';

// Keep in sync with any page that sets noindex={true} in its <Layout> usage —
// @astrojs/sitemap has no visibility into that prop, so noindex routes have to
// be excluded here explicitly or they end up contradicting their own meta tag.
/** @param {string} pageUrl */
function isNoindexPath(pageUrl) {
  const path = new URL(pageUrl).pathname;
  return (
    path === base ||
    path.endsWith('/sign-in/') ||
    path.endsWith('/request-demo-success/') ||
    path.endsWith('/about-us/') ||
    path.endsWith('/contact/') ||
    path.startsWith(`${base}pattern-tool`)
  );
}

// https://astro.build/config
export default defineConfig({
  site: 'https://aishwaryabhattbhatt-cbc.github.io',
  base,
  integrations: [
    sitemap({
      filter: (page) => !isNoindexPath(page),
    }),
  ],
});
