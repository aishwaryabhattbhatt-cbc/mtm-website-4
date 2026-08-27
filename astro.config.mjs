// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';

// Overridable for a handoff build served from somewhere other than GitHub
// Pages (e.g. the backend developer's own host/IIS path) — every asset URL
// in the build is prefixed with this exact string, so it must match wherever
// dist/ actually gets served from, or CSS/JS/images will all 404.
// Usage: BUILD_BASE_PATH=/some/other/path/ npm run build
const base = process.env.BUILD_BASE_PATH || '/mtm-website-4/';

// Every page that sets noindex={true} in its <Layout> usage. @astrojs/sitemap
// has no visibility into that prop, so each one has to be listed here or it
// ends up in the sitemap contradicting its own meta robots tag.
// Keep in sync: `grep -rn "noindex" src/pages/`
const NOINDEX_SUFFIXES = [
  '/sign-in/',
  '/register/',
  '/register-success/',
  '/forgot-password/',
  '/contact/',
  '/contact-success/',
  '/request-demo-success/',
  '/submission-error/',
  '/insights/report-download/',
  '/insights/report-download-2/',
  '/insights/download-success/',
];

/** @param {string} pageUrl */
function isNoindexPath(pageUrl) {
  const path = new URL(pageUrl).pathname;
  return (
    path === base ||
    path.startsWith(`${base}pattern-tool`) ||
    NOINDEX_SUFFIXES.some((suffix) => path.endsWith(suffix))
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
  // Overridable alongside BUILD_BASE_PATH for a handoff build — affects
  // sitemap URLs, canonical tags, and absolute OG image URLs.
  site: process.env.BUILD_SITE_URL || 'https://aishwaryabhattbhatt-cbc.github.io',
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
