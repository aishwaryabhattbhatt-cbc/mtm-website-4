// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';

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
    path.endsWith('/contact/') ||
    path.endsWith('/products/census/') ||
    path.startsWith(`${base}pattern-tool`)
  );
}

// Maps a URL path suffix to the source files that actually determine its
// content — the .astro template plus its CMS copy file where one exists.
// lastmod uses the most recent commit across both, so a copy-only change
// (no template edit) still bumps the date.
/** @type {Array<[string, string[]]>} */
const LASTMOD_SOURCES = [
  ['/en/', ['src/pages/[locale]/index.astro', 'src/content/copy/home.json']],
  ['/fr/', ['src/pages/[locale]/index.astro', 'src/content/copy/home.json']],
  ['/insights/', ['src/pages/[locale]/insights.astro', 'src/content/copy/insights.json']],
  [
    '/products/mtm-18-plus/',
    ['src/pages/[locale]/products/mtm-18-plus.astro', 'src/content/copy/mtm-18-plus.json'],
  ],
  ['/products/juniors/', ['src/pages/[locale]/products/juniors.astro', 'src/content/copy/juniors.json']],
  [
    '/products/newcomers/',
    ['src/pages/[locale]/products/newcomers.astro', 'src/content/copy/newcomers.json'],
  ],
  [
    '/solutions/advertising/',
    ['src/pages/[locale]/solutions/advertising.astro', 'src/content/copy/advertising.json'],
  ],
  [
    '/solutions/education/',
    ['src/pages/[locale]/solutions/education.astro', 'src/content/copy/education.json'],
  ],
  ['/solutions/gov-ngos/', ['src/pages/[locale]/solutions/gov-ngos.astro', 'src/content/copy/gov-ngos.json']],
  ['/solutions/industry/', ['src/pages/[locale]/solutions/industry.astro', 'src/content/copy/industry.json']],
  ['/solutions/media/', ['src/pages/[locale]/solutions/media.astro', 'src/content/copy/media.json']],
  [
    '/tools/analytic-tools/',
    ['src/pages/[locale]/tools/analytic-tools.astro', 'src/content/copy/analytic-tools.json'],
  ],
  [
    '/tools/census-tool/',
    ['src/pages/[locale]/tools/census-tool.astro', 'src/content/copy/census-tool.json'],
  ],
  ['/request-demo/', ['src/pages/[locale]/request-demo.astro', 'src/content/copy/request-demo.json']],
  ['/about-us/', ['src/pages/[locale]/about-us.astro']],
];

/** @param {string} path */
function gitLastCommitDate(path) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', path], {
      encoding: 'utf-8',
    }).trim();
    return out ? new Date(out) : undefined;
  } catch {
    return undefined;
  }
}

/** @param {string} pathname */
function resolveLastmod(pathname) {
  const entry = LASTMOD_SOURCES.find(([suffix]) => pathname.endsWith(suffix));
  if (!entry) return undefined;
  const dates = entry[1].map(gitLastCommitDate).filter((d) => d !== undefined);
  if (dates.length === 0) return undefined;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

// https://astro.build/config
export default defineConfig({
  site: 'https://aishwaryabhattbhatt-cbc.github.io',
  base,
  integrations: [
    sitemap({
      filter: (page) => !isNoindexPath(page),
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const lastmod = resolveLastmod(pathname);
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
      },
    }),
  ],
});
